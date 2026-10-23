var anotacaoModel = require("../models/anotacaoModel");

function listarProjetos(req, res) {
    var idUsuario = req.params.idUsuario;

    anotacaoModel.listarProjetos(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function criarProjeto(req, res) {
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;

    anotacaoModel.criarProjeto(idUsuario, nome)
        .then(function (resultado) {
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarAnotacoes(req, res) {
    var idUsuario = req.params.idUsuario;

    anotacaoModel.listarAnotacoes(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function criarAnotacao(req, res) {
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.criarAnotacao(idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            // Nenhuma linha inserida: projeto inexistente ou não pertence ao usuário
            if (resultado.affectedRows == 0) {
                res.status(404).send("Projeto não encontrado!");
                return;
            }
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function editarAnotacao(req, res) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;
    var idProjeto = req.body.idProjeto;
    var titulo = req.body.titulo;
    var conteudo = req.body.conteudo;

    anotacaoModel.editarAnotacao(idAnotacao, idUsuario, idProjeto, titulo, conteudo)
        .then(function (resultado) {
            // 0 linhas alteradas entao anotação não eh desse usuário ou projeto não existe
            if (resultado.affectedRows == 0) {
                res.status(404).send("Anotação ou projeto não encontrado!");
                return;
            }
            res.status(200).send("Anotação atualizada!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function excluirAnotacao(req, res) {
    var idAnotacao = req.body.id;
    var idUsuario = req.body.idUsuario;

    anotacaoModel.excluirAnotacao(idAnotacao, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(404).send("Anotação não encontrada para este usuário!");
                return;
            }
            res.status(200).send("Anotação excluída!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}
function editarProjeto(req, res) {
    var idProjeto = req.body.id;
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;

    anotacaoModel.editarProjeto(idProjeto, idUsuario, nome)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(404).send("Projeto não encontrado para este usuário!");
                return;
            }

            res.status(200).send("Projeto atualizado!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function excluirProjeto(req, res) {
    var idProjeto = req.body.id;
    var idUsuario = req.body.idUsuario;

    anotacaoModel.excluirProjeto(idProjeto, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                res.status(409).send(
                    "Não foi possível excluir. O projeto pode não existir, não pertencer a você ou possuir anotações."
                );
                return;
            }

            res.status(200).send("Projeto excluído!");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listarProjetos,
    criarProjeto,
    listarAnotacoes,
    criarAnotacao,
    editarAnotacao,
    excluirAnotacao,
    editarProjeto,
    excluirProjeto
};