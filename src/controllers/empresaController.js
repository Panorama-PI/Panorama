var empresaModel = require("../models/empresaModel");

// Cadastra uma nova empresa.
// Verifica se o CNPJ já está cadastrado antes de realizar o cadastro.
// Essa função será utilizada posteriormente.
// function cadastrar(req, res) {
//   var cnpj = req.body.cnpj;
//   var razaoSocial = req.body.razaoSocial;

//   empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
//     if (resultado.length > 0) {
//       res
//         .status(401)
//         .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
//     } else {
//       empresaModel.cadastrar(razaoSocial, cnpj).then((resultado) => {
//         res.status(201).json(resultado);
//       });
//     }
//   });
// }


// Busca uma empresa pelo CNPJ.
// Essa função será utilizada posteriormente.
// function buscarPorCnpj(req, res) {
//   var cnpj = req.query.cnpj;

//   empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
//     res.status(200).json(resultado);
//   });
// }


// Busca uma empresa pelo ID.
// Essa função será utilizada posteriormente.
// function buscarPorId(req, res) {
//   var id = req.params.id;

//   empresaModel.buscarPorId(id).then((resultado) => {
//     res.status(200).json(resultado);
//   });
// }


// Lista as empresas cadastradas.
// Solicita os dados ao model e retorna o resultado em formato JSON.
function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}


module.exports = {
  // cadastrar,
  // buscarPorCnpj,
  // buscarPorId,
  listar
};
