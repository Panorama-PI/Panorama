var database = require("../database/config");

function buscarPublicacoes(idEmpresa, idProdutor) {
    console.log("ACESSEI O PUBLICACOES MODEL \n function buscarPublicacoes(): ", idEmpresa);

    let sql = `
        SELECT 
            p.id,
            p.titulo,
            p.descricao,
            DATE_FORMAT(p.criado_em, '%Y-%m-%d') AS data,
            p.criado_em,
            u.nome AS roteirista,
            proj.nome AS nome_projeto,
            a.texto AS nota_produtor
        FROM
            publicacao AS p
        INNER JOIN usuario AS u ON u.id = p.usuario_id
        LEFT JOIN projeto AS proj ON proj.id = p.projeto_id
        LEFT JOIN avaliacao AS a
            ON a.publicacao_id = p.id AND a.autor_id = ?
        WHERE u.id_empresa = ?
        ORDER BY p.criado_em DESC;
    `;

    return database.executar(sql, [idProdutor, idEmpresa]);
}

function salvarAvaliacao(idPublicacao, idProdutor, nota) {
    return database.executarTransacao(async function ({ query }) {
        const publicacaoElegivel = await query(`
            SELECT p.id
            FROM publicacao AS p
            INNER JOIN usuario AS roteirista ON roteirista.id = p.usuario_id
            INNER JOIN usuario AS produtor ON produtor.id = ?
            WHERE p.id = ?
              AND produtor.perfil_id = 1
              AND roteirista.perfil_id = 2
              AND produtor.id_empresa = roteirista.id_empresa;
        `, [idProdutor, idPublicacao]);

        if (publicacaoElegivel.length === 0) return false;

        const avaliacaoExistente = await query(`
            SELECT id
            FROM avaliacao
            WHERE publicacao_id = ? AND autor_id = ?
            ORDER BY id DESC
            LIMIT 1
            FOR UPDATE;
        `, [idPublicacao, idProdutor]);

        if (avaliacaoExistente.length > 0) {
            await query(`
                UPDATE avaliacao
                SET texto = ?
                WHERE id = ?;
            `, [nota, avaliacaoExistente[0].id]);
        } else {
            await query(`
                INSERT INTO avaliacao (publicacao_id, autor_id, texto)
                VALUES (?, ?, ?);
            `, [idPublicacao, idProdutor, nota]);
        }

        return true;
    });
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
    salvarAvaliacao,
    buscarPublicacoesAnotacoes,
    buscarRoteiristas
};
