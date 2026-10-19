
/* TELA DE CADASTRO DE EMPRESA + ADMINISTRADOR */

var MENSAGEM_ERRO_GENERICA = "Não foi possível concluir o cadastro. Tente novamente em instantes.";

// Máscaras

// CNPJ: 00.000.000/0000-00
function mascararCnpj(valor) {
    var c = valor.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 14);
    var m = c.slice(0, 2);

    if (c.length > 2) m += "." + c.slice(2, 5);
    if (c.length > 5) m += "." + c.slice(5, 8);
    if (c.length > 8) m += "/" + c.slice(8, 12);
    if (c.length > 12) m += "-" + c.slice(12, 14);

    return m;
}

// Telefone: (11) 99999-9999
function mascararTelefone(valor) {
    var d = valor.replace(/\D/g, "").slice(0, 11);
    var m = "";

    if (d.length > 0) m = "(" + d.slice(0, 2);
    if (d.length > 2) m += ") " + d.slice(2, 7);
    if (d.length > 7) m += "-" + d.slice(7, 11);

    return m;
}

ipt_cnpj.addEventListener("input", function () {
    ipt_cnpj.value = mascararCnpj(ipt_cnpj.value);
});

ipt_telefone.addEventListener("input", function () {
    ipt_telefone.value = mascararTelefone(ipt_telefone.value);
});

// Mostrar ou esconder as senhas
chk_mostrar.addEventListener("change", function () {
    var tipo = chk_mostrar.checked ? "text" : "password";
    ipt_senha.type = tipo;
    ipt_confirmacao_senha.type = tipo;
});

// Mensagens

// Exibe os erros na própria tela.
function mostrarErros(erros) {
    caixa_erros.textContent = "";

    if (erros.length === 0) {
        caixa_erros.classList.remove("visivel");
        return;
    }

    var titulo = document.createElement("strong");
    titulo.textContent = "Cadastro não realizado. Verifique a mensagem abaixo:";
    caixa_erros.appendChild(titulo);

    var lista = document.createElement("ul");

    erros.forEach(function (erro) {
        var item = document.createElement("li");
        item.textContent = erro;
        lista.appendChild(item);
    });

    caixa_erros.appendChild(lista);
    caixa_erros.classList.add("visivel");
    caixa_erros.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Exibe a mensagem de sucesso.
function mostrarSucesso(mensagem) {
    mostrarErros([]);

    caixa_sucesso.textContent = "";

    var titulo = document.createElement("strong");
    titulo.textContent = mensagem;
    caixa_sucesso.appendChild(titulo);
    caixa_sucesso.appendChild(
        document.createTextNode(" Redirecionando para o login...")
    );

    caixa_sucesso.classList.add("visivel");
    caixa_sucesso.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function liberarBotao() {
    btn_cadastrar.disabled = false;
    btn_cadastrar.textContent = "Cadastrar empresa";
}

// Cadastro

function cadastrar() {
    var resultado = ValidacoesCadastro.validarCadastroEmpresa({
        nomeEmpresa: ipt_nome_empresa.value,
        cnpj: ipt_cnpj.value,
        telefone: ipt_telefone.value,
        nomeAdmin: ipt_nome.value,
        email: ipt_email.value,
        senha: ipt_senha.value,
        confirmacaoSenha: ipt_confirmacao_senha.value
    });

    caixa_sucesso.classList.remove("visivel");
    mostrarErros(resultado.erros);

    if (resultado.erros.length > 0) {
        return;
    }

    btn_cadastrar.disabled = true;
    btn_cadastrar.textContent = "Cadastrando...";

    console.log("Enviando cadastro para o backend...");

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeEmpresaServer: resultado.dados.nomeEmpresa,
            cnpjServer: resultado.dados.cnpj,
            telefoneServer: resultado.dados.telefone,
            nomeAdminServer: resultado.dados.nomeAdmin,
            emailServer: resultado.dados.email,
            senhaServer: resultado.dados.senha,
            confirmacaoSenhaServer: ipt_confirmacao_senha.value
        })
    })
    .then(function (resposta) {
        console.log("Resposta recebida:", resposta.status);

        return resposta.json()
            .catch(function () {
                return {};
            })
            .then(function (corpo) {
                if (resposta.ok) {
                    btn_cadastrar.textContent = "Cadastro realizado!";

                    mostrarSucesso(
                        corpo.mensagem || "Cadastro realizado com sucesso!"
                    );

                    setTimeout(function () {
                        window.location.href = "/login.html";
                    }, 2000);

                    return;
                }

                // Exibe as mensagens de validação ou de regra de negócio.
                if (
                    resposta.status < 500 &&
                    Array.isArray(corpo.erros) &&
                    corpo.erros.length > 0
                ) {
                    mostrarErros(corpo.erros);
                } else if (
                    resposta.status < 500 &&
                    typeof corpo.mensagem === "string" &&
                    corpo.mensagem
                ) {
                    mostrarErros([corpo.mensagem]);
                } else {
                    mostrarErros([MENSAGEM_ERRO_GENERICA]);
                }

                liberarBotao();
            });
    })
    .catch(function (erro) {
        console.error("Erro na requisição:", erro);

        mostrarErros([
            "Erro de conexão com o servidor. Verifique se o backend está funcionando."
        ]);

        liberarBotao();
    });
}

btn_cadastrar.addEventListener("click", cadastrar);
