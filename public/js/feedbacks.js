
var idUsuario = sessionStorage.ID_USUARIO;
var ehProdutor = sessionStorage.PERFIL_ID_USUARIO == 1;

var feedbacksAtuais = [];

var telaLista = document.getElementById("tela-lista");
var telaDetalhe = document.getElementById("tela-detalhe");
var estadoCarregando = document.getElementById("estado-carregando");
var estadoVazio = document.getElementById("estado-vazio");
var estadoErro = document.getElementById("estado-erro");
var listaFeedbacks = document.getElementById("lista-feedbacks");
var contador = document.getElementById("contador-feedbacks");
var avisoPagina = document.getElementById("aviso-pagina");

var sinoPainel = document.getElementById("sino-painel");
var sinoBotao = document.getElementById("sino-botao");
var sinoEstado = document.getElementById("sino-estado");
var sinoStatus = document.getElementById("sino-status");
var sinoMensagem = document.getElementById("sino-mensagem");
var btnConfigurarPreferencias = document.getElementById("btn-configurar-preferencias");

var horarioInicio = document.getElementById("horario-inicio");
var horarioFim = document.getElementById("horario-fim");
var diaResumo = document.getElementById("dia-resumo");
var preferenciasMensagem = document.getElementById("preferencias-mensagem");
var btnSalvarPreferencias = document.getElementById("btn-salvar-preferencias");

var filtroDataInicial = document.getElementById("filtro-data-inicial");
var filtroDataFinal = document.getElementById("filtro-data-final");
var filtroSemana = document.getElementById("filtro-semana");
var btnLimparFiltros = document.getElementById("btn-limpar-filtros");

function formatarData(valor) {
    if (!valor) {
        return "";
    }

    var data = new Date(String(valor).replace(" ", "T"));

    if (isNaN(data.getTime())) {
        return "";
    }

    return data.toLocaleDateString("pt-BR");
}

function obterDataComparacao(valor) {
    if (!valor) {
        return "";
    }

    return String(valor).substring(0, 10);
}

function lerErro(resposta, mensagemPadrao) {
    return resposta.json()
        .then(function (corpo) {
            throw new Error(corpo.mensagem || corpo.erro || mensagemPadrao);
        }, function () {
            throw new Error(mensagemPadrao);
        });
}

function mostrarAviso(texto) {
    avisoPagina.textContent = texto;
    avisoPagina.hidden = false;
}

function esconderAviso() {
    avisoPagina.textContent = "";
    avisoPagina.hidden = true;
}

function preencherUsuario() {
    document.getElementById("a_usuario").textContent =
        sessionStorage.NOME_USUARIO || "Usuário";

    document.getElementById("c_email").textContent =
        sessionStorage.EMAIL_USUARIO || "";

    document.getElementById("b_cargo").textContent =
        ehProdutor ? "Produtor" : "Roteirista";
}

function mostrarEstado(estado) {
    estadoCarregando.hidden = estado != "carregando";
    estadoVazio.hidden = estado != "vazio";
    estadoErro.hidden = estado != "erro";
    listaFeedbacks.hidden = estado != "lista";

    telaLista.setAttribute("aria-busy", estado == "carregando" ? "true" : "false");

    if (estado != "lista") {
        contador.textContent = "";
    }
}

function obterFeedbacksFiltrados() {
    var dataInicial = filtroDataInicial.value;
    var dataFinal = filtroDataFinal.value;

    return feedbacksAtuais.filter(function (feedback) {
        var dataFeedback = obterDataComparacao(feedback.criado_em);

        if (dataInicial && dataFeedback < dataInicial) {
            return false;
        }

        if (dataFinal && dataFeedback > dataFinal) {
            return false;
        }

        return true;
    });
}

function obterInicioSemana(data) {
    var dataSemana = new Date(data + "T12:00:00");
    var dia = dataSemana.getDay();

    var diferenca = dia == 0 ? -6 : 1 - dia;

    dataSemana.setDate(dataSemana.getDate() + diferenca);

    return dataSemana;
}

