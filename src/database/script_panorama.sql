-- MySQL Workbench Forward Engineering

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema filmes_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema filmes_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `filmes_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `filmes_db` ;

-- -----------------------------------------------------
-- Table `filmes_db`.`empresa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`empresa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `telefone` CHAR(11) NULL DEFAULT NULL,
  `cnpj` VARCHAR(15) NOT NULL,
  `nome` VARCHAR(120) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cnpj` (`cnpj` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`filme`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`filme` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NULL DEFAULT NULL,
  `data_lancamento` VARCHAR(50) NULL DEFAULT NULL,
  `score` INT NULL DEFAULT NULL,
  `sinopse` TEXT NULL DEFAULT NULL,
  `titulo_original` VARCHAR(255) NULL DEFAULT NULL,
  `status_filme` VARCHAR(50) NULL DEFAULT NULL,
  `idioma_original` VARCHAR(50) NULL DEFAULT NULL,
  `orcamento` DOUBLE NULL DEFAULT NULL,
  `receita` DOUBLE NULL DEFAULT NULL,
  `pais` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 9731
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`filme_elenco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`filme_elenco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filme_id` INT NULL DEFAULT NULL,
  `ator` TEXT NULL DEFAULT NULL,
  `personagem` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `filme_id` (`filme_id` ASC) VISIBLE,
  CONSTRAINT `filme_elenco_ibfk_1`
    FOREIGN KEY (`filme_id`)
    REFERENCES `filmes_db`.`filme` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 82593
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`filme_genero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`filme_genero` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filme_id` INT NULL DEFAULT NULL,
  `genero` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `filme_id` (`filme_id` ASC) VISIBLE,
  CONSTRAINT `filme_genero_ibfk_1`
    FOREIGN KEY (`filme_id`)
    REFERENCES `filmes_db`.`filme` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 25140
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil_id` INT NOT NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_empresa` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  INDEX `fk_usuario_empresa` (`id_empresa` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_empresa`
    FOREIGN KEY (`id_empresa`)
    REFERENCES `filmes_db`.`empresa` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`projeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`projeto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_projeto_usuario` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_projeto_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `filmes_db`.`usuario` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`observacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`observacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projeto_id` INT NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `conteudo` TEXT NOT NULL,
  `criado_em` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_observacoes_projeto` (`projeto_id` ASC) VISIBLE,
  CONSTRAINT `fk_observacoes_projeto`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `filmes_db`.`projeto` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`publicacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`publicacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projeto_id` INT NULL DEFAULT NULL,
  `usuario_id` INT NULL DEFAULT NULL,
  `titulo` VARCHAR(50) NULL DEFAULT NULL,
  `descricao` TEXT NOT NULL,
  `criado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_publicacao_projeto` (`projeto_id` ASC) VISIBLE,
  INDEX `fk_publicacao_usuario` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_publicacao_projeto`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `filmes_db`.`projeto` (`id`),
  CONSTRAINT `fk_publicacao_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `filmes_db`.`usuario` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`publicacao_observacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`publicacao_observacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_publicacao` INT NULL DEFAULT NULL,
  `id_observacao` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_publicacao_obs` (`id_publicacao` ASC) VISIBLE,
  INDEX `fk_obs_publicacao` (`id_observacao` ASC) VISIBLE,
  CONSTRAINT `fk_obs_publicacao`
    FOREIGN KEY (`id_observacao`)
    REFERENCES `filmes_db`.`observacao` (`id`),
  CONSTRAINT `fk_publicacao_obs`
    FOREIGN KEY (`id_publicacao`)
    REFERENCES `filmes_db`.`publicacao` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`filtro`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`filtro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `titulo` VARCHAR(150) NOT NULL,
  `criterios_pesquisa` TEXT NOT NULL,
  `resumo_resultado` TEXT NULL DEFAULT NULL,
  `criado_em` DATETIME NOT NULL,
  `tipo_visao` VARCHAR(20) NULL DEFAULT NULL,
  `genero` VARCHAR(100) NULL DEFAULT NULL,
  `pais` VARCHAR(100) NULL DEFAULT NULL,
  `operador_lucro` VARCHAR(20) NULL DEFAULT NULL,
  `valor_lucro` DECIMAL(15,2) NULL DEFAULT NULL,
  `operador_avaliacao` VARCHAR(20) NULL DEFAULT NULL,
  `valor_avaliacao` DECIMAL(5,2) NULL DEFAULT NULL,
  `atualizado_em` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_filtros_usuario` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_filtros_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `filmes_db`.`usuario` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `filmes_db`.`token`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`token` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(6) NOT NULL,
  `status_enviado` TINYINT(1) NULL DEFAULT NULL,
  `expiracao` DATETIME NULL DEFAULT NULL,
  `id_empresa` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_token_empresa` (`id_empresa` ASC) VISIBLE,
  CONSTRAINT `fk_token_empresa`
    FOREIGN KEY (`id_empresa`)
    REFERENCES `filmes_db`.`empresa` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


CREATE TABLE feedback(
id INT PRIMARY KEY AUTO_INCREMENT,
texto TEXT ,
status_enviado TINYINT,
publicacao_id INT NOT NULL,
CONSTRAINT fk_publicacao_feedback FOREIGN KEY (publicacao_id) REFERENCES publicacao(id)
);

CREATE TABLE IF NOT EXISTS `filmes_db`.`log_execucao` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nivel` VARCHAR(10) NOT NULL,              
    `origem` VARCHAR(100) NOT NULL,           
    `mensagem` VARCHAR(255) NOT NULL,          
    `data_hora` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
;

CREATE TABLE IF NOT EXISTS `filmes_db`.`genero` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL
  );


