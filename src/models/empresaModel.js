var database = require("../database/config");
var bcrypt = require("bcryptjs");

async function cadastrar(dados) {
    // Gera o hash antes de abrir a transação
    var senhaHash = await bcrypt.hash(dados.senha, 10);

    return database.executarTransacao(async function ({ query }) {
        // 1. Cadastra a empresa
        var resultadoEmpresa = await query(
            `INSERT INTO empresa (nome, cnpj, telefone)
             VALUES (?, ?, ?)`,
            [
                dados.nomeEmpresa,
                dados.cnpj,
                dados.telefone
            ]
        );

        // Recupera o ID gerado pelo MySQL
        var idEmpresa = resultadoEmpresa.insertId;

        // 2. Cadastra o administrador vinculado à empresa
        var resultadoUsuario = await query(
            `INSERT INTO usuario
                (nome, email, senha_hash, perfil_id, criado_em, id_empresa)
             VALUES (?, ?, ?, ?, NOW(), ?)`,
            [
                dados.nomeAdmin,
                dados.email,
                senhaHash,
                3,
                idEmpresa
            ]
        );

        return {
            idEmpresa: idEmpresa,
            idAdministrador: resultadoUsuario.insertId
        };
    });
}
// Cadastra uma nova empresa.
// Essa função será utilizada posteriormente.
// function cadastrar(razaoSocial, cnpj) {
//    var instrucaoSql = `
//      INSERT INTO empresa (razao_social, cnpj) 
//      VALUES ('${razaoSocial}', '${cnpj}')
//    `;

//    return database.executar(instrucaoSql);
// }


// Busca uma empresa pelo CNPJ.
// Essa função será utilizada posteriormente.
// function buscarPorCnpj(cnpj) {
//    var instrucaoSql = `
//      SELECT * FROM empresa 
//      WHERE cnpj = '${cnpj}'
//    `;
    
//    return database.executar(instrucaoSql);
// }
  

// Busca uma empresa pelo ID.
// Essa função será utilizada posteriormente.
// function buscarPorId(id) {
//    var instrucaoSql = `
//      SELECT * FROM empresa 
//      WHERE id = '${id}'
//    `;
  
//    return database.executar(instrucaoSql);
// }


// Lista as empresas cadastradas.
// Retorna apenas os dados necessários para exibição da lista.
function listar() {
    var instrucaoSql = `
      SELECT id, nome, telefone,cnpj
      FROM empresa
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
  // cadastrar,
  // buscarPorCnpj,
  // buscarPorId,
  cadastrar,
  listar
};
