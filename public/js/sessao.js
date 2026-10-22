/// Valida se existe uma sessão ativa e redireciona o usuário para o login
// caso os dados da sessão não estejam disponíveis.
// Será utilizada posteriormente.
// function validarSessao() {
//    var email = sessionStorage.EMAIL_USUARIO;
//    var nome = sessionStorage.NOME_USUARIO;

//    var b_usuario = document.getElementById("b_usuario");

//    if (email != null && nome != null) {
//        b_usuario.innerHTML = nome;
//    } else {
//        window.location = "../login.html";
//    }
// }

function validarSessao() {
    const id = sessionStorage.ID_USUARIO;

    if (id == undefined || id == null) {
        window.location.replace("/login.html"); // ajuste o caminho
    }
}

// Encerra a sessão do usuário, limpa os dados armazenados
// e redireciona para a tela de login.
function limparSessao() {
    sessionStorage.clear();
    window.location = "../../index.html";
}


// Exibe a tela de carregamento enquanto uma operação está sendo realizada.
// Será utilizada posteriormente.
// function aguardar() {
//    var divAguardar = document.getElementById("div_aguardar");
//    divAguardar.style.display = "flex";
// }


// Finaliza a tela de carregamento e exibe uma mensagem de erro, quando houver.
// Será utilizada posteriormente.
// function finalizarAguardar(texto) {
//    var divAguardar = document.getElementById("div_aguardar");
//    divAguardar.style.display = "none";

//    var divErrosLogin = document.getElementById("div_erros_login");
//    if (texto) {
//        divErrosLogin.style.display = "flex";
//        divErrosLogin.innerHTML = texto;
//    }
// }

