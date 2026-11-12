

// 2. Função principal para o botão no HTML (ex: onclick="solicitarEnvioToken()")
async function solicitarEnvioToken() {
    // Busca o ID da empresa apenas aqui dentro para evitar conflitos!
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    
    const email = document.getElementById("input-email-convite").value.trim();
    const mensagem = document.getElementById("mensagem"); 

    console.log("O Email é ", email);

    if (email === "") {
        mensagem.style.color = "red";
        mensagem.innerText = "Por favor, digita um e-mail válido.";
        return;
    }

    if (!idEmpresa) {
        mensagem.style.color = "red";
        mensagem.innerText = "Erro: Empresa não identificada. Por favor, faz login novamente.";
        return;
    }

    mensagem.style.color = "white";
    mensagem.innerText = "A gerar e a guardar o token...";

    try {
        // Chama a função principal passando o ID da sessão e o e-mail digitado
        const token = await gerarTokenSalvar(idEmpresa, email);
        
        if (token) {
            mensagem.style.color = "#00FF00"; // Verde
            mensagem.innerText = "Token gerado e salvo com sucesso!";
            document.getElementById("input-email-convite").value = ""; // Limpa o input
        }
    } catch (erro) {
        console.error("Erro ao processar envio:", erro);
        mensagem.style.color = "red";
        mensagem.innerText = "Ocorreu um erro ao processar o pedido.";
    }
}

// ==========================================
// FUNÇÕES DE LÓGICA DO TOKEN (CORRIGIDAS)
// ==========================================

async function gerarTokenSalvar(idEmpresa, email) {
    let token;
    let validoUso = true;

    do {
        token = gerarToken();
        validoUso = await verificarTokenExiste(token);
        // dentro do if (token) em solicitarEnvioToken
document.getElementById("codigo-empresa-texto").innerText = token;

        if (!validoUso) {
            console.log(`AVISO: O token ${token} já existe, a gerar outro...`);
        }
    } while (!validoUso);

    console.log(`SUCESSO: Token único gerado [${token}]. A guardar...`);

    const salvou = await salvarToken(token, idEmpresa, email);

    if (!salvou) {
        throw new Error("Não foi possível salvar o token.");
    }

    return token;
}

function gerarToken() {
    let tamanho = 6;
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let token = "";

    for (let i = 0; i < tamanho; i++) {
        let aleatorio = Math.floor(Math.random() * caracteres.length);
        token += caracteres.charAt(aleatorio);
    }


    return token;
}

function verificarTokenExiste(token) {
    // É obrigatório usar o 'return fetch' para que o 'await' funcione lá em cima
    return fetch(`/tokens/${token}`, {
        method: "GET"
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return true; // Se der 200 OK, significa que o token já existe no BD
        } else {
            return false; // Se der 404 (ou erro), está livre para uso
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        return false;
    });
}

function salvarToken(token, idEmpresa, email) {
    // Retornar a Promise para garantir o fluxo assíncrono
    return fetch(`/tokens/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: token,
            idEmpresa: idEmpresa,
            email: email
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Token salvo com sucesso!");
            return true;
        } else {
            console.log("Não foi possível salvar o token.");
            return false;
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        return false;
    });
}

function autenticar(token) {
    return fetch(`/tokens/autenticar/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            console.log("Token inválido ou expirado.");
            return null;
        }
    })
    .then(function (dados) {
        if (dados) {
            console.log("Token autenticado com sucesso!");
            return dados.idEmpresa || dados.id_empresa;
        }
        return null;
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        return null;
    });
}

function atualizarToken(tokenAntigo) {
    let tokenNovo = gerarToken();

    return fetch(`/tokens/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tokenNovo: tokenNovo,
            tokenAntigo: tokenAntigo
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            console.log("Token atualizado com sucesso!");
            return true;
        } else {
            console.log("Não foi possível atualizar o token.");
            return false;
        }
    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        return false;
    });

    function limparSessao() {
    sessionStorage.clear();
    window.location.replace("login.html"); // ajuste pro nome real da tela de login
}   


}