package com.panorama;

import java.util.Scanner;

public class Menu {

    void iniciar(){
        menuPrincipal();
    }

    void menuPrincipal(){
        String menu = """
        SISTEMA DE LOGS DO PANORAMA        
        
        1) Login
        2) Cadastro
        3) Ver Logs
        4) Sair
                """;

        Scanner sc = new Scanner(System.in);
        Log logCreator = new Log();
        Integer opcao = 0;
        Boolean sair = false;

        do{
            System.out.println(menu);
            opcao = sc.nextInt();

            switch (opcao){
                case 1:
                    // Usuario usuarioLogado = loginCadastro();
                    break;
                case 2:
                    // logCreator.visualizarLogs();
                    break;
                default:
                    System.out.println("Digite uma opção valida!");
                    sair = true;
                    break;
            }
        }while(!sair);
    }

    Usuario login(){
        String menu = """
        SISTEMA DE LOGS DO PANORAMA        
                """;

        Scanner sc = new Scanner(System.in);
        Log logCreator = new Log();
        Boolean sair = false;
        Usuario novoUsuario = new Usuario();

        do{
            System.out.println(menu);
            System.out.println("Digite seu nome de usuario");
            novoUsuario.nome = sc.next();
            System.out.println("Digite a senha do usuario");
            novoUsuario.senha = sc.next();


        }while(!sair);

        return novoUsuario;
    }
}
