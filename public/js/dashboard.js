 
// Configuração e funções usadas pelas duas telas de dashboard (geral e específica).
 
Chart.defaults.color = '#828282';
Chart.defaults.font.family = "'Barlow', sans-serif";
 
const COR_ROSA_BARRA = '#FF6B6B';
const COR_LINHA_GRID = '#2B2B2E';
 
// Título padrão dos gráficos (branco, negrito, alinhado à esquerda).
// comSubtitulo = true quando o gráfico tem o subtítulo verde logo abaixo:
function tituloGrafico(texto, comSubtitulo) {
    return {
        display: true,
        text: texto,
        color: '#FFFFFF',
        font: { size: 18, weight: 'bold' },
        align: 'start',
        padding: { top: 0, bottom: comSubtitulo ? 4 : 24 }
    };
}
 
// Subtítulo verde com o gênero escolhido (ou "Média Anual")
function subtituloGrafico(texto) {
    return {
        display: true,
        text: texto,
        color: '#34C759',
        align: 'start',
        font: { size: 13 },
        padding: { bottom: 24 }
    };
}
 
// Escreve o valor no fim de cada barra horizontal (ex.: "4,2x").
function pluginRotuloFimBarra(formatar) {
    return {
        id: 'rotuloFimBarra',
        afterDatasetsDraw(chart) {
            const ctx = chart.ctx;
            const barras = chart.getDatasetMeta(0).data;
            const valores = chart.data.datasets[0].data;
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = "bold 13px 'Barlow', sans-serif";
            ctx.textBaseline = 'middle';
            barras.forEach((barra, i) => ctx.fillText(formatar(valores[i]), barra.x + 8, barra.y));
            ctx.restore();
        }
    };
}
 
// Preenche nome e e-mail do usuário na barra lateral
function preencherUsuario() {
    const nome = sessionStorage.NOME_USUARIO;
    const email = sessionStorage.EMAIL_USUARIO;
    if (nome) document.getElementById('a_usuario').innerHTML = nome;
    if (email) document.getElementById('c_email').innerHTML = email;
}
 
 
// =====================================================================
// INTEGRAÇÃO COM A API (compartilhado pelas dashboards)
// =====================================================================
 
var BILHAO = 1000000000;
var MILHAO = 1000000;
 
// Busca JSON na API. Se o servidor responder com erro, cai no .catch de quem chamou.
function buscarDados(url) {
    return fetch(url).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Erro " + resposta.status + " ao consultar " + url);
        }
 
        return resposta.json();
    });
}
 
// O banco guarda os gêneros em inglês; a tela mostra em português.
var GENEROS_PT = {
    'Drama': 'Drama',
    'Action': 'Ação',
    'Science Fiction': 'Ficção Científica',
    'Adventure': 'Aventura',
    'Animation': 'Animação',
    'Family': 'Família',
    'Fantasy': 'Fantasia',
    'Comedy': 'Comédia',
    'Thriller': 'Suspense',
    'Crime': 'Crime',
    'Horror': 'Terror',
    'Mystery': 'Mistério',
    'History': 'História',
    'War': 'Guerra',
    'Documentary': 'Documentário',
    'Romance': 'Romance',
    'Music': 'Música',
    'Western': 'Faroeste',
    'TV Movie': 'Filme para TV'
};
 
function traduzirGenero(genero) {
    if (GENEROS_PT[genero]) {
        return GENEROS_PT[genero];
    }
 
    return genero;
}
 
// ---------- Formatação ----------
// 2.45 -> "2,5"
function formatarNumero(valor, casas) {
    if (casas === undefined) {
        casas = 1;
    }
 
    return Number(valor).toFixed(casas).replace('.', ',');
}
 
// 4800000000 -> "$ 4,8B" | 28000000 -> "$ 28,0M"
function formatarDinheiro(valor) {
    if (valor >= BILHAO) {
        return "$ " + formatarNumero(valor / BILHAO) + "B";
    }
 
    return "$ " + formatarNumero(valor / MILHAO) + "M";
}
 
