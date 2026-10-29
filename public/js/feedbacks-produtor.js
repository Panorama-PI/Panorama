
// ==========================================
// DADOS MOCKADOS
// ==========================================

// Publicações disponíveis da empresa
var publicacoes = [
    {
        id: 1,
        titulo: "Entre Sombras",
        roteirista: "Ana Martins"
    },
    {
        id: 2,
        titulo: "Última Estação",
        roteirista: "Rafael Costa"
    },
    {
        id: 3,
        titulo: "Cidade Submersa",
        roteirista: "Júlia Mendes"
    },
    {
        id: 4,
        titulo: "Além do Horizonte",
        roteirista: "Mariana Souza"
    },
    {
        id: 5,
        titulo: "O Último Capítulo",
        roteirista: "Pedro Oliveira"
    }
];

// Feedbacks enviados pelo produtor
var feedbacks = [
    {
        id: 1,
        idPublicacao: 1,
        texto: "Gostei da proposta do roteiro. Sugiro desenvolver melhor o conflito da protagonista.",
        status: "Enviado"
    },
    {
        id: 2,
        idPublicacao: 2,
        texto: "A história está bem estruturada, mas acredito que o final poderia ser mais desenvolvido.",
        status: "Enviado"
    },
    {
        id: 3,
        idPublicacao: 3,
        texto: "A ambientação está muito boa. Seria interessante aprofundar os personagens secundários.",
        status: "Enviado"
    }
];

// Guarda o ID do feedback que está sendo editado
var idEditando = null;


// ==========================================
// LISTAR FEEDBACKS
// ==========================================

