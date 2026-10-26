var database = require("../database/config");

function buscarPublicacoes(idEmpresa) {
    console.log("ACESSEI O PUBLICACOES MODEL \n function buscarPublicacoes(): ", idEmpresa);

    let sql = `
        SELECT 
            p.id,
            p.titulo,
            p.descricao,
            DATE_FORMAT(p.criado_em, '%Y-%m-%d') AS data,
            p.criado_em,
            u.nome AS roteirista,
            proj.nome AS nome_projeto
        FROM
            publicacao AS p
        INNER JOIN usuario AS u ON u.id = p.usuario_id
        LEFT JOIN projeto AS proj ON proj.id = p.projeto_id
        WHERE u.id_empresa = ${idEmpresa}
        ORDER BY p.criado_em DESC;
    `;

    return database.executar(sql);
}

function buscarPublicacoesAnotacoes(idPublicacao) {
    console.log("ACESSEI O PUBLICACOES MODEL \n function buscarPublicacoesAnotacoes(): ", idPublicacao);

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
        WHERE pub.id = ${idPublicacao};
    `;

    return database.executar(sql);
}

function buscarRoteiristas(idEmpresa) {
    console.log("ACESSEI O PUBLICACOES MODEL \n function buscarRoteiristas(): ", idEmpresa);

    let sql = `
        SELECT DISTINCT u.id, u.nome
        FROM usuario u
        WHERE u.id_empresa = ${idEmpresa} AND u.perfil_id = 2
        ORDER BY u.nome;
    `;

    return database.executar(sql);
}

module.exports = {
    buscarPublicacoes,
    buscarPublicacoesAnotacoes,
    buscarRoteiristas
};