// 12 -> "+12" | -3 -> "-3"
function comSinal(valor, casas) {
    if (casas === undefined) {
        casas = 0;
    }
 
    if (valor < 0) {
        return "-" + formatarNumero(Math.abs(valor), casas);
    }
 
    return "+" + formatarNumero(valor, casas);
}
 
// ---------- Montagem dos dados dos gráficos ----------
// As views devolvem várias linhas; estas funções tiram uma coluna de cada linha.
 
// Lista de números de uma coluna, já dividida (ex.: lucro / BILHAO)
function pegarNumeros(linhas, coluna, divisor) {
    var lista = [];
 
    for (var i = 0; i < linhas.length; i++) {
        lista.push(Number(linhas[i][coluna]) / divisor);
    }
 
    return lista;
}
 
function pegarGeneros(linhas) {
    var lista = [];
 
    for (var i = 0; i < linhas.length; i++) {
        lista.push(traduzirGenero(linhas[i].genero));
    }
 
    return lista;
}
 
function pegarPaises(linhas) {
    var lista = [];
 
    for (var i = 0; i < linhas.length; i++) {
        lista.push((linhas[i].pais));
    }
 
    return lista;
}
 
// "genius" -> "Genius" (as palavras das sinopses ficam minúsculas no banco)
function capitalizar(texto) {
    if (!texto) {
        return texto;
    }
 
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
 
function pegarPalavras(linhas) {
    var lista = [];
 
    for (var i = 0; i < linhas.length; i++) {
        lista.push(capitalizar(linhas[i].palavra));
    }
 
    return lista;
}
 
 
function pegarTextos(linhas, coluna) {
    var lista = [];
 
    for (var i = 0; i < linhas.length; i++) {
        lista.push(linhas[i][coluna]);
    }
 
    return lista;
}
 
// Sempre devolve 12 posições (JAN a DEZ). Mês sem filme fica null (lacuna na linha).
function pegarMeses(linhas, coluna, divisor) {
    var lista = [null, null, null, null, null, null, null, null, null, null, null, null];
 
    for (var i = 0; i < linhas.length; i++) {
        var posicao = Number(linhas[i].mes) - 1;
        lista[posicao] = Number(linhas[i][coluna]) / divisor;
    }
 
    return lista;
}
 
// Média que vem da view (repetida em todas as linhas, então pega da primeira)
function pegarMedia(linhas, coluna, divisor) {
    if (linhas.length == 0) {
        return null;
    }
 
    return Number(linhas[0][coluna]) / divisor;
}
 
// ---------- Tela ----------
// Escreve texto num elemento (textContent não interpreta HTML, então é seguro)
function setTexto(id, texto) {
    document.getElementById(id).textContent = texto;
}
 
// Valor verde do KPI com a unidade em <small> (ex.: "8,4 estrelas IMDb").
// Monta com textContent/createElement para não precisar de innerHTML.
function setValorKpi(id, valor, unidade) {
    var elemento = document.getElementById(id);
 
    elemento.textContent = valor + ' ';
 
    var small = document.createElement('small');
    small.textContent = unidade;
    elemento.appendChild(small);
}
 
// Linha de comparação do KPI (ex.: "10,5% acima da média").
// Sem texto, esconde a linha inteira (senão sobraria só a seta). "dica" vira o tooltip.
function setComparacaoKpi(id, texto, dica) {
    var elemento = document.getElementById(id);
 
    elemento.textContent = texto;
    elemento.title = dica || '';
    elemento.style.display = texto ? '' : 'none';
}
 
// Troca rótulos e valores de um gráfico já criado.
// "media" é a linha verde de média (use null para o gráfico calcular sozinho).
function atualizarGrafico(grafico, rotulos, valores, media) {
    grafico.data.labels = rotulos;
    grafico.data.datasets[0].data = valores;
    grafico.options.plugins.pluginMedia = { valor: media };
    grafico.update();
}