CREATE TABLE IF NOT EXISTS `filmes_db`.`filme_ator` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `id_filme` INT,
  CONSTRAINT fk_filme FOREIGN KEY (id_filme) REFERENCES filme(id)
  );

CREATE TABLE IF NOT EXISTS `filmes_db`.`genero_palavra` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `id_genero` INT,
  CONSTRAINT fk_genero FOREIGN KEY (id_genero) REFERENCES genero(id)
  );

  CREATE TABLE avaliacao(
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT ,
  status_enviado TINYINT,
  publicacao_id INT NOT NULL,
  autor_id INT NOT NULL,
  nota TINYINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_avaliacao_publicacao_autor (publicacao_id, autor_id),
  CONSTRAINT chk_avaliacao_nota CHECK (nota BETWEEN 1 AND 5),
  CONSTRAINT fk_publicacao_avaliacao FOREIGN KEY (publicacao_id) REFERENCES publicacao(id),
  CONSTRAINT fk_autor_avaliacao FOREIGN KEY (autor_id) REFERENCES usuario(id)
  );

INSERT INTO genero (nome)
SELECT DISTINCT TRIM(genero)
FROM filme_genero
WHERE genero IS NOT NULL AND TRIM(genero) <> '';

ALTER TABLE projeto ADD COLUMN genero_id INT NULL;
ALTER TABLE projeto ADD CONSTRAINT fk_projeto_genero FOREIGN KEY (genero_id) REFERENCES genero(id) ON DELETE SET NULL;

ALTER TABLE usuario ADD COLUMN notificacao TINYINT;
ALTER TABLE token ADD COLUMN email_destinatario VARCHAR(255);
ALTER TABLE feedback ADD COLUMN autor_id INT NOT NULL;
ALTER TABLE feedback ADD CONSTRAINT fk_feedback_usuario FOREIGN KEY (autor_id) REFERENCES usuario(id);
ALTER TABLE feedback DROP COLUMN status_enviado;
ALTER TABLE feedback ADD COLUMN status TINYINT NOT NULL;
ALTER TABLE feedback ADD COLUMN criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL;

