-- Migração incremental e não destrutiva para habilitar gêneros por projeto.
-- Execute usando o schema filmes_db. O script_panorama.sql é uma montagem
-- completa do banco e contém DROP DATABASE; não o execute para esta migração.

CREATE TABLE IF NOT EXISTS projeto_genero (
    projeto_id INT NOT NULL,
    genero_id INT NOT NULL,
    PRIMARY KEY (projeto_id, genero_id),
    INDEX idx_projeto_genero_genero (genero_id),
    CONSTRAINT fk_projeto_genero_projeto
        FOREIGN KEY (projeto_id) REFERENCES projeto(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_projeto_genero_genero
        FOREIGN KEY (genero_id) REFERENCES genero(id)
        ON DELETE CASCADE
);
