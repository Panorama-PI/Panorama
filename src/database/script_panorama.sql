CREATE DATABASE IF NOT EXISTS filmes_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
 
USE filmes_db;

 
CREATE TABLE empresa (
    id        INT PRIMARY KEY AUTO_INCREMENT,
    telefone  CHAR(11),
    cnpj      VARCHAR(15) NOT NULL UNIQUE,
    nome      VARCHAR(120) NOT NULL
);
 
CREATE TABLE usuario (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    perfil_id   INT NOT NULL,
    criado_em   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_empresa  INT NOT NULL,
    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
 
CREATE TABLE token (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    codigo          VARCHAR(6) NOT NULL UNIQUE,
    status_enviado  BOOLEAN,
    expiracao       DATETIME,
    id_empresa      INT NOT NULL,
    email           VARCHAR(255),
    CONSTRAINT fk_token_empresa
        FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
 
 

 
CREATE TABLE filme (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(255),
    data_lancamento  VARCHAR(50),
    score            INT,
    sinopse          TEXT,
    titulo_original  VARCHAR(255),
    status_filme     VARCHAR(50),
    idioma_original  VARCHAR(50),
    orcamento        DOUBLE,
    receita          DOUBLE,
    pais             VARCHAR(50)
);
 
CREATE TABLE filme_genero (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    filme_id  INT,
    genero    VARCHAR(100),
    FOREIGN KEY (filme_id) REFERENCES filme(id)
);
 
CREATE TABLE filme_elenco (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    filme_id    INT,
    ator        TEXT,
    personagem  TEXT,
    FOREIGN KEY (filme_id) REFERENCES filme(id)
);
 

 
CREATE TABLE projeto (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nome        VARCHAR(50) NOT NULL,
    usuario_id  INT NOT NULL,
    CONSTRAINT fk_projeto_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON DELETE CASCADE
);
 
CREATE TABLE publicacao (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    projeto_id     INT,
    usuario_id     INT,
    titulo         VARCHAR(50),
    descricao      TEXT NOT NULL,
    criado_em      DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_publicacao_projeto
        FOREIGN KEY (projeto_id) REFERENCES projeto(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_publicacao_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON DELETE CASCADE
);
 
CREATE TABLE observacao (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    projeto_id  INT NOT NULL,
    titulo      VARCHAR(150) NOT NULL,
    conteudo    TEXT NOT NULL,
    criado_em   DATETIME NOT NULL,
    CONSTRAINT fk_observacoes_projeto
        FOREIGN KEY (projeto_id) REFERENCES projeto(id)
        ON DELETE CASCADE
);
 
CREATE TABLE publicacao_observacao (
    id             INT PRIMARY KEY AUTO_INCREMENT,
    id_publicacao  INT,
    id_observacao  INT,
    CONSTRAINT fk_publicacao_obs
        FOREIGN KEY (id_publicacao) REFERENCES publicacao(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_obs_publicacao
        FOREIGN KEY (id_observacao) REFERENCES observacao(id)
        ON DELETE CASCADE
);
 
 

 
CREATE TABLE relatorio (
    id                  INT NOT NULL AUTO_INCREMENT,
    usuario_id          INT NOT NULL,
    titulo              VARCHAR(150) NOT NULL,
    criterios_pesquisa  TEXT NOT NULL,
    resumo_resultado    TEXT,
    criado_em           DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_relatorios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        ON DELETE CASCADE
);