function formatarDataInput(data) {
    var ano = data.getFullYear();
    var mes = String(data.getMonth() + 1).padStart(2, "0");
    var dia = String(data.getDate()).padStart(2, "0");

    return ano + "-" + mes + "-" + dia;
}

function formatarPeriodoSemana(inicio, fim) {
    return inicio.toLocaleDateString("pt-BR") + " até " +
        fim.toLocaleDateString("pt-BR");
}

function preencherSemanas() {
    filtroSemana.innerHTML = '<option value="">Todas as semanas</option>';

    var semanas = {};

    feedbacksAtuais.forEach(function (feedback) {
        var data = obterDataComparacao(feedback.criado_em);

        if (!data) {
            return;
        }

        var inicio = obterInicioSemana(data);
        var fim = new Date(inicio);

        fim.setDate(fim.getDate() + 6);

        var inicioTexto = formatarDataInput(inicio);

        semanas[inicioTexto] = {
            inicio: inicioTexto,
            fim: formatarDataInput(fim),
            descricao: formatarPeriodoSemana(inicio, fim)
        };
    });

    var semanasOrdenadas = Object.values(semanas).sort(function (a, b) {
        return b.inicio.localeCompare(a.inicio);
    });

    semanasOrdenadas.forEach(function (semana) {
        var opcao = document.createElement("option");

        opcao.value = semana.inicio;
        opcao.textContent = semana.descricao;
        opcao.dataset.fim = semana.fim;

        filtroSemana.appendChild(opcao);
    });
}

function renderizarFeedbacks() {
    listaFeedbacks.innerHTML = "";

    var feedbacksFiltrados = obterFeedbacksFiltrados();

    if (feedbacksAtuais.length == 0) {
        document.getElementById("estado-vazio-titulo").textContent =
            "Você ainda não recebeu feedbacks";

        document.getElementById("estado-vazio-texto").textContent =
            "Quando um produtor enviar um feedback para uma das suas publicações, ele aparecerá aqui. Continue publicando seus projetos para receber feedbacks.";

        mostrarEstado("vazio");
        return;
    }

    if (feedbacksFiltrados.length == 0) {
        document.getElementById("estado-vazio-titulo").textContent =
            "Nenhum feedback encontrado";

        document.getElementById("estado-vazio-texto").textContent =
            "Não encontramos feedbacks para o período selecionado. Altere os filtros para visualizar outros resultados.";

        mostrarEstado("vazio");
        return;
    }

    for (var i = 0; i < feedbacksFiltrados.length; i++) {
        var feedback = feedbacksFiltrados[i];

        var item = document.createElement("li");
        item.className = "feedback-item";

        var corpo = document.createElement("div");
        corpo.className = "feedback-item-corpo";

        var titulo = document.createElement("h3");
        titulo.className = "feedback-item-titulo";
        titulo.textContent = feedback.titulo_publicacao || "Publicação sem título";

        var meta = document.createElement("p");
        meta.className = "feedback-item-meta";

        var rotuloProdutor = document.createElement("strong");
        rotuloProdutor.textContent = feedback.nome_produtor || "";

        var data = formatarData(feedback.criado_em);

        meta.appendChild(document.createTextNode("Produtor: "));
        meta.appendChild(rotuloProdutor);

        if (data) {
            meta.appendChild(document.createTextNode(" • " + data));
        }

        var previa = document.createElement("p");
        previa.className = "feedback-item-previa";
        previa.textContent = feedback.texto || "";

        corpo.appendChild(titulo);
        corpo.appendChild(meta);
        corpo.appendChild(previa);

        var botao = document.createElement("button");
        botao.type = "button";
        botao.className = "feedbacks-btn-secundario";
        botao.textContent = "Ver feedback";

        botao.addEventListener("click", (function (id) {
            return function () {
                abrirDetalhe(id);
            };
        })(feedback.id));

        item.appendChild(corpo);
        item.appendChild(botao);

        listaFeedbacks.appendChild(item);
    }

    contador.textContent = feedbacksFiltrados.length == 1
        ? "1 feedback"
        : feedbacksFiltrados.length + " feedbacks";

    mostrarEstado("lista");
}

