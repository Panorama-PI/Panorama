function gerarToken(){

    let tamanho = 6;
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let token = "";

    for(let i = 0; i < tamanho; i++){
        let aleatorio = Math.floor(Math.random() * caracteres.length);

        token += caracteres.charAt(aleatorio);
    }

    return token;
}

function verificarTokenExiste(token){


}

function salvarToken(token){
    
}