function listarFeedbacks() {
    var lista = document.getElementById("lista-feedbacks");
    var contador = document.getElementById("contador-feedbacks");

    lista.innerHTML = "";

    contador.innerHTML = feedbacks.length + " feedback(s)";

    if (feedbacks.length == 0) {
        document.getElementById("estado-vazio").hidden = false;
        document.getElementById("container-tabela").hidden = true;
    } else {
        document.getElementById("estado-vazio").hidden = true;
        document.getElementById("container-tabela").hidden = false;

        for (var i = 0; i < feedbacks.length; i++) {
            var feedback = feedbacks[i];
            var publicacao = buscarPublicacao(feedback.idPublicacao);

            if (publicacao != null) {
                var classeStatus = "status-enviado";

                if (feedback.status == "Enviando") {
                    classeStatus = "status-enviando";
                }

                lista.innerHTML += `
                <tr class="feedback-linha-clicavel"
                onclick="visualizarFeedback(${feedback.id})">
                        <td>${publicacao.titulo}</td>

                        <td>${publicacao.roteirista}</td>

                        <td>
                            <span class="feedbacks-status ${classeStatus}">
                                ${feedback.status}
                            </span>
                        </td>

                        <td>
                            <div class="feedbacks-acoes">
                               <button class="feedbacks-btn-editar"
                                    onclick="event.stopPropagation(); editarFeedback(${feedback.id})">
                                    Editar
                                </button>

                                <button class="feedbacks-btn-excluir"
                                    onclick="event.stopPropagation(); excluirFeedback(${feedback.id})">
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }
    }
}


// ==========================================
// BUSCAR PUBLICAÇÃO PELO ID
// ==========================================

function buscarPublicacao(id) {
    for (var i = 0; i < publicacoes.length; i++) {
        if (publicacoes[i].id == id) {
            return publicacoes[i];
        }
    }

    return null;
}


// ==========================================
// ABRIR FORMULÁRIO
// ==========================================

function abrirFormulario() {
    idEditando = null;

    document.getElementById("tela-lista").hidden = true;
    document.getElementById("tela-formulario").hidden = false;

    document.getElementById("btn-adicionar").hidden = true;

    document.getElementById("titulo-formulario").innerHTML =
        "Adicionar novo feedback";

    document.getElementById("btn-salvar").innerHTML =
        "Enviar feedback";

    document.getElementById("input-feedback").value = "";

    carregarPublicacoes();
    contarCaracteres();
}


// ==========================================
// CARREGAR PUBLICAÇÕES NO SELECT
// ==========================================

function carregarPublicacoes() {
    var select = document.getElementById("select-publicacao");

    select.innerHTML =
        '<option value="">Selecione uma publicação</option>';

    for (var i = 0; i < publicacoes.length; i++) {
        var jaAvaliada = false;

        // Verifica se já existe feedback para a publicação
        for (var j = 0; j < feedbacks.length; j++) {
            if (feedbacks[j].idPublicacao == publicacoes[i].id) {
                jaAvaliada = true;
            }
        }

        // Mostra apenas publicações sem feedback
        if (jaAvaliada == false) {
            var opcao = document.createElement("option");

            opcao.value = publicacoes[i].id;
            opcao.textContent = publicacoes[i].titulo +
                " — " + publicacoes[i].roteirista;

            select.appendChild(opcao);
        }
    }

    select.disabled = false;
}


// ==========================================
// CONTADOR DE CARACTERES
// ==========================================

function contarCaracteres() {
    var texto = document.getElementById("input-feedback").value;

    document.getElementById("contador-caracteres").innerHTML =
        texto.length + " / 2000 caracteres";
}


// ==========================================
// SALVAR FEEDBACK
// ==========================================

function salvarFeedback() {
    var idPublicacao = document.getElementById("select-publicacao").value;
    var texto = document.getElementById("input-feedback").value.trim();

    if (idPublicacao == "") {
        alert("Selecione uma publicação.");
        return;
    }

    if (texto == "") {
        alert("Escreva um feedback antes de enviar.");
        return;
    }

    if (texto.length > 2000) {
        alert("O feedback deve ter no máximo 2000 caracteres.");
        return;
    }

    if (idEditando == null) {

        // Impede feedback duplicado
        for (var i = 0; i < feedbacks.length; i++) {
            if (feedbacks[i].idPublicacao == idPublicacao) {
                alert("Você já enviou um feedback para esta publicação.");
                return;
            }
        }

        // Gera um ID para o novo feedback
        var novoId = 1;

        for (var i = 0; i < feedbacks.length; i++) {
            if (feedbacks[i].id >= novoId) {
                novoId = feedbacks[i].id + 1;
            }
        }

        var novoFeedback = {
            id: novoId,
            idPublicacao: Number(idPublicacao),
            texto: texto,
            status: "Enviado"
        };

        feedbacks.push(novoFeedback);

        alert("Feedback enviado com sucesso!");

    } else {

        // Atualiza o feedback existente
        for (var i = 0; i < feedbacks.length; i++) {
            if (feedbacks[i].id == idEditando) {
                feedbacks[i].texto = texto;
            }
        }

        alert("Feedback atualizado com sucesso!");
    }

    voltarLista();
}


// ==========================================
// VISUALIZAR FEEDBACK
// ==========================================

function visualizarFeedback(id) {
    for (var i = 0; i < feedbacks.length; i++) {

        if (feedbacks[i].id == id) {

            var feedback = feedbacks[i];
            var publicacao = buscarPublicacao(feedback.idPublicacao);

            document.getElementById("tela-lista").hidden = true;
            document.getElementById("tela-formulario").hidden = true;
            document.getElementById("tela-detalhe").hidden = false;

            document.getElementById("btn-adicionar").hidden = true;

            document.getElementById("detalhe-titulo").textContent =
                publicacao.titulo;

            document.getElementById("detalhe-publicacao").textContent =
                publicacao.titulo;

            document.getElementById("detalhe-roteirista").textContent =
                publicacao.roteirista;

            document.getElementById("detalhe-status").textContent =
                feedback.status;

            document.getElementById("detalhe-texto").textContent =
                feedback.texto;

            break;
        }
    }
}

// ==========================================
// EDITAR FEEDBACK
// ==========================================

function editarFeedback(id) {
    for (var i = 0; i < feedbacks.length; i++) {
        if (feedbacks[i].id == id) {
            idEditando = id;

            document.getElementById("tela-lista").hidden = true;
            document.getElementById("tela-formulario").hidden = false;

            document.getElementById("btn-adicionar").hidden = true;

            document.getElementById("titulo-formulario").innerHTML =
                "Editar feedback";

            document.getElementById("btn-salvar").innerHTML =
                "Salvar alterações";

            // Carrega a publicação do feedback
            var publicacao = buscarPublicacao(feedbacks[i].idPublicacao);

            var select = document.getElementById("select-publicacao");

            select.innerHTML = "";

            var opcao = document.createElement("option");
            opcao.value = publicacao.id;
            opcao.textContent = publicacao.titulo +
                " — " + publicacao.roteirista;

            select.appendChild(opcao);

            // Não permite trocar a publicação durante a edição
            select.disabled = true;

            document.getElementById("input-feedback").value =
                feedbacks[i].texto;

            contarCaracteres();

            break;
        }
    }
}


// ==========================================
// EXCLUIR FEEDBACK
// ==========================================

function excluirFeedback(id) {
    var confirmar = confirm(
        "Tem certeza que deseja excluir este feedback?"
    );

    if (confirmar == true) {
        for (var i = 0; i < feedbacks.length; i++) {
            if (feedbacks[i].id == id) {
                feedbacks.splice(i, 1);
                break;
            }
        }

        listarFeedbacks();

        alert("Feedback excluído com sucesso!");
    }
}


// ==========================================
// VOLTAR PARA A LISTAGEM
// ==========================================

function voltarLista() {
    document.getElementById("tela-lista").hidden = false;
    document.getElementById("tela-formulario").hidden = true;
    document.getElementById("tela-detalhe").hidden = true;

    document.getElementById("btn-adicionar").hidden = false;

    idEditando = null;

    listarFeedbacks();
}


// ==========================================
// INICIAR PÁGINA
// ==========================================

listarFeedbacks();
