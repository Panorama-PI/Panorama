
var feedbacks = [];
var idEditando = null;
var salvando = false;

function listarFeedbacks() {
    var idProdutor = sessionStorage.ID_USUARIO;
    var lista = document.getElementById("lista-feedbacks");
    var contador = document.getElementById("contador-feedbacks");

    lista.innerHTML = "";
    contador.innerHTML = "Carregando feedbacks...";

    document.getElementById("estado-vazio").hidden = true;
    document.getElementById("container-tabela").hidden = true;

    fetch("/feedbacks/produtor/" + idProdutor)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log("Feedbacks recebidos:", dados);

                    feedbacks = dados.feedbacks || [];

                    renderizarFeedbacks();
                });
            } else {
                console.log("Erro ao buscar feedbacks.");

                contador.innerHTML = "Erro ao carregar feedbacks";

                alert("Não foi possível carregar os feedbacks.");
            }
        })
        .catch(function (erro) {
            console.log("Erro na requisição:", erro);

            contador.innerHTML = "Erro ao carregar feedbacks";

            alert("Erro ao conectar com o servidor.");
        });
}

function renderizarFeedbacks() {
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

            lista.innerHTML += `
                <tr class="feedback-linha-clicavel"
                    onclick="visualizarFeedback(${feedback.id})">

                    <td>${feedback.titulo}</td>

                    <td>${feedback.roteirista}</td>

                    <td>
                        <span class="feedbacks-status status-enviado">
                            Enviado
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

function abrirFormulario() {
    idEditando = null;

    document.getElementById("tela-lista").hidden = true;
    document.getElementById("tela-detalhe").hidden = true;
    document.getElementById("tela-formulario").hidden = false;

    document.getElementById("btn-adicionar").hidden = true;

    document.getElementById("titulo-formulario").innerHTML =
        "Adicionar novo feedback";

    document.getElementById("btn-salvar").innerHTML =
        "Enviar feedback";

    document.getElementById("input-feedback").value = "";

    contarCaracteres();
    carregarPublicacoes();
}

function carregarPublicacoes() {
    var idProdutor = sessionStorage.ID_USUARIO;
    var select = document.getElementById("select-publicacao");

    select.innerHTML =
        '<option value="">Carregando publicações...</option>';

    select.disabled = true;

    fetch("/feedbacks/produtor/" + idProdutor + "/publicacoes-disponiveis")
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    var publicacoes = dados.publicacoes || [];

                    select.innerHTML =
                        '<option value="">Selecione uma publicação</option>';

                    if (publicacoes.length == 0) {
                        select.innerHTML =
                            '<option value="">Nenhuma publicação disponível</option>';
                        return;
                    }

                    for (var i = 0; i < publicacoes.length; i++) {
                        var publicacao = publicacoes[i];

                        var opcao = document.createElement("option");

                        opcao.value = publicacao.id;
                        opcao.textContent =
                            publicacao.titulo + " — " + publicacao.roteirista;

                        select.appendChild(opcao);
                    }

                    select.disabled = false;
                });
            } else {
                console.log("Erro ao buscar publicações.");

                select.innerHTML =
                    '<option value="">Erro ao carregar publicações</option>';

                alert("Não foi possível carregar as publicações.");
            }
        })
        .catch(function (erro) {
            console.log("Erro na requisição:", erro);

            select.innerHTML =
                '<option value="">Erro ao carregar publicações</option>';

            alert("Erro ao conectar com o servidor.");
        });
}

function contarCaracteres() {
    var texto = document.getElementById("input-feedback").value;

    document.getElementById("contador-caracteres").innerHTML =
        texto.length + " / 2000 caracteres";
}

function salvarFeedback() {
    if (salvando == true) {
        return;
    }

    var idProdutor = sessionStorage.ID_USUARIO;
    var idPublicacao = document.getElementById("select-publicacao").value;
    var texto = document.getElementById("input-feedback").value.trim();
    var botao = document.getElementById("btn-salvar");

    if (idEditando == null && idPublicacao == "") {
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

    var url = "/feedbacks/produtor/" + idProdutor;
    var metodo = "POST";
    var corpo = {
        idPublicacao: Number(idPublicacao),
        texto: texto
    };

    if (idEditando != null) {
        url += "/" + idEditando;
        metodo = "PUT";

        corpo = {
            texto: texto
        };
    }

    salvando = true;
    botao.disabled = true;
    botao.innerHTML = "Enviando...";

    fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(corpo)
    })
        .then(function (resposta) {
            return resposta.json().then(function (dados) {
                if (resposta.ok) {
                    alert(dados.mensagem || "Feedback salvo com sucesso!");

                    voltarLista();
                } else {
                    alert(
                        dados.message ||
                        dados.mensagem ||
                        "Não foi possível salvar o feedback."
                    );
                }
            });
        })
        .catch(function (erro) {
            console.log("Erro ao salvar feedback:", erro);
            alert("Erro ao conectar com o servidor.");
        })
        .finally(function () {
            salvando = false;
            botao.disabled = false;

            if (idEditando == null) {
                botao.innerHTML = "Enviar feedback";
            } else {
                botao.innerHTML = "Salvar alterações";
            }
        });
}

function visualizarFeedback(id) {
    var idProdutor = sessionStorage.ID_USUARIO;

    fetch("/feedbacks/produtor/" + idProdutor + "/" + id)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    var feedback = dados.feedback;

                    document.getElementById("tela-lista").hidden = true;
                    document.getElementById("tela-formulario").hidden = true;
                    document.getElementById("tela-detalhe").hidden = false;

                    document.getElementById("btn-adicionar").hidden = true;

                    document.getElementById("detalhe-titulo").textContent =
                        feedback.titulo;

                    document.getElementById("detalhe-publicacao").textContent =
                        feedback.titulo;

                    document.getElementById("detalhe-roteirista").textContent =
                        feedback.roteirista;

                    document.getElementById("detalhe-status").textContent =
                        "Enviado";

                    document.getElementById("detalhe-texto").textContent =
                        feedback.texto;
                });
            } else {
                alert("Não foi possível carregar o feedback.");
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar feedback:", erro);
            alert("Erro ao conectar com o servidor.");
        });
}

function editarFeedback(id) {
    var idProdutor = sessionStorage.ID_USUARIO;

    fetch("/feedbacks/produtor/" + idProdutor + "/" + id)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    var feedback = dados.feedback;

                    idEditando = id;

                    document.getElementById("tela-lista").hidden = true;
                    document.getElementById("tela-detalhe").hidden = true;
                    document.getElementById("tela-formulario").hidden = false;

                    document.getElementById("btn-adicionar").hidden = true;

                    document.getElementById("titulo-formulario").innerHTML =
                        "Editar feedback";

                    document.getElementById("btn-salvar").innerHTML =
                        "Salvar alterações";

                    var select = document.getElementById("select-publicacao");

                    select.innerHTML = "";

                    var opcao = document.createElement("option");

                    opcao.value = feedback.idPublicacao;
                    opcao.textContent =
                        feedback.titulo + " — " + feedback.roteirista;

                    select.appendChild(opcao);

                    select.disabled = true;

                    document.getElementById("input-feedback").value =
                        feedback.texto;

                    contarCaracteres();
                });
            } else {
                alert("Não foi possível carregar o feedback para edição.");
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar feedback:", erro);
            alert("Erro ao conectar com o servidor.");
        });
}

function excluirFeedback(id) {
    var confirmar = confirm(
        "Tem certeza que deseja excluir este feedback?"
    );

    if (confirmar == false) {
        return;
    }

    var idProdutor = sessionStorage.ID_USUARIO;

    fetch("/feedbacks/produtor/" + idProdutor + "/" + id, {
        method: "DELETE"
    })
        .then(function (resposta) {
            return resposta.json().then(function (dados) {
                if (resposta.ok) {
                    alert(dados.mensagem || "Feedback excluído com sucesso!");

                    voltarLista();
                } else {
                    alert(
                        dados.message ||
                        dados.mensagem ||
                        "Não foi possível excluir o feedback."
                    );
                }
            });
        })
        .catch(function (erro) {
            console.log("Erro ao excluir feedback:", erro);
            alert("Erro ao conectar com o servidor.");
        });
}

function voltarLista() {
    document.getElementById("tela-lista").hidden = false;
    document.getElementById("tela-formulario").hidden = true;
    document.getElementById("tela-detalhe").hidden = true;

    document.getElementById("btn-adicionar").hidden = false;

    idEditando = null;

    listarFeedbacks();
}

if (sessionStorage.ID_USUARIO == null) {
    window.location.replace("/login.html");
} else {
    listarFeedbacks();
}
