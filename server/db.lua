-- Criacao/verificacao das tabelas do mri-hud a partir de database.sql.
-- Espelha o padrao do mri_Qadmin (server/db.lua): le o .sql, quebra por ';' e
-- executa cada statement. O MySQL.query.await abaixo cede a coroutine de
-- carregamento do recurso — por isso os demais server_scripts (settings.lua)
-- terminam de carregar e registram o handler de 'mri_hud:db:ready' ANTES do
-- TriggerEvent no fim deste arquivo disparar.

local function splitStr(inputstr, sep)
    if sep == nil then sep = "%s" end
    local t = {}
    for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
        str = string.gsub(str, "^%s*(.-)%s*$", "%1")
        if not (str == nil or str == "") then
            table.insert(t, str)
        end
    end
    return t
end

local function executeQueries(queries, callback)
    for index, query in ipairs(queries) do
        local ok, err = pcall(MySQL.query.await, query)
        if not ok then
            print("[mri_hud] WARN: query " .. index .. " falhou: " .. tostring(err))
        end
    end
    if callback then callback() end
end

local function createTables()
    local content = LoadResourceFile(GetCurrentResourceName(), "database.sql")
    if not content or content == "" then
        print("[mri_hud] WARN: database.sql vazio ou ausente — pulando criacao de tabelas.")
        return
    end
    local queries = splitStr(content, ";")
    executeQueries(queries, function()
        print("[mri_hud] Tabelas verificadas/criadas.")
    end)
end

print("[mri_hud] Verificando/criando tabelas...")
createTables()

TriggerEvent("mri_hud:db:ready")
