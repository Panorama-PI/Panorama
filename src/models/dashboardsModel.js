var database = require("../database/config");



// Gráfico: Lucro x Gênero
function produtorGeralLucroGenero(limite) {
    var instrucaoSql = `
        SELECT genero, lucro_total, qtd_filmes, media_geral, ranking
        FROM vw_prod_geral_grafico_lucro_genero
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}

// Gráfico: ROI x Gênero
function produtorGeralRoiGenero(limite) {
    var instrucaoSql = `
        SELECT genero, roi, qtd_filmes, media_geral, ranking
        FROM vw_prod_geral_grafico_roi_genero
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}

// Gráfico: % de filmes com lucro x Gênero
function produtorGeralTaxaSucesso(limite) {
    var instrucaoSql = `
        SELECT genero, pct_com_lucro, pct_sem_lucro, qtd_filmes, media_geral, ranking
        FROM vw_prod_geral_grafico_pct_lucro_genero
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}

// Gráfico: Orçamento médio x Gênero
function produtorGeralOrcamentoGenero(limite) {
    var instrucaoSql = `
        SELECT genero, orcamento_medio, qtd_filmes, media_geral, ranking
        FROM vw_prod_geral_grafico_orcamento_genero
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}

// Gráfico: Lucro médio por mês de lançamento (ordenado de JAN a DEZ)
function produtorGeralPeriodoLucro() {
    var instrucaoSql = `
        SELECT mes, nome_mes, lucro_medio, qtd_filmes, media_anual
        FROM vw_prod_geral_grafico_periodo_lucro
        ORDER BY mes
    `;
    return database.executar(instrucaoSql);
}

// KPIs
function produtorGeralKpiGeneroMaisLucrativo() {
    var instrucaoSql = `
        SELECT genero, lucro_total
        FROM vw_prod_geral_kpi_genero_mais_lucrativo
    `;
    return database.executar(instrucaoSql);
}

function produtorGeralKpiGeneroMaiorRoi() {
    var instrucaoSql = `
        SELECT genero, roi
        FROM vw_prod_geral_kpi_genero_maior_roi
    `;
    return database.executar(instrucaoSql);
}

function produtorGeralKpiGeneroMaiorRisco() {
    var instrucaoSql = `
        SELECT genero, roi, pct_sem_lucro
        FROM vw_prod_geral_kpi_genero_maior_risco
    `;
    return database.executar(instrucaoSql);
}

function produtorGeralKpiMelhorMes() {
    var instrucaoSql = `
        SELECT mes, nome_mes, lucro_medio
        FROM vw_prod_geral_kpi_melhor_mes
    `;
    return database.executar(instrucaoSql);
}


// ---------------------------------------------------------------------
// 2) PRODUTOR · VISÃO ESPECÍFICA  (todas filtradas pelo gênero)
// ---------------------------------------------------------------------

