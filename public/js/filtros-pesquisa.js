
var caminhoAtual = window.location.pathname;

var tipoVisao = caminhoAtual.includes("dashboard-roteirista")
    ? "roteirista"
    : "produtor";

var filtroEmEdicao = null;

var campoPesquisa = document.getElementById("pesquisa-bar") ||
    document.getElementById("pesquisa_bar");

var corpoTabela = document.querySelector("#tabela_filmes tbody");

var tituloTabela = document.getElementById("titulo");

var usuarioId = sessionStorage.ID_USUARIO;

if (typeof preencherUsuario == "function") {
    preencherUsuario();
}

document.getElementById("filtro-lucro-container").style.display =
    tipoVisao == "produtor" ? "block" : "none";

document.getElementById("filtro-avaliacao-container").style.display =
    tipoVisao == "roteirista" ? "block" : "none";

if (tipoVisao == "roteirista") {
    tituloTabela.innerHTML = "TOP 10 FILMES MAIS BEM AVALIADOS";
} else {
    tituloTabela.innerHTML = "TOP 10 FILMES COM MAIORES LUCROS";
}

var cabecalhos = document.querySelectorAll("#tabela_filmes thead th");

if (cabecalhos.length > 0) {
    cabecalhos[cabecalhos.length - 1].textContent =
        tipoVisao == "produtor" ? "Lucro" : "Avaliação";
}

function abrirFiltros() {
    document.getElementById("painel-filtros").style.display = "block";
}

function fecharFiltros() {
    document.getElementById("painel-filtros").style.display = "none";

    preencherCriterios({
        genero: "",
        pais: "",
        operadorLucro: "",
        valorLucro: "",
        operadorAvaliacao: "",
        valorAvaliacao: ""
    });

    filtroEmEdicao = null;
}


function obterCriterios() {
    return {
        tipoVisao: tipoVisao,
        filme: campoPesquisa.value.trim(),

        genero: document.getElementById("filtro-genero").value,
        pais: document.getElementById("filtro-pais").value.trim(),

        operadorLucro: document.getElementById("filtro-operador-lucro").value,
        valorLucro: document.getElementById("filtro-valor-lucro").value,

        operadorAvaliacao: document.getElementById("filtro-operador-avaliacao").value,
        valorAvaliacao: document.getElementById("filtro-valor-avaliacao").value
    };
}


function preencherCriterios(criterios) {
    campoPesquisa.value = criterios.filme || "";

    document.getElementById("filtro-genero").value =
        criterios.genero || "";

    document.getElementById("filtro-pais").value =
        criterios.pais || "";

    document.getElementById("filtro-operador-lucro").value =
        criterios.operadorLucro || "";

    document.getElementById("filtro-valor-lucro").value =
        criterios.valorLucro || "";

    document.getElementById("filtro-operador-avaliacao").value =
        criterios.operadorAvaliacao || "";

    document.getElementById("filtro-valor-avaliacao").value =
        criterios.valorAvaliacao || "";
}


function formatarLucro(lucro) {
    if (lucro == null || isNaN(lucro)) {
        return "N/A";
    }

    var milhoes = Number(lucro) / 1000000;

    milhoes = Math.round(milhoes * 10) / 10;

    return milhoes + "M";
}


function carregarTop10() {
    tituloTabela.style.display = "";
    corpoTabela.innerHTML = `
        <tr>
            <td colspan="5">Carregando filmes...</td>
        </tr>
    `;

    fetch("/filmes/top10", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tipoVisao: tipoVisao
        })
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o ranking.");
        }

        return resposta.json();
    })
    .then(function (filmes) {
        corpoTabela.innerHTML = "";

        if (filmes.length == 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum filme encontrado.</td>
                </tr>
            `;
            return;
        }

        for (var i = 0; i < filmes.length; i++) {
            var valorFinal;

            if (tipoVisao == "produtor") {
                valorFinal = filmes[i].lucro == null
                    ? "N/A"
                    : formatarLucro(filmes[i].lucro);
            } else {
                valorFinal = filmes[i].avaliacao == null
                    ? "N/A"
                    : filmes[i].avaliacao;
            }

            corpoTabela.innerHTML += `
                <tr>
                    <td>${filmes[i].titulo || ""}</td>
                    <td>${filmes[i].atorPrincipal || "N/A"}</td>
                    <td>${filmes[i].genero || "N/A"}</td>
                    <td>${filmes[i].pais || "N/A"}</td>
                    <td>${valorFinal}</td>
                </tr>
            `;
        }
    })
    .catch(function (erro) {
        console.log(erro);

        corpoTabela.innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar os filmes.</td>
            </tr>
        `;
    });
}



