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
// 3) ROTEIRISTA · VISÃO GERAL
// ---------------------------------------------------------------------
 
// Gráfico: Avaliação média x Gênero
// (nota_media já vem na escala 0-10, a mesma mostrada no front como "x / 10")
function roteiristaGeralNotaGenero(limite) {
    var instrucaoSql = `
        SELECT genero, nota_media, qtd_filmes, media_geral, ranking
        FROM vw_rot_geral_grafico_nota_genero
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}
 
// Gráfico: Avaliação média x País de origem (top 5)
// media_top5 = média dos países exibidos | media_geral = média de todos os países
function roteiristaGeralNotaPais(limite) {
    var instrucaoSql = `
        SELECT pais, nota_media, qtd_filmes, media_geral, media_top5, ranking
        FROM vw_rot_geral_grafico_nota_pais
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}
 
// Gráfico: Palavras mais frequentes nas sinopses (top 6)
function roteiristaGeralPalavras(limite) {
    var instrucaoSql = `
        SELECT palavra, ocorrencias, media_top6, ranking
        FROM vw_rot_geral_grafico_palavras
        WHERE ranking <= ?
        ORDER BY ranking
    `;
    return database.executar(instrucaoSql, [limite]);
}
 
// KPIs
function roteiristaGeralKpiGeneroMelhorNota() {
    var instrucaoSql = `
        SELECT genero, nota_media
        FROM vw_rot_geral_kpi_genero_melhor_nota
    `;
    return database.executar(instrucaoSql);
}
 
function roteiristaGeralKpiPaisMelhorNota() {
    var instrucaoSql = `
        SELECT pais, nota_media
        FROM vw_rot_geral_kpi_pais_melhor_nota
    `;
    return database.executar(instrucaoSql);
}
 
function roteiristaGeralKpiPalavraRecorrente() {
    var instrucaoSql = `
        SELECT palavra, ocorrencias
        FROM vw_rot_geral_kpi_palavra_recorrente
    `;
    return database.executar(instrucaoSql);
}
 
function roteiristaGeralKpiGeneroAssociado() {
    var instrucaoSql = `
        SELECT genero, total_associacoes
        FROM vw_rot_geral_kpi_genero_associado
    `;
    return database.executar(instrucaoSql);
}
 
// 2º gênero mais associado (usado só para o "X% acima do 2º lugar" do KPI).
// A view do KPI só devolve o 1º (LIMIT 1), então reaproveita a view base
// vw_base_genero_associacao com a MESMA ordenação, sem criar view nova.
function roteiristaGeralGeneroAssociadoSegundo() {
    var instrucaoSql = `
        SELECT genero, SUM(qtd_filmes) AS total_associacoes
        FROM vw_base_genero_associacao
        GROUP BY genero
        ORDER BY total_associacoes DESC, genero
        LIMIT 1 OFFSET 1
    `;
    return database.executar(instrucaoSql);
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
 
    roteiristaGeralNotaGenero,
    roteiristaGeralNotaPais,
    roteiristaGeralPalavras,
    roteiristaGeralKpiGeneroMelhorNota,
    roteiristaGeralKpiPaisMelhorNota,
    roteiristaGeralKpiPalavraRecorrente,
    roteiristaGeralKpiGeneroAssociado,
    roteiristaGeralGeneroAssociadoSegundo
};
 