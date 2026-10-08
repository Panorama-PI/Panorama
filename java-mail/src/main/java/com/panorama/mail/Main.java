package com.panorama.mail;

import com.panorama.mail.config.EmailConfig;
import com.panorama.mail.model.EmailMessage;
import com.panorama.mail.model.Empresa;
import com.panorama.mail.model.Token;
import com.panorama.mail.model.Usuario;
import com.panorama.mail.service.EmailService;

import java.time.LocalDateTime;

public class Main {
    public static void main(String[] args) {
        EmailConfig config = new EmailConfig(
                "smtp.gmail.com",
                "587",
                "exemplo@gmail.com",
                "senha-app"
        );

        Usuario usuario = new Usuario("Matheus","matheus.san.dev@gmail.com");

        EmailMessage message = new EmailMessage(
                usuario.getEmail(),
                "Teste de E-mail via POO",
                "Olá! Este e-mail foi enviado com sucesso utilizando a estrutura por pacotes."
        );

        Token token = new Token("123321", LocalDateTime.now().plusMinutes(10));
        Empresa empresa = new Empresa("Warner Bros", "warner.bros@gmail.com");


        EmailService emailService = new EmailService(config);

        try {
            emailService.enviarEmail(message,usuario,empresa,token);
            System.out.println("E-mail enviado com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
            e.printStackTrace();
        }


    }
}
