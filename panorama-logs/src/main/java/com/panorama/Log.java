package com.panorama;

import java.text.spi.DateFormatProvider;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {

    String criarLog(String usuario, String acao){
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss a");
        LocalDateTime data = LocalDateTime.now();

        String dataFormatada = data.format(formato);

        return String.format("O %s fez %s, Data e Hora: %s ",usuario,acao,dataFormatada);
    }
}
