

// DADOS MOCKADOS

// Limite de caracteres de um feedback (o produtor escreve até 2000).
var LIMITE_CARACTERES = 2000;

// Tempo que a carga simulada demora, para dar para ver o carregamento.
var ATRASO_SIMULADO_MS = 900;

// Aviso mostrado ao mexer no sininho. Apague quando a preferência for salva de verdade.
var AVISO_SIMULACAO = "Nesta etapa a preferência é apenas visual e ainda não é salva.";

var FEEDBACKS_MOCK = [
    {
        id: 1,
        publicacao: "O Último Farol",
        produtor: "Camila Duarte",
        data: "2026-10-22T14:32:00-03:00",
        conteudo: "Gostei muito da premissa e do ritmo do primeiro ato. Abrir a história com a protagonista já dentro do conflito prende a atenção e deixa claro, em poucas cenas, o que está em jogo para ela.\n\n" +
            "Pontos fortes\n" +
            "- A relação entre os dois irmãos tem tensão real e rende os melhores diálogos do material.\n" +
            "- O mundo da história é apresentado sem excesso de explicação, o que facilita a leitura.\n" +
            "- O final do segundo ato cria um bom gancho para a virada.\n\n" +
            "Pontos que precisam de ajuste\n" +
            "1. O objetivo da protagonista muda entre a cena 12 e a cena 18. Vale decidir qual é o desejo central e manter essa linha até a virada, senão o público perde a referência do que ela quer.\n" +
            "2. O vilão aparece tarde e pouco. Hoje ele é mais uma ameaça distante do que um personagem. Uma cena anterior ao meio da história, mostrando o ponto de vista dele, ajudaria a construir o conflito.\n" +
            "3. Há três cenas de exposição seguidas no começo do segundo ato. Tente espalhar essas informações em ação ou em conflito entre personagens.\n" +
            "4. O tom oscila entre drama e comédia sem uma regra clara. Se o humor faz parte da identidade do projeto, ele precisa aparecer desde o primeiro ato.\n\n" +
            "Sobre os diálogos\n" +
            "Os diálogos entre os irmãos são o ponto alto, mas alguns personagens secundários falam todos do mesmo jeito. Experimente dar a cada um uma forma própria de falar, com ritmo, vocabulário e manias diferentes, para que o leitor reconheça quem está falando mesmo sem o nome acima da fala.\n\n" +
            "Do ponto de vista de produção\n" +
            "O orçamento parece viável: poucas locações e elenco enxuto. A cena do porto, porém, pode custar bem mais do que o restante. Vale pensar em uma alternativa que preserve o efeito dramático com menos recursos.\n\n" +
            "Próximos passos: revisar o objetivo da protagonista, reforçar o vilão e enviar uma nova versão do primeiro e do segundo atos. Se fizer sentido, avalio essa versão em seguida. Parabéns pelo trabalho, o material tem muito potencial. Fico no aguardo da nova versão e à disposição para conversar."
    },
    {
        id: 2,
        publicacao: "Cartas de um Verão Incerto",
        produtor: "Rafael Monteiro",
        data: "2026-10-20T09:15:00-03:00",
        conteudo: "A voz narrativa é o ponto mais forte do material: as cartas dão intimidade sem pesar o ritmo.\n\nSugiro encurtar o terceiro bloco. Ele repete a ideia do segundo e atrasa a virada. Com esse corte, a história ganha fôlego."
    },
    {
        id: 3,
        publicacao: "Sinal Perdido",
        produtor: "Beatriz Nogueira",
        data: "2026-10-18T17:48:00-03:00",
        conteudo: "Conceito interessante, mas a explicação científica ocupa espaço demais. Prefira mostrar as consequências do sinal em vez de explicá-lo."
    },
    {
        id: 4,
        publicacao: "Entre Duas Margens",
        produtor: "Lucas Andrade",
        data: "2026-10-15T11:05:00-03:00",
        conteudo: "Ótimo uso das locações! Referência visual para o segundo ato: https://exemplo.com/referencias/entre-duas-margens/segundo-ato/moodboard-completo-com-paleta-de-cores-e-planos-sugeridos-versao-final-revisada-2026 (confira com calma, tem bastante coisa)."
    },
    {
        id: 5,
        publicacao: "A Casa dos Ecos",
        produtor: "Helena Prado",
        data: "2026-10-12T16:20:00-03:00",
        conteudo: "O suspense funciona, mas o final entrega a resposta cedo demais. Teste <b>adiar</b> a revelação para o último ato & manter a dúvida: \"quem estava na casa?\". Nota técnica: 5 < 7 e 7 > 3 não são tags, só símbolos."
    },
    {
        id: 6,
        publicacao: "Um título bem longo para testar a quebra de linha",
        produtor: "Camila Duarte",
        data: "2026-10-08T10:00:00-03:00",
        conteudo: "Feedback curto: o título está forte, mas o logline ainda não diz qual é o conflito principal."
    },
    {
        id: 7,
        publicacao: "Projeto Aurora, primeiro ato",
        produtor: "Rafael Monteiro",
        data: "2026-09-30T13:40:00-03:00",
        conteudo: "Boa estrutura de primeiro ato. Falta um incidente incitante mais claro por volta da cena 6. Hoje o público só entende o problema da protagonista na cena 9."
    }
];


