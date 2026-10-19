CREATE DATABASE IF NOT EXISTS filmes_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE filmes_db;
CREATE TABLE empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    telefone CHAR(11),
    cnpj VARCHAR(15) NOT NULL,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE token (
id INT PRIMARY KEY AUTO_INCREMENT,
codigo VARCHAR(6) NOT NULL,
status_enviado BOOLEAN,
expiracao DATETIME,
id_empresa INT NOT NULL,
    CONSTRAINT fk_token_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id) 
);

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil_id INT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_empresa INT NOT NULL,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);
CREATE TABLE filme (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    data_lancamento VARCHAR(50),
    score INT,
    sinopse TEXT,
    titulo_original VARCHAR(255),
    status_filme VARCHAR(50),
    idioma_original VARCHAR(50),
    orcamento DOUBLE,
    receita DOUBLE,
    pais VARCHAR(50)
);


CREATE TABLE filme_genero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT,
    genero VARCHAR(100),
    FOREIGN KEY (filme_id) REFERENCES filme(id)
);

CREATE TABLE filme_elenco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT,
    ator TEXT,
    personagem TEXT,
    FOREIGN KEY (filme_id) REFERENCES filme(id)
);

/* UPDATE IGNORE filme 
SET data_lancamento_real = STR_TO_DATE(data_lancamento, '%m/%d/%y') where id >=1;

UPDATE filme 
SET data_lancamento_real = DATE_SUB(data_lancamento_real, INTERVAL 100 YEAR)
WHERE data_lancamento_real > CURDATE() and id >=1;
*/


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
    CONSTRAINT fk_projeto_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE publicacao(
    id INT PRIMARY KEY AUTO_INCREMENT,
    projeto_id INT,
    usuario_id INT,
    titulo VARCHAR(50),
    descricao TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_publicacao_projeto FOREIGN KEY (projeto_id) REFERENCES projeto(id),
    CONSTRAINT fk_publicacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
CREATE TABLE observacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    projeto_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    conteudo TEXT NOT NULL,
    criado_em DATETIME NOT NULL,
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

