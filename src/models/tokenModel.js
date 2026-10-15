var database = require("../database/config");

function verificarTokenExiste(token){
    console.log(
            "ACESSEI O TOKEN MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
            " \t\t >> verifique suas credenciais de acesso ao banco\n" +
            " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
            " function verificarTokenExiste(): ", 
            token
    );

    let sql = ` 
        SELECT codigo
        FROM token
        WHERE codigo = '${token}';
    `;

    return database.executar(sql);
}

function salvarToken(token,idEmpresa,email){
    console.log(
            "ACESSEI O TOKEN MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
            " \t\t >> verifique suas credenciais de acesso ao banco\n" +
            " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
            " function salvarToken(): ", 
            token
    );

    let sql = `
        INSERT INTO 
            token 
            (codigo, status_enviado, expiracao, email_destinatario, id_empresa) 
        VALUES 
            ('${token}', 0, NOW() + INTERVAL 15 MINUTE,'${email}', ${idEmpresa}); 
    `

    return database.executar(sql)
}

function autenticar(token){
    console.log(
                "ACESSEI O TOKEN MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
                " \t\t >> verifique suas credenciais de acesso ao banco\n" +
                " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
                " function salvarToken(): ", 
                token
    );

    let sql = `
            SELECT 
                codigo,
                id_empresa
            FROM
                token
            WHERE
                codigo = '${token}' AND expiracao > NOW();
    `

    return database.executar(sql)
}

function atualizarToken(tokenNovo, tokenAntigo){
    console.log(
        "ACESSEI O TOKEN MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n" +
        " \t\t >> verifique suas credenciais de acesso ao banco\n" +
        " \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n" +
        " function atualizarToken(): ", 
        tokenNovo,tokenAntigo
    );

    let sql = `
        UPDATE token SET codigo = '${tokenNovo}' WHERE codigo = '${tokenAntigo}';
    `

    return database.executar(sql)
}


module.exports = {
    verificarTokenExiste,
    salvarToken,
    autenticar,
    atualizarToken
}