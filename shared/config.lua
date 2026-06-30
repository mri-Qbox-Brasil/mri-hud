Config = {}

Config.OpenMenu = 'I' -- https://docs.fivem.net/docs/game-references/input-mapper-parameter-ids/keyboard/
Config.PositioningKey = 'F10' -- Key to open the HUD positioning mode
Config.StressChance = 0.1 -- Default: 10% -- Percentage Stress Chance When Shooting (0-1)
Config.UseMPH = true -- If true speed math will be done as MPH, if false KPH will be used (YOU HAVE TO CHANGE CONTENT IN STYLES.CSS TO DISPLAY THE CORRECT TEXT)
Config.MinimumStress = 50 -- Minimum Stress Level For Screen Shaking
Config.MinimumSpeedUnbuckled = 50 -- Going Over This Speed Will Cause Stress
Config.MinimumSpeed = 100 -- Going Over This Speed Will Cause Stress
Config.DisablePoliceStress = false -- Default: false, If true will disable stress for people with the police job
Config.VehicleEnabled = true -- Enable/Disable the vehicle portion of the HUD (this allows you to use a custom speedometer)

-- Admin only to change hud icons/shapes
Config.AdminOnly = false

-- Stress
Config.WhitelistedWeaponArmed = { -- weapons specifically whitelisted to not show armed mode
    -- miscellaneous
    `weapon_petrolcan`,
    `weapon_hazardcan`,
    `weapon_fireextinguisher`,
    -- melee
    `weapon_dagger`,
    `weapon_bat`,
    `weapon_bottle`,
    `weapon_crowbar`,
    `weapon_flashlight`,
    `weapon_golfclub`,
    `weapon_hammer`,
    `weapon_hatchet`,
    `weapon_knuckle`,
    `weapon_knife`,
    `weapon_machete`,
    `weapon_switchblade`,
    `weapon_nightstick`,
    `weapon_wrench`,
    `weapon_battleaxe`,
    `weapon_poolcue`,
    `weapon_briefcase`,
    `weapon_briefcase_02`,
    `weapon_garbagebag`,
    `weapon_handcuffs`,
    `weapon_bread`,
    `weapon_stone_hatchet`,
    -- throwables
    `weapon_grenade`,
    `weapon_bzgas`,
    `weapon_molotov`,
    `weapon_stickybomb`,
    `weapon_proxmine`,
    `weapon_snowball`,
    `weapon_pipebomb`,
    `weapon_ball`,
    `weapon_smokegrenade`,
    `weapon_flare`
}

Config.WhitelistedWeaponStress = {
    `weapon_petrolcan`,
    `weapon_hazardcan`,
    `weapon_fireextinguisher`
}

Config.Intensity = {
    ["blur"] = {
        [1] = {
            min = 50,
            max = 60,
            intensity = 1500,
        },
        [2] = {
            min = 60,
            max = 70,
            intensity = 2000,
        },
        [3] = {
            min = 70,
            max = 80,
            intensity = 2500,
        },
        [4] = {
            min = 80,
            max = 90,
            intensity = 2700,
        },
        [5] = {
            min = 90,
            max = 100,
            intensity = 3000,
        },
    }
}

Config.EffectInterval = {
    [1] = {
        min = 50,
        max = 60,
        timeout = math.random(50000, 60000)
    },
    [2] = {
        min = 60,
        max = 70,
        timeout = math.random(40000, 50000)
    },
    [3] = {
        min = 70,
        max = 80,
        timeout = math.random(30000, 40000)
    },
    [4] = {
        min = 80,
        max = 90,
        timeout = math.random(20000, 30000)
    },
    [5] = {
        min = 90,
        max = 100,
        timeout = math.random(15000, 20000)
    }
}

