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

        LogDao logDao = new LogDao();
        Log log = new Log("INFO", "LeitorExcel", "Iniciando importação da base de dados");
        logDao.inserirLog(log);
        System.out.println(log);
        
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row linha = sheet.getRow(i);

            if (linha != null) {
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

                listaDeFilmes.add(filme);
            }else{
                Log logNull = new Log("WARN", "LeitorExcel", "A linha da base está nula");
                logDao.inserirLog(log);
                System.out.println(log);
            }
        }

        return removerDuplicados(listaDeFilmes);
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