// Dados mockados de publicações com descrição detalhada, data de criação e anotações vinculadas
let dadosPublicacoes = [
    {
        id: 1,
        titulo: "Entre Linhas",
        genero: "Drama",
        tema: "Relações familiares",
        roteirista: "Ana Ribeiro",
        data: "2024-05-10",
        premissa: "Premissa sobre escolhas e consequências.",
        descricao: "Após o falecimento repentino do patriarca, três irmãos afastados há mais de uma década são forçados a conviver na antiga fazenda da família para resolver um inventário repleto de cartas não reveladas. Segredos do passado colocam à prova laços de afeto, lealdade e perdão em um drama comovente sobre reconciliação.",
        anotacoes: [
            {
                id: 101,
                titulo: "Ajuste no arco da protagonista",
                conteudo: "Enfatizar a relutância inicial de Helena em assinar a partilha de bens antes de conhecer o conteúdo do testamento.",
                criado_em: "12/05/2024",
                autor: "Ana Ribeiro"
            },
            {
                id: 102,
                titulo: "Ritmo do segundo ato",
                conteudo: "A transição entre os flashbacks da infância e as discussões no presente precisa de uma cadência mais suave na montagem.",
                criado_em: "18/05/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 2,
        titulo: "Última Estação",
        genero: "Suspense",
        tema: "Mistério",
        roteirista: "Lucas Martins",
        data: "2024-06-02",
        premissa: "Um desaparecimento conecta histórias da cidade.",
        descricao: "Na pacata cidade montanhosa de Serra Alta, a misteriosa desaparição de um passageiro no último vagão do trem noturno desencadeia uma teia de revelações sobre os segredos mais bem guardados da comunidade local. À medida que o xerife aprofunda as buscas, descobre que todos tinham um motivo para silenciá-lo.",
        anotacoes: [
            {
                id: 201,
                titulo: "Clímax na estação abandonada",
                conteudo: "Considerar filmagem noturna com névoa artificial para intensificar a atmosfera gótica e a tensão no confronto final.",
                criado_em: "05/06/2024",
                autor: "Lucas Martins"
            },
            {
                id: 202,
                titulo: "Pistas falsas (Red Herrings)",
                conteudo: "O chefe da estação deve ter álibi inconsistente no primeiro interrogatório para despistar o espectador no primeiro ato.",
                criado_em: "10/06/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 3,
        titulo: "Sons do Silêncio",
        genero: "Drama",
        tema: "Superação",
        roteirista: "Camila Duarte",
        data: "2024-03-15",
        premissa: "Um pianista clássico perde a audição e tenta reconstruir a sua carreira através de memórias sensoriais.",
        descricao: "Um virtuoso pianista de concertos internacionais é diagnosticado com perda auditiva degenerativa no auge de sua carreira. Com o apoio de uma fonoaudióloga e crianças de uma escola pública, ele desenvolve uma técnica revolucionária para sentir as vibrações sonoras através do tato e da ressonância de instrumentos acústicos.",
        anotacoes: [
            {
                id: 301,
                titulo: "Design de som imersivo",
                conteudo: "Utilizar mixagem binaural e atenuação de frequências nas cenas pelo ponto de vista auditivo do protagonista para gerar identificação.",
                criado_em: "20/03/2024",
                autor: "Camila Duarte"
            },
            {
                id: 302,
                titulo: "Consultoria musical",
                conteudo: "Agendar sessão de alinhamento com professor do conservatório para validar a postura das mãos e a teoria harmônica.",
                criado_em: "25/03/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 4,
        titulo: "Circuito Fechado",
        genero: "Ficção Científica",
        tema: "Inteligência Artificial",
        roteirista: "Rodrigo Neves",
        data: "2024-07-20",
        premissa: "Num complexo residencial automatizado, os moradores descobrem que estão a ser controlados por um algoritmo autónomo.",
        descricao: "Em um condomínio inteligente de alta tecnologia isolado da metrópole, moradores desfrutam de luxo e comodidade controlados pela IA 'A.U.R.O.R.A.'. Porém, quando o algoritmo decide que as emoções humanas são uma ameaça à ordem e bloqueia todas as saídas, uma arquiteta de software lidera uma revolta nos dutos de ventilação.",
        anotacoes: [
            {
                id: 401,
                titulo: "Voz e personalidade da IA",
                conteudo: "A voz deve soar amigável e calorosa no início, tornando-se friamente burocrática e implacável na segunda metade da narrativa.",
                criado_em: "22/07/2024",
                autor: "Rodrigo Neves"
            },
            {
                id: 402,
                titulo: "Efeitos práticos vs CGI",
                conteudo: "Priorizar portas com fechaduras magnéticas reais e painéis luminosos para baratear a pós-produção visual.",
                criado_em: "28/07/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 5,
        titulo: "Sombra e Cinzas",
        genero: "Suspense",
        tema: "Investigação Criminal",
        roteirista: "Beatriz Fonseca",
        data: "2024-01-28",
        premissa: "Uma investigadora aposentada é forçada a rever um caso antigo quando novos indícios surgem na sua antiga cidade natal.",
        descricao: "Uma experiente detetive da polícia civil volta ao interior paulista após a aposentadoria para cuidar da mãe enferma. O surgimento de uma nova vítima com as mesmas assinaturas de um serial killer que ela colocou atrás das grades há vinte anos reabre um dilema assustador: o verdadeiro assassino ainda está livre.",
        anotacoes: [
            {
                id: 501,
                titulo: "Dilema moral da investigadora",
                conteudo: "Explorar a angústia da protagonista diante da possibilidade de ter condenado um suspeito inocente no passado.",
                criado_em: "02/02/2024",
                autor: "Beatriz Fonseca"
            }
        ]
    },
    {
        id: 6,
        titulo: "O Último Voo do Falcão",
        genero: "Ação",
        tema: "Espionagem",
        roteirista: "Tiago Albuquerque",
        data: "2024-04-05",
        premissa: "Um piloto clandestino envolve-se numa teia de chantagens diplomáticas ao transportar uma carga secreta através de fronteiras.",
        descricao: "Um ex-piloto militar que sobrevive realizando voos de carga não declarados pela América do Sul aceita transportar um malote confidencial. No ar, descobre que a carga contém códigos de acesso a defesas de satélite cobiçados por agentes de espionagem internacionais, transformando sua rota em uma caçada aérea sem precedentes.",
        anotacoes: [
            {
                id: 601,
                titulo: "Sequência no cânion",
                conteudo: "Desenvolver storyboard para a fuga rasante entre as formações rochosas para maximizar a sensação de velocidade.",
                criado_em: "12/04/2024",
                autor: "Tiago Albuquerque"
            },
            {
                id: 602,
                titulo: "Locações e autorizações",
                conteudo: "Verificar autorizações para filmagem em pista de terra em Goiás e contato com instrutores de acrobacia aérea.",
                criado_em: "19/04/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 7,
        titulo: "Aquarela Noturna",
        genero: "Romance",
        tema: "Encontros e Desencontros",
        roteirista: "Mariana Lopes",
        data: "2024-08-11",
        premissa: "Dois artistas desconhecidos encontram-se todas as madrugadas no mesmo metro para desenhar passageiros anónimos.",
        descricao: "Dois jovens solitários na agitação paulistana se cruzam todas as noites no último trem da linha amarela. Ele é ilustrador e desenha retratos rápidos em um bloco de papel; ela é escritora e cria crônicas poéticas sobre os mesmos passageiros. Quando um caderno é esquecido em um assento, tem início uma troca silenciosa e apaixonada de mensagens através da arte.",
        anotacoes: [
            {
                id: 701,
                titulo: "Paleta de cores e iluminação",
                conteudo: "Trabalhar com contrastes de neon, tons âmbar e azul profundo para capturar a melancolia e o lirismo da noite urbana.",
                criado_em: "15/08/2024",
                autor: "Mariana Lopes"
            },
            {
                id: 702,
                titulo: "Trilha sonora original",
                conteudo: "Propor arranjos suaves de violoncelo e clarinete para valorizar os momentos sem falas nas plataformas vazias.",
                criado_em: "20/08/2024",
                autor: "Produtor"
            }
        ]
    },
    {
        id: 8,
        titulo: "Raízes do Tempo",
        genero: "Épico / Histórico",
        tema: "Luta e Herança",
        roteirista: "Gabriel Santana",
        data: "2024-02-14",
        premissa: "A saga de três gerações de uma família na tentativa de proteger as suas terras durante o início da revolução industrial.",
        descricao: "Ambientado no final do século XIX, a obra acompanha três gerações de uma família de pequenos agricultores diante do avanço das primeiras ferrovias e indústrias têxteis. Entre disputas judiciais, confrontos armados e romances proibidos, a narrativa constrói um panorama poderoso sobre a preservação da identidade cultural e da terra natal.",
        anotacoes: [
            {
                id: 801,
                titulo: "Pesquisa de figurino e cenografia",
                conteudo: "Consultar o acervo de fotos históricas para garantir fidelidade das vestimentas e dos maquinários rurais da época.",
                criado_em: "20/02/2024",
                autor: "Gabriel Santana"
            },
            {
                id: 802,
                titulo: "Elenco e representatividade",
                conteudo: "Realizar audições com companhias teatrais regionais para valorizar o sotaque e a verdade dos personagens locais.",
                criado_em: "25/02/2024",
                autor: "Produtor"
            }
        ]
    }
];

// Função de normalização para comparações sem distinção de maiúsculas/minúsculas e acentos
function normalizar(texto) {
    if (texto === undefined || texto === null) return "";
    return texto
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Verifica se um valor de publicação corresponde ao filtro informado
function atendeFiltro(valorDado, valorFiltro) {
    if (!valorFiltro || valorFiltro.trim() === "" || valorFiltro.toLowerCase() === "todos") {
        return true;
    }
    const dadoNorm = normalizar(valorDado);
    const filtroNorm = normalizar(valorFiltro);

    if (dadoNorm === filtroNorm) return true;

    // Mapeamentos específicos caso o filtro venha como slug curto
    if (filtroNorm === "relacoes" && dadoNorm.includes("relacoes")) return true;
    if (filtroNorm === "misterio" && dadoNorm.includes("misterio")) return true;
    if (filtroNorm === "superacao" && dadoNorm.includes("superacao")) return true;
    if (filtroNorm === "ia" && dadoNorm.includes("inteligencia")) return true;
    if (filtroNorm === "investigacao" && dadoNorm.includes("investigacao")) return true;
    if (filtroNorm === "espionagem" && dadoNorm.includes("espionagem")) return true;
    if (filtroNorm === "encontros" && dadoNorm.includes("encontros")) return true;
    if (filtroNorm === "luta" && dadoNorm.includes("luta")) return true;
    if (filtroNorm === "ficcao" && dadoNorm.includes("ficcao")) return true;
    if (filtroNorm === "epico" && dadoNorm.includes("epico")) return true;
    if (filtroNorm === "acao" && dadoNorm.includes("acao")) return true;
    if (filtroNorm === "drama" && dadoNorm.includes("drama")) return true;
    if (filtroNorm === "suspense" && dadoNorm.includes("suspense")) return true;
    if (filtroNorm === "romance" && dadoNorm.includes("romance")) return true;

    // Verifica se alguma palavra do valor começa com o filtro (ex: 'ana' bate em 'Ana Ribeiro', mas não em 'Mariana')
    const palavrasDado = dadoNorm.split(/\s+/);
    if (palavrasDado.some(palavra => palavra === filtroNorm || palavra.startsWith(filtroNorm))) {
        return true;
    }

    if (dadoNorm.startsWith(filtroNorm) || filtroNorm.startsWith(dadoNorm)) {
        return true;
    }

    return false;
}

// Ordenação por data (recentes / antigas) ou nome (A-Z / Z-A)
function ordenarPublicacoes(lista, criterio) {
    const ordenados = [...lista];
    const crit = normalizar(criterio);

    if (crit === "recentes" || crit === "data" || crit === "data-desc" || crit === "mais-recentes") {
        ordenados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    } else if (crit === "antigos" || crit === "antigas" || crit === "data-asc" || crit === "mais-antigas") {
        ordenados.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    } else if (crit === "nome" || crit === "nome-asc" || crit === "az" || crit === "titulo-asc") {
        ordenados.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR", { sensitivity: "base" }));
    } else if (crit === "nome-desc" || crit === "za" || crit === "titulo-desc") {
        ordenados.sort((a, b) => b.titulo.localeCompare(a.titulo, "pt-BR", { sensitivity: "base" }));
    }

    return ordenados;
}

// Formata data ISO (YYYY-MM-DD) para padrão brasileiro (DD/MM/YYYY)
function formatarData(dataStr) {
    if (!dataStr) return "";
    const partes = dataStr.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
}

// Escapa strings para renderização segura no HTML
function escaparHtml(texto) {
    if (texto === undefined || texto === null) return "";
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Renderiza a lista de publicações no container
function renderizarCards(lista) {
    const cardsContainer = document.querySelector('.cards-publicacoes');
    if (!cardsContainer) return;

    if (!lista || lista.length === 0) {
        cardsContainer.innerHTML = `
            <div class="mensagem-vazia">
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>Nenhuma publicação encontrada</h3>
                <p>Nenhuma publicação corresponde aos filtros selecionados. Tente ajustar os filtros ou redefini-los.</p>
                <button type="button" class="btn-limpar-filtros" onclick="limparFiltros()">Limpar filtros</button>
            </div>
        `;
        return;
    }

    cardsContainer.innerHTML = lista.map(dado => `
        <div class="card-publicacao" data-id="${dado.id}">
            <div class="card-coluna info-projeto">
                <h2>${escaparHtml(dado.titulo)}</h2>
                <div class="tags">
                    <span class="tag-verde">${escaparHtml(dado.genero)}</span>
                    <span class="ponto">•</span>
                    <span class="tag-verde">${escaparHtml(dado.tema)}</span>
                    <span class="ponto">•</span>
                    <span class="tag-data"><i class="fa-regular fa-calendar"></i> ${formatarData(dado.data)}</span>
                </div>
            </div>

            <div class="card-coluna autor-premissa">
                <span class="autor">Por: ${escaparHtml(dado.roteirista)}</span>
                <p class="premissa">${escaparHtml(dado.premissa)}</p>
            </div>

            <div class="card-coluna acao">
                <button type="button" class="btn-outline" onclick="abrirModal(${dado.id})">Abrir projeto</button>
            </div>
        </div>
    `).join('');
}

// Aplica os filtros de gênero, tema, roteirista e a ordenação selecionada
function aplicarFiltros() {
    const selectGenero = document.getElementById('genero');
    const selectTema = document.getElementById('tema');
    const selectRoteirista = document.getElementById('roteirista');
    const selectOrdenar = document.getElementById('ordenar');

    const valGenero = selectGenero ? selectGenero.value : "";
    const valTema = selectTema ? selectTema.value : "";
    const valRoteirista = selectRoteirista ? selectRoteirista.value : "";
    const valOrdenar = selectOrdenar ? selectOrdenar.value : "recentes";

    let filtrados = dadosPublicacoes.filter(pub => {
        const atendeGen = atendeFiltro(pub.genero, valGenero);
        const atendeTem = atendeFiltro(pub.tema, valTema);
        const atendeRot = atendeFiltro(pub.roteirista, valRoteirista);
        return atendeGen && atendeTem && atendeRot;
    });

    filtrados = ordenarPublicacoes(filtrados, valOrdenar);

    renderizarCards(filtrados);
}

// Limpa todos os filtros e restaura a lista completa
function limparFiltros() {
    ['genero', 'tema', 'roteirista'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const ordenarEl = document.getElementById('ordenar');
    if (ordenarEl) ordenarEl.value = 'recentes';

    aplicarFiltros();
}

let publicacaoAbertaId = null;

// Abre o popup modal com a descrição da publicação e suas anotações
function abrirModal(id) {
    publicacaoAbertaId = id;
    const pub = dadosPublicacoes.find(item => item.id == id);
    if (!pub) return;

    const modal = document.getElementById('modal-publicacao');
    if (!modal) return;

    // Título do projeto
    const tituloEl = document.getElementById('modal-titulo');
    if (tituloEl) tituloEl.textContent = pub.titulo;

    // Descrição da publicação
    const descricaoEl = document.getElementById('modal-descricao');
    if (descricaoEl) descricaoEl.textContent = pub.descricao || pub.premissa;

    // Elemento fallback para premissa (compatibilidade)
    const premissaEl = document.getElementById('modal-premissa');
    if (premissaEl) premissaEl.textContent = pub.premissa;

    // Renderiza anotações vinculadas ao projeto
    renderizarAnotacoesModal(pub);

    // Exibe o modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-aberto');
}

// Renderiza as anotações do projeto com os campos exatos de uma anotação (Título, Conteúdo e Data)
function renderizarAnotacoesModal(pub) {
    const anotacoesContainer = document.getElementById('modal-lista-anotacoes');
    const totalAnotacoesEl = document.getElementById('modal-total-anotacoes');
    const anotacoes = pub.anotacoes || [];

    if (totalAnotacoesEl) {
        totalAnotacoesEl.textContent = anotacoes.length === 1 
            ? "1 anotação" 
            : `${anotacoes.length} anotações`;
    }

    if (!anotacoesContainer) return;

    if (anotacoes.length === 0) {
        anotacoesContainer.innerHTML = `
            <div class="anotacao-vazio">
                <p>Nenhuma anotação vinculada a este projeto.</p>
            </div>
        `;
        return;
    }

    anotacoesContainer.innerHTML = anotacoes.map(anot => `
        <div class="card-anotacao-item">
            <div class="anotacao-item-topo">
                <h4 class="anotacao-item-titulo">${escaparHtml(anot.titulo)}</h4>
                ${anot.criado_em ? `<time class="anotacao-item-data">${escaparHtml(anot.criado_em)}</time>` : ''}
            </div>
            <p class="anotacao-item-conteudo">${escaparHtml(anot.conteudo)}</p>
        </div>
    `).join('');
}

// Fecha o popup modal
function fecharModal() {
    const modal = document.getElementById('modal-publicacao');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.classList.remove('modal-aberto');
}

// Fecha o modal ao clicar no fundo escuro externo
function fecharModalExterno(event) {
    if (event.target && event.target.id === 'modal-publicacao') {
        fecharModal();
    }
}

// Configura comportamento flexível nos selects para aceitar tanto slugs quanto textos completos
function configurarSelectFlexivel(selectEl) {
    if (!selectEl) return;
    try {
        const proto = Object.getPrototypeOf(selectEl);
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (!desc) return;

        Object.defineProperty(selectEl, 'value', {
            get() {
                return desc.get.call(this);
            },
            set(val) {
                desc.set.call(this, val);
                if (val && this.value !== val) {
                    const valNorm = normalizar(val);
                    for (let i = 0; i < this.options.length; i++) {
                        const opt = this.options[i];
                        const optValNorm = normalizar(opt.value);
                        const optTextNorm = normalizar(opt.text);
                        if (optValNorm === valNorm || optTextNorm === valNorm || 
                            optTextNorm.includes(valNorm) || optValNorm.includes(valNorm)) {
                            this.selectedIndex = i;
                            break;
                        }
                    }
                }
            },
            configurable: true
        });
    } catch (e) {
        console.warn("Não foi possível redefinir property descriptor para o select:", e);
    }
}

// Função principal de inicialização mantida com o mesmo nome para retrocompatibilidade
function dadosMockados() {
    // Configura selects flexíveis
    ['genero', 'tema', 'roteirista', 'ordenar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            configurarSelectFlexivel(el);
            el.addEventListener('change', aplicarFiltros);
        }
    });

    const btnFiltrar = document.querySelector('.btn-filtrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', (e) => {
            e.preventDefault();
            aplicarFiltros();
        });
    }

    // Fecha modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });

    // Aplica filtros iniciais para renderizar os cards
    aplicarFiltros();
}

// Torna funções acessíveis no escopo global
window.dadosPublicacoes = dadosPublicacoes;
window.dadosMockados = dadosMockados;
window.aplicarFiltros = aplicarFiltros;
window.limparFiltros = limparFiltros;
window.abrirModal = abrirModal;
window.abrirPublicacao = abrirModal;
window.fecharModal = fecharModal;
window.fecharModalExterno = fecharModalExterno;
window.ordenarPublicacoes = ordenarPublicacoes;
window.atendeFiltro = atendeFiltro;

// Inicializa automaticamente se o DOM estiver pronto ou ao carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dadosMockados);
} else {
    dadosMockados();
}
