package com.panorama.mail;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.model.*;
import com.panorama.mail.service.EmailService;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Main {
    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    public static void main(String[] args) {
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

        EmailConfig config = new EmailConfig(
                "smtp.gmail.com",
                "587",
                config("EMAIL"),
                config("PASSWORD")
        );


        EmailService emailService = new EmailService(config);
        EmailDao emailDao = new EmailDao();

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[INFO] Encerrando worker de e-mails...");
            scheduler.shutdown();
        }));

        scheduler.scheduleWithFixedDelay(() -> {
            try {
                List<PendenciaEmailEnvio> pendentes = emailDao.verificarEmailPendente();
                for (PendenciaEmailEnvio pendente : pendentes) {
                    Boolean enviado = emailService.enviarEmail(pendente);

                    if(enviado){
                        System.out.println("[DEBUG] Email enviado com sucesso");
                    }
                }
                if (pendentes.isEmpty()) {
                    System.out.println("[DEBUG] Nenhum email pendente encontrado...");
                }
            } catch (Exception e) {
                System.err.println("[ERRO] Erro ao enviar e-mail: " + e.getMessage());
                e.printStackTrace();
            }
        }, 0, 15, TimeUnit.SECONDS);

    }

    private static String config(String key) {
        String value = System.getenv(key);
        return value != null && !value.isBlank() ? value : dotenv.get(key);
    }
}
