package com.panorama.mail.service;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.model.EmailMessage;
import com.panorama.mail.model.Empresa;
import com.panorama.mail.model.Token;
import com.panorama.mail.model.Usuario;
import jakarta.mail.MessagingException;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailService {
    private final EmailConfig config;

    public EmailService(EmailConfig config){
        this.config = config;
    }

    public void enviarEmail(EmailMessage emailMessage, Usuario usuario, Empresa empresa, Token token) throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", config.getHost());
        props.put("mail.smtp.port", config.getPort());

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(config.getUsername(), config.getPassword());
            }
        });

        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(config.getUsername()));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailMessage.getTo()));
        message.setSubject(emailMessage.getSubject());

        String htmlContent = "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
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
                "Olá, "+ usuario.getNome() +". a empresa " + empresa.getNome() + " solicitou um código de acesso para a sua conta no <strong>Panorama</strong>. Utilize o token abaixo para prosseguir:" +
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


        message.setContent(htmlContent, "text/html; charset=utf-8");

        Transport.send(message);
    }

}