// Gráfico: País x Lucro (top 5)
function produtorEspecificaPaisLucro(genero, limite) {
    var instrucaoSql = `
        SELECT pais, lucro_total, qtd_filmes, media_top5, ranking
        FROM vw_prod_esp_grafico_pais_lucro
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Atores x Aparições em filmes lucrativos (top 5)
function produtorEspecificaAtoresAparicoes(genero, limite) {
    var instrucaoSql = `
        SELECT ator, aparicoes, ranking
        FROM vw_prod_esp_grafico_atores_aparicoes
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Atores x Lucro (top 5)
function produtorEspecificaAtoresLucro(genero, limite) {
    var instrucaoSql = `
        SELECT ator, lucro_total, qtd_filmes, ranking
        FROM vw_prod_esp_grafico_atores_lucro
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Lucro médio por mês de lançamento do gênero (JAN a DEZ)
function produtorEspecificaPeriodoLucro(genero) {
    var instrucaoSql = `
        SELECT mes, nome_mes, lucro_medio, qtd_filmes, media_anual
        FROM vw_prod_esp_grafico_periodo_lucro
        WHERE genero = ?
        ORDER BY mes
    `;
    return database.executar(instrucaoSql, [genero]);
}

// Lucro total do gênero (usado só para calcular "Representa X% do lucro total do gênero")
// Reaproveita a view da visão geral, sem criar view nova.
function produtorEspecificaLucroTotalGenero(genero) {
    var instrucaoSql = `
        SELECT lucro_total
        FROM vw_prod_geral_grafico_lucro_genero
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

// KPIs
function produtorEspecificaKpiPaisMaisLucrativo(genero) {
    var instrucaoSql = `
        SELECT pais, lucro_total
        FROM vw_prod_esp_kpi_pais_mais_lucrativo
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

function produtorEspecificaKpiAtorMaisAparicoes(genero) {
    var instrucaoSql = `
        SELECT ator, aparicoes
        FROM vw_prod_esp_kpi_ator_mais_aparicoes
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

function produtorEspecificaKpiPeriodoPico(genero) {
    var instrucaoSql = `
        SELECT mes_inicio, mes_fim, periodo, lucro_medio_periodo
        FROM vw_prod_esp_kpi_periodo_pico
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

// ---------------------------------------------------------------------
// 3) ROTEIRISTA · VISÃO ESPECÍFICA  (todas filtradas pelo gênero)
// ---------------------------------------------------------------------

// Gráfico: Avaliação média x País de origem (top 5)
// media_genero = média de todos os países do gênero; media_top5 = média só dos 5 exibidos
function roteiristaEspecificaNotaPais(genero, limite) {
    var instrucaoSql = `
        SELECT pais, nota_media, qtd_filmes, media_genero, media_top5, ranking
        FROM vw_rot_esp_grafico_nota_pais
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Proporção de gêneros associados (top 5)
function roteiristaEspecificaGenerosAssociados(genero, limite) {
    var instrucaoSql = `
        SELECT genero_associado, qtd_filmes, percentual, ranking
        FROM vw_rot_esp_grafico_generos_associados
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Elementos narrativos (palavras) mais frequentes nas sinopses do gênero (top 5)
// ocorrencias = quantidade de sinopses do gênero que contêm a palavra
function roteiristaEspecificaPalavras(genero, limite) {
    var instrucaoSql = `
        SELECT palavra, ocorrencias, ranking
        FROM vw_rot_esp_grafico_palavras
        WHERE genero = ? AND ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [genero, limite]);
}

// Gráfico: Distribuição das avaliações por faixa de nota (ordem 1 a 5)
function roteiristaEspecificaDistribuicaoNotas(genero) {
    var instrucaoSql = `
        SELECT ordem, faixa, qtd_filmes, percentual
        FROM vw_rot_esp_grafico_distribuicao_notas
        WHERE genero = ?
        ORDER BY ordem
    `;
    return database.executar(instrucaoSql, [genero]);
}

// KPI: % de filmes com avaliação positiva no gênero
function roteiristaEspecificaKpiPctPositivas(genero) {
    var instrucaoSql = `
        SELECT pct_positivas, qtd_positivas, qtd_filmes
        FROM vw_rot_esp_kpi_pct_avaliacoes_positivas
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

// Referência do KPI acima: % de positivas somando todos os gêneros.
// Sai da mesma view do KPI (sem view nova). Atenção: um filme com vários gêneros
// entra uma vez por gênero, igual às outras views que usam vw_base_filme_genero.
function roteiristaEspecificaPctPositivasReferencia() {
    var instrucaoSql = `
        SELECT ROUND(100 * SUM(qtd_positivas) / SUM(qtd_filmes), 0) AS pct_referencia
        FROM vw_rot_esp_kpi_pct_avaliacoes_positivas
    `;
    return database.executar(instrucaoSql);
}

// KPI: país com melhor média de avaliações
function roteiristaEspecificaKpiPaisMelhorNota(genero) {
    var instrucaoSql = `
        SELECT pais, nota_media
        FROM vw_rot_esp_kpi_pais_melhor_nota
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

// KPI: palavra mais recorrente nas sinopses
function roteiristaEspecificaKpiPalavraRecorrente(genero) {
    var instrucaoSql = `
        SELECT palavra, ocorrencias
        FROM vw_rot_esp_kpi_palavra_recorrente
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}

// KPI: gênero mais associado
function roteiristaEspecificaKpiGeneroAssociado(genero) {
    var instrucaoSql = `
        SELECT genero_associado, percentual
        FROM vw_rot_esp_kpi_genero_associado
        WHERE genero = ?
    `;
    return database.executar(instrucaoSql, [genero]);
}




module.exports = {
  
    produtorGeralLucroGenero,
    produtorGeralRoiGenero,
    produtorGeralTaxaSucesso,
    produtorGeralOrcamentoGenero,
    produtorGeralPeriodoLucro,
    produtorGeralKpiGeneroMaisLucrativo,
    produtorGeralKpiGeneroMaiorRoi,
    produtorGeralKpiGeneroMaiorRisco,
    produtorGeralKpiMelhorMes,

    produtorEspecificaPaisLucro,
    produtorEspecificaAtoresAparicoes,
    produtorEspecificaAtoresLucro,
    produtorEspecificaPeriodoLucro,
    produtorEspecificaLucroTotalGenero,
    produtorEspecificaKpiPaisMaisLucrativo,
    produtorEspecificaKpiAtorMaisAparicoes,
    produtorEspecificaKpiPeriodoPico,

    roteiristaEspecificaNotaPais,
    roteiristaEspecificaGenerosAssociados,
    roteiristaEspecificaPalavras,
    roteiristaEspecificaDistribuicaoNotas,
    roteiristaEspecificaKpiPctPositivas,
    roteiristaEspecificaPctPositivasReferencia,
    roteiristaEspecificaKpiPaisMelhorNota,
    roteiristaEspecificaKpiPalavraRecorrente,
    roteiristaEspecificaKpiGeneroAssociado
};
