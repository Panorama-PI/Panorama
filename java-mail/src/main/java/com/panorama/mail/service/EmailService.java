package com.panorama.mail.service;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.model.EmailMessage;
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

    public void enviarEmail(EmailMessage emailMessage) throws MessagingException {
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
        message.setText(emailMessage.getBody());

        Transport.send(message);
    }

}
