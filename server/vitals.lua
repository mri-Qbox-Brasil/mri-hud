-- ─────────────────────────────────────────────────────────────────
-- Vitais custom do skin sobrenatural: MANA e SANIDADE.
--
-- Server-autoritativo + persistido em metadata QBCore (por personagem) +
-- regen automatico. Sincroniza com o client via statebag (Player(src).state),
-- exatamente como fome/sede/stress ja fazem. O client repassa pra NUI
-- (action 'vitals'/'supernatural'), que alimenta o supernaturalVitalsStore.
--
-- Folego NAO vive aqui: e a stamina de sprint nativa, calculada no client.
--
-- API pra outros resources (server-side):
--   exports['ps-hud']:GetMana(src)             -> number (0-100)
--   exports['ps-hud']:SetMana(src, value)      -> seta absoluto
--   exports['ps-hud']:AddMana(src, amount)     -> incrementa (clamp 0..max)
--   exports['ps-hud']:RemoveMana(src, amount)  -> decrementa
--   (mesmos 4 pra Sanidade; + genericos GetVital/SetVital/ModifyVital)
-- ou via evento: TriggerEvent('hud:server:modifyVital', src, 'mana', -25)
-- ─────────────────────────────────────────────────────────────────

local QBCore = exports['qb-core']:GetCoreObject()
local Cfg = Config.SupernaturalVitals or {}
local VITALS = { 'mana', 'sanidade' }

-- Valor corrente em runtime por source (fonte de verdade viva; a metadata e a
-- copia persistida). Vitals[src] = { mana = n, sanidade = n }
local Vitals = {}

local function vcfg(name)
    return Cfg[name] or { default = 100, max = 100, regen = 0 }
end

local function clamp(v, max)
    v = math.floor(v + 0.5)
    if v < 0 then return 0 end
    if v > max then return max end
    return v
end

-- Escreve o valor: atualiza runtime + statebag (sync client) e, se persist,
-- grava na metadata QBCore (a autosave/logout persiste no banco).
local function setVital(src, name, value, persist)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    value = clamp(value, vcfg(name).max)

    Vitals[src] = Vitals[src] or {}
    Vitals[src][name] = value
    Player(src).state:set(name, value, true)
    if persist then Player.Functions.SetMetaData(name, value) end
    return value
end

local function getVital(src, name)
    if Vitals[src] and Vitals[src][name] ~= nil then
        return Vitals[src][name]
    end
    return vcfg(name).default
end

local function modifyVital(src, name, delta, persist)
    return setVital(src, name, getVital(src, name) + delta, persist)
end

-- Carrega da metadata (ou default) pro runtime + statebag ao entrar.
local function loadPlayer(src)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    Vitals[src] = {}
    for _, name in ipairs(VITALS) do
        local meta = Player.PlayerData.metadata[name]
        if meta == nil then meta = vcfg(name).default end
        -- persist=true garante que a chave passe a existir na metadata do char.
        setVital(src, name, meta, true)
    end
end

-- ── Ciclo de vida ────────────────────────────────────────────────
RegisterNetEvent('QBCore:Server:PlayerLoaded', function(Player)
    loadPlayer(Player.PlayerData.source)
end)

AddEventHandler('QBCore:Server:OnPlayerUnload', function(src)
    Vitals[src] = nil
end)

AddEventHandler('playerDropped', function()
    Vitals[source] = nil
end)

-- Re-hidrata todos os players online ao (re)iniciar o resource.
AddEventHandler('onResourceStart', function(resource)
    if resource ~= GetCurrentResourceName() then return end
    for _, src in ipairs(QBCore.Functions.GetPlayers()) do
        loadPlayer(src)
    end
end)

-- ── Regen automatico ─────────────────────────────────────────────
if Cfg.enabled then
    CreateThread(function()
        local interval = Cfg.regenInterval or 5000
        while true do
            Wait(interval)
            for src, cur in pairs(Vitals) do
                for _, name in ipairs(VITALS) do
                    local c = vcfg(name)
                    -- so mexe (e persiste) enquanto abaixo do maximo -> quando
                    -- cheio, silencia (sem SetMetaData/statebag redundante).
                    if c.regen and c.regen > 0 and (cur[name] or c.default) < c.max then
                        modifyVital(src, name, c.regen, true)
                    end
                end
            end
        end
    end)
end

-- ── Export unico ─────────────────────────────────────────────────
-- Ajusta qualquer vital. A HUD resolve o calculo/clamp/sync/persistencia
-- por dentro. Retorna o novo valor (0..max), ou nil se player/atributo invalido.
--   src       : server id do player
--   attribute : 'mana' | 'sanidade'
--   value     : magnitude (>= 0); pra 'set' e o valor absoluto
--   mode      : 'add' (aumenta) | 'remove' (reduz) | 'set' (absoluto). Default 'add'.
--
--   exports['ps-hud']:AdjustVital(src, 'mana', 25, 'remove')  -- gasta 25 de mana
--   exports['ps-hud']:AdjustVital(src, 'sanidade', 10, 'add') -- recupera 10 de sanidade
--   exports['ps-hud']:AdjustVital(src, 'mana', 100, 'set')    -- crava em 100
--   local mana = exports['ps-hud']:AdjustVital(src, 'mana', 0, 'add') -- so le o atual
local function adjustVital(src, attribute, value, mode)
    if attribute ~= 'mana' and attribute ~= 'sanidade' then return end
    value = math.abs(tonumber(value) or 0)
    mode = mode or 'add'
    if mode == 'set' then
        return setVital(src, attribute, value, true)
    elseif mode == 'remove' or mode == 'subtract' or mode == 'reduce' then
        return modifyVital(src, attribute, -value, true)
    else -- 'add' (default)
        return modifyVital(src, attribute, value, true)
    end
end

exports('AdjustVital', adjustVital)
