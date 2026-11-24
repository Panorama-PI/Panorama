package com.panorama.mail.service;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.dao.FeedbackDao;
import com.panorama.mail.dao.*;
import com.panorama.mail.model.*;
import jakarta.mail.MessagingException;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalTime;
import java.util.Properties;

public class EmailService {
    private final EmailConfig config;
    private EmailDao emailDao;
    private Session session;

    public EmailService(EmailConfig config){
        this.config = config;
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", config.getHost());
        props.put("mail.smtp.port", config.getPort());
        props.put("mail.smtp.connectiontimeout", "5000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        this.session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(config.getUsername(), config.getPassword());
            }
        });
    }

    public void enviarEmail(PendenciaEmailEnvio pendencia) throws MessagingException {
        String tipo = pendencia.getTipo();
        Integer status = pendencia.getStatus();
        Roteirista roteirista = pendencia.getRoteirista();
        Empresa empresa = pendencia.getEmpresa();

        if ("TOKEN".equals(tipo)) {
            Token token = pendencia.getToken();
            String assunto = "Envio do Token da Panorama";
            String html = htmlToken(empresa, token);

            dispararEmail(roteirista.getEmail(), assunto, html);
            new TokenDao().marcarComoEnviado(token.getToken());
            return;
        }

        if (!dentroDoHorarioPermitido(roteirista)) {
            return;
        }

        Produtor produtor = pendencia.getProdutor();

        if ("FEEDBACK".equals(tipo)) {
            Feedback feedback = pendencia.getFeedback();

            if (Integer.valueOf(2).equals(status)) {
                dispararEmail(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa te mandou um feedback",
                        htmlFeedback(roteirista, produtor, empresa)
                );
                new FeedbackDao().marcarComoEnviado(feedback.getId());

            } else if (Integer.valueOf(3).equals(status)) {
                dispararEmail(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa te editou um feedback",
                        htmlFeedbackEditado(roteirista, produtor, empresa)
                );
                new FeedbackDao().marcarComoEnviado(feedback.getId());
            }

        } else if ("AVALIACAO".equals(tipo)) {
            Avaliacao avaliacao = pendencia.getAvaliacao();

            if (Integer.valueOf(2).equals(status)) {
                dispararEmail(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa te mandou uma avaliação da publicação",
                        htmlAvaliacao(roteirista, produtor, empresa)
                );
                new AvaliacaoDao().marcarComoEnviado(avaliacao.getIdAvaliacao());
            } else if (Integer.valueOf(3).equals(status)) {
                dispararEmail(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa te editou uma avaliação da publicação",
                        htmlAvaliacaoEditada(roteirista, produtor, empresa)
                );
                new AvaliacaoDao().marcarComoEnviado(avaliacao.getIdAvaliacao());
            }
        }
    }

    private boolean dentroDoHorarioPermitido(Roteirista roteirista) {
        if (roteirista.getHorarioInicio() == null || roteirista.getHorarioFim() == null) {
            return true; // Ou false, dependendo da regra caso não tenha horário configurado
        }
        LocalTime agora = LocalTime.now();
        LocalTime inicio = roteirista.getHorarioInicio().toLocalTime();
        LocalTime fim = roteirista.getHorarioFim().toLocalTime();

        return !agora.isBefore(inicio) && !agora.isAfter(fim);
    }

    private void dispararEmail(String destinatario, String assunto, String htmlContent) throws MessagingException {

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(config.getUsername()));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
        message.setSubject(assunto);
        message.setContent(htmlContent, "text/html; charset=utf-8");

        Transport.send(message);
    }


    public String htmlFeedback(Roteirista roteirista, Produtor produtor, Empresa empresa){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Novo Feedback Recebido</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, <strong>" + roteirista.getNome() + "</strong>! A empresa <strong>" + empresa.getNome() + "</strong> informou que há um novo feedback feito pelo produtor <strong>" + produtor.getNome() + "</strong> na sua publicação." +
                "</p>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Acesse a plataforma <strong>Panorama</strong> para conferir os detalhes e interagir." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }


    public String htmlFeedbackEditado(Roteirista roteirista, Produtor produtor, Empresa empresa){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Feedback Editado</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, <strong>" + roteirista.getNome() + "</strong>! A empresa <strong>" + empresa.getNome() + "</strong> informou que o feedback feito pelo produtor <strong>" + produtor.getNome() + "</strong> na sua publicação foi atualizado." +
                "</p>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Acesse diretamente a plataforma <strong>Panorama</strong> para conferir as alterações." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }


    public String htmlToken(Empresa empresa, Token token){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Código de Verificação</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, a empresa " + empresa.getNome() + " solicitou um código de acesso para a sua conta no <strong>Panorama</strong>. Utilize o token abaixo para prosseguir:" +
                "</p>" +

                // <!-- CAIXA DESTAQUE DO TOKEN -->
                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"background-color: #1f1f1f; border: 2px dashed #e50914; border-radius: 8px; margin: 0 auto;\">" +
                "<tr>" +
                "<td style=\"padding: 20px 40px; text-align: center;\">" +
                "<span style=\"font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px;\">" +
                token.getToken() +
                "</span>" +
                "</td>" +
                "</tr>" +
                "</table>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Este código é válido por 15 minutos" +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Se você não solicitou este código, por favor ignore este e-mail. Nenhuma alteração será feita na sua conta." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }
    // LEMBRETE SEMANAL DO PRODUTOR

    public void enviarLembreteProdutor(
            ResumoProdutorEmail produtor
    ) throws MessagingException {

        String assunto = "Publicações aguardando sua avaliação - Panorama";

        String html = htmlLembreteProdutor(produtor);

        enviarHtml(produtor.getEmail(), assunto, html);
    }

    public String htmlLembreteProdutor(
            ResumoProdutorEmail produtor
    ) {

        return """
                <div style="background-color:#0b0b0b;padding:30px 0;
                font-family:Helvetica,Arial,sans-serif;color:#e0e0e0;">

                    <table align="center" border="0" cellpadding="0"
                    cellspacing="0" width="600"
                    style="background-color:#141414;border:1px solid #222;
                    border-radius:8px;overflow:hidden;">

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:25px 20px;
                            border-bottom:3px solid #e50914;">

                                <h1 style="color:#fff;margin:0;font-size:24px;
                                letter-spacing:2px;text-transform:uppercase;">
                                    Panorama
                                </h1>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;
                            background-color:#141414;text-align:center;">

                                <h2 style="color:#fff;font-size:20px;
                                margin-top:0;margin-bottom:15px;">
                                    Publicações aguardando avaliação
                                </h2>

                                <p style="color:#b3b3b3;font-size:15px;
                                line-height:1.6;">

                                    Olá, <strong style="color:#fff;">%s</strong>!

                                    Identificamos que você ainda possui
                                    publicações aguardando sua avaliação
                                    na plataforma Panorama.

                                </p>

                                <table align="center" cellpadding="0"
                                cellspacing="0"
                                style="background-color:#1f1f1f;
                                border:1px solid #333;border-radius:8px;
                                margin:25px auto;">

                                    <tr>
                                        <td align="center"
                                        style="padding:25px 45px;">

                                            <h1 style="color:#e50914;
                                            font-size:38px;margin:0;">

                                                %d

                                            </h1>

                                            <p style="color:#b3b3b3;
                                            font-size:13px;margin:8px 0 0;">

                                                Publicações pendentes

                                            </p>

                                        </td>
                                    </tr>

                                </table>

                                <p style="color:#b3b3b3;font-size:14px;
                                line-height:1.5;">

                                    Sua avaliação é importante para acompanhar
                                    o desempenho das publicações e contribuir
                                    com os roteiristas da sua empresa.

                                </p>

                                <p style="color:#e50914;font-size:14px;
                                font-weight:bold;margin-top:25px;">

                                    Acesse o Panorama e realize suas avaliações!

                                </p>


                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:20px;
                            border-top:1px solid #222;">

                                <p style="color:#666;font-size:12px;margin:0;">

                                    © 2026 Panorama. Todos os direitos reservados.

                                </p>

                            </td>
                        </tr>

                    </table>

                </div>
                """.formatted(
                escaparHtml(produtor.getNome()),
                produtor.getQuantidadePendentes()
        );
    }

    // RESUMO SEMANAL DO ROTEIRISTA

    public void enviarResumoRoteirista(
            ResumoRoteiristaEmail roteirista,
            LocalDate inicio,
            LocalDate fim
    ) throws MessagingException {

        String assunto = "Seu resumo semanal de avaliações - Panorama";

        String html = htmlResumoRoteirista(
                roteirista,
                inicio,
                fim
        );

        enviarHtml(roteirista.getEmail(), assunto, html);
    }

    public String htmlResumoRoteirista(
            ResumoRoteiristaEmail roteirista,
            LocalDate inicio,
            LocalDate fim
    ) {

        return """
                <div style="background-color:#0b0b0b;padding:30px 0;
                font-family:Helvetica,Arial,sans-serif;color:#e0e0e0;">

                    <table align="center" border="0" cellpadding="0"
                    cellspacing="0" width="600"
                    style="background-color:#141414;border:1px solid #222;
                    border-radius:8px;overflow:hidden;">

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:25px 20px;
                            border-bottom:3px solid #e50914;">

                                <h1 style="color:#fff;margin:0;font-size:24px;
                                letter-spacing:2px;text-transform:uppercase;">
                                    Panorama
                                </h1>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;
                            background-color:#141414;text-align:center;">

                                <h2 style="color:#fff;font-size:20px;
                                margin-top:0;margin-bottom:15px;">

                                    Resumo semanal das avaliações

                                </h2>

                                <p style="color:#b3b3b3;font-size:15px;
                                line-height:1.6;">

                                    Olá, <strong style="color:#fff;">%s</strong>!

                                    Confira o resumo das avaliações recebidas
                                    em suas publicações durante o período
                                    de <strong style="color:#e50914;">%s</strong>
                                    até <strong style="color:#e50914;">%s</strong>.

                                </p>

                                <table align="center" width="100%%"
                                cellpadding="0" cellspacing="10"
                                style="margin:25px auto;">

                                    <tr>

                                        <td align="center"
                                        style="background-color:#1f1f1f;
                                        border:1px solid #333;
                                        border-radius:8px;padding:20px;">

                                            <h1 style="color:#e50914;
                                            font-size:32px;margin:0;">

                                                %d

                                            </h1>

                                            <p style="color:#b3b3b3;
                                            font-size:12px;margin:8px 0 0;">

                                                Avaliações recebidas

                                            </p>

                                        </td>

                                        <td align="center"
                                        style="background-color:#1f1f1f;
                                        border:1px solid #333;
                                        border-radius:8px;padding:20px;">

                                            <h1 style="color:#e50914;
                                            font-size:32px;margin:0;">

                                                %d

                                            </h1>

                                            <p style="color:#b3b3b3;
                                            font-size:12px;margin:8px 0 0;">

                                                Publicações avaliadas

                                            </p>

                                        </td>

                                    </tr>

                                </table>

                                <table align="center" cellpadding="0"
                                cellspacing="0"
                                style="background-color:#1f1f1f;
                                border:1px solid #333;border-radius:8px;
                                margin:20px auto;">

                                    <tr>
                                        <td align="center"
                                        style="padding:20px 50px;">

                                            <p style="color:#b3b3b3;
                                            font-size:13px;margin:0;">

                                                Média das avaliações

                                            </p>

                                            <h1 style="color:#e50914;
                                            font-size:42px;margin:8px 0;">

                                                %.1f / 5

                                            </h1>

                                        </td>
                                    </tr>

                                </table>

                                <p style="color:#b3b3b3;font-size:14px;
                                line-height:1.5;margin-top:25px;">

                                    Continue acompanhando suas publicações
                                    e utilizando os resultados para aprimorar
                                    seus projetos.

                                </p>

                                <p style="color:#e50914;font-size:14px;
                                font-weight:bold;margin-top:25px;">

                                    Acesse o Panorama para acompanhar suas publicações!

                                </p>


                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:20px;
                            border-top:1px solid #222;">

                                <p style="color:#666;font-size:12px;margin:0;">

                                    © 2026 Panorama. Todos os direitos reservados.

                                </p>

                            </td>
                        </tr>

                    </table>

                </div>
                """.formatted(
                escaparHtml(roteirista.getNome()),
                inicio,
                fim,
                roteirista.getQuantidadeAvaliacoes(),
                roteirista.getPublicacoesAvaliadas(),
                roteirista.getMediaAvaliacoes()
        );
    }

}
