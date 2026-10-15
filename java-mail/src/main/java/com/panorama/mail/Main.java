package com.panorama.mail;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.model.*;
import com.panorama.mail.service.EmailService;
import io.github.cdimascio.dotenv.Dotenv;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Main {
    private static Dotenv dotenv = Dotenv.load();

    public static void main(String[] args) {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

        EmailConfig config = new EmailConfig(
                "smtp.gmail.com",
                "587",
                dotenv.get("EMAIL"),
                dotenv.get("PASSWORD")
        );


        EmailService emailService = new EmailService(config);
        EmailDao emailDao = new EmailDao();

        scheduler.scheduleAtFixedRate(() ->{
            try {
                List<PendenciaEmailEnvio> pendentes = emailDao.verificarEmailPendente();
                for (PendenciaEmailEnvio pendente : pendentes) {
                    EmailMessage message = new EmailMessage(
                            "Teste de E-mail via POO",
                            "Olá! Este e-mail foi enviado com sucesso utilizando a estrutura por pacotes."
                    );
                    emailService.enviarEmail(message,pendente);
                    System.out.println("E-mail enviado com sucesso!");
                    emailDao.marcarComoEnviado(pendente.getToken().getToken());
                }
            } catch (Exception e) {
                System.err.println("Erro ao enviar e-mail: " + e.getMessage());
                e.printStackTrace();
            }
        }, 0, 30, TimeUnit.SECONDS);

    }
}
