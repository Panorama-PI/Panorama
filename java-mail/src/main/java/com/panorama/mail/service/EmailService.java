package com.panorama.mail.service;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.dao.EmailDao;
import com.panorama.mail.dao.FeedbackDao;
import com.panorama.mail.dao.TokenDao;
import com.panorama.mail.model.*;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;
import java.time.LocalDate;

public class EmailService {

    private final EmailConfig config;

    public EmailService(EmailConfig config) {
        this.config = config;
    }

    // Configuração da sessão do JavaMail.
    private Session criarSessao() {

        Properties props = new Properties();

        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", config.getHost());
        props.put("mail.smtp.port", config.getPort());

        return Session.getInstance(props, new Authenticator() {

            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                        config.getUsername(),
                        config.getPassword()
                );
            }
        });
    }

    // Envio de mensagens HTML.
    private void enviarHtml(
            String destinatario,
            String assunto,
            String html
    ) throws MessagingException {

        Session session = criarSessao();

        Message message = new MimeMessage(session);

        message.setFrom(new InternetAddress(config.getUsername()));

        message.setRecipients(
                Message.RecipientType.TO,
                InternetAddress.parse(destinatario)
        );

        message.setSubject(assunto);

        message.setContent(html, "text/html; charset=utf-8");

        Transport.send(message);
    }

    // Mantém o fluxo dos e-mails antigos.
    public void enviarEmail(
            PendenciaEmailEnvio pendenciaEmailEnvio
    ) throws MessagingException {

        String tipo = pendenciaEmailEnvio.getTipo();

        Integer status = pendenciaEmailEnvio.getStatus();

        if (tipo.equals("TOKEN")) {

            TokenDao tokenDao = new TokenDao();

            Roteirista roteirista = pendenciaEmailEnvio.getRoteirista();

            Empresa empresa = pendenciaEmailEnvio.getEmpresa();

            Token token = pendenciaEmailEnvio.getToken();

            enviarHtml(
                    roteirista.getEmail(),
                    "Envio do Token da Panorama",
                    htmlToken(empresa, token)
            );

            tokenDao.marcarComoEnviado(token.getToken());

        } else if (tipo.equals("FEEDBACK")) {

            FeedbackDao feedbackDao = new FeedbackDao();

            Produtor produtor = pendenciaEmailEnvio.getProdutor();

            Roteirista roteirista = pendenciaEmailEnvio.getRoteirista();

            Feedback feedback = pendenciaEmailEnvio.getFeedback();

            Empresa empresa = pendenciaEmailEnvio.getEmpresa();

            if (status.equals(2)) {

                enviarHtml(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa te mandou um feedback",
                        htmlFeedback(roteirista, produtor, empresa)
                );

                feedbackDao.marcarComoEnviado(feedback.getId());

            } else if (status.equals(3)) {

                enviarHtml(
                        roteirista.getEmail(),
                        "Um produtor da sua empresa editou um feedback",
                        htmlFeedbackEditado(roteirista, produtor, empresa)
                );

                feedbackDao.marcarComoEnviado(feedback.getId());
            }
        }
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

                                <p style="color:#777;font-size:13px;
                                margin-top:30px;">

                                    Esta é uma mensagem automática.
                                    Por favor, não responda a este e-mail.

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

                                <p style="color:#777;font-size:13px;
                                margin-top:30px;">

                                    Esta é uma mensagem automática.
                                    Por favor, não responda a este e-mail.

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

    // E-MAILS FEEDBACK E TOKEN

    public String htmlFeedback(
            Roteirista roteirista,
            Produtor produtor,
            Empresa empresa
    ) {

        return """
                <div style="background-color:#0b0b0b;padding:30px 0;
                font-family:Helvetica,Arial,sans-serif;color:#e0e0e0;">

                    <table align="center" width="600"
                    style="background-color:#141414;border:1px solid #222;">

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:25px;
                            border-bottom:3px solid #e50914;">

                                <h1 style="color:#fff;margin:0;">Panorama</h1>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;text-align:center;">

                                <h2 style="color:#fff;">Novo Feedback Recebido</h2>

                                <p style="color:#b3b3b3;line-height:1.5;">

                                    Olá, <strong>%s</strong>!
                                    A empresa <strong>%s</strong> informou
                                    que há um novo feedback feito pelo produtor
                                    <strong>%s</strong> na sua publicação.

                                </p>

                                <p style="color:#888;font-size:13px;">
                                    Acesse a plataforma Panorama para conferir os detalhes.
                                </p>

                                <p style="color:#777;font-size:13px;">
                                    Esta é uma mensagem automática.
                                </p>

                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:20px;">

                                <p style="color:#666;font-size:12px;">
                                    © 2026 Panorama. Todos os direitos reservados.
                                </p>

                            </td>
                        </tr>

                    </table>
                </div>
                """.formatted(
                escaparHtml(roteirista.getNome()),
                escaparHtml(empresa.getNome()),
                escaparHtml(produtor.getNome())
        );
    }

    public String htmlFeedbackEditado(
            Roteirista roteirista,
            Produtor produtor,
            Empresa empresa
    ) {

        return """
                <div style="background-color:#0b0b0b;padding:30px 0;
                font-family:Helvetica,Arial,sans-serif;color:#e0e0e0;">

                    <table align="center" width="600"
                    style="background-color:#141414;border:1px solid #222;">

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:25px;
                            border-bottom:3px solid #e50914;">

                                <h1 style="color:#fff;margin:0;">Panorama</h1>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;text-align:center;">

                                <h2 style="color:#fff;">Feedback Editado</h2>

                                <p style="color:#b3b3b3;line-height:1.5;">

                                    Olá, <strong>%s</strong>!
                                    A empresa <strong>%s</strong> informou
                                    que o feedback feito pelo produtor
                                    <strong>%s</strong> na sua publicação
                                    foi atualizado.

                                </p>

                                <p style="color:#888;font-size:13px;">
                                    Acesse o Panorama para conferir as alterações.
                                </p>

                                <p style="color:#777;font-size:13px;">
                                    Esta é uma mensagem automática.
                                </p>

                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:20px;">

                                <p style="color:#666;font-size:12px;">
                                    © 2026 Panorama. Todos os direitos reservados.
                                </p>

                            </td>
                        </tr>

                    </table>
                </div>
                """.formatted(
                escaparHtml(roteirista.getNome()),
                escaparHtml(empresa.getNome()),
                escaparHtml(produtor.getNome())
        );
    }

    public String htmlToken(Empresa empresa, Token token) {

        return """
                <div style="background-color:#0b0b0b;padding:30px 0;
                font-family:Helvetica,Arial,sans-serif;color:#e0e0e0;">

                    <table align="center" width="600"
                    style="background-color:#141414;border:1px solid #222;">

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:25px;
                            border-bottom:3px solid #e50914;">

                                <h1 style="color:#fff;margin:0;">Panorama</h1>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;text-align:center;">

                                <h2 style="color:#fff;">Código de Verificação</h2>

                                <p style="color:#b3b3b3;line-height:1.5;">

                                    Olá! A empresa <strong>%s</strong>
                                    solicitou um código de acesso para sua conta.

                                </p>

                                <table align="center"
                                style="background-color:#1f1f1f;
                                border:2px dashed #e50914;margin:20px auto;">

                                    <tr>
                                        <td style="padding:20px 40px;">

                                            <span style="font-family:Courier New;
                                            font-size:36px;font-weight:bold;
                                            color:#fff;letter-spacing:8px;">

                                                %s

                                            </span>

                                        </td>
                                    </tr>

                                </table>

                                <p style="color:#888;font-size:13px;">
                                    Este código é válido por 15 minutos.
                                </p>

                                <p style="color:#777;font-size:13px;">
                                    Se você não solicitou este código, ignore este e-mail.
                                </p>

                            </td>
                        </tr>

                        <tr>
                            <td align="center"
                            style="background-color:#000;padding:20px;">

                                <p style="color:#666;font-size:12px;">
                                    © 2026 Panorama. Todos os direitos reservados.
                                </p>

                            </td>
                        </tr>

                    </table>
                </div>
                """.formatted(
                escaparHtml(empresa.getNome()),
                escaparHtml(token.getToken())
        );
    }

    // Evita que nomes e outros textos sejam interpretados como HTML.
    private String escaparHtml(String texto) {

        if (texto == null) {
            return "";
        }

        return texto
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}