ALTER TABLE usuario ADD COLUMN horario_inicio TIME NULL,
ADD COLUMN horario_fim TIME NULL,
ADD COLUMN dia_resumo_semanal TINYINT NULL;



desc feedback;
CREATE OR REPLACE VIEW vw_emails_pendentes AS
SELECT 
    t.id AS id_token,
    NULL AS id_feedback,
    e.nome AS nome_empresa,
    NULL AS nome_produtor,
    NULL AS nome_roteirista,
    'TOKEN' AS tipo,
    t.status_enviado AS status_enviado,
    t.email_destinatario,
    t.codigo AS codigo,
    t.expiracao AS expiracao,
    NULL AS texto_feedback,
    NULL AS notificacao
FROM token t
INNER JOIN empresa e ON t.id_empresa = e.id

UNION ALL

SELECT 
    NULL AS id_token,
    f.id AS id_feedback,
    e.nome AS nome_empresa,
    produtor.nome AS nome_produtor,
    roteirista.nome AS nome_roteirista,
    'FEEDBACK' AS tipo,
    f.status AS status_enviado,
    roteirista.email AS email_destinatario, 
    NULL AS codigo,
    NULL AS expiracao,     
    f.texto AS texto_feedback,
    roteirista.notificacao AS notificacao
FROM feedback f
INNER JOIN publicacao p ON f.publicacao_id = p.id
INNER JOIN usuario roteirista ON p.usuario_id = roteirista.id
INNER JOIN usuario produtor ON f.autor_id = produtor.id
INNER JOIN empresa e ON produtor.id_empresa = e.id;




-- PROJETO → USUARIO
ALTER TABLE projeto
DROP FOREIGN KEY fk_projeto_usuario;

ALTER TABLE projeto
ADD CONSTRAINT fk_projeto_usuario
FOREIGN KEY (usuario_id) REFERENCES usuario(id)
ON DELETE CASCADE;


-- OBSERVACAO → PROJETO
ALTER TABLE observacao
DROP FOREIGN KEY fk_observacoes_projeto;

ALTER TABLE observacao
ADD CONSTRAINT fk_observacoes_projeto
FOREIGN KEY (projeto_id) REFERENCES projeto(id)
ON DELETE CASCADE;


-- PUBLICACAO → PROJETO
ALTER TABLE publicacao
DROP FOREIGN KEY fk_publicacao_projeto;

ALTER TABLE publicacao
ADD CONSTRAINT fk_publicacao_projeto
FOREIGN KEY (projeto_id) REFERENCES projeto(id)
ON DELETE CASCADE;


-- PUBLICACAO → USUARIO
ALTER TABLE publicacao
DROP FOREIGN KEY fk_publicacao_usuario;

ALTER TABLE publicacao
ADD CONSTRAINT fk_publicacao_usuario
FOREIGN KEY (usuario_id) REFERENCES usuario(id)
ON DELETE CASCADE;


-- PUBLICACAO_OBSERVACAO → PUBLICACAO
ALTER TABLE publicacao_observacao
DROP FOREIGN KEY fk_publicacao_obs;

ALTER TABLE publicacao_observacao
ADD CONSTRAINT fk_publicacao_obs
FOREIGN KEY (id_publicacao) REFERENCES publicacao(id)
ON DELETE CASCADE;

-- PUBLICACAO_OBSERVACAO → OBSERVACAO
ALTER TABLE publicacao_observacao
DROP FOREIGN KEY fk_obs_publicacao;

ALTER TABLE publicacao_observacao
ADD CONSTRAINT fk_obs_publicacao
FOREIGN KEY (id_observacao) REFERENCES observacao(id)
ON DELETE CASCADE;


-- filtro → USUARIO
ALTER TABLE filtro
DROP FOREIGN KEY fk_filtros_usuario;

ALTER TABLE filtro
ADD CONSTRAINT fk_filtros_usuario
FOREIGN KEY (usuario_id) REFERENCES usuario(id)
ON DELETE CASCADE;


