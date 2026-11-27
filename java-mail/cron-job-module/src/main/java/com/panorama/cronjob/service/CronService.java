package com.panorama.cronjob.service;

import com.panorama.cronjob.exceptions.NullValueException;
import com.panorama.cronjob.model.PendenciaEmailEnvioCron;
import com.panorama.cronjob.model.Publicacao;
import com.panorama.cronjob.template.EmailTemplate;
import com.panorama.mail.config.EmailConfig;
import com.panorama.cronjob.dao.CronDao;
import com.panorama.mail.model.PendenciaEmailEnvio;
import com.panorama.mail.service.EmailService;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.mail.MessagingException;

import java.awt.desktop.PreferencesEvent;
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
    private final CronDao cronDao;

    public CronService() {
        this.config = new EmailConfig(
                "smtp.gmail.com",
                "587",
                getEnv("EMAIL"),
                getEnv("PASSWORD"));
        this.emailService = new EmailService(config);
        this.cronDao = new CronDao();
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
                List<PendenciaEmailEnvioCron> pendentes = cronDao.verificarPublicacoes();

                if (pendentes.isEmpty()) {
                    System.out.println("[DEBUG] Nenhum email pendente encontrado...");
                    return;
                }

                for (PendenciaEmailEnvioCron pendente : pendentes) {
                    Boolean enviado = enviarEmail(pendente);
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

    public boolean enviarEmail(PendenciaEmailEnvioCron pendente) {

        if (pendente == null) {
            throw new NullValueException("O email pendente está nulo");
        }

        String destinatario = pendente.getProdutor().getEmail();
        String assunto = "Você tem publicações não avaliadas";
        String htmlContent = EmailTemplate.htmlResumoPublicacoesPendentes(
                pendente.getProdutor(),
                pendente.getEmpresa(),
                pendente.getPublicacoes());

        try {
            emailService.dispararEmail(destinatario, assunto, htmlContent);
        } catch (MessagingException e) {
            return false;
        }

        return true;
    }

    private static String getEnv(String key) {
        String val = dotenv.get(key);
        return (val != null && !val.isBlank()) ? val : System.getenv(key);
    }
}
