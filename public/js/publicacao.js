// Lista de publicações carregadas do banco de dados
var dadosPublicacoes = [];

// Busca publicações da empresa no backend
function buscarPublicacoes() {
    var idEmpresa = sessionStorage.ID_EMPRESA;

    fetch("/publicacoes/produtor/empresa/" + idEmpresa)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Publicações recebidas do backend: ", dados);
                    dadosPublicacoes = dados.publicacoes || dados || [];
                    atualizarSelectRoteiristas();
                    aplicarFiltros();
                });
            } else {
                console.log("Erro na resposta do backend.");
                dadosPublicacoes = [];
                aplicarFiltros();
            }
        })
        .catch(function (erro) {
            console.log("Erro na requisição: ", erro);
            dadosPublicacoes = [];
            aplicarFiltros();
        });
}

// Atualiza as opções do select de roteiristas com os nomes vindos do banco
function atualizarSelectRoteiristas() {
    var select = document.getElementById("roteirista");
    if (!select) return;

    var nomes = [];
    for (var i = 0; i < dadosPublicacoes.length; i++) {
        var nome = dadosPublicacoes[i].roteirista;
        if (nome && nomes.indexOf(nome) === -1) {
            nomes.push(nome);
        }
    }

    nomes.sort();
    var valorAtual = select.value;

    var html = '<option value="">Todos</option>';
    for (var j = 0; j < nomes.length; j++) {
        html += '<option value="' + nomes[j] + '">' + nomes[j] + '</option>';
    }

    select.innerHTML = html;
    select.value = valorAtual;
}

