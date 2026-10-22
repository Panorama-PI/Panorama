document.addEventListener("DOMContentLoaded", function () {

    // Modais
    var modalProjeto = document.getElementById("modal-projeto");
    var modalAnotacao = document.getElementById("formulario-anotacao");

    // Botões de projeto
    var btnAbrirProjeto = document.getElementById("abrir-modal-projeto");
    var btnFecharProjeto = document.getElementById("fechar-modal-projeto");
    var btnCancelarProjeto = document.getElementById("cancelar-projeto");
    var formProjeto = document.getElementById("form-projeto");

    // Botões de anotação
    var btnAbrirAnotacao = document.getElementById("abrir-formulario-anotacao");
    var btnFecharAnotacao = document.getElementById("fechar-formulario");
    var btnCancelarAnotacao = document.getElementById("cancelar-anotacao");

    // Abre o modal de projeto
    btnAbrirProjeto.addEventListener("click", function () {
        modalProjeto.classList.add("aberto");
        modalProjeto.setAttribute("aria-hidden", "false");
    });

    // Fecha o modal de projeto
    function fecharModalProjeto() {
        modalProjeto.classList.remove("aberto");
        modalProjeto.setAttribute("aria-hidden", "true");
        formProjeto.reset();
    }

    btnFecharProjeto.addEventListener("click", fecharModalProjeto);
    btnCancelarProjeto.addEventListener("click", fecharModalProjeto);

    // Abre o formulário de anotação
    btnAbrirAnotacao.addEventListener("click", function () {
        modalAnotacao.classList.add("aberto");
        modalAnotacao.setAttribute("aria-hidden", "false");
    });

    // Fecha o formulário de anotação
    function fecharModalAnotacao() {
        modalAnotacao.classList.remove("aberto");
        modalAnotacao.setAttribute("aria-hidden", "true");
    }

    btnFecharAnotacao.addEventListener("click", fecharModalAnotacao);
    btnCancelarAnotacao.addEventListener("click", fecharModalAnotacao);

});