function obterFeedbacks() {
    mostrarEstado("carregando");
    esconderAviso();

    fetch("/feedbacks/roteirista/" + idUsuario, { cache: "no-store" })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            return lerErro(resposta, "Erro ao buscar feedbacks.");
        })
        .then(function (corpo) {
            feedbacksAtuais = corpo.feedbacks || [];
            preencherSemanas();
            renderizarFeedbacks();
        })
        .catch(function (erro) {
            console.error("Erro ao obter feedbacks: " + erro.message);
            mostrarEstado("erro");
        });
}

function abrirDetalhe(idFeedback) {
    esconderAviso();

    fetch("/feedbacks/roteirista/" + idUsuario + "/" + idFeedback, { cache: "no-store" })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            return lerErro(resposta, "Erro ao buscar o feedback.");
        })
        .then(function (corpo) {
            var feedback = corpo.feedback;

            document.getElementById("detalhe-titulo").textContent =
                feedback.titulo_publicacao || "Publicação sem título";

            document.getElementById("detalhe-publicacao").textContent =
                feedback.titulo_publicacao || "";

            document.getElementById("detalhe-produtor").textContent =
                feedback.nome_produtor || "";

            document.getElementById("detalhe-data").textContent =
                formatarData(feedback.criado_em);

            document.getElementById("detalhe-texto").textContent =
                feedback.texto || "";

            telaLista.hidden = true;
            telaDetalhe.hidden = false;

            document.getElementById("detalhe-titulo").focus();
        })
        .catch(function (erro) {
            console.error("Erro ao abrir feedback: " + erro.message);
            mostrarAviso(erro.message);
            obterFeedbacks();
        });
}

function voltarParaLista() {
    telaDetalhe.hidden = true;
    telaLista.hidden = false;
}

function desenharSino(ativo) {
    ativo = ativo === true || ativo === 1 || ativo === "1";

    sinoPainel.classList.toggle("sino-ativo", ativo);
    sinoBotao.setAttribute("aria-checked", ativo ? "true" : "false");

    sinoEstado.textContent = ativo ? "Ativado" : "Desativado";

    sinoStatus.textContent = ativo
        ? "Você optou por receber notificações por e-mail."
        : "Você optou por não receber notificações por e-mail.";
}

function preencherPreferencias(preferencias) {
    if (!preferencias) {
        return;
    }

    horarioInicio.value = preferencias.horario_inicio
        ? String(preferencias.horario_inicio).substring(0, 5)
        : "";

    horarioFim.value = preferencias.horario_fim
        ? String(preferencias.horario_fim).substring(0, 5)
        : "";

    diaResumo.value = preferencias.dia_resumo_semanal == null
        ? ""
        : String(preferencias.dia_resumo_semanal);
}

function obterNotificacao() {
    sinoBotao.disabled = true;

    fetch("/feedbacks/roteirista/" + idUsuario + "/notificacao", { cache: "no-store" })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            return lerErro(resposta, "Erro ao buscar a preferência de notificação.");
        })
        .then(function (corpo) {
            desenharSino(corpo.notificacao);
            preencherPreferencias(corpo.preferencias);
        })
        .catch(function (erro) {
            console.error("Erro ao obter notificação: " + erro.message);
            desenharSino(false);
            sinoMensagem.textContent =
                "Não foi possível carregar as suas preferências de notificação.";
        })
        .finally(function () {
            sinoBotao.disabled = false;
        });
}

function alternarSino() {
    var estavaAtivo = sinoBotao.getAttribute("aria-checked") == "true";
    var novoValor = !estavaAtivo;

    sinoBotao.disabled = true;
    sinoMensagem.textContent = "";

    fetch("/feedbacks/roteirista/" + idUsuario + "/notificacao", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ativo: novoValor })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            return lerErro(resposta, "Não foi possível atualizar as notificações.");
        })
        .then(function (corpo) {
            desenharSino(corpo.notificacao);
            sinoMensagem.textContent = corpo.mensagem || "Preferência atualizada.";
        })
        .catch(function (erro) {
            console.error("Erro ao atualizar notificação: " + erro.message);
            desenharSino(estavaAtivo);
            sinoMensagem.textContent =
                "Não foi possível atualizar as notificações. Tente novamente.";
        })
        .finally(function () {
            sinoBotao.disabled = false;
        });
}

