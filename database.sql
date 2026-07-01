-- Tabela de configuracoes globais do mri-hud (formato key/value/type, espelha
-- mri_qadmin_settings). Fonte de verdade em runtime dos Config.X primitivos:
-- carregada no boot pelo server/settings.lua e editavel via plugin do mri_Qadmin.
CREATE TABLE IF NOT EXISTS mri_hud_settings (
    name VARCHAR(50) PRIMARY KEY,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'string'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
