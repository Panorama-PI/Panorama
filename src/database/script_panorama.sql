CREATE DATABASE IF NOT EXISTS filmes_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE filmes_db;

CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    telefone CHAR(11),
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE token (
id INT PRIMARY KEY AUTO_INCREMENT,
numero INT NOT NULL,
status BOOLEAN,
id_empresa INT NOT NULL,
    CONSTRAINT fk_token_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id) 
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil_id INT NOT NULL,
    criado_em DATETIME NOT NULL,
    id_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE filme (
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    score DECIMAL(4,2),
    budget_x DECIMAL(15,2),
    revenue DECIMAL(15,2),
    orig_lang VARCHAR(50),
    country VARCHAR(100),
    overview TEXT,
    release_date DATETIME NOT NULL,
    status BIGINT NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE genero (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100),

    PRIMARY KEY (id)
);

CREATE TABLE pessoa (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,

    PRIMARY KEY (id)
);

/* CREATE TABLE log_atividade (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    acao VARCHAR(50) NOT NULL,
    criado_em DATETIME NOT NULL,

    PRIMARY KEY (id),
    INDEX idx_log_usuario_acao (usuario_id, acao),

    CONSTRAINT fk_log_atividade_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
*/
CREATE TABLE projeto (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50) NOT NULL,
	usuario_id INT NOT NULL,
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
CREATE TABLE observacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    projeto_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    criado_em DATETIME NOT NULL,

    CONSTRAINT fk_observacoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_observacoes_projeto
        FOREIGN KEY (projeto_id) REFERENCES projeto(id)
);

CREATE TABLE relatorio (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    criterios_pesquisa TEXT NOT NULL,
    resumo_resultado TEXT,
    criado_em DATETIME NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_relatorios_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE notificacao (
    id INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    enviado_em DATETIME NOT NULL,
    descricao VARCHAR(255) NOT NULL,

    PRIMARY KEY (id),

    CONSTRAINT fk_notificacoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE filmes_elenco (
    filme_id INT NOT NULL,
    pessoa_id INT NOT NULL,

    PRIMARY KEY (filme_id, pessoa_id),

    CONSTRAINT fk_filmes_elenco_filme
        FOREIGN KEY (filme_id) REFERENCES filme(id),
    CONSTRAINT fk_filmes_elenco_pessoa
        FOREIGN KEY (pessoa_id) REFERENCES pessoa(id)
);

CREATE TABLE filmes_generos (
    filme_id INT NOT NULL,
    genero_id INT NOT NULL,

    PRIMARY KEY (filme_id, genero_id),

    CONSTRAINT fk_filmes_generos_filme
        FOREIGN KEY (filme_id) REFERENCES filme(id),
    CONSTRAINT fk_filmes_generos_genero
        FOREIGN KEY (genero_id) REFERENCES genero(id)
);