function buscar() {
    var criterios = obterCriterios();

    criterios.filme = campoPesquisa.value.trim();

    tituloTabela.style.display = "none";
    corpoTabela.innerHTML = "";

    fetch("/filmes/pesquisar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            filmeServer: criterios.filme,
            tipoVisao: criterios.tipoVisao,
            genero: criterios.genero,
            pais: criterios.pais,
            operadorLucro: criterios.operadorLucro,
            valorLucro: criterios.valorLucro,
            operadorAvaliacao: criterios.operadorAvaliacao,
            valorAvaliacao: criterios.valorAvaliacao
        })
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível pesquisar os filmes.");
        }

        return resposta.json();
    })
    .then(function (filmes) {
        if (filmes.length == 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum filme encontrado.</td>
                </tr>
            `;
            return;
        }

        for (var i = 0; i < filmes.length; i++) {
    var valorFinal = tipoVisao == "produtor"
        ? (filmes[i].lucro == null ? "N/A" :
            (Math.round((Number(filmes[i].lucro) / 1000000) * 10) / 10) + "M")
        : (filmes[i].avaliacao == null ? "N/A" :
            filmes[i].avaliacao);

    corpoTabela.innerHTML += `
        <tr>
            <td>${filmes[i].titulo || ""}</td>
            <td>${filmes[i].atorPrincipal || "N/A"}</td>
            <td>${filmes[i].genero || "N/A"}</td>
            <td>${filmes[i].pais || "N/A"}</td>
            <td>${valorFinal}</td>
        </tr>
    `;
}
    })
    .catch(function (erro) {
        console.log(erro);
        alert("Erro ao pesquisar os filmes.");
    });
}

function salvarFiltro() {
    if (!usuarioId) {
        alert("Não foi possível identificar o usuário. Entre novamente.");
        return;
    }

    var titulo = document.getElementById("filtro-titulo").value.trim();

    if (titulo == "") {
        alert("Digite um nome para o filtro.");
        return;
    }

    var dados = {
        usuarioId: usuarioId,
        titulo: titulo,
        criterios: obterCriterios()
    };

    var url = "/relatorios";
    var metodo = "POST";

    if (filtroEmEdicao != null) {
        url = "/relatorios/" + filtroEmEdicao;
        metodo = "PUT";
    }

    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível salvar o filtro.");
        }

        return resposta.json();
    })
    .then(function () {
        alert(filtroEmEdicao == null
            ? "Filtro salvo com sucesso!"
            : "Filtro atualizado com sucesso!");

        filtroEmEdicao = null;
        document.getElementById("filtro-titulo").value = "";

        listarFiltros();
    })
    .catch(function (erro) {
        console.log(erro);
        alert("Erro ao salvar o filtro.");
    });
}


function aplicarFiltros() {
    buscar();
}


function listarFiltros() {
    if (!usuarioId) {
        alert("Não foi possível identificar o usuário. Entre novamente.");
        return;
    }

    fetch("/relatorios/" + usuarioId)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Erro ao buscar os filtros.");
            }

            return resposta.json();
        })
        .then(function (filtros) {
            var lista = document.getElementById("lista-filtros-salvos");
            lista.innerHTML = "<h3>Meus filtros salvos</h3>";

            if (filtros.length == 0) {
                lista.innerHTML += "<p>Você ainda não salvou filtros.</p>";
                return;
            }

            for (var i = 0; i < filtros.length; i++) {
                var filtro = filtros[i];

                var item = document.createElement("div");
                item.className = "filtro-salvo";

                var nome = document.createElement("span");
                nome.textContent = filtro.titulo;

                var botaoAplicar = document.createElement("button");
                botaoAplicar.textContent = "Aplicar";
                botaoAplicar.onclick = function (criterios) {
                    return function () {
                        preencherCriterios(criterios);
                        buscar();
                    };
                }(filtro.criterios_pesquisa);

                var botaoEditar = document.createElement("button");
                botaoEditar.textContent = "Editar";
                botaoEditar.onclick = function (filtroAtual) {
                    return function () {
                        filtroEmEdicao = filtroAtual.id;
                        document.getElementById("filtro-titulo").value =
                            filtroAtual.titulo;

                        preencherCriterios(filtroAtual.criterios_pesquisa);
                        abrirFiltros();
                    };
                }(filtro);

                var botaoExcluir = document.createElement("button");
                botaoExcluir.textContent = "Excluir";
                botaoExcluir.onclick = function (idFiltro) {
                    return function () {
                        excluirFiltro(idFiltro);
                    };
                }(filtro.id);

                item.appendChild(nome);
                item.appendChild(botaoAplicar);
                item.appendChild(botaoEditar);
                item.appendChild(botaoExcluir);

                lista.appendChild(item);
            }
        })
        .catch(function (erro) {
            console.log(erro);
            alert("Erro ao listar os filtros.");
        });
}

function excluirFiltro(idFiltro) {
    if (!confirm("Deseja realmente excluir este filtro?")) {
        return;
    }

    fetch("/relatorios/" + usuarioId + "/" + idFiltro, {
        method: "DELETE"
    })
    .then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível excluir o filtro.");
        }

        return resposta.json();
    })
    .then(function () {
        alert("Filtro excluído com sucesso!");
        listarFiltros();
    })
    .catch(function (erro) {
        console.log(erro);
        alert("Erro ao excluir o filtro.");
    });
}

function limpar_pesquisa() {
    campoPesquisa.value = "";

    preencherCriterios({
        filme: "",
        genero: "",
        pais: "",
        operadorLucro: "",
        valorLucro: "",
        operadorAvaliacao: "",
        valorAvaliacao: ""
    });

    carregarTop10();
}
carregarTop10();