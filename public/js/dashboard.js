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
        font: { size: 16, weight: 'bold' },
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
        font: { size: 12 },
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
            ctx.font = "bold 11px 'Barlow', sans-serif";
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