function alternarPreferencias() {
    var estaAberto = btnConfigurarPreferencias.getAttribute("aria-expanded") == "true";

    btnConfigurarPreferencias.setAttribute("aria-expanded", estaAberto ? "false" : "true");

    document.getElementById("sino-preferencias").hidden = estaAberto;

    btnConfigurarPreferencias.innerHTML = estaAberto
        ? 'Configurar notificações <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>'
        : 'Fechar configurações <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
}

function salvarPreferencias() {
    var inicio = horarioInicio.value;
    var fim = horarioFim.value;
    var dia = diaResumo.value;

    preferenciasMensagem.textContent = "";

    if (!inicio && !fim && !dia) {
        preferenciasMensagem.textContent =
            "Personalize as notificações preenchendo os horários e selecionando o dia do resumo semanal.";
        return;
    }

    if (!inicio || !fim || !dia) {
        preferenciasMensagem.textContent =
            "Para salvar, preencha os dois horários e selecione o dia do resumo semanal.";
        return;
    }

    if (inicio >= fim) {
        preferenciasMensagem.textContent =
            "O horário final precisa ser maior que o horário inicial.";
        return;
    }

    btnSalvarPreferencias.disabled = true;

    fetch("/feedbacks/roteirista/" + idUsuario + "/notificacao", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            horario_inicio: inicio,
            horario_fim: fim,
            dia_resumo_semanal: Number(dia)
        })
    })
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            }

            return lerErro(resposta, "Não foi possível salvar as preferências.");
        })
        .then(function (corpo) {
            preencherPreferencias(corpo.preferencias || {
                horario_inicio: inicio,
                horario_fim: fim,
                dia_resumo_semanal: Number(dia)
            });

            preferenciasMensagem.textContent =
                corpo.mensagem || "Preferências salvas com sucesso.";
        })
        .catch(function (erro) {
            console.error("Erro ao salvar preferências: " + erro.message);
            preferenciasMensagem.textContent =
                "Não foi possível salvar as preferências. Tente novamente.";
        })
        .finally(function () {
            btnSalvarPreferencias.disabled = false;
        });
}

function aplicarFiltroSemana() {
    var inicio = filtroSemana.value;

    if (!inicio) {
        renderizarFeedbacks();
        return;
    }

    var opcao = filtroSemana.options[filtroSemana.selectedIndex];

    filtroDataInicial.value = inicio;
    filtroDataFinal.value = opcao.dataset.fim;

    renderizarFeedbacks();
}

function limparFiltros() {
    filtroDataInicial.value = "";
    filtroDataFinal.value = "";
    filtroSemana.value = "";

    renderizarFeedbacks();
}

function atualizarFiltroData() {
    filtroSemana.value = "";

    if (filtroDataInicial.value && filtroDataFinal.value &&
        filtroDataInicial.value > filtroDataFinal.value) {
        mostrarAviso("A data inicial não pode ser posterior à data final.");
        return;
    }

    esconderAviso();
    renderizarFeedbacks();
}

document.getElementById("btn-tentar-novamente")
    .addEventListener("click", obterFeedbacks);

document.getElementById("btn-voltar")
    .addEventListener("click", voltarParaLista);

sinoBotao.addEventListener("click", alternarSino);

btnSalvarPreferencias.addEventListener("click", salvarPreferencias);

filtroDataInicial.addEventListener("change", atualizarFiltroData);
filtroDataFinal.addEventListener("change", atualizarFiltroData);
filtroSemana.addEventListener("change", aplicarFiltroSemana);
btnLimparFiltros.addEventListener("click", limparFiltros);
btnConfigurarPreferencias.addEventListener("click", alternarPreferencias);

preencherUsuario();

if (ehProdutor) {
    sinoPainel.hidden = true;
} else {
    obterNotificacao();
}

obterFeedbacks();