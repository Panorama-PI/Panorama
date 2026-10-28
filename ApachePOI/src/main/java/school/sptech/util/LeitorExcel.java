package school.sptech.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.ss.usermodel.*;
import school.sptech.dao.LogDao;
import school.sptech.model.Filme;
import school.sptech.model.Log;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class LeitorExcel {

    private static final Logger log = LogManager.getLogger(LeitorExcel.class);

    public List<Filme> extrairFilmes(Sheet sheet, DataFormatter formatador) throws SQLException {
        List<Filme> listaDeFilmes = new ArrayList<>();

        Integer totalLinhas = sheet.getLastRowNum();
        Integer linhasLidas = 0;
        Integer linhasNulas = 0;
        Integer falhasConversao = 0;

        LogDao logDao = new LogDao();
        Log logInicio = new Log("INFO", "LeitorExcel",
                String.format("Iniciando importação da planilha. Total de linhas detectadas: %d", totalLinhas));
        logDao.inserirLog(logInicio);
        System.out.println(logInicio);
        
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row linha = sheet.getRow(i);

            if (linha != null) {

                try {
                    Filme filme = new Filme();


                    String nomeBruto = lerTexto(linha.getCell(0), formatador);
                    filme.setNome(TratamentoUtils.repararEncoding(nomeBruto));


                    filme.setDataLancamento(lerTexto(linha.getCell(1), formatador));


                    filme.setScore(converterParaInteiro(lerTexto(linha.getCell(2), formatador)));


                    String textoGeneros = lerTexto(linha.getCell(3), formatador);
                    filme.setGeneros(TratamentoUtils.extrairGeneros(textoGeneros));


                    String sinopseBruta = lerTexto(linha.getCell(4), formatador);
                    filme.setSinopse(TratamentoUtils.repararEncoding(sinopseBruta));


                    String textoElenco = lerTexto(linha.getCell(5), formatador);
                    filme.setElenco(TratamentoUtils.extrairElenco(textoElenco));


                    String tituloBruto = lerTexto(linha.getCell(6), formatador);
                    filme.setTituloOriginal(TratamentoUtils.repararEncoding(tituloBruto));


                    filme.setStatus(lerTexto(linha.getCell(7), formatador));
                    filme.setIdiomaOriginal(lerTexto(linha.getCell(8), formatador));
                    filme.setOrcamento(converterParaDouble(lerTexto(linha.getCell(9), formatador)));
                    filme.setReceita(converterParaDouble(lerTexto(linha.getCell(10), formatador)));
                    filme.setPais(lerTexto(linha.getCell(11), formatador));

                    if (linhasLidas % 500 == 0) {
                        Log logProgresso = new Log("INFO", "LeitorExcel",
                                String.format("Progresso da leitura: %d linhas processadas...", linhasLidas));
                        logDao.inserirLog(logProgresso);
                        System.out.println(logProgresso);
                    }

                    listaDeFilmes.add(filme);
                    linhasLidas++;
                } catch (Exception e) {
                    falhasConversao++;
                    Log logErroLinha = new Log("WARN", "LeitorExcel",
                            String.format("Erro ao processar linha %d: %s", (i + 1), e.getMessage()));
                    logDao.inserirLog(logErroLinha);
                    System.out.println(logErroLinha);
                }
            }else{
                linhasNulas++;
                Log logNull = new Log("WARN", "LeitorExcel",
                        String.format("Linha %d da planilha está nula", (i + 1)));
                logDao.inserirLog(logNull);
                System.out.println(logNull);
            }
        }

        List<Filme> listaFiltrada = removerDuplicados(listaDeFilmes);

        Integer duplicadosRemovidos = listaDeFilmes.size() - listaFiltrada.size();

        if (duplicadosRemovidos > 0) {
            Log logDuplicados = new Log("WARN", "LeitorExcel",
                    String.format("Foram identificados e removidos %d filmes duplicados", duplicadosRemovidos));
            logDao.inserirLog(logDuplicados);
            System.out.println(logDuplicados);
        }

        Log logFim = new Log("INFO", "LeitorExcel", String.format(
                "Importação concluída. Lidos com sucesso: %d | Duplicados: %d | Falhas: %d | Linhas nulas: %d | Total final: %d",
                linhasLidas, duplicadosRemovidos, falhasConversao, linhasNulas, listaFiltrada.size()
        ));
        logDao.inserirLog(logFim);
        System.out.println(logFim);

        return listaFiltrada;
    }

    

    private String lerTexto(Cell celula, DataFormatter formatador) {
        if (celula == null) return null;
        String texto = formatador.formatCellValue(celula).trim();
        return texto.isEmpty() ? null : texto;
    }

    private Integer converterParaInteiro(String texto) {
        if (texto == null) return null;
        try {
            return (int) Double.parseDouble(texto);
        } catch (Exception e) {
            return null;
        }
    }

    private Double converterParaDouble(String texto) {
        if (texto == null) return null;
        try {
            return Double.parseDouble(texto);
        } catch (Exception e) {
            return null;
        }
    }

    
    private List<Filme> removerDuplicados(List<Filme> filmes) {
        List<Filme> listaLimpa = new ArrayList<>();

        for (Filme filmeAtual : filmes) {
            boolean jaExiste = false;

            for (Filme filmeLimpo : listaLimpa) {
                
                if (filmeAtual.getTituloOriginal() != null &&
                        filmeAtual.getTituloOriginal().equals(filmeLimpo.getTituloOriginal())) {
                    jaExiste = true;
                    break;
                }
            }

            
            if (!jaExiste) {
                listaLimpa.add(filmeAtual);
            }
        }
        return listaLimpa;
    }
}