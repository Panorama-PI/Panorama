

// 2. Função principal para o botão no HTML (ex: onclick="solicitarEnvioToken()")
async function solicitarEnvioToken() {
    // Busca o ID da empresa apenas aqui dentro para evitar conflitos!
    const idEmpresa = sessionStorage.getItem("ID_EMPRESA");
    
    const email = document.getElementById("input-email-convite").value.trim();
    const mensagem = document.getElementById("mensagem"); 

    console.log("O Email é ", email);

    const campoEmail = document.getElementById("input-email-convite");
    const emailCompleto = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!campoEmail.checkValidity() || !emailCompleto) {
        mensagem.style.color = "red";
        mensagem.innerText = "Digite um e-mail válido e completo (ex.: nome@empresa.com).";
        campoEmail.focus();
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
    const token = await gerarTokenUnico();

    console.log(`SUCESSO: Token único gerado [${token}]. A guardar...`);

    const salvou = await salvarToken(token, idEmpresa, email);

    if (!salvou) {
        throw new Error("Não foi possível salvar o token.");
    }

    document.getElementById("codigo-empresa-texto").innerText = token;

    return token;
}

async function reiniciarToken() {
    const campoCodigo = document.getElementById("codigo-empresa-texto");
    const mensagem = document.getElementById("mensagem");
    const codigoAtual = campoCodigo.textContent.trim();
    if (!codigoAtual || codigoAtual === "—") {
        mensagem.style.color = "#F4F4F5";
        mensagem.innerText = "Envie um convite por e-mail primeiro para gerar um código.";
        return;
    }
    mensagem.style.color = "#F4F4F5";
    mensagem.innerText = "Gerando outro código...";
    try {
        const novoCodigo = await gerarTokenUnico();
        const resposta = await fetch("/tokens/", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokenNovo: novoCodigo, tokenAntigo: codigoAtual })
        });
        if (!resposta.ok) throw new Error("Não foi possível atualizar o código.");
        campoCodigo.innerText = novoCodigo;
        mensagem.style.color = "#34C759";
        mensagem.innerText = "Novo código gerado com sucesso.";
    } catch (erro) {
        console.error("Erro ao gerar outro código:", erro);
        mensagem.style.color = "#FF383C";
        mensagem.innerText = erro.message || "Não foi possível gerar outro código.";
    }
}

function verificarTokenDisponivel(token) {
    return fetch(`/tokens/${token}`).then(resposta => {
        if (resposta.status === 200) return true;
        if (resposta.status === 409) return false;
        throw new Error("Não foi possível verificar o código.");
    });
}

async function gerarTokenUnico() {
    let token = gerarToken();
    while (!(await verificarTokenDisponivel(token))) {
        token = gerarToken();
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
