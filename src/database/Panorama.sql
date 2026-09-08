CREATE DATABASE panorama;
USE panorama;

CREATE TABLE empresa (
	idEmpresa INT AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(50) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(15) NOT NULL
);

INSERT INTO empresa VALUE
(1, "Warner Bros", "4.869.458/0001-44","(11) 99999-9999");

CREATE TABLE usuario (
	idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, 
    senha VARCHAR(12) NOT NULL,
    cargo VARCHAR(10) NOT NULL,
		CONSTRAINT chCargo CHECK (cargo IN ('Produtor', 'Roteirista')),
	fkEmpresa INT NOT NULL, 
		CONSTRAINT fkEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);


CREATE TABLE filme (
	idFilme INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    dtLancamento DATE NOT NULL,
		CONSTRAINT chData CHECK (dtLancamento BETWEEN '1903-05-14' AND '2023-12-30'),
	score DOUBLE NOT NULL,
		CONSTRAINT chScore CHECK (score BETWEEN 0 AND 100),
	genero VARCHAR(100),
    sinopse VARCHAR(1000) NOT NULL,
    atores VARCHAR(1400),
    tituloOriginal VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    orcamento DOUBLE NOT NULL, 
    receita DOUBLE NOT NULL,
    paisOrigem VARCHAR(10)
);
