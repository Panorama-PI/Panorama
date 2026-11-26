package com.panorama.cronjob.service;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.model.PendenciaEmailEnvio;
import com.panorama.mail.service.EmailService;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class CronService {

    private static final Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final EmailConfig config;
    private final EmailService emailService;
    private final EmailDao emailDao;

    public CronService() {
        this.config = new EmailConfig(
                "smtp.gmail.com",
                "587",
                getEnv("EMAIL"),
                getEnv("PASSWORD")
        );
        this.emailService = new EmailService(config);
        this.emailDao = new EmailDao();
    }

    public void start() {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("[INFO] Encerrando worker de e-mails...");
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(10, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }));

        scheduler.scheduleWithFixedDelay(() -> {
            try {
                List<PendenciaEmailEnvio> pendentes = emailDao.verificarEmailPendente();

                if (pendentes.isEmpty()) {
                    System.out.println("[DEBUG] Nenhum email pendente encontrado...");
                    return;
                }

                for (PendenciaEmailEnvio pendente : pendentes) {
                    Boolean enviado = emailService.enviarEmail(pendente);
                    if (Boolean.TRUE.equals(enviado)) {
                        System.out.println("[DEBUG] Email enviado com sucesso");
                    }
                }
            } catch (Exception e) {
                System.err.println("[ERRO] Erro ao enviar e-mail: " + e.getMessage());
                e.printStackTrace();
            }
        }, 0, 15, TimeUnit.SECONDS);
    }

    



    private static String getEnv(String key) {
        String val = dotenv.get(key);
        return (val != null && !val.isBlank()) ? val : System.getenv(key);
    }
}
