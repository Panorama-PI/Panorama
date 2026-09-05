package com.panorama;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class Log {

    String criarLog(String tipo,String usuario, String acao){
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss a");
        LocalDateTime data = LocalDateTime.now();

        String dataFormatada = data.format(formato);

        return String.format("[%s] [%s] %s %s ",dataFormatada,tipo,usuario,acao);
    }

    void visualizar(List<String> logs,String tipo){
        if(tipo.equals("ultimos")){
            visualizarUltimoslogs(logs);
        }else if(tipo.equals("primeiros")){
            visualizarLogs(logs);
        }
    }

    void visualizar(List<String> logs,String tipo, Integer quantidade){
        if(tipo.equals("ultimos")){
            visualizarUltimoslogs(logs,quantidade);
        }else if(tipo.equals("primeiros")){
            visualizarLogs(logs,quantidade);
        }
    }

    void visualizarLogs(List<String> logs){
        for(String log : logs){
            System.out.println(log);
        }
    }

    void visualizarLogs(List<String> logs, Integer quantidade){
        for (int i = 0; i < quantidade; i++) {
            System.out.println(logs.get(i));
        }
    }

    void visualizarUltimoslogs(List<String> logs){
        for (int i = logs.size() - 1; i >= 0; i--) {
            System.out.println(logs.get(i));
        }
    }

    void visualizarUltimoslogs(List<String> logs, Integer quantidade){
        for (int i = logs.size() - 1; i >= (logs.size() - quantidade); i--) {
            System.out.println(logs.get(i));
        }
    }
}
