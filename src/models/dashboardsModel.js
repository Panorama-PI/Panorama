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
    produtorEspecificaKpiPeriodoPico
};
