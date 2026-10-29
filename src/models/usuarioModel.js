var database = require("../database/config");
var bcrypt = require("bcryptjs");


/* =========================
   AUXILIAR
========================= */

// Executa uma query parametrizada (com ?) e devolve o resultado.
function consultar(instrucao, parametros) {
    return database.executarTransacao(async function ({ query }) {
        return await query(instrucao, parametros);
    });
}


/* =========================
   CADASTRO E LOGIN
========================= */

// Cadastra um novo usuário vinculado a uma empresa.
// A senha é guardada como hash (bcrypt), nunca em texto puro.
async function cadastrar(nome, email, senha, perfilId, idEmpresa) {
    var senhaHash = await bcrypt.hash(senha, 10);

    return consultar(
        `INSERT INTO usuario (nome, email, senha_hash, perfil_id, criado_em, id_empresa)
         VALUES (?, ?, ?, ?, NOW(), ?)`,
        [nome, email, senhaHash, perfilId, idEmpresa]
    );
}


// Autentica um usuário por e-mail e senha.
// Busca pelo e-mail e compara a senha digitada com o hash salvo.
// Retorna uma lista: [usuario] quando confere, [] quando não confere
// (o controller já espera esse formato).
async function autenticar(email, senha) {
    var usuarios = await consultar(
        `SELECT id, nome, email, senha_hash, perfil_id, id_empresa AS empresaId
         FROM usuario
         WHERE email = ?`,
        [email]
    );

    if (usuarios.length === 0) {
        return [];
    }

    var usuario = usuarios[0];
    var senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaConfere) {
        return [];
    }

    // o hash não sai do model
    delete usuario.senha_hash;

    return [usuario];
}


/* =========================
   CONSULTAS
========================= */

// Busca os usuários vinculados a uma empresa (rota antiga + checagem do login).
// Lista as colunas de propósito: nunca devolver o senha_hash.
function buscarUsuariosPorEmpresa(idEmpresa) {
    return consultar(
        `SELECT id, nome, email, perfil_id, criado_em, id_empresa
         FROM usuario
         WHERE id_empresa = ?`,
        [idEmpresa]
    );
}


/* =========================
   GERENCIAMENTO DE FUNCIONÁRIOS
   (tela administrativa)
========================= */

function listarPorEmpresa(idEmpresa) {
    return consultar(
        `SELECT id,
                nome,
                email,
                CASE perfil_id
                    WHEN 1 THEN 'Produtor'
                    WHEN 2 THEN 'Roteirista'
                END AS cargo,
                DATE_FORMAT(criado_em, '%d/%m/%Y') AS data,
                'Ativo' AS status
         FROM usuario
         WHERE id_empresa = ? AND perfil_id <> 3
         ORDER BY nome`,
        [idEmpresa]
    );
}

function editar(idUsuario, idEmpresa, nome, email, perfilId) {
    return consultar(
        `UPDATE usuario
         SET nome = ?, email = ?, perfil_id = ?
         WHERE id = ? AND id_empresa = ? AND perfil_id <> 3`,
        [nome, email, perfilId, idUsuario, idEmpresa]
    );
}

function excluir(idUsuario, idEmpresa) {
    return consultar(
        `DELETE FROM usuario
         WHERE id = ? AND id_empresa = ? AND perfil_id <> 3`,
        [idUsuario, idEmpresa]
    );
}


module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa,
    listarPorEmpresa,
    editar,
    excluir
};