// Renderiza os cards das publicações na tela
function renderizarCards(lista) {
    var container = document.querySelector(".cards-publicacoes");
    if (!container) return;

    if (lista.length == 0) {
        container.innerHTML = `
            <div class="mensagem-vazia">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>Nenhuma publicação encontrada</h3>
                <p>Nenhuma publicação corresponde aos filtros selecionados. Tente ajustar os filtros ou redefini-los.</p>
                <button type="button" class="btn-limpar-filtros" onclick="limparFiltros()">Limpar filtros</button>
            </div>
        `;
        return;
    }

    var html = "";

    for (var i = 0; i < lista.length; i++) {
        var pub = lista[i];
        var dataFormatada = formatarData(pub.data || pub.criado_em);

        html += `
            <div class="card-publicacao" data-id="${pub.id}">
                <div class="card-coluna info-projeto">
                    <h2>${pub.titulo}</h2>
                    <div class="tags">
                        <span class="tag-data"><i class="fa-regular fa-calendar"></i> ${dataFormatada}</span>
                    </div>
                </div>

                <div class="card-coluna autor-premissa">
                    <span class="autor">Por: ${pub.roteirista || "Roteirista"}</span>
                    ${pub.premissa ? `<p class="premissa">${pub.premissa}</p>` : ""}
                </div>

                <div class="card-coluna acao">
                    <button type="button" class="btn-outline" onclick="abrirModal(${pub.id})">Abrir projeto</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Remove acentos para facilitar comparação de filtros
function removerAcentos(texto) {
    if (!texto) return "";
    return texto.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Aplica os filtros selecionados e a ordenação
function aplicarFiltros() {
    var selectRoteirista = document.getElementById("roteirista");
    var selectOrdenar = document.getElementById("ordenar");

    var filtroRoteirista = removerAcentos(selectRoteirista ? selectRoteirista.value : "");
    var filtroOrdenar = selectOrdenar ? selectOrdenar.value : "recentes";

    var filtrados = [];

    for (var i = 0; i < dadosPublicacoes.length; i++) {
        var pub = dadosPublicacoes[i];

        var roteiristaPub = removerAcentos(pub.roteirista);

        var bateuRoteirista = filtroRoteirista == "" || 
            roteiristaPub == filtroRoteirista || 
            roteiristaPub.split(" ").some(function (palavra) { return palavra.startsWith(filtroRoteirista); });

        if (bateuRoteirista) {
            filtrados.push(pub);
        }
    }

    // Ordenação simples por data ou nome
    if (filtroOrdenar == "recentes") {
        filtrados.sort(function (a, b) {
            return new Date(b.data || b.criado_em) - new Date(a.data || a.criado_em);
        });
    } else if (filtroOrdenar == "antigos") {
        filtrados.sort(function (a, b) {
            return new Date(a.data || a.criado_em) - new Date(b.data || b.criado_em);
        });
    } else if (filtroOrdenar == "nome-asc") {
        filtrados.sort(function (a, b) {
            return a.titulo.localeCompare(b.titulo);
        });
    } else if (filtroOrdenar == "nome-desc") {
        filtrados.sort(function (a, b) {
            return b.titulo.localeCompare(a.titulo);
        });
    }

    renderizarCards(filtrados);
}

// Limpa os filtros e retorna ao estado inicial
function limparFiltros() {
    var selectRoteirista = document.getElementById("roteirista");
    var selectOrdenar = document.getElementById("ordenar");

    if (selectRoteirista) selectRoteirista.value = "";
    if (selectOrdenar) selectOrdenar.value = "recentes";

    aplicarFiltros();
}

// Abre o popup modal e busca as anotações da publicação no backend
function abrirModal(id) {
    // Localiza a publicação nos dados carregados
    var pub = null;
    for (var i = 0; i < dadosPublicacoes.length; i++) {
        if (dadosPublicacoes[i].id == id) {
            pub = dadosPublicacoes[i];
            break;
        }
    }

    if (!pub) {
        pub = { id: id, titulo: "Publicação #" + id, descricao: "" };
    }

    // Abre o modal imediatamente na tela
    exibirModal(pub);

    // Busca as anotações atualizadas no backend
    fetch("/publicacoes/produtor/" + id + "/anotacoes")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    var lista = [];

                    // Trata retorno em array direto ou em objeto { publicacao }
                    if (Array.isArray(dados)) {
                        lista = dados;
                    } else if (dados.publicacao && Array.isArray(dados.publicacao.anotacoes)) {
                        lista = dados.publicacao.anotacoes;
                        if (dados.publicacao.descricao) {
                            pub.descricao = dados.publicacao.descricao;
                            var elDesc = document.getElementById("modal-descricao");
                            if (elDesc) elDesc.textContent = pub.descricao;
                        }
                    } else if (dados.anotacoes && Array.isArray(dados.anotacoes)) {
                        lista = dados.anotacoes;
                    }

                    pub.anotacoes = lista;
                    renderizarAnotacoesModal(lista);
                });
            } else {
                console.log("Status diferente de 200 ao buscar anotações.");
                renderizarAnotacoesModal([]);
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar no backend: ", erro);
            renderizarAnotacoesModal([]);
        });
}

// Preenche os dados no modal e exibe na tela
function exibirModal(pub) {
    if (!pub) return;

    var modal = document.getElementById("modal-publicacao");
    if (!modal) return;

    var elTitulo = document.getElementById("modal-titulo");
    if (elTitulo) {
        elTitulo.textContent = pub.titulo || "Projeto";
    }

    var elDescricao = document.getElementById("modal-descricao");
    if (elDescricao) {
        elDescricao.textContent = pub.descricao || pub.premissa || "Sem descrição disponível.";
    }

    // Se já tiver as anotações em memória, renderiza direto; senão, mostra carregando
    if (pub.anotacoes && Array.isArray(pub.anotacoes)) {
        renderizarAnotacoesModal(pub.anotacoes);
    } else {
        var containerAnotacoes = document.getElementById("modal-lista-anotacoes");
        var contadorAnotacoes = document.getElementById("modal-total-anotacoes");
        if (contadorAnotacoes) {
            contadorAnotacoes.textContent = "Carregando...";
        }
        if (containerAnotacoes) {
            containerAnotacoes.innerHTML = `
                <div class="anotacao-vazio">
                    <p><i class="fa-solid fa-spinner fa-spin"></i> Carregando anotações do projeto...</p>
                </div>
            `;
        }
    }

    modal.style.display = "flex";
    document.body.classList.add("modal-aberto");
}

// Renderiza a lista de anotações dentro do modal
function renderizarAnotacoesModal(lista) {
    var container = document.getElementById("modal-lista-anotacoes");
    var contador = document.getElementById("modal-total-anotacoes");
    if (!container) return;

    var anotacoes = lista || [];

    if (contador) {
        contador.textContent = anotacoes.length + (anotacoes.length == 1 ? " anotação" : " anotações");
    }

    if (anotacoes.length == 0) {
        container.innerHTML = `
            <div class="anotacao-vazio">
                <p>Nenhuma anotação vinculada a este projeto.</p>
            </div>
        `;
        return;
    }

    var htmlAnotacoes = "";
    for (var i = 0; i < anotacoes.length; i++) {
        var nota = anotacoes[i];
        var data = formatarData(nota.criado_em || nota.data);

        htmlAnotacoes += `
            <div class="card-anotacao-item">
                <div class="anotacao-item-topo">
                    <h4 class="anotacao-item-titulo">${nota.titulo}</h4>
                    <time class="anotacao-item-data">${data}</time>
                </div>
                <p class="anotacao-item-conteudo">${nota.conteudo}</p>
            </div>
        `;
    }

    container.innerHTML = htmlAnotacoes;
}

// Fecha o popup modal
function fecharModal() {
    var modal = document.getElementById("modal-publicacao");
    if (modal) {
        modal.style.display = "none";
    }
    document.body.classList.remove("modal-aberto");
}

// Fecha o modal ao clicar fora dele
function fecharModalExterno(event) {
    if (event.target && event.target.id == "modal-publicacao") {
        fecharModal();
    }
}

// Formata data simples (YYYY-MM-DD ou ISO para DD/MM/YYYY)
function formatarData(dataTexto) {
    if (!dataTexto) return "";
    var texto = dataTexto.toString().trim();
    if (texto.indexOf("/") !== -1) return texto;
    if (texto.indexOf("T") !== -1) {
        texto = texto.split("T")[0];
    }
    var partes = texto.split("-");
    if (partes.length == 3) {
        return partes[2].substring(0, 2) + "/" + partes[1] + "/" + partes[0];
    }
    return texto;
}

// Inicializa a tela e adiciona os ouvintes de eventos
function inicializar() {
    var btnFiltrar = document.querySelector(".btn-filtrar");
    if (btnFiltrar) {
        btnFiltrar.addEventListener("click", function (e) {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            fecharModal();
        }
    });

    buscarPublicacoes();
}

// Compatibilidade para testes ou scripts externos
window.dadosMockados = buscarPublicacoes;
window.buscarPublicacoes = buscarPublicacoes;
window.aplicarFiltros = aplicarFiltros;
window.limparFiltros = limparFiltros;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.fecharModalExterno = fecharModalExterno;

// Inicia quando o documento estiver carregado
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
} else {
    inicializar();
}