preencherUsuario()

    a_usuario.innerHTML = sessionStorage.NOME_USUARIO;

    // guarda o estado atual da página para eu consultar mais fácil depois
    // projetoSelecionado = id do projeto escolhido na faixa (null = tds)
    let dashboardAtual = {
        projetos: [],
        anotacoes: [],
        projetoSelecionado: null
    };

    // evita que texto digitado pelo usuário quebre 
    function escapar(texto) {
        var div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
    }

    // conta quantas anotações um projeto tem p por no botao
    function contarAnotacoes(idProjeto) {
        var total = 0;

        for (var i = 0; i < dashboardAtual.anotacoes.length; i++) {
            if (dashboardAtual.anotacoes[i].projeto_id == idProjeto) {
                total++;
            }
        }

        return total;
    }

    window.onload = function () {
        obterProjetos();
        obterAnotacoes();
    }

    // atualiza toda funcao p nao dar problema na pagina dps
    function atualizarTela() {
        exibirProjetos();
        exibirSelectProjeto();
        exibirAnotacoes();
    }

    // parte de projetos

    // Busca os projetos do usuário na rota e salva na dashboardAtual.projetos
    function obterProjetos() {
        fetch(`/anotacoes/projetos/listar/${sessionStorage.ID_USUARIO}`, { cache: 'no-store' })
            .then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (projetos) {
                        console.log(`Dados recebidos: ${JSON.stringify(projetos)}`);
                        dashboardAtual.projetos = projetos;
                        atualizarTela();
                    });
                } else {
                    console.error('Nenhum dado encontrado ou erro na API');
                }
            })
            .catch(function (erro) {
                console.error(`Erro na obtenção dos projetos: ${erro.message}`);
            });
    }

    // renderiza os botoes
    function exibirProjetos() {
        var container = document.getElementById("lista-projetos");
        container.innerHTML = "";

        var classeTodas = "projeto-botao";
        if (dashboardAtual.projetoSelecionado === null) {
            classeTodas += " ativo";
        }

        container.innerHTML += `
            <li>
                <button type="button" class="${classeTodas}" onclick="selecionarProjeto(null)">
                    <i class="fa-solid fa-layer-group"></i> Todas
                </button>
            </li>
        `;

        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            var projeto = dashboardAtual.projetos[i];

            var classe = "projeto-botao";
            if (projeto.id == dashboardAtual.projetoSelecionado) {
                classe += " ativo";
            }

            container.innerHTML += `
                <li>
                    <button type="button" class="${classe}" data-projeto-id="${projeto.id}"
                        onclick="selecionarProjeto(${projeto.id})">
                        <i class="fa-solid fa-folder"></i> ${escapar(projeto.nome)}
                        <span class="projeto-count">${contarAnotacoes(projeto.id)}</span>
                    </button>
                </li>
            `;
        }
    }

    function exibirSelectProjeto() {
        var select = document.getElementById("selectProjeto");
        var valorAnterior = select.value;

        if (dashboardAtual.projetos.length == 0) {
            select.innerHTML = `<option class="select-projeto" value="">Crie um projeto primeiro</option>`;
            return;
        }

        select.innerHTML = "";

        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            var projeto = dashboardAtual.projetos[i];

            select.innerHTML += `<option class="select-projeto" value="${projeto.id}">${escapar(projeto.nome)}</option>`;
        }

        if (dashboardAtual.projetoSelecionado !== null) {
            select.value = dashboardAtual.projetoSelecionado;
        } else if (valorAnterior != "") {
            select.value = valorAnterior;
        }
    }

    // quando o usuário clica em um botao guarda o projeto e reload a tela
    function selecionarProjeto(idProjeto) {
        dashboardAtual.projetoSelecionado = idProjeto;
        atualizarTela();
    }

    // Chamada quando o usuário envia o modal "Novo projeto"
    function adicionarProjeto(evento) {
        evento.preventDefault();

        var input = document.getElementById("projeto_nome");
        var nome = input.value.trim();

        // impede criar projeto sem nome
        if (nome == "") {
            alert("Digite o nome do projeto");
            return;
        }

        fetch("/anotacoes/projetos/criar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idUsuario: sessionStorage.ID_USUARIO,
                nome: nome
            })
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (dados) {
                        input.value = "";
                        document.getElementById("modal-projeto").close();
                        dashboardAtual.projetoSelecionado = dados.id; // já abre o projeto novo
                        obterProjetos();                              // atualiza a lista na tela
                    });
                } else {
                    console.error("Não foi possível criar o projeto");
                    alert("Não foi possível criar o projeto");
                }
            })
            .catch(function (erro) {
                console.error(`Erro ao criar projeto: ${erro.message}`);
            });
    }

    // Parte de anotacoes

    function obterAnotacoes() {
        fetch(`/anotacoes/listar/${sessionStorage.ID_USUARIO}`, { cache: 'no-store' })
            .then(function (resposta) {
                if (resposta.ok) {
                    resposta.json().then(function (anotacoes) {
                        console.log(`Dados recebidos: ${JSON.stringify(anotacoes)}`);
                        dashboardAtual.anotacoes = anotacoes;
                        atualizarTela();
                    });
                } else {
                    console.error('Nenhum dado encontrado ou erro na API');
                }
            })
            .catch(function (erro) {
                console.error(`Erro na obtenção das anotações: ${erro.message}`);
            });
    }

    function nomeDoProjeto(idProjeto) {
        for (var i = 0; i < dashboardAtual.projetos.length; i++) {
            if (dashboardAtual.projetos[i].id == idProjeto) {
                return dashboardAtual.projetos[i].nome;
            }
        }
        return "";
    }

    // Renderiza os cards na ul listaAnotacoes
    // Filtra pelo projeto selecionado e pelo texto da busca (título ou conteúdo)
    function exibirAnotacoes() {
        var container = document.getElementById("listaAnotacoes");
        var busca = document.getElementById("busca_nota").value.toLowerCase();
        container.innerHTML = "";

        // título do painel: nome do projeto selecionado
        var nomeAtivo = "todos os projetos";
        if (dashboardAtual.projetoSelecionado !== null) {
            nomeAtivo = nomeDoProjeto(dashboardAtual.projetoSelecionado);
        }
        document.getElementById("nome-projeto-ativo").innerHTML = escapar(nomeAtivo);

        var exibidas = 0;

        for (var i = 0; i < dashboardAtual.anotacoes.length; i++) {
            var anotacao = dashboardAtual.anotacoes[i];

            // filtro por projeto
            if (dashboardAtual.projetoSelecionado !== null && anotacao.projeto_id != dashboardAtual.projetoSelecionado) {
                continue;
            }

            // filtro pela busca
            var texto = (anotacao.titulo + " " + anotacao.conteudo).toLowerCase();
            if (texto.indexOf(busca) == -1) {
                continue;
            }

            // quando está em "todas", mostra de qual projeto é a anotação
            var tituloTodas = "";
            if (dashboardAtual.projetoSelecionado === null) {
                tituloTodas = `<span class="note-tag"><i class="fa-solid fa-folder"></i> ${escapar(nomeDoProjeto(anotacao.projeto_id))}</span>`;
            }

            var data = new Date(anotacao.criado_em);

            container.innerHTML += `
                <li class="card note-item" data-nota-id="${anotacao.id}">
                    <div class="note-body">
                        <h2>${tituloTodas}</h2>
                        <h4>${escapar(anotacao.titulo)}</h4>
                        <p>${escapar(anotacao.conteudo)}</p>
                        <time datetime="${anotacao.criado_em}">
                            Criada em: ${data.toLocaleString("pt-BR")}
                        </time>
                    </div>
                    <div class="note-actions">
                        <button type="button" class="btn-icon btn-excluir" aria-label="Editar anotação"
                            onclick="editarAnotacao(${anotacao.id})">
                            <img src="../../assets/imgs/edit.png" alt="">
                        </button>
                        <button type="button" class="btn-icon btn-excluir" aria-label="Excluir anotação"
                            onclick="excluirAnotacao(${anotacao.id})">
                            <img src="../../assets/imgs/lixo.png" alt="">
                        </button>
                    </div>
                </li>
            `;
            exibidas++;
        }

        if (exibidas == 0) {
            container.innerHTML = `<li class="note-vazio">Nenhuma anotação encontrada.</li>`;
        }
    }

    // 
    // se nota_id estiver vazio cria uma anotacao nova senao edita
    function salvarAnotacao(evento) {
        evento.preventDefault();

        var idNota = document.getElementById("nota_id").value;
        var idProjeto = document.getElementById("selectProjeto").value;
        var titulo = document.getElementById("nota_titulo").value.trim();
        var conteudo = document.getElementById("nota_texto").value.trim();

        if (idProjeto == "") {
            alert("Crie ou selecione um projeto para salvar a anotação");
            return;
        }

        if (titulo == "" || conteudo == "") {
            alert("Preencha o título e a anotação");
            return;
        }

        var rota = "/anotacoes/criar";
        var metodo = "POST";

        if (idNota != "") {
            rota = "/anotacoes/editar";
            metodo = "PUT";
        }

        fetch(rota, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idNota,
                idUsuario: sessionStorage.ID_USUARIO,
                idProjeto: idProjeto,
                titulo: titulo,
                conteudo: conteudo
            })
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    // se já estava filtrando por um projeto, passa a mostrar o projeto onde salvou
                    if (dashboardAtual.projetoSelecionado !== null) {
                        dashboardAtual.projetoSelecionado = idProjeto;
                    }
                    limparFormulario();
                    obterAnotacoes(); // atualiza a lista na tela
                } else {
                    console.error("Não foi possível salvar a anotação");
                    alert("Não foi possível salvar a anotação");
                }
            })
            .catch(function (erro) {
                console.error(`Erro ao salvar anotação: ${erro.message}`);
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

                document.getElementById("titulo-form").innerHTML = "Editar anotação";
                document.getElementById("texto-botao-salvar").innerHTML = "Salvar alterações";
                document.getElementById("btn-cancelar-edicao").style.display = "block";

                document.getElementById("nota_titulo").focus();
                break;
            }
        }
    }

    // Volta o formulário para o modo "Nova anotação"
    function limparFormulario() {
        document.getElementById("form-anotacao").reset();
        document.getElementById("nota_id").value = "";

        document.getElementById("titulo-form").innerHTML = "Nova anotação";
        document.getElementById("texto-botao-salvar").innerHTML = "Salvar";
        document.getElementById("btn-cancelar-edicao").style.display = "none";

        exibirSelectProjeto(); // reaplica o projeto selecionado no select
    }

    function excluirAnotacao(idNota) {
        if (!confirm("Deseja excluir esta anotação?")) {
            return;
        }

        fetch("/anotacoes/excluir", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idNota,
                idUsuario: sessionStorage.ID_USUARIO
            })
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    limparFormulario();
                    obterAnotacoes(); // atualiza a lista na tela
                } else {
                    console.error("Erro ao excluir anotação");
                }
            })
            .catch(function (erro) {
                console.error(`Erro ao excluir anotação: ${erro.message}`);
            });
    }