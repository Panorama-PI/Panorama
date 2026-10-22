
var database = require("../database/config");
var bcrypt = require("bcryptjs");

async function cadastrar(nome, email, senha, perfil_id, id_empresa) {
    var senhaHash = await bcrypt.hash(senha, 10);

    var instrucaoSql = `
        INSERT INTO usuario
            (nome, email, senha_hash, perfil_id, criado_em, id_empresa)
        VALUES (?, ?, ?, ?, NOW(), ?)
    `;

    return database.executar(instrucaoSql, [
        nome,
        email,
        senhaHash,
        perfil_id,
        id_empresa
    ]);
}

async function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT id, nome, email, id_empresa AS empresaId, senha_hash, perfil_id
        FROM usuario
        WHERE email = ?
    `;

    var usuarios = await database.executar(instrucaoSql, [email]);

    if (usuarios.length !== 1) {
        return [];
    }

    var usuario = usuarios[0];
    var senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
        return [];
    }

    // Não devolve o hash para o controller
    delete usuario.senha_hash;

    return [usuario];
}

function buscarUsuariosPorEmpresa(id) {
    var instrucaoSql = `
        SELECT id, nome, email, perfil_id, criado_em, id_empresa
        FROM usuario
        WHERE id_empresa = ?
    `;

    return database.executar(instrucaoSql, [id]);
}

module.exports = {
    cadastrar,
    autenticar,
    buscarUsuariosPorEmpresa
};
