
document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // ELEMENTOS DA TELA
    // =========================

    var modalProjeto = document.getElementById("modal-projeto");
    var modalAnotacao = document.getElementById("formulario-anotacao");

    var formProjeto = document.getElementById("form-projeto");
    var formAnotacao = document.getElementById("form-anotacao");

    var btnAbrirProjeto = document.getElementById("abrir-modal-projeto");
    var btnFecharProjeto = document.getElementById("fechar-modal-projeto");
    var btnCancelarProjeto = document.getElementById("cancelar-projeto");

    var btnAbrirAnotacao = document.getElementById("abrir-formulario-anotacao");
    var btnFecharAnotacao = document.getElementById("fechar-formulario");
    var btnCancelarAnotacao = document.getElementById("cancelar-anotacao");
    var btnNovaAnotacaoProjeto = document.getElementById("nova-anotacao-projeto");

    var btnVoltarProjetos = document.getElementById("voltar-projetos");
    var campoBusca = document.getElementById("busca_nota");

    var telaProjetos = document.getElementById("tela-projetos");
    var telaDetalhes = document.getElementById("tela-detalhes");

    if (typeof preencherUsuario === "function") {
        preencherUsuario();
    }

    var elementoUsuario = document.getElementById("a_usuario");

    if (elementoUsuario) {
        elementoUsuario.textContent = sessionStorage.NOME_USUARIO || "";
    }

    // =========================
    // ESTADO DA PÁGINA
    // =========================

    var dashboardAtual = {
        projetos: [],
        anotacoes: [],
        projetoSelecionado: null
    };

    // =========================
    // FUNÇÕES AUXILIARES
    // =========================

    function escapar(texto) {
        var div = document.createElement("div");
        div.textContent = texto == null ? "" : String(texto);
        return div.innerHTML;
    }

    function contarAnotacoes(idProjeto) {
        var total = 0;

        for (var i = 0; i < dashboardAtual.anotacoes.length; i++) {
            if (dashboardAtual.anotacoes[i].projeto_id == idProjeto) {
                total++;
            }
        }

        return total;
    }

    function nomeDoProjeto(idProjeto) {
        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            if (dashboardAtual.projetos[i].id == idProjeto) {
                return dashboardAtual.projetos[i].nome;
            }
        }

        return "";
    }

    function abrirModal(modal) {
        if (modal) {
            modal.classList.add("aberto");
            modal.setAttribute("aria-hidden", "false");
        }
    }

    function fecharModal(modal) {
        if (modal) {
            modal.classList.remove("aberto");
            modal.setAttribute("aria-hidden", "true");
        }
    }

    function abrirTelaDetalhes() {
        if (telaProjetos) {
            telaProjetos.hidden = true;
        }

        if (telaDetalhes) {
            telaDetalhes.hidden = false;
        }

        atualizarTela();
    }

    function voltarParaProjetos() {
        if (telaDetalhes) {
            telaDetalhes.hidden = true;
        }

        if (telaProjetos) {
            telaProjetos.hidden = false;
        }

        dashboardAtual.projetoSelecionado = null;
        atualizarTela();
    }

    function mostrarErro(mensagem, erro) {
        console.error(mensagem, erro || "");
        alert(mensagem);
    }

    // =========================
    // MODAIS
    // =========================

    if (btnAbrirProjeto) {
        btnAbrirProjeto.addEventListener("click", function () {
            prepararFormularioProjeto();
            abrirModal(modalProjeto);
        });
    }

    function prepararFormularioProjeto() {
        if (formProjeto) {
            formProjeto.reset();
        }

        var campoId = document.getElementById("projeto_id");
        var tituloModal = document.getElementById("titulo-modal-projeto");
        var botaoSalvar = document.getElementById("salvar-projeto");

        if (campoId) {
            campoId.value = "";
        }

        if (tituloModal) {
            tituloModal.textContent = "Novo projeto";
        }

        if (botaoSalvar) {
            botaoSalvar.textContent = "Criar projeto";
        }
    }

    function fecharModalProjeto() {
        fecharModal(modalProjeto);
        prepararFormularioProjeto();
    }

    if (btnFecharProjeto) {
        btnFecharProjeto.addEventListener("click", fecharModalProjeto);
    }

    if (btnCancelarProjeto) {
        btnCancelarProjeto.addEventListener("click", fecharModalProjeto);
    }

    if (btnAbrirAnotacao) {
        btnAbrirAnotacao.addEventListener("click", function () {
            limparFormulario();
            abrirModal(modalAnotacao);
        });
    }

    function fecharModalAnotacao() {
        fecharModal(modalAnotacao);
    }

    if (btnFecharAnotacao) {
        btnFecharAnotacao.addEventListener("click", fecharModalAnotacao);
    }

    if (btnCancelarAnotacao) {
        btnCancelarAnotacao.addEventListener("click", function () {
            limparFormulario();
            fecharModalAnotacao();
        });
    }

    if (btnNovaAnotacaoProjeto) {
        btnNovaAnotacaoProjeto.addEventListener("click", function () {
            limparFormulario();

            if (dashboardAtual.projetoSelecionado !== null) {
                document.getElementById("selectProjeto").value =
                    dashboardAtual.projetoSelecionado;
            }

            abrirModal(modalAnotacao);
        });
    }

    if (btnVoltarProjetos) {
        btnVoltarProjetos.addEventListener("click", voltarParaProjetos);
    }

    // =========================
    // FORMULÁRIOS
    // =========================

    if (formProjeto) {
        formProjeto.addEventListener("submit", adicionarProjeto);
    }

    if (formAnotacao) {
        formAnotacao.addEventListener("submit", salvarAnotacao);
    }

    if (campoBusca) {
        campoBusca.addEventListener("input", exibirAnotacoes);
    }

    // =========================
    // ATUALIZAR A TELA
    // =========================

    function atualizarTela() {
        exibirProjetos();
        exibirSelectProjeto();
        exibirAnotacoes();
    }

    // =========================
    // CARREGAR PROJETOS
    // =========================

    function obterProjetos() {
        var idUsuario = sessionStorage.ID_USUARIO;

        if (!idUsuario) {
            console.error("Usuário não identificado na sessão.");
            return;
        }

        fetch("/anotacoes/projetos/listar/" + encodeURIComponent(idUsuario), {
            cache: "no-store"
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar os projetos.");
                }

                return resposta.json();
            })
            .then(function (projetos) {
                dashboardAtual.projetos = projetos;

                if (
                    dashboardAtual.projetoSelecionado !== null &&
                    !dashboardAtual.projetos.some(function (projeto) {
                        return projeto.id == dashboardAtual.projetoSelecionado;
                    })
                ) {
                    dashboardAtual.projetoSelecionado = null;
                }

                atualizarTela();
            })
            .catch(function (erro) {
                mostrarErro("Erro ao carregar os projetos.", erro);
            });
    }

    // =========================
    // EXIBIR PROJETOS E BOTÕES
    // =========================

    function exibirProjetos() {
        var container = document.getElementById("lista-projetos-tabela");

        if (!container) {
            console.error("Elemento lista-projetos-tabela não encontrado.");
            return;
        }

        container.innerHTML = "";

        if (dashboardAtual.projetos.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="4">Nenhum projeto cadastrado.</td>
                </tr>
            `;
            return;
        }

        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            var projeto = dashboardAtual.projetos[i];
            var linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escapar(projeto.nome)}</td>
                <td>—</td>
                <td>${contarAnotacoes(projeto.id)} anotações</td>

                <td>
                    <div class="projeto-acoes">
                        <button
                            type="button"
                            class="btn-abrir-projeto"
                            data-abrir-projeto="${projeto.id}">
                            Abrir projeto
                        </button>

                        <button
                            type="button"
                            class="btn-editar-projeto"
                            data-editar-projeto="${projeto.id}">
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir-projeto"
                            data-excluir-projeto="${projeto.id}">
                            🗑️ Excluir
                        </button>
                    </div>
                </td>
            `;

            container.appendChild(linha);
        }

        container.querySelectorAll("[data-abrir-projeto]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                selecionarProjeto(botao.dataset.abrirProjeto);
                abrirTelaDetalhes();
            });
        });

        container.querySelectorAll("[data-editar-projeto]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                editarProjeto(botao.dataset.editarProjeto);
            });
        });

        container.querySelectorAll("[data-excluir-projeto]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                excluirProjeto(botao.dataset.excluirProjeto);
            });
        });
    }

    // =========================
    // EDITAR PROJETO
    // =========================

    function editarProjeto(idProjeto) {
        var projetoEncontrado = null;

        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            if (dashboardAtual.projetos[i].id == idProjeto) {
                projetoEncontrado = dashboardAtual.projetos[i];
                break;
            }
        }

        if (!projetoEncontrado) {
            alert("Não foi possível encontrar esse projeto.");
            return;
        }

        var campoId = document.getElementById("projeto_id");
        var campoNome = document.getElementById("projeto_nome");
        var tituloModal = document.getElementById("titulo-modal-projeto");
        var botaoSalvar = document.getElementById("salvar-projeto");

        if (!campoId || !campoNome) {
            alert("Não foi possível encontrar os campos do formulário de projeto.");
            return;
        }

        campoId.value = projetoEncontrado.id;
        campoNome.value = projetoEncontrado.nome;

        if (tituloModal) {
            tituloModal.textContent = "Editar projeto";
        }

        if (botaoSalvar) {
            botaoSalvar.textContent = "Salvar alterações";
        }

        abrirModal(modalProjeto);
        campoNome.focus();
    }

    // =========================
    // EXCLUIR PROJETO
    // =========================

    function excluirProjeto(idProjeto) {
        if (contarAnotacoes(idProjeto) > 0) {
            alert("Este projeto possui anotações. Exclua as anotações antes de excluir o projeto.");
            return;
        }

        if (!confirm("Tem certeza de que deseja excluir este projeto?")) {
            return;
        }

        var idUsuario = sessionStorage.ID_USUARIO;

        fetch("/anotacoes/projetos/excluir", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idProjeto,
                idUsuario: idUsuario
            })
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    return resposta.text().then(function (mensagem) {
                        throw new Error(mensagem || "Não foi possível excluir o projeto.");
                    });
                }

                return resposta.text();
            })
            .then(function () {
                if (dashboardAtual.projetoSelecionado == idProjeto) {
                    voltarParaProjetos();
                }

                return Promise.all([
                    obterProjetos(),
                    obterAnotacoes()
                ]);
            })
            .catch(function (erro) {
                mostrarErro("Erro ao excluir projeto.", erro);
            });
    }

    // =========================
    // CRIAR E EDITAR PROJETO
    // =========================

    function adicionarProjeto(evento) {
        evento.preventDefault();

        var campoId = document.getElementById("projeto_id");
        var campoNome = document.getElementById("projeto_nome");

        var idProjeto = campoId ? campoId.value : "";
        var nome = campoNome ? campoNome.value.trim() : "";
        var idUsuario = sessionStorage.ID_USUARIO;

        if (!idUsuario) {
            alert("Não foi possível identificar o usuário. Entre novamente.");
            return;
        }

        if (nome === "") {
            alert("Digite o nome do projeto.");
            return;
        }

        var editando = idProjeto !== "";

        var rota = editando
            ? "/anotacoes/projetos/editar"
            : "/anotacoes/projetos/criar";

        var metodo = editando ? "PUT" : "POST";

        fetch(rota, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idProjeto,
                idUsuario: idUsuario,
                nome: nome
            })
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    return resposta.text().then(function (mensagem) {
                        throw new Error(mensagem || "Não foi possível salvar o projeto.");
                    });
                }

                if (editando) {
                    return {};
                }

                return resposta.json();
            })
            .then(function (dados) {
                fecharModalProjeto();

                if (!editando && dados.id) {
                    dashboardAtual.projetoSelecionado = String(dados.id);
                }

                obterProjetos();
            })
            .catch(function (erro) {
                mostrarErro("Erro ao salvar projeto.", erro);
            });
    }

    // =========================
    // CARREGAR ANOTAÇÕES
    // =========================

    function obterAnotacoes() {
        var idUsuario = sessionStorage.ID_USUARIO;

        if (!idUsuario) {
            console.error("Usuário não identificado na sessão.");
            return;
        }

        fetch("/anotacoes/listar/" + encodeURIComponent(idUsuario), {
            cache: "no-store"
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar as anotações.");
                }

                return resposta.json();
            })
            .then(function (anotacoes) {
                dashboardAtual.anotacoes = anotacoes;
                atualizarTela();
            })
            .catch(function (erro) {
                mostrarErro("Erro ao carregar as anotações.", erro);
            });
    }

    // =========================
    // SELECT DE PROJETOS
    // =========================

    function exibirSelectProjeto() {
        var select = document.getElementById("selectProjeto");

        if (!select) {
            return;
        }

        var valorAnterior = select.value;

        select.innerHTML = "";

        if (dashboardAtual.projetos.length === 0) {
            select.innerHTML = `
                <option value="">Crie um projeto primeiro</option>
            `;
            return;
        }

        select.innerHTML = `
            <option value="">Selecione um projeto</option>
        `;

        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            var projeto = dashboardAtual.projetos[i];
            var option = document.createElement("option");

            option.value = projeto.id;
            option.textContent = projeto.nome;

            select.appendChild(option);
        }

        if (dashboardAtual.projetoSelecionado !== null) {
            select.value = dashboardAtual.projetoSelecionado;
        } else if (valorAnterior !== "") {
            select.value = valorAnterior;
        }
    }

    function selecionarProjeto(idProjeto) {
        dashboardAtual.projetoSelecionado =
            idProjeto === null ? null : String(idProjeto);

        atualizarTela();
    }

    // =========================
    // EXIBIR ANOTAÇÕES
    // =========================

    function exibirAnotacoes() {
        var container = document.getElementById("listaAnotacoes");

        if (!container) {
            return;
        }

        var campoBusca = document.getElementById("busca_nota");
        var busca = campoBusca ? campoBusca.value.toLowerCase().trim() : "";

        container.innerHTML = "";

        var nomeAtivo = "Todos os projetos";

        if (dashboardAtual.projetoSelecionado !== null) {
            nomeAtivo = nomeDoProjeto(dashboardAtual.projetoSelecionado);
        }

        var tituloProjeto = document.getElementById("nome-projeto-ativo");

        if (tituloProjeto) {
            tituloProjeto.textContent = nomeAtivo;
        }

        var exibidas = 0;

        for (var i = 0; i < dashboardAtual.anotacoes.length; i++) {
            var anotacao = dashboardAtual.anotacoes[i];

            if (
                dashboardAtual.projetoSelecionado !== null &&
                anotacao.projeto_id != dashboardAtual.projetoSelecionado
            ) {
                continue;
            }

            var texto = (
                String(anotacao.titulo || "") + " " +
                String(anotacao.conteudo || "")
            ).toLowerCase();

            if (texto.indexOf(busca) === -1) {
                continue;
            }

            var tituloTodas = "";

            if (dashboardAtual.projetoSelecionado === null) {
                tituloTodas = `
                    <span class="note-tag">
                        <i class="fa-solid fa-folder"></i>
                        ${escapar(nomeDoProjeto(anotacao.projeto_id))}
                    </span>
                `;
            }

            var data = new Date(anotacao.criado_em);

            var dataFormatada = isNaN(data.getTime())
                ? ""
                : data.toLocaleString("pt-BR");

            var item = document.createElement("li");
            item.className = "card note-item";
            item.dataset.notaId = anotacao.id;

            item.innerHTML = `
                <div class="note-body">
                    <h2>${tituloTodas}</h2>
                    <h4>${escapar(anotacao.titulo)}</h4>
                    <p>${escapar(anotacao.conteudo)}</p>
                    <time datetime="${escapar(anotacao.criado_em)}">
                        Criada em: ${escapar(dataFormatada)}
                    </time>
                </div>

                <div class="note-actions">
                    <button
                        type="button"
                        class="btn-icon btn-editar"
                        aria-label="Editar anotação"
                        data-editar-nota="${escapar(anotacao.id)}">
                        ✏️
                    </button>

                    <button
                        type="button"
                        class="btn-icon btn-excluir"
                        aria-label="Excluir anotação"
                        data-excluir-nota="${escapar(anotacao.id)}">
                        🗑️
                    </button>
                </div>
            `;

            container.appendChild(item);
            exibidas++;
        }

        if (exibidas === 0) {
            container.innerHTML = `
                <li class="note-vazio">Nenhuma anotação encontrada.</li>
            `;
        }

        container.querySelectorAll("[data-editar-nota]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                editarAnotacao(botao.dataset.editarNota);
            });
        });

        container.querySelectorAll("[data-excluir-nota]").forEach(function (botao) {
            botao.addEventListener("click", function () {
                excluirAnotacao(botao.dataset.excluirNota);
            });
        });
    }

    // =========================
    // CRIAR E EDITAR ANOTAÇÕES
    // =========================

    function salvarAnotacao(evento) {
        evento.preventDefault();

        var idNota = document.getElementById("nota_id").value;
        var idProjeto = document.getElementById("selectProjeto").value;
        var titulo = document.getElementById("nota_titulo").value.trim();
        var conteudo = document.getElementById("nota_texto").value.trim();
        var idUsuario = sessionStorage.ID_USUARIO;

        if (!idUsuario) {
            alert("Não foi possível identificar o usuário. Entre novamente.");
            return;
        }

        if (idProjeto === "") {
            alert("Crie ou selecione um projeto para salvar a anotação.");
            return;
        }

        if (titulo === "" || conteudo === "") {
            alert("Preencha o título e o conteúdo da anotação.");
            return;
        }

        var rota = "/anotacoes/criar";
        var metodo = "POST";

        if (idNota !== "") {
            rota = "/anotacoes/editar";
            metodo = "PUT";
        }

        fetch(rota, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idNota,
                idUsuario: idUsuario,
                idProjeto: idProjeto,
                titulo: titulo,
                conteudo: conteudo
            })
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    throw new Error("Não foi possível salvar a anotação.");
                }

                return resposta.text();
            })
            .then(function () {
                dashboardAtual.projetoSelecionado = String(idProjeto);

                limparFormulario();
                fecharModalAnotacao();
                abrirTelaDetalhes();

                obterAnotacoes();
            })
            .catch(function (erro) {
                mostrarErro("Erro ao salvar a anotação.", erro);
            });
    }

    function editarAnotacao(idNota) {
        for (var i = 0; i < dashboardAtual.anotacoes.length; i++) {
            var anotacao = dashboardAtual.anotacoes[i];

            if (anotacao.id == idNota) {
                document.getElementById("nota_id").value = anotacao.id;
                document.getElementById("selectProjeto").value = anotacao.projeto_id;
                document.getElementById("nota_titulo").value = anotacao.titulo;
                document.getElementById("nota_texto").value = anotacao.conteudo;

                var tituloFormulario = document.getElementById("titulo-formulario");
                var botaoSalvar = document.getElementById("salvar-anotacao");

                if (tituloFormulario) {
                    tituloFormulario.textContent = "Editar anotação";
                }

                if (botaoSalvar) {
                    botaoSalvar.textContent = "Salvar alterações";
                }

                abrirModal(modalAnotacao);
                document.getElementById("nota_titulo").focus();

                break;
            }
        }
    }

    function limparFormulario() {
        if (formAnotacao) {
            formAnotacao.reset();
        }

        var campoId = document.getElementById("nota_id");

        if (campoId) {
            campoId.value = "";
        }

        var tituloFormulario = document.getElementById("titulo-formulario");
        var botaoSalvar = document.getElementById("salvar-anotacao");

        if (tituloFormulario) {
            tituloFormulario.textContent = "Nova anotação";
        }

        if (botaoSalvar) {
            botaoSalvar.textContent = "Salvar anotação";
        }

        exibirSelectProjeto();
    }

    function excluirAnotacao(idNota) {
        if (!confirm("Deseja excluir esta anotação?")) {
            return;
        }

        var idUsuario = sessionStorage.ID_USUARIO;

        fetch("/anotacoes/excluir", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: idNota,
                idUsuario: idUsuario
            })
        })
            .then(function (resposta) {
                if (!resposta.ok) {
                    throw new Error("Não foi possível excluir a anotação.");
                }

                return resposta.text();
            })
            .then(function () {
                return obterAnotacoes();
            })
            .catch(function (erro) {
                mostrarErro("Erro ao excluir a anotação.", erro);
            });
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================

    obterProjetos();
    obterAnotacoes();

});