Config.FuelBlacklist = {
	"surge",
	"iwagen",
	"voltic",
	"voltic2",
	"raiden",
	"cyclone",
	"tezeract",
	"neon",
	"omnisegt",
	"iwagen",
	"caddy",
	"caddy2",
	"caddy3",
	"airtug",
	"rcbandito",
	"imorgon",
	"dilettante",
	"khamelion",
	"wheelchair",
}

-- ─────────────────────────────────────────────────────────────────
-- Status Icons — define quais painéis aparecem e em que ordem.
-- Remova uma entrada ou defina enabled = false para ocultar o ícone.
-- A ordem da tabela determina a ordem de exibição.
-- ─────────────────────────────────────────────────────────────────
Config.StatusIcons = {
    { id = "voice",     enabled = true  },
    { id = "health",    enabled = true  },
    { id = "armor",     enabled = true  },
    { id = "hunger",    enabled = true  },
    { id = "thirst",    enabled = true  },
    { id = "stress",    enabled = true  },
    { id = "oxygen",    enabled = true  },
    { id = "armed",     enabled = true  },
    { id = "parachute", enabled = true  },
    { id = "harness",   enabled = true  },
    { id = "cruise",    enabled = true  },
    { id = "nitro",     enabled = true  },
    { id = "dev",       enabled = true  },
}

-- ─────────────────────────────────────────────────────────────────
-- Server Logo — exibe uma imagem PNG na HUD.
-- Coloque o arquivo na pasta html/ do recurso.
-- x/y são percentuais do viewport (vw / vh).
-- ─────────────────────────────────────────────────────────────────
Config.ServerLogo = {
    enabled = true,
    src    = "https://assets.mriqbox.com.br/branding/logo96.webp", -- nome do arquivo em html/
    width  = 80,         -- largura em px
    x      = 50,         -- posição horizontal (vw %)
    y      = 5,          -- posição vertical   (vh %)
}

-- ─────────────────────────────────────────────────────────────────
-- Positioning Mode — controla quais elementos podem ser reposicionados.
-- enabled: false desativa completamente o modo de posicionamento (F10).
-- Por elemento: canMove = arrastar, canHide = ocultar/mostrar, canResize = redimensionar.
-- ─────────────────────────────────────────────────────────────────
Config.Positioning = {
    enabled = true,
    elements = {
        statusBar     = { canMove = true,  canHide = true,  canResize = false },
        compassHud    = { canMove = true,  canHide = true,  canResize = false },
        moneyHud      = { canMove = true,  canHide = true,  canResize = false },
        minimap       = { canMove = false, canHide = false, canResize = false }, -- reposicionamento desativado temporariamente (bugs pendentes)
        speedometer   = { canMove = true,  canHide = true,  canResize = true  },
        fuelgauge     = { canMove = true,  canHide = true,  canResize = true  },
        seatbelt      = { canMove = true,  canHide = true,  canResize = false },
        serverLogo    = { canMove = true,  canHide = true,  canResize = false },
        aircraftFuel  = { canMove = true,  canHide = true,  canResize = true  },
        dynamicGauges = { canMove = true,  canHide = true,  canResize = true  }, -- afeta todos os custom gauges
    },
}

Config.VehClassStress = { -- Enable/Disable gaining stress from vehicle classes in this table
    ['0'] = true, -- Compacts
    ['1'] = true, -- Sedans
    ['2'] = true, -- SUVs
    ['3'] = true, -- Coupes
    ['4'] = true, -- Muscle
    ['5'] = true,  -- Sports Classics
    ['6'] = true, -- Sports
    ['7'] = true, -- Super
    ['8'] = false, -- Motorcycles
    ['9'] = true, -- Off Road
    ['10'] = true, -- Industrial
    ['11'] = true,  -- Utility
    ['12'] = true,  -- Vans
    ['13'] = false, -- Cycles
    ['14'] = false, -- Boats
    ['15'] = false, -- Helicopters
    ['16'] = false, -- Planes
    ['18'] = false, -- Emergency
    ['19'] = false, -- Military
    ['20'] = false, -- Commercial
    ['21'] = false  -- Trains
}
