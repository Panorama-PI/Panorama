package com.panorama.mail;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.model.*;
import com.panorama.mail.service.EmailService;
import io.github.cdimascio.dotenv.Dotenv;

import java.time.LocalDate;
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
                    emailService.enviarEmail(pendente);
                    System.out.println("E-mail enviado com sucesso!");
                }
            }
                // LEMBRETES SEMANAIS DOS PRODUTORES


                List<ResumoProdutorEmail> produtores =
                        emailDao.buscarProdutoresPendentes();

                LocalDate periodoInicio =
                        LocalDate.now().minusDays(7);

                LocalDate periodoFim =
                        LocalDate.now();

                for (ResumoProdutorEmail produtor : produtores) {

                    emailService.enviarLembreteProdutor(produtor);

                    emailDao.marcarEnvioSemanal(
                            produtor.getId(),
                            "LEMBRETE_PRODUTOR",
                            periodoInicio,
                            periodoFim
                    );

                    System.out.println(
                            "Lembrete enviado para o produtor: "
                            + produtor.getNome()
                    );
                }

                // RESUMOS SEMANAIS DOS ROTEIRISTAS

                List<ResumoRoteiristaEmail> roteiristas =
                        emailDao.buscarResumosRoteiristas();

                for (ResumoRoteiristaEmail roteirista : roteiristas) {

                    emailService.enviarResumoRoteirista(
                            roteirista,
                            periodoInicio,
                            periodoFim
                    );

                    emailDao.marcarEnvioSemanal(
                            roteirista.getId(),
                            "RESUMO_ROTEIRISTA",
                            periodoInicio,
                            periodoFim
                    );

                    System.out.println(
                            "Resumo semanal enviado para o roteirista: "
                            + roteirista.getNome()
                    );
                }

            } catch (Exception e) {

                System.err.println(
                        "Erro ao executar os envios de e-mail: "
                        + e.getMessage()
                );

                e.printStackTrace();
            }

        }, 0, 30, TimeUnit.SECONDS);

}
