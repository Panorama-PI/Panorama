var dashboardsModel = require("../models/dashboardsModel");

const { BadRequestError } = require("../errors");

// Quantidade de itens em cada gráfico
var LIMITE_GENEROS = 6;
var LIMITE_TOP = 5;

// ---------------------------------------------------------------------
function produtorGeral(req, res, next) {
    Promise.all([
        dashboardsModel.produtorGeralLucroGenero(LIMITE_GENEROS),      // r[0]
        dashboardsModel.produtorGeralRoiGenero(LIMITE_GENEROS),        // r[1]
        dashboardsModel.produtorGeralTaxaSucesso(LIMITE_GENEROS),      // r[2]
        dashboardsModel.produtorGeralOrcamentoGenero(LIMITE_GENEROS),  // r[3]
        dashboardsModel.produtorGeralPeriodoLucro(),                   // r[4]
        dashboardsModel.produtorGeralKpiGeneroMaisLucrativo(),         // r[5]
        dashboardsModel.produtorGeralKpiGeneroMaiorRoi(),              // r[6]
        dashboardsModel.produtorGeralKpiGeneroMaiorRisco(),            // r[7]
        dashboardsModel.produtorGeralKpiMelhorMes()                    // r[8]
    ])
        .then(function (r) {
            var lucro = r[0];
            var roi = r[1];
            var taxa = r[2];
            var orcamento = r[3];
            var periodo = r[4];

            // Cada KPI fica null se a view vier vazia
            var kpis = {
                generoMaisLucrativo: null,
                generoMaiorRoi: null,
                generoMaiorRisco: null,
                melhorMes: null
            };

            // KPI 1: gênero mais lucrativo (compara com o 2º colocado)
            if (r[5].length > 0) {
                var kpiLucro = r[5][0];
                var segundoGenero = null;
                var vantagem = null;

                if (lucro.length > 1 && Number(lucro[1].lucro_total) > 0) {
                    segundoGenero = lucro[1].genero;
                    vantagem = Math.round((Number(kpiLucro.lucro_total) / Number(lucro[1].lucro_total) - 1) * 100);
                }

                kpis.generoMaisLucrativo = {
                    genero: kpiLucro.genero,
                    lucro_total: Number(kpiLucro.lucro_total),
                    segundo_genero: segundoGenero,
                    vantagem_pct: vantagem
                };
            }

            // KPI 2: gênero com maior ROI (compara com a média geral)
            if (r[6].length > 0 && roi.length > 0) {
                var mediaRoi = Number(roi[0].media_geral);

                kpis.generoMaiorRoi = {
                    genero: r[6][0].genero,
                    roi: Number(r[6][0].roi),
                    media_geral: mediaRoi,
                    diferenca: Math.round((Number(r[6][0].roi) - mediaRoi) * 10) / 10
                };
            }

            // KPI 3: gênero de maior risco (compara com a média de filmes sem lucro)
            if (r[7].length > 0 && taxa.length > 0) {
                var mediaSemLucro = Math.round((100 - Number(taxa[0].media_geral)) * 10) / 10;

                kpis.generoMaiorRisco = {
                    genero: r[7][0].genero,
                    pct_sem_lucro: Number(r[7][0].pct_sem_lucro),
                    media_pct_sem_lucro: mediaSemLucro,
                    diferenca_pontos: Math.round((Number(r[7][0].pct_sem_lucro) - mediaSemLucro) * 10) / 10
                };
            }

            // KPI 4: melhor mês (compara com a média anual)
            if (r[8].length > 0 && periodo.length > 0) {
                var mediaAnual = Number(periodo[0].media_anual);
                var vantagemMes = null;

                if (mediaAnual > 0) {
                    vantagemMes = Math.round((Number(r[8][0].lucro_medio) / mediaAnual - 1) * 100);
                }

                kpis.melhorMes = {
                    nome_mes: r[8][0].nome_mes,
                    lucro_medio: Number(r[8][0].lucro_medio),
                    vantagem_pct: vantagemMes
                };
            }

            // Os gráficos vão do jeito que vieram das views (o front converte e formata)
            res.json({
                kpis: kpis,
                graficos: {
                    lucroGenero: lucro,
                    roiGenero: roi,
                    taxaSucesso: taxa,
                    orcamentoGenero: orcamento,
                    periodoLucro: periodo
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}


function produtorEspecifica(req, res, next) {
    var genero = req.query.genero;

    if (!genero || typeof genero !== "string" || genero.trim() === "" || genero.length > 100) {
        return next(new BadRequestError("Informe o gênero na query string (?genero=Action)."));
    }

    genero = genero.trim();

    Promise.all([
        dashboardsModel.produtorEspecificaPaisLucro(genero, LIMITE_TOP),         // r[0]
        dashboardsModel.produtorEspecificaAtoresAparicoes(genero, LIMITE_TOP),   // r[1]
        dashboardsModel.produtorEspecificaAtoresLucro(genero, LIMITE_TOP),       // r[2]
        dashboardsModel.produtorEspecificaPeriodoLucro(genero),                  // r[3]
        dashboardsModel.produtorEspecificaLucroTotalGenero(genero),              // r[4]
        dashboardsModel.produtorEspecificaKpiPaisMaisLucrativo(genero),          // r[5]
        dashboardsModel.produtorEspecificaKpiAtorMaisAparicoes(genero),          // r[6]
        dashboardsModel.produtorEspecificaKpiPeriodoPico(genero)                 // r[7]
    ])
        .then(function (r) {
            var atoresAparicoes = r[1];
            var periodo = r[3];

            var kpis = {
                paisMaisLucrativo: null,
                atorMaisAparicoes: null,
                periodoPico: null
            };

            // KPI 1: país mais lucrativo (quanto % do lucro do gênero ele representa)
            if (r[5].length > 0) {
                var pctDoGenero = null;

                if (r[4].length > 0 && Number(r[4][0].lucro_total) > 0) {
                    pctDoGenero = Math.round(Number(r[5][0].lucro_total) / Number(r[4][0].lucro_total) * 100);
                }

                kpis.paisMaisLucrativo = {
                    pais: r[5][0].pais,
                    lucro_total: Number(r[5][0].lucro_total),
                    pct_do_genero: pctDoGenero
                };
            }

            // KPI 2: ator com mais aparições (compara com o 2º colocado)
            if (r[6].length > 0) {
                var segundoAtor = null;
                var diferenca = null;

                if (atoresAparicoes.length > 1) {
                    segundoAtor = atoresAparicoes[1].ator;
                    diferenca = Number(r[6][0].aparicoes) - Number(atoresAparicoes[1].aparicoes);
                }

                kpis.atorMaisAparicoes = {
                    ator: r[6][0].ator,
                    aparicoes: Number(r[6][0].aparicoes),
                    segundo_ator: segundoAtor,
                    diferenca: diferenca
                };
            }

            // KPI 3: período de pico (compara com a média anual do gênero)
            if (r[7].length > 0 && periodo.length > 0) {
                var mediaAnual = Number(periodo[0].media_anual);
                var vantagem = null;

                if (mediaAnual > 0) {
                    vantagem = Math.round((Number(r[7][0].lucro_medio_periodo) / mediaAnual - 1) * 100);
                }

                kpis.periodoPico = {
                    periodo: r[7][0].periodo,
                    lucro_medio_periodo: Number(r[7][0].lucro_medio_periodo),
                    vantagem_pct: vantagem
                };
            }

            res.json({
                genero: genero,
                kpis: kpis,
                graficos: {
                    paisLucro: r[0],
                    atoresAparicoes: atoresAparicoes,
                    atoresLucro: r[2],
                    periodoLucro: periodo
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}

// ---------------------------------------------------------------------
// ROTEIRISTA
// ---------------------------------------------------------------------

// Quanto "valor" está acima de "base", em % (ex.: 8,4 vs 7,6 -> 10,5).
// Devolve null quando não dá para calcular (base zerada ou ausente).
function calcularVantagem(valor, base, casas) {
    if (base === null || base === undefined || Number(base) <= 0) {
        return null;
    }

    var fator = Math.pow(10, casas);
    return Math.round((Number(valor) / Number(base) - 1) * 100 * fator) / fator;
}

function roteiristaEspecifica(req, res, next) {
    var genero = req.query.genero;

    if (!genero || typeof genero !== "string" || genero.trim() === "" || genero.length > 100) {
        return next(new BadRequestError("Informe o gênero na query string (?genero=Action)."));
    }

    genero = genero.trim();

    Promise.all([
        dashboardsModel.roteiristaEspecificaNotaPais(genero, LIMITE_TOP),             // r[0]
        dashboardsModel.roteiristaEspecificaGenerosAssociados(genero, LIMITE_TOP),    // r[1]
        dashboardsModel.roteiristaEspecificaPalavras(genero, LIMITE_TOP),             // r[2]
        dashboardsModel.roteiristaEspecificaDistribuicaoNotas(genero),                // r[3]
        dashboardsModel.roteiristaEspecificaKpiPctPositivas(genero),                  // r[4]
        dashboardsModel.roteiristaEspecificaPctPositivasReferencia(),                 // r[5]
        dashboardsModel.roteiristaEspecificaKpiPaisMelhorNota(genero),                // r[6]
        dashboardsModel.roteiristaEspecificaKpiPalavraRecorrente(genero),             // r[7]
        dashboardsModel.roteiristaEspecificaKpiGeneroAssociado(genero)                // r[8]
    ])
        .then(function (r) {
            var notaPais = r[0];
            var generosAssociados = r[1];
            var palavras = r[2];

            var kpis = {
                pctPositivas: null,
                paisMelhorNota: null,
                palavraMaisRecorrente: null,
                generoAssociado: null
            };

            // KPI 1: % de filmes com avaliação positiva (compara com o % de todos os gêneros)
            if (r[4].length > 0) {
                var referencia = null;

                if (r[5].length > 0 && r[5][0].pct_referencia !== null) {
                    referencia = Number(r[5][0].pct_referencia);
                }

                kpis.pctPositivas = {
                    pct_positivas: Number(r[4][0].pct_positivas),
                    qtd_positivas: Number(r[4][0].qtd_positivas),
                    qtd_filmes: Number(r[4][0].qtd_filmes),
                    pct_referencia: referencia,
                    vantagem_pct: calcularVantagem(r[4][0].pct_positivas, referencia, 0)
                };
            }

            // KPI 2: país com melhor média (compara com o 2º colocado do gráfico)
            if (r[6].length > 0) {
                var segundoPais = null;
                var vantagemPais = null;

                if (notaPais.length > 1) {
                    segundoPais = notaPais[1].pais;
                    vantagemPais = calcularVantagem(r[6][0].nota_media, notaPais[1].nota_media, 1);
                }

                kpis.paisMelhorNota = {
                    pais: r[6][0].pais,
                    nota_media: Number(r[6][0].nota_media),
                    segundo_pais: segundoPais,
                    vantagem_pct: vantagemPais
                };
            }

            // KPI 3: palavra mais recorrente (compara com o 2º colocado do gráfico)
            if (r[7].length > 0) {
                var segundaPalavra = null;
                var vantagemPalavra = null;

                if (palavras.length > 1) {
                    segundaPalavra = palavras[1].palavra;
                    vantagemPalavra = calcularVantagem(r[7][0].ocorrencias, palavras[1].ocorrencias, 1);
                }

                kpis.palavraMaisRecorrente = {
                    palavra: r[7][0].palavra,
                    ocorrencias: Number(r[7][0].ocorrencias),
                    segunda_palavra: segundaPalavra,
                    vantagem_pct: vantagemPalavra
                };
            }

            // KPI 4: gênero mais associado (compara com o 2º colocado do gráfico)
            if (r[8].length > 0) {
                var segundoGenero = null;
                var vantagemGenero = null;

                if (generosAssociados.length > 1) {
                    segundoGenero = generosAssociados[1].genero_associado;
                    vantagemGenero = calcularVantagem(r[8][0].percentual, generosAssociados[1].percentual, 1);
                }

                kpis.generoAssociado = {
                    genero: r[8][0].genero_associado,
                    percentual: Number(r[8][0].percentual),
                    segundo_genero: segundoGenero,
                    vantagem_pct: vantagemGenero
                };
            }

            res.json({
                genero: genero,
                kpis: kpis,
                graficos: {
                    notaPais: notaPais,
                    generosAssociados: generosAssociados,
                    palavras: palavras,
                    distribuicaoNotas: r[3]
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
            next(erro);
        });
}





module.exports = {
    produtorGeral,
    produtorEspecifica,
    roteiristaEspecifica
};
