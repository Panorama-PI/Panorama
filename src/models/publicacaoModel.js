var database = require("../database/config");

function buscarPublicacoes(idEmpresa){
    console.log(
            "ACESSEI O PUBLICACOES MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
            " \t\t >> verifique suas credenciais de acesso ao banco\n" +
            " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
            " function buscarPublicacoes(): ", 
            idEmpresa
    );

    let sql = `
        SELECT 
            p.titulo,
            p.descricao,
            p.criado_em,
            p.atualizado_em
        FROM
            publicacao AS p
        INNER JOIN usuario AS u ON u.id = p.usuario_id
        WHERE p.id_empresa = ${idEmpresa};
    `;

    return database.executar(sql);
}

function buscarPublicacoes(idEmpresa){
    console.log(
            "ACESSEI O PUBLICACOES MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
            " \t\t >> verifique suas credenciais de acesso ao banco\n" +
            " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
            " function buscarPublicacoes(): ", 
            idEmpresa
    );

    let sql = `
        SELECT 
            pub.id AS id_publicacao,
            pub.titulo,
            pub.descricao,
            DATE_FORMAT(pub.criado_em, '%Y-%m-%d') AS data_publicacao,
            proj.nome AS nome_projeto,
            u.nome AS roteirista,
            obs.id AS id_observacao,
            obs.titulo AS observacao_titulo,
            obs.conteudo AS observacao_conteudo,
            DATE_FORMAT(obs.criado_em, '%d/%m/%Y') AS observacao_criado_em,
            u_obs.nome AS observacao_autor
        FROM publicacao pub
        INNER JOIN projeto proj ON pub.projeto_id = proj.id
        INNER JOIN usuario u ON pub.usuario_id = u.id
        LEFT JOIN publicacao_observacao po ON pub.id = po.id_publicacao
        LEFT JOIN observacao obs ON po.id_observacao = obs.id
        LEFT JOIN usuario u_obs ON proj.usuario_id = u_obs.id
        WHERE pub.id = ?;
    `;

    database.executar(sql);
}

module.exports = {
    buscarPublicacoes
}