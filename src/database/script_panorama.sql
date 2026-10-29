-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

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
-- Table `filmes_db`.`relatorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `filmes_db`.`relatorio` (
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
  INDEX `fk_relatorios_usuario` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_relatorios_usuario`
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

ALTER TABLE usuario ADD COLUMN notificacao TINYINT;
ALTER TABLE token ADD COLUMN email_destinatario VARCHAR(255);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
