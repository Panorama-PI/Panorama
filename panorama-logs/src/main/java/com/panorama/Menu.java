package com.panorama;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Menu {
    List<Usuario> listaUsuarios = new ArrayList<>();
    List<String> logs = new ArrayList<>();
    String nome = "usuario anonimo";
    Log logCreator = new Log();
    Scanner sc = new Scanner(System.in);
    Scanner scNextLine = new Scanner(System.in);

    void iniciar(){
        menuPrincipal();
    }

    void menuPrincipal(){

        Integer opcao = 0;
        Boolean sair = false;

        logs.add(logCreator.criarLog("INFO",nome,"iniciou o programa"));

        do{
            logs.add(logCreator.criarLog("INFO",nome,"acessou o menu principal"));
            System.out.println(String.format("""
                
             SISTEMA DE LOGS DO PANORAMA 
                
             Usuario: %s       
                
              1) Login
              2) Cadastro
              3) Ver Logs
              4) Sair do programa
              
              """,nome));
            opcao = sc.nextInt();

            switch (opcao){
                case 1:
                    logs.add(logCreator.criarLog("INFO",nome,"acessou o menu login para realizar a autentificação"));
                    Usuario usuarioLogado = login();
                    if(usuarioLogado != null){
                        logs.add(logCreator.criarLog("INFO",nome,"realizou o login no sistema"));
                        nome = usuarioLogado.nome;
                    }
                    break;
                case 2:
                    logs.add(logCreator.criarLog("INFO",nome,"acessou o menu cadastro para criar uma conta"));
                    Usuario usuarioCadastrado = cadastro();
                    if(usuarioCadastrado != null){
                        logs.add(logCreator.criarLog("INFO",nome,"criou um cadastro no programa"));
                        listaUsuarios.add(usuarioCadastrado);
                        nome = usuarioCadastrado.nome;
                    }
                    break;
                case 3:
                    logs.add(logCreator.criarLog("INFO",nome,"acessou o menu de logs"));
                    menuLogs();
                    break;
                case 4:
                    logs.add(logCreator.criarLog("INFO",nome,"Saiu do programa"));
                    logCreator.visualizarLogs(logs);
                    sair = true;
                    break;
                default:
                    logs.add(logCreator.criarLog("WARN",nome,"Digitou uma opção invalida no menu"));
                    System.out.println("Digite uma opção valida!");
                    break;
            }
        }while(!sair);

        System.out.println("""
                
                Saindo...
                
                """);
    }

    void menuLogs(){
        Integer opcao = 0;
        Boolean sair = false;

        do{
            System.out.println(String.format("""
                
              SISTEMA DE LOGS DO PANORAMA 
                
              MENU DE LOGS
                
              Usuario: %s       
                
              1) Visualizar os ultimos logs
              2) Visualizar os primeiros logs
              3) Voltar
              """,nome));
            opcao = sc.nextInt();

            switch (opcao){
                case 1:
                    logs.add(logCreator.criarLog("INFO",nome,"vizualizou o menu de ultimos logs"));
                    menuQuantidadeLogs("ultimos");
                    break;
                case 2:
                    logs.add(logCreator.criarLog("INFO",nome,"vizualizou o menu de primeiros logs"));
                    menuQuantidadeLogs("primeiros");
                    break;
                case 3:
                    return;
                default:
                    logs.add(logCreator.criarLog("WARN",nome,"Digitou uma opção invalida no menu"));
                    System.out.println("Digite uma opção valida!");
                    break;
            }
        }while(!sair);
    }

    void menuQuantidadeLogs(String menuLog){

        Integer opcao = 0;
        Boolean sair = false;

        do{
            System.out.println(String.format("""
                
              SISTEMA DE LOGS DO PANORAMA 
                
              MENU DE LOGS: %s
                
              Usuario: %s       
                
              1) Todos
              2) Quantidade de logs especifica
              3) Voltar
              
              """,menuLog,nome));
            opcao = sc.nextInt();

            switch (opcao){
                case 1:
                    logs.add(logCreator.criarLog("INFO",nome,"vizualizou os "+ menuLog +" logs"));
                    logCreator.visualizar(logs,menuLog);
                    break;
                case 2:

                    Boolean valido = false;
                    Integer quantidade = 0;

                    do{
                        System.out.println("""
                        Digite a quantidade de logs que deseja ver
                        """);

                        quantidade = sc.nextInt();

                        if(quantidade <= 0){
                            logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou uma quantidade invalida nos ultimos logs"));
                            System.out.println("Digite uma opcão valida");
                        }else if(quantidade > logs.size()){
                            logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou uma quantidade invalida nos ultimos logs"));
                            System.out.println("Digite uma opcão valida");
                        }else{
                            valido = true;
                        }

                    }while(!valido);

                    logs.add(logCreator.criarLog("INFO",nome,"vizualizou os "+ quantidade + " " + menuLog +" logs"));
                    logCreator.visualizar(logs,menuLog,quantidade);
                    break;
                case 3:
                    return;
                default:
                    logs.add(logCreator.criarLog("WARN",nome,"Digitou uma opção invalida no menu"));
                    System.out.println("Digite uma opção valida!");
                    break;
            }
        }while(!sair);
    }

    Usuario login(){
        String menu = """
        SISTEMA DE LOGS DO PANORAMA        
                
                """;

        Boolean sair = false;
        Usuario usuario = new Usuario();

        do{
            System.out.println(menu);
            System.out.println("Digite seu nome de usuario");
            usuario.nome = scNextLine.nextLine();
            System.out.println("Digite a senha do usuario");
            usuario.senha = scNextLine.nextLine();

            Boolean valida = validarLoginCadastro(usuario);
            Boolean existe = validaExiste(usuario.nome, usuario.senha);

            if(valida && existe) {
                return usuario;
            }else{
                System.out.println("Digite nome e senha validos!");
                logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou nome e senha invalidos"));
                Integer opcao = 0;

                do{
                    System.out.println("""
                    Deseja continuar o login?
                        
                    1) não
                    2) sim
                        
                        """);

                    opcao = sc.nextInt();

                    switch (opcao){
                        case 1:
                            sair = true;
                            break;
                        case 2:
                            sair = false;
                            break;
                        default:
                            logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou uma opção invalida no continuar cadastro"));
                            System.out.println("Digite uma opcão valida");
                            break;
                    }
                }while(opcao > 2);

            }

        }while(!sair);

        return null;

    }

    Usuario cadastro(){
        String menu = """
        SISTEMA DE LOGS DO PANORAMA        
                
                """;

        Boolean sair = false;
        Usuario usuario = new Usuario();

        do{
            System.out.println(menu);
            System.out.println("CADASTRO");
            System.out.println("Digite seu nome de usuario");
            usuario.nome = scNextLine.next();
            System.out.println("Digite a senha do usuario");
            usuario.senha = scNextLine.next();

            Boolean valida = validarLoginCadastro(usuario);

            if(valida){
                sair = true;
            }else{
                System.out.println("Digite nome e senha validos!");
                logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou nome e senha invalidos"));

                Integer opcao = 0;

                do{
                    System.out.println("""
                    Deseja continuar o login?
                        
                    1) não
                    2) sim 
                        """);

                    opcao = sc.nextInt();

                    switch (opcao){
                        case 1:
                            sair = true;
                            break;
                        case 2:
                            sair = false;
                            break;
                        default:
                            logs.add(logCreator.criarLog("WARN","usuario anonimo", "digitou uma opção invalida no continuar cadastro"));
                            System.out.println("Digite uma opcão valida");
                            break;
                    }
                }while(opcao > 2);

            }

        }while(!sair);

        return usuario;
    }

    Boolean validaExiste(String nome, String senha){
        for(Usuario usuario : listaUsuarios){
            if(nome.equals(usuario.nome) && senha.equals(usuario.senha)){
                return true;
            }
        }

        return false;
    }

    Boolean validarLoginCadastro(Usuario usuario){
        if(usuario.nome == null || usuario.nome.isBlank() || usuario.nome.isEmpty()){
            return false;
        }

        if(usuario.senha == null || usuario.senha.isBlank() || usuario.senha.isEmpty()){
            return false;
        }

        return true;

    }
}