-- FEEDBACK → PUBLICACAO
ALTER TABLE feedback
DROP FOREIGN KEY fk_publicacao_feedback;

ALTER TABLE feedback
ADD CONSTRAINT fk_publicacao_feedback
FOREIGN KEY (publicacao_id) REFERENCES publicacao(id)
ON DELETE CASCADE;


-- FEEDBACK → USUARIO (AUTOR)
ALTER TABLE feedback
DROP FOREIGN KEY fk_feedback_usuario;

ALTER TABLE feedback
ADD CONSTRAINT fk_feedback_usuario
FOREIGN KEY (autor_id) REFERENCES usuario(id)
ON DELETE CASCADE;

ALTER TABLE feedback
ADD COLUMN avaliacao TINYINT UNSIGNED NOT NULL DEFAULT 0;

ALTER TABLE feedback DROP COLUMN avaliacao;

CREATE OR REPLACE VIEW vw_emails_pendentes AS
SELECT 
    t.id AS id_token,
    NULL AS id_feedback,
    e.nome AS nome_empresa,
    NULL AS nome_produtor,
    NULL AS nome_roteirista,
    'TOKEN' AS tipo,
    t.status_enviado,
    t.email_destinatario,
    t.codigo AS codigo,
    t.expiracao AS expiracao,
    NULL AS texto_feedback,
    NULL AS notificacao
FROM token t
INNER JOIN empresa e ON t.id_empresa = e.id

UNION ALL

SELECT 
    NULL AS id_token,
    f.id AS id_feedback,
    e.nome AS nome_empresa,
    produtor.nome AS nome_produtor,
    roteirista.nome AS nome_roteirista,
    'FEEDBACK' AS tipo,
    f.status,
    roteirista.email AS email_destinatario, 
    NULL AS codigo,
    NULL AS expiracao,     
    f.texto AS texto_feedback,
    roteirista.notificacao AS notificacao
FROM feedback f
INNER JOIN publicacao p ON f.publicacao_id = p.id
INNER JOIN usuario roteirista ON p.usuario_id = roteirista.id
INNER JOIN usuario produtor ON f.autor_id = produtor.id
INNER JOIN empresa e ON produtor.id_empresa = e.id;

-- VIEWS DAS DASHBOARDS - Para facilitar essas daqui são utilizadas por geral
    
-- Data convertida, lucro/ROI calculados
CREATE OR REPLACE VIEW vw_base_filme AS
SELECT
  t.*,
  YEAR(t.data_lancamento)  AS ano,
  MONTH(t.data_lancamento) AS mes
FROM (
  SELECT
    f.id AS filme_id,
    f.nome,
    STR_TO_DATE(TRIM(f.data_lancamento), '%m/%d/%Y') AS data_lancamento,
    f.score,
    f.orcamento,
    f.receita,
    f.pais AS pais,
    CASE WHEN f.orcamento > 0 AND f.receita > 0
         THEN f.receita - f.orcamento END AS lucro,
    CASE WHEN f.orcamento > 0 AND f.receita > 0
         THEN f.receita / f.orcamento END AS roi
  FROM filme f
) t;

-- Um registro por filme x gênero (sem duplicidades)
CREATE OR REPLACE VIEW vw_base_filme_genero_unico AS
SELECT DISTINCT
  fg.filme_id,
  TRIM(fg.genero) AS genero
FROM filme_genero fg
WHERE fg.genero IS NOT NULL AND TRIM(fg.genero) <> '';

-- Filme + gênero - base da maioria dos especificos
CREATE OR REPLACE VIEW vw_base_filme_genero AS
SELECT b.*, g.genero
FROM vw_base_filme b
INNER JOIN vw_base_filme_genero_unico g ON g.filme_id = b.filme_id;

-- Pares de gêneros que aparecem juntos no mesmo filme
CREATE OR REPLACE VIEW vw_base_genero_associacao AS
SELECT
  a.genero,
  b.genero AS genero_associado,
  COUNT(*) AS qtd_filmes,
  ROUND(100 * COUNT(*) / tot.total_filmes, 0) AS percentual
