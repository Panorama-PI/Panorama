
-- MySQL Workbench Forward Engineering
 
-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema filmes_db
-- -----------------------------------------------------
drop database filmes_db;
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
  `nome` VARCHAR(100) UNIQUE NOT NULL,
  `id_genero` INT,
  CONSTRAINT fk_genero FOREIGN KEY (id_genero) REFERENCES genero(id)
  );
 
  CREATE TABLE avaliacao(
  id INT PRIMARY KEY AUTO_INCREMENT,
  texto TEXT ,
  status_enviado TINYINT,
  publicacao_id INT NOT NULL,
  CONSTRAINT fk_publicacao_avaliacao FOREIGN KEY (publicacao_id) REFERENCES publicacao(id)
  );
 
-- A tabela genero é preenchida AQUI, lendo a coluna de texto da filme_genero ANTIGA.
-- Por isso o DROP da filme_genero só pode vir depois deste INSERT.
INSERT INTO genero (nome)
SELECT DISTINCT TRIM(genero)
FROM filme_genero
WHERE genero IS NOT NULL AND TRIM(genero) <> '';
 
 
-- =====================================================================
-- RECRIAÇÃO DE filme_genero, ator E filme_ator (modelo associativo)
-- ORDEM: 1) DROP  ->  2) CREATE  ->  3) ALTERs (mais abaixo)
-- ATENÇÃO: o DROP apaga os dados das 3 tabelas.
-- =====================================================================
 
-- 1) DROP
-- Nenhuma dessas 3 tabelas é referenciada por outra (todas apontam para filme),
-- então a ordem entre elas é livre.
DROP TABLE IF EXISTS `filmes_db`.`filme_elenco`;
DROP TABLE IF EXISTS `filmes_db`.`filme_genero`;
DROP TABLE IF EXISTS `filmes_db`.`filme_ator`;
 
-- 2) CREATE
-- (a tabela genero já foi criada acima)
 
