var database = require("../database/config");

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
      SELECT idEmpresa, nome, cnpj, telefone 
      FROM empresa
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
  // cadastrar,
  // buscarPorCnpj,
  // buscarPorId,
  listar
};
