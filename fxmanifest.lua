fx_version 'cerulean'
game 'gta5'

description 'Ultra customizable hud featuring a unique and robust settings menu. Change eveything about your experience!'
author 'Project-Sloth & GFive'
version "2.5.1"

shared_scripts {
    '@ox_lib/init.lua',
	'shared/*.lua',
}

client_scripts {
    'client/*.lua'
}
-- Ordem explicita: oxmysql -> db (cria tabela, dispara mri_hud:db:ready) ->
-- main -> settings (escuta db:ready e carrega/seeda o Config a partir do DB).
-- O MySQL.query.await no db.lua cede a coroutine de load, garantindo que o
-- handler de settings.lua ja esteja registrado quando db:ready dispara.
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/db.lua',
    'server/main.lua',
    'server/vitals.lua',
    'server/settings.lua',
}

lua54 'yes'
use_fxv2_oal 'yes'

ui_page 'html/index.html'

files {
	'html/*',
	'locales/*.json',
}