FROM vw_base_filme_genero_unico a
INNER JOIN vw_base_filme_genero_unico b
        ON b.filme_id = a.filme_id AND b.genero <> a.genero
INNER JOIN (
  SELECT genero, COUNT(*) AS total_filmes
  FROM vw_base_filme_genero_unico
  GROUP BY genero
) tot ON tot.genero = a.genero
GROUP BY a.genero, b.genero, tot.total_filmes;

-- DASHBOARD GERAL ROTEIRISTA
	-- Avaliação média x genero
CREATE OR REPLACE VIEW vw_rot_geral_grafico_nota_genero AS
SELECT
  genero,
  nota_media,
  qtd_filmes,
  ROUND(AVG(nota_media) OVER (), 1) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY nota_media DESC) AS ranking
FROM (
  SELECT genero, ROUND(AVG(score), 1) AS nota_media, COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE score IS NOT NULL
  GROUP BY genero
) t;

	-- Avaliação média x País de origem (use ranking <= 5)
CREATE OR REPLACE VIEW vw_rot_geral_grafico_nota_pais AS
SELECT
  pais,
  nota_media,
  qtd_filmes,
  ROUND(AVG(nota_media) OVER (), 1) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY nota_media DESC) AS ranking
FROM (
  SELECT pais, ROUND(AVG(score), 1) AS nota_media, COUNT(*) AS qtd_filmes
  FROM filme
  WHERE score IS NOT NULL AND pais IS NOT NULL
  GROUP BY pais
  HAVING COUNT(*) >= 5  -- amostra mínima por país
) t;

	-- Genero com melhro média de avaliações
CREATE OR REPLACE VIEW vw_rot_geral_kpi_genero_melhor_nota AS
SELECT genero, nota_media
FROM vw_rot_geral_grafico_nota_genero
WHERE ranking = 1;

	-- País com melhor média de avaliações
CREATE OR REPLACE VIEW vw_rot_geral_kpi_pais_melhor_nota AS
SELECT pais, nota_media
FROM vw_rot_geral_grafico_nota_pais
WHERE ranking = 1;

	-- Gênero mais associado a outros gêneros
CREATE OR REPLACE VIEW vw_rot_geral_kpi_genero_associado AS
SELECT genero, total_associacoes
FROM (
  SELECT
    genero,
    SUM(qtd_filmes) AS total_associacoes,
    ROW_NUMBER() OVER (ORDER BY SUM(qtd_filmes) DESC) AS ranking
  FROM vw_base_genero_associacao
  GROUP BY genero
) t
WHERE ranking = 1;

-- DASHBOARD ESPECIFICA ROTEIRISTA
	-- Avaliação média x Pais origem (barras + linha media_genero)
CREATE OR REPLACE VIEW vw_rot_esp_grafico_nota_pais AS
SELECT
  genero,
  pais,
  nota_media,
  qtd_filmes,
  ROUND(AVG(nota_media) OVER (PARTITION BY genero), 1) AS media_genero,
  ROW_NUMBER() OVER (PARTITION BY genero ORDER BY nota_media DESC) AS ranking
FROM (
  SELECT genero, pais, ROUND(AVG(score), 1) AS nota_media, COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE score IS NOT NULL AND pais IS NOT NULL
  GROUP BY genero, pais
  HAVING COUNT(*) >= 3          -- amostra mínima por país
) t;    

	-- Proporção de Gêneros Associados (%)
CREATE OR REPLACE VIEW vw_rot_esp_grafico_generos_associados AS
SELECT
  genero,
  genero_associado,
  qtd_filmes,
  percentual,
  ROW_NUMBER() OVER (PARTITION BY genero ORDER BY percentual DESC, genero_associado) AS ranking
FROM vw_base_genero_associacao;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