// ---------------------------------------------------------------- ELEMENTOS DA TELA

var telaLista = document.getElementById("tela-lista");
var telaDetalhe = document.getElementById("tela-detalhe");

var estadoCarregando = document.getElementById("estado-carregando");
var estadoVazio = document.getElementById("estado-vazio");
var estadoErro = document.getElementById("estado-erro");
var botaoTentarNovamente = document.getElementById("btn-tentar-novamente");

var listaFeedbacks = document.getElementById("lista-feedbacks");
var contadorFeedbacks = document.getElementById("contador-feedbacks");
var avisoPagina = document.getElementById("aviso-pagina");

var botaoVoltar = document.getElementById("btn-voltar");
var detalheTitulo = document.getElementById("detalhe-titulo");
var detalheProdutor = document.getElementById("detalhe-produtor");
var detalheData = document.getElementById("detalhe-data");
var detalhePublicacao = document.getElementById("detalhe-publicacao");
var detalheTexto = document.getElementById("detalhe-texto");

var painelSino = document.getElementById("sino-painel");
var botaoSino = document.getElementById("sino-botao");
var sinoEstado = document.getElementById("sino-estado");
var sinoStatus = document.getElementById("sino-status");
var sinoMensagem = document.getElementById("sino-mensagem");


// ESTADO DA TELA

var feedbacks = [];
var feedbacksCarregados = false;
var ultimoBotaoUsado = null;      
var tentativasDeCarga = 0;
var simulacao = new URLSearchParams(window.location.search).get("estado");

// Preferência do sininho. Mockada: vale só enquanto a página está aberta.
var notificacoesAtivas = true;


// FUNÇÕES AUXILIARES

var formatoDataCurta = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo"
});

var formatoDataLonga = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo"
});

// Resume o texto para a listagem, cortando em uma palavra inteira.
function criarPrevia(texto, limite) {
    var limpo = String(texto).replace(/\s+/g, " ").trim();

    if (limpo.length <= limite) {
        return limpo;
    }

    var corte = limpo.slice(0, limite);
    var ultimoEspaco = corte.lastIndexOf(" ");

    if (ultimoEspaco > limite * 0.6) {
        corte = corte.slice(0, ultimoEspaco);
    }

    return corte.replace(/[\s.,;:!?-]+$/, "") + "…";
}

// Cria um elemento com texto. Usa textContent: o conteúdo dos feedbacks
function criarElemento(tag, classe, texto) {
    var elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }
    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

function mostrarAviso(texto) {
    avisoPagina.textContent = texto;
    avisoPagina.hidden = false;
}

function esconderAviso() {
    avisoPagina.textContent = "";
    avisoPagina.hidden = true;
}

// Mostra só um dos estados da listagem: carregando, vazio, erro ou lista.
function mostrarEstado(nome) {
    estadoCarregando.hidden = nome !== "carregando";
    estadoVazio.hidden = nome !== "vazio";
    estadoErro.hidden = nome !== "erro";
    listaFeedbacks.hidden = nome !== "lista";

    telaLista.setAttribute("aria-busy", nome === "carregando" ? "true" : "false");
}


// CARGA DOS FEEDBACKS

// INTEGRAÇÃO: trocar o corpo desta função por um fetch ao backend
// (por exemplo GET /feedbacks/recebidos), mantendo o retorno em Promise.
function buscarFeedbacks() {
    return new Promise(function (resolver, rejeitar) {

        // ?estado=carregando: a promessa nunca termina, só para ver o carregamento.
        if (simulacao === "carregando") {
            return;
        }

        setTimeout(function () {
            tentativasDeCarga++;

            // ?estado=erro: a primeira tentativa falha, a segunda funciona.
            if (simulacao === "erro" && tentativasDeCarga === 1) {
                rejeitar(new Error("Falha simulada"));
                return;
            }

            if (simulacao === "vazio") {
                resolver([]);
                return;
            }

            resolver(FEEDBACKS_MOCK.slice().sort(function (a, b) {
                return new Date(b.data) - new Date(a.data);
            }));
        }, ATRASO_SIMULADO_MS);
    });
}

function carregarFeedbacks() {
    feedbacksCarregados = false;
    mostrarEstado("carregando");

    buscarFeedbacks()
        .then(function (resultado) {
            feedbacks = resultado;
            feedbacksCarregados = true;

            if (feedbacks.length === 0) {
                mostrarEstado("vazio");
            } else {
                desenharLista();
                mostrarEstado("lista");
            }

            sincronizarTela();
        })
        .catch(function (erro) {
            console.log("Erro ao carregar os feedbacks:", erro.message);
            mostrarEstado("erro");
        });
}


// LISTAGEM

