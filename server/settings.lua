-- Sincronizador de configuracoes do mri-hud com o banco (formato key/value/type,
-- espelha mri_Qadmin/server/settings.lua). No boot carrega os Config.X
-- primitivos do DB (fazendo cast por 'type') e seeda no DB os que ainda nao
-- existem. Expoe leitura/escrita pra NUI (plugin do mri_Qadmin) e faz broadcast
-- pros clients aplicarem em runtime.

local QBCore = exports['qb-core']:GetCoreObject()

-- Um valor so vai pro DB se for primitivo (string/number/boolean). Tabelas do
-- Config (ex: whitelists de armas) permanecem definidas apenas no config.lua.
local function isPrimitive(v)
    local t = type(v)
    return t == 'string' or t == 'number' or t == 'boolean'
end

local function hasAdminPerm(src)
    return QBCore.Functions.HasPermission(src, 'admin') or IsPlayerAceAllowed(src, 'command')
end

local function LoadSettings()
    local dbSettings = MySQL.query.await('SELECT * FROM mri_hud_settings')
    local loadedKeys = {}

    if dbSettings then
        for _, row in ipairs(dbSettings) do
            local key, val, t = row.name, row.value, row.type
            if t == 'number' then
                val = tonumber(val)
            elseif t == 'boolean' then
                val = (val == 'true')
            end
            Config[key] = val
            loadedKeys[key] = true
        end
        print(('[mri_hud] Configuracoes carregadas do DB: %s'):format(#dbSettings))
    end

    -- Seed das chaves primitivas do Config que ainda nao estao no DB.
    local seedCount = 0
    for k, v in pairs(Config) do
        if type(k) == 'string' and isPrimitive(v) and not loadedKeys[k] then
            local ok = pcall(function()
                MySQL.insert.await(
                    'INSERT INTO mri_hud_settings (`name`, `value`, `type`) VALUES (?, ?, ?)',
                    { k, tostring(v), type(v) }
                )
            end)
            if ok then seedCount = seedCount + 1 end
        end
    end
    print(('[mri_hud] Sincronizacao de settings concluida. Semeadas: %s'):format(seedCount))
end

-- Payload enviado pros clients / NUI: apenas Config.X primitivos.
local function GetPrimitiveSettings()
    local payload = {}
    for k, v in pairs(Config) do
        if type(k) == 'string' and isPrimitive(v) then
            payload[k] = v
        end
    end
    return payload
end
_G.GetHudPrimitiveSettings = GetPrimitiveSettings

local function persistSetting(key, value)
    local t = type(value)
    MySQL.insert.await([[
        INSERT INTO mri_hud_settings (`name`, `value`, `type`)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE `value` = ?, `type` = ?
    ]], { key, tostring(value), t, tostring(value), t })
    Config[key] = value
end

-- Leitura pra NUI (plugin do Qadmin). Admin-gated.
lib.callback.register('mri_hud:getSettings', function(source)
    if not hasAdminPerm(source) then return nil end
    return GetPrimitiveSettings()
end)

-- Escrita de uma unica chave.
RegisterNetEvent('mri_hud:server:updateSetting', function(key, value)
    local src = source
    if not hasAdminPerm(src) then return end
    if type(key) ~= 'string' or not isPrimitive(value) then return end
    persistSetting(key, value)
    -- force=true: config global do admin e ABSOLUTA -> sobrescreve qualquer
    -- override local dos players (limpa o "overridden" nas stores da NUI).
    TriggerClientEvent('mri_hud:client:settingsUpdated', -1, GetPrimitiveSettings(), true)
end)

-- Escrita em lote (botao Salvar do painel Qadmin). Recebe um patch
-- { key = value, ... }, persiste, faz broadcast e devolve os primitivos
-- atualizados. Retorna (false) se sem permissao.
lib.callback.register('mri_hud:saveSettings', function(source, patch)
    if not hasAdminPerm(source) then return false end
    if type(patch) ~= 'table' then return false end
    local changed = false
    for key, value in pairs(patch) do
        if type(key) == 'string' and isPrimitive(value) then
            persistSetting(key, value)
            changed = true
        end
    end
    if changed then
        -- force=true: publish global absoluto (ver comentario em updateSetting).
        TriggerClientEvent('mri_hud:client:settingsUpdated', -1, GetPrimitiveSettings(), true)
    end
    return true, GetPrimitiveSettings()
end)

-- Client pede o estado atual ao carregar. force = (nao e admin): usuario comum
-- SEMPRE recebe o global de forma absoluta (nao consegue manter override local);
-- admin recebe sem force, entao mantem seu preview local do F10 ate o proximo
-- save global. Assim a config admin sempre vence a customizacao do usuario comum.
RegisterNetEvent('mri_hud:server:requestSettings', function()
    local src = source
    local force = not hasAdminPerm(src)
    TriggerClientEvent('mri_hud:client:settingsUpdated', src, GetPrimitiveSettings(), force)
end)

-- db.lua dispara isto depois de criar as tabelas (ver comentario la sobre o
-- yield do await que garante este handler registrado a tempo).
RegisterNetEvent('mri_hud:db:ready', function()
    LoadSettings()
end)

-- Registra o painel de config global do mri-hud como plugin do mri_Qadmin.
-- Se o Qadmin nao estiver rodando, o pcall protege e a config continua
-- acessivel pelo menu F10 do HUD normalmente. Manifest espelha
-- web/src/plugin/types.ts (drift control manual).
local function registerPlugin()
    if GetResourceState('mri_Qadmin') ~= 'started' then return end
    local ok, result = pcall(function()
        return exports['mri_Qadmin']:RegisterPlugin({
            id = 'hud',
            label = 'HUD',
            icon = 'gauge',
            resource = GetCurrentResourceName(),
            htmlPath = 'html/index.html',
            requiredPerms = { 'mri_hud.admin', 'command' },
            description = 'Configurações globais da HUD (veículo, skin, stress)',
        })
    end)
    if not ok or result == false then
        print(('[mri_hud] Falha ao registrar plugin no mri_Qadmin: %s'):format(tostring(result)))
    end
end

CreateThread(function()
    local deadline = GetGameTimer() + 10000
    while GetResourceState('mri_Qadmin') ~= 'started' and GetGameTimer() < deadline do
        Wait(200)
    end
    registerPlugin()
end)

AddEventHandler('onResourceStart', function(resourceName)
    if resourceName == 'mri_Qadmin' then
        Wait(500) -- aguarda os exports do Qadmin ficarem disponiveis
        registerPlugin()
    end
end)