-- Associativa FILME x GENERO
CREATE TABLE IF NOT EXISTS `filmes_db`.`filme_genero` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_filme` INT NOT NULL,
  `id_genero` INT NOT NULL,
  CONSTRAINT `fk_filme_genero_filme`
    FOREIGN KEY (`id_filme`) REFERENCES `filmes_db`.`filme` (`id`),
  CONSTRAINT `fk_filme_genero_genero`
    FOREIGN KEY (`id_genero`) REFERENCES `filmes_db`.`genero` (`id`)
);
 
-- ATOR
CREATE TABLE IF NOT EXISTS `filmes_db`.`ator` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL
);
-- Associativa FILME x ATOR (com o personagem interpretado)
CREATE TABLE IF NOT EXISTS `filmes_db`.`filme_ator` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `id_filme` INT NOT NULL,
  `id_ator` INT NOT NULL,
  `personagem` VARCHAR(255) NULL,
  CONSTRAINT `fk_filme_ator_filme`
    FOREIGN KEY (`id_filme`) REFERENCES `filmes_db`.`filme` (`id`),
  CONSTRAINT `fk_filme_ator_ator`
    FOREIGN KEY (`id_ator`) REFERENCES `filmes_db`.`ator` (`id`)
);
 
DROP TABLE IF EXISTS avaliacao;
 
CREATE TABLE IF NOT EXISTS avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    texto DECIMAL(2,1) NOT NULL,
    status_enviado TINYINT NOT NULL DEFAULT 0,
    publicacao_id INT NOT NULL,
    autor_id INT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_publicacao_avaliacao
        FOREIGN KEY (publicacao_id)
        REFERENCES publicacao(id),
 
    CONSTRAINT fk_avaliacao_autor
        FOREIGN KEY (autor_id)
        REFERENCES usuario(id),
 
    CONSTRAINT uq_avaliacao_publicacao_autor
        UNIQUE (publicacao_id, autor_id),
 
    CONSTRAINT chk_avaliacao_nota
        CHECK (texto >= 0 AND texto <= 5)
);
 
CREATE TABLE IF NOT EXISTS email_envio_semanal (
 
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,
    enviado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    CONSTRAINT fk_email_semanal_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id),
 
    CONSTRAINT uq_email_semanal
        UNIQUE (usuario_id, tipo, periodo_inicio)
 
);
 
-- =====================================================================
-- 3) ALTERs
-- =====================================================================
 
-- Nome do gênero único.
-- Se der erro 1062 (Duplicate entry), há gêneros repetidos em genero: remova os duplicados antes.
ALTER TABLE genero ADD CONSTRAINT uq_genero_nome UNIQUE (nome);
ALTER TABLE projeto ADD COLUMN genero_id INT NULL;
ALTER TABLE projeto ADD CONSTRAINT fk_projeto_genero FOREIGN KEY (genero_id) REFERENCES genero(id) ON DELETE SET NULL;
 
ALTER TABLE token ADD COLUMN email_destinatario VARCHAR(255);
ALTER TABLE feedback ADD COLUMN autor_id INT NOT NULL;
ALTER TABLE feedback ADD CONSTRAINT fk_feedback_usuario FOREIGN KEY (autor_id) REFERENCES usuario(id);
ALTER TABLE feedback DROP COLUMN status_enviado;
ALTER TABLE feedback ADD COLUMN status TINYINT NOT NULL;
ALTER TABLE feedback ADD COLUMN criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL;
 
ALTER TABLE usuario ADD COLUMN horario_inicio TIME NULL,
ADD COLUMN horario_fim TIME NULL,
ADD COLUMN dia_resumo_semanal TINYINT NULL;
 
-- CORRIGIDO (1): a coluna notificacao precisa existir ANTES de criar vw_emails_pendentes,
-- pois a view lê roteirista.notificacao. Estes 3 comandos estavam depois da view.
ALTER TABLE usuario
ADD COLUMN notificacao TINYINT NOT NULL DEFAULT 1;
 
-- Corrige os usuários que já estão com notificacao NULL
-- (CORRIGIDO: esta linha tinha só um "-", o que causava erro de sintaxe)
UPDATE usuario
SET notificacao = 0
WHERE notificacao IS NULL;
 
-- Define 0 como valor padrão e impede NULL
ALTER TABLE usuario
MODIFY COLUMN notificacao TINYINT NOT NULL DEFAULT 0;
 
-- CORRIGIDO (2): horario_inicio, horario_fim e dia_resumo_semanal já foram adicionadas
-- acima. O ADD COLUMN repetido dava erro 1060 (Duplicate column name);
-- aqui só definimos os valores padrão com MODIFY.
ALTER TABLE usuario
MODIFY COLUMN dia_resumo_semanal TINYINT DEFAULT 1,
MODIFY COLUMN horario_inicio TIME DEFAULT '09:00:00',
MODIFY COLUMN horario_fim TIME DEFAULT '10:00:00';
 
 
DROP TABLE IF EXISTS genero_palavra;
 
CREATE TABLE genero_palavra (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  id_genero INT NOT NULL,
  INDEX idx_genero_palavra (id_genero, nome),
  CONSTRAINT fk_genero FOREIGN KEY (id_genero) REFERENCES genero(id)
);
 
ALTER TABLE ator ADD CONSTRAINT uq_ator_nome UNIQUE (nome);
 

ALTER TABLE projeto DROP FOREIGN KEY fk_projeto_genero;
ALTER TABLE projeto DROP COLUMN genero_id;


CREATE TABLE IF NOT EXISTS filmes_db.projeto_genero (
  projeto_id INT NOT NULL,
  genero_id  INT NOT NULL,
  PRIMARY KEY (projeto_id, genero_id),
  INDEX fk_projeto_genero_genero (genero_id ASC),
  CONSTRAINT fk_projeto_genero_projeto
    FOREIGN KEY (projeto_id) REFERENCES filmes_db.projeto (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_projeto_genero_genero
    FOREIGN KEY (genero_id) REFERENCES filmes_db.genero (id)
    ON DELETE CASCADE
);
 
-- vw_emails_pendentes (versão final, com horarios e avaliacao)
CREATE OR REPLACE VIEW vw_emails_pendentes AS
 
-- 1) TOKEN
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
    NULL AS notificacao,
    u.horario_inicio AS horario_inicio,   -- NULL se o e-mail do token ainda não for de um usuário
    u.horario_fim AS horario_fim,
    NULL AS id_avaliacao
FROM token t
INNER JOIN empresa e ON t.id_empresa = e.id
LEFT JOIN usuario u ON u.email = t.email_destinatario   
 
UNION ALL
 
-- 2) FEEDBACK (produtor -> roteirista)
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
    roteirista.notificacao AS notificacao,
    roteirista.horario_inicio AS horario_inicio,
    roteirista.horario_fim AS horario_fim,
    NULL AS id_avaliacao
FROM feedback f
INNER JOIN publicacao p ON f.publicacao_id = p.id
INNER JOIN usuario roteirista ON p.usuario_id = roteirista.id
INNER JOIN usuario produtor ON f.autor_id = produtor.id
INNER JOIN empresa e ON produtor.id_empresa = e.id
 
UNION ALL
 
-- 3) AVALIAÇÃO (produtor -> roteirista; agora a tabela avaliacao tem autor_id)
SELECT 
    NULL AS id_token,
    NULL AS id_feedback,
    e.nome AS nome_empresa,          -- empresa do produtor (autor), igual ao feedback
    produtor.nome AS nome_produtor,
    roteirista.nome AS nome_roteirista,
    'AVALIACAO' AS tipo,
    a.status_enviado AS status_enviado,
    roteirista.email AS email_destinatario,
    NULL AS codigo,
    NULL AS expiracao,
    a.texto AS texto_feedback,       -- aqui vai a nota (0 a 5)
    roteirista.notificacao AS notificacao,
    roteirista.horario_inicio AS horario_inicio,
    roteirista.horario_fim AS horario_fim,
    a.id AS id_avaliacao
FROM avaliacao a
INNER JOIN publicacao p ON a.publicacao_id = p.id
INNER JOIN usuario roteirista ON p.usuario_id = roteirista.id
INNER JOIN usuario produtor ON a.autor_id = produtor.id
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
 
-- CORRIGIDO (3): aqui havia um SEGUNDO "CREATE OR REPLACE VIEW vw_emails_pendentes"
-- (a versão ANTIGA, sem horarios e sem avaliacao). Ele sobrescrevia a view nova.
-- Foi removido: a versão final é a que está logo depois do "desc feedback;".
 
 -- VIEWS DASHBOARD -- VIEWS DASHBOARD -- VIEWS DASHBOARD -- VIEWS DASHBOARD -- VIEWS DASHBOARD -- VIEWS DASHBOARD
 
-- VIEWS GERAIS - Para facilitar essas daqui são utilizadas por geral
    
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
-- ATUALIZADA: filme_genero agora é associativa (id_filme, id_genero),
-- então o nome do gênero vem da tabela genero.
CREATE OR REPLACE VIEW vw_base_filme_genero_unico AS
SELECT DISTINCT
  fg.id_filme AS filme_id,
  TRIM(g.nome) AS genero
FROM filme_genero fg
INNER JOIN genero g ON g.id = fg.id_genero
WHERE g.nome IS NOT NULL AND TRIM(g.nome) <> '';
 
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
 
 
 
-- Um registro por filme x ator (evita duplicar quando o ator faz 2 personagens no mesmo filme)
CREATE OR REPLACE VIEW vw_base_filme_ator_unico AS
SELECT DISTINCT
  fa.id_filme AS filme_id,
  a.id        AS ator_id,
  TRIM(a.nome) AS ator
FROM filme_ator fa
INNER JOIN ator a ON a.id = fa.id_ator
WHERE a.nome IS NOT NULL AND TRIM(a.nome) <> '';
 
-- Filme + gênero + ator (base da visão específica de atores)
CREATE OR REPLACE VIEW vw_base_filme_genero_ator AS
SELECT b.*, fa.ator
FROM vw_base_filme_genero b
INNER JOIN vw_base_filme_ator_unico fa ON fa.filme_id = b.filme_id;
 
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
 
-- DASHBOARD GERAL RPODUTOR -- DASHBOARD GERAL PRODUTOR -- DASHBOARD GERAL PRODUTOR 

-- Gráfico: Lucro x Gênero (barras + linha "Média: 3,3B")
CREATE OR REPLACE VIEW vw_prod_geral_grafico_lucro_genero AS
SELECT
  genero,
  lucro_total,
  qtd_filmes,
  ROUND(AVG(lucro_total) OVER (), 2) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY lucro_total DESC) AS ranking
FROM (
  SELECT genero, SUM(lucro) AS lucro_total, COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE lucro IS NOT NULL
  GROUP BY genero
) t;


-- Gráfico: Gênero x ROI (barras + linha "Média: 2,7x")
-- o calculo do roi ta receita total / orçamento total do genero
CREATE OR REPLACE VIEW vw_prod_geral_grafico_roi_genero AS
SELECT
  genero,
  roi,
  qtd_filmes,
  ROUND(AVG(roi) OVER (), 1) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY roi DESC) AS ranking
FROM (
  SELECT
    genero,
    ROUND(SUM(receita) / SUM(orcamento), 1) AS roi,
    COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE lucro IS NOT NULL            -- só filmes com orçamento e receita
  GROUP BY genero
) t;

-- Gráfico: Gênero x % de filmes com lucro (barras + linha "Média: 62,8%")
CREATE OR REPLACE VIEW vw_prod_geral_grafico_pct_lucro_genero AS
SELECT
  genero,
  pct_com_lucro,
  pct_sem_lucro,
  qtd_filmes,
  ROUND(AVG(pct_com_lucro) OVER (), 1) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY pct_com_lucro DESC) AS ranking
FROM (
  SELECT
    genero,
    ROUND(100 * SUM(lucro > 0) / COUNT(*), 1)       AS pct_com_lucro,
    ROUND(100 - 100 * SUM(lucro > 0) / COUNT(*), 1) AS pct_sem_lucro,
    COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE lucro IS NOT NULL
  GROUP BY genero
) t;

-- Gráfico: Orçamento médio x Gênero (barras + linha "Média: 40,3M")
CREATE OR REPLACE VIEW vw_prod_geral_grafico_orcamento_genero AS
SELECT
  genero,
  orcamento_medio,
  qtd_filmes,
  ROUND(AVG(orcamento_medio) OVER (), 2) AS media_geral,
  ROW_NUMBER() OVER (ORDER BY orcamento_medio DESC) AS ranking
FROM (
  SELECT genero, ROUND(AVG(orcamento), 2) AS orcamento_medio, COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE orcamento > 0
  GROUP BY genero
) t;

-- Gráfico: Período de lançamento x Lucro (todos os gêneros) (linha + "Média: 25,5M")
-- usa vw_base_filme (e não por gênero) para cada filme contar so uma vez
CREATE OR REPLACE VIEW vw_prod_geral_grafico_periodo_lucro AS
SELECT
  mes,
  ELT(mes, 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
           'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro') AS nome_mes, -- isso aqui é p transformar em separadinho
  lucro_medio,
  qtd_filmes,
  ROUND(AVG(lucro_medio) OVER (), 2) AS media_anual,
  ROW_NUMBER() OVER (ORDER BY lucro_medio DESC) AS ranking
FROM (
  SELECT mes, ROUND(AVG(lucro), 2) AS lucro_medio, COUNT(*) AS qtd_filmes
  FROM vw_base_filme
  WHERE lucro IS NOT NULL AND mes IS NOT NULL
  GROUP BY mes
) t;
 
 -- KPI: Gênero mais lucrativo geral
CREATE OR REPLACE VIEW vw_prod_geral_kpi_genero_mais_lucrativo AS
SELECT genero, lucro_total
FROM vw_prod_geral_grafico_lucro_genero
WHERE ranking = 1;

-- KPI: Gênero com maior retorno
CREATE OR REPLACE VIEW vw_prod_geral_kpi_genero_maior_roi AS
SELECT genero, roi
FROM vw_prod_geral_grafico_roi_genero
WHERE ranking = 1;

-- KPI: Gênero de maior risco (ROI < 2,5x) (ex.: Ação - 45% dos filmes sem lucro)
-- entre os generos com roi abaixo de 2,5x pega o que tem maior % de filmes sem lucro, acho que era isso ne
CREATE OR REPLACE VIEW vw_prod_geral_kpi_genero_maior_risco AS
SELECT r.genero, r.roi, p.pct_sem_lucro
FROM vw_prod_geral_grafico_roi_genero r
INNER JOIN vw_prod_geral_grafico_pct_lucro_genero p ON p.genero = r.genero
WHERE r.roi < 2.5
ORDER BY p.pct_sem_lucro DESC
LIMIT 1;

-- KPI: Melhor mês para lançar filmes
CREATE OR REPLACE VIEW vw_prod_geral_kpi_melhor_mes AS
SELECT mes, nome_mes, lucro_medio
FROM vw_prod_geral_grafico_periodo_lucro
WHERE ranking = 1;
 
 -- DASHBOARD ESPECIFICA RPODUTOR -- DASHBOARD ESPECIFICA PRODUTOR -- DASHBOARD ESPECIFICA PRODUTOR -- AQUI DAVID
 
 -- antes de tudo deixa eu explicar umas coisas
 -- o row nuumber() é pra numerar as linhas e o over eh pra definir o criterio
 -- ai, por exemplo, o partition by genero divide as linhas em grupo por generos, entao cada grupo tem seu 1 2 3 tendeu
 --  e o order by basico ne
 
 -- ai no model vc meio q so vai precisar puxar as views daqui botando um where genero = ? e ranking <= 5 tendeu
 
 -- Gráfico: País de origem x Lucro (top 5 -> WHERE ranking <= 5) + linha "Média"
-- media_top5 = média dos 5 países exibidos (é isso que a linha do grafico ta mostrando)
CREATE OR REPLACE VIEW vw_prod_esp_grafico_pais_lucro AS
SELECT
  genero,
  pais,
  lucro_total,
  qtd_filmes,
  ranking,
  ROUND(AVG(CASE WHEN ranking <= 5 THEN lucro_total END)
        OVER (PARTITION BY genero), 2) AS media_top5
FROM (
  SELECT
    genero,
    pais,
    SUM(lucro) AS lucro_total,
    COUNT(*)   AS qtd_filmes,
    ROW_NUMBER() OVER (PARTITION BY genero ORDER BY SUM(lucro) DESC) AS ranking
  FROM vw_base_filme_genero
  WHERE lucro IS NOT NULL AND pais IS NOT NULL
  GROUP BY genero, pais
) t;

-- Gráfico: Atores x Aparições em produções lucrativas (top 5 -> WHERE ranking <= 5)
CREATE OR REPLACE VIEW vw_prod_esp_grafico_atores_aparicoes AS
SELECT
  genero,
  ator,
  aparicoes,
  ROW_NUMBER() OVER (PARTITION BY genero ORDER BY aparicoes DESC, ator) AS ranking
FROM (
  SELECT genero, ator, COUNT(DISTINCT filme_id) AS aparicoes
  FROM vw_base_filme_genero_ator
  WHERE lucro > 0
  GROUP BY genero, ator
) t;

-- Gráfico: Atores x Gênero x Lucro (top 5 -> WHERE ranking <= 5)
CREATE OR REPLACE VIEW vw_prod_esp_grafico_atores_lucro AS
SELECT
  genero,
  ator,
  lucro_total,
  qtd_filmes,
  ROW_NUMBER() OVER (PARTITION BY genero ORDER BY lucro_total DESC, ator) AS ranking
FROM (
  SELECT genero, ator, SUM(lucro) AS lucro_total, COUNT(DISTINCT filme_id) AS qtd_filmes
  FROM vw_base_filme_genero_ator
  WHERE lucro IS NOT NULL
  GROUP BY genero, ator
) t;

-- Gráfico: Período x Lucro x Gênero (média anual) (linha de 12 meses)
CREATE OR REPLACE VIEW vw_prod_esp_grafico_periodo_lucro AS
SELECT
  genero,
  mes,
  ELT(mes, 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
           'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro') AS nome_mes,
  lucro_medio,
  qtd_filmes,
  ROUND(AVG(lucro_medio) OVER (PARTITION BY genero), 2) AS media_anual
FROM (
  SELECT genero, mes, ROUND(AVG(lucro), 2) AS lucro_medio, COUNT(*) AS qtd_filmes
  FROM vw_base_filme_genero
  WHERE lucro IS NOT NULL AND mes IS NOT NULL -- sem null aquiiiii
  GROUP BY genero, mes
) t;

-- Auxiliar: janelas de 3 meses consecutivos (ex.: Jun-Ago) por gênero
-- view demoniaca por sinal deus melivre
CREATE OR REPLACE VIEW vw_prod_esp_base_janela_pico AS
SELECT
  genero,
  mes_inicio,
  mes_fim,
  lucro_medio_periodo,
  ROW_NUMBER() OVER (PARTITION BY genero ORDER BY lucro_medio_periodo DESC) AS ranking
FROM (
  SELECT
    m1.genero,
    m1.mes AS mes_inicio,
    m3.mes AS mes_fim,
    ROUND((m1.lucro_medio + m2.lucro_medio + m3.lucro_medio) / 3, 2) AS lucro_medio_periodo
  FROM vw_prod_esp_grafico_periodo_lucro m1
  INNER JOIN vw_prod_esp_grafico_periodo_lucro m2
          ON m2.genero = m1.genero AND m2.mes = m1.mes + 1
  INNER JOIN vw_prod_esp_grafico_periodo_lucro m3
          ON m3.genero = m1.genero AND m3.mes = m1.mes + 2
) t;

-- KPI: País mais lucrativo
CREATE OR REPLACE VIEW vw_prod_esp_kpi_pais_mais_lucrativo AS
SELECT genero, pais, lucro_total
FROM vw_prod_esp_grafico_pais_lucro
WHERE ranking = 1;

-- KPI: Ator com mais aparições em filmes lucrativos
CREATE OR REPLACE VIEW vw_prod_esp_kpi_ator_mais_aparicoes AS
SELECT genero, ator, aparicoes
FROM vw_prod_esp_grafico_atores_aparicoes
WHERE ranking = 1;

-- KPI: Período de pico de lucro (ex.: Junho a Agosto - média $28M)
CREATE OR REPLACE VIEW vw_prod_esp_kpi_periodo_pico AS
SELECT
  genero,
  mes_inicio,
  mes_fim,
  CONCAT(
    ELT(mes_inicio, 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'),
    ' a ',
    ELT(mes_fim, 'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro')
  ) AS periodo,
  lucro_medio_periodo
FROM vw_prod_esp_base_janela_pico
WHERE ranking = 1;


 
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
 
 