function desenharLista() {
    listaFeedbacks.textContent = "";

    feedbacks.forEach(function (feedback) {
        var item = criarElemento("li", "feedback-item");
        item.dataset.id = feedback.id;

        var corpo = criarElemento("div", "feedback-item-corpo");
        corpo.appendChild(criarElemento("h3", "feedback-item-titulo", feedback.publicacao));

        var meta = criarElemento("p", "feedback-item-meta");
        meta.appendChild(document.createTextNode("Produtor: "));
        meta.appendChild(criarElemento("strong", "", feedback.produtor));
        meta.appendChild(document.createTextNode(" · " + formatoDataCurta.format(new Date(feedback.data))));
        corpo.appendChild(meta);

        corpo.appendChild(criarElemento("p", "feedback-item-previa", criarPrevia(feedback.conteudo, 160)));

        var botao = criarElemento("button", "feedbacks-btn-secundario", "Ver feedback");
        botao.type = "button";
        botao.setAttribute("aria-label", "Ver feedback de " + feedback.produtor + " sobre " + feedback.publicacao);
        botao.addEventListener("click", function () {
            ultimoBotaoUsado = botao;
            abrirFeedback(feedback.id);
        });

        item.appendChild(corpo);
        item.appendChild(botao);
        listaFeedbacks.appendChild(item);
    });

    contadorFeedbacks.textContent = feedbacks.length === 1
        ? "1 feedback recebido"
        : feedbacks.length + " feedbacks recebidos";
}


// VISUALIZAÇÃO DETALHADA

// A navegação usa o endereço (#feedback-3): o botão "voltar" do navegador
// e links diretos funcionam sem recarregar a página.
function abrirFeedback(id) {
    window.location.hash = "feedback-" + id;
}

function voltarParaLista() {
    history.pushState("", document.title, window.location.pathname + window.location.search);
    sincronizarTela();
}

function mostrarDetalhe(feedback) {
    detalheTitulo.textContent = feedback.publicacao;
    detalhePublicacao.textContent = feedback.publicacao;
    detalheProdutor.textContent = feedback.produtor;
    detalheData.textContent = formatoDataLonga.format(new Date(feedback.data));
    detalheTexto.textContent = feedback.conteudo;

    telaLista.hidden = true;
    telaDetalhe.hidden = false;
    window.scrollTo(0, 0);

    detalheTitulo.focus();
}

function mostrarLista() {
    var vindoDoDetalhe = !telaDetalhe.hidden;

    telaDetalhe.hidden = true;
    telaLista.hidden = false;

    if (vindoDoDetalhe && ultimoBotaoUsado) {
        ultimoBotaoUsado.focus();
    }
}

// Decide qual tela mostrar de acordo com o endereço.
function sincronizarTela() {
    var encontrado = /^#feedback-(\d+)$/.exec(window.location.hash);

    if (!encontrado) {
        mostrarLista();
        return;
    }

    // Os dados ainda estão carregando: a lista aparece e o detalhe abre quando terminar.
    if (!feedbacksCarregados) {
        mostrarLista();
        return;
    }

    var id = Number(encontrado[1]);
    var feedback = feedbacks.find(function (f) { return f.id === id; });

    if (!feedback) {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
        mostrarLista();
        mostrarAviso("Não encontramos esse feedback. Escolha um da lista abaixo.");
        return;
    }

    esconderAviso();
    mostrarDetalhe(feedback);
}


// SININHO

// INTEGRAÇÃO: ao clicar, enviar a nova preferência ao backend
// (por exemplo PUT /usuarios/notificacoes) e só então atualizar a tela.
function atualizarSino() {
    botaoSino.setAttribute("aria-checked", String(notificacoesAtivas));
    painelSino.classList.toggle("sino-ativo", notificacoesAtivas);

    sinoEstado.textContent = notificacoesAtivas ? "Ativado" : "Desativado";
    sinoStatus.textContent = notificacoesAtivas
        ? "Você optou por receber notificações por e-mail."
        : "Você optou por não receber notificações por e-mail.";
}

function alternarSino() {
    notificacoesAtivas = !notificacoesAtivas;
    atualizarSino();

    // A escolha muda só os avisos por e-mail: a lista de feedbacks não é alterada.
    sinoMensagem.textContent = notificacoesAtivas
        ? "Notificações por e-mail ativadas. Você será avisado por e-mail sobre novos feedbacks. " + AVISO_SIMULACAO
        : "Notificações por e-mail desativadas. Você não receberá e-mails sobre novos feedbacks, mas todos continuam disponíveis aqui. " + AVISO_SIMULACAO;
}


// DADOS DO USUÁRIO NA BARRA LATERAL

function preencherUsuario() {
    var nome = sessionStorage.NOME_USUARIO;
    var email = sessionStorage.EMAIL_USUARIO;

    if (nome) {
        document.getElementById("a_usuario").textContent = nome;
    }
    if (email) {
        document.getElementById("c_email").textContent = email;
    }
}


// INICIALIZAÇÃO

botaoVoltar.addEventListener("click", voltarParaLista);
botaoTentarNovamente.addEventListener("click", carregarFeedbacks);
botaoSino.addEventListener("click", alternarSino);
window.addEventListener("hashchange", sincronizarTela);

preencherUsuario();
atualizarSino();
carregarFeedbacks();