async function gerarToken(idEmpresa,email) {
    let tamanho = 6;
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let token = "";
    let existe = true;

    while (existe) {
        token = "";
        for (let i = 0; i < tamanho; i++) {
            let aleatorio = Math.floor(Math.random() * caracteres.length);
            token += caracteres.charAt(aleatorio);

        }

        existe = await verificarTokenExiste(token); 

        if (existe) {
            console.log(`AVISO: Token ${token} já existe, gerando outro...`);
        }


        console.log(`SUCESSO: Token único gerado [${token}]. Salvando...`);
        

        await salvarToken(token, idEmpresa, email); 
        
        return token;
    }
}

function verificarTokenExiste(token){

    fetch(`/tokens/${token}`, {
        method: "GET"
      }).then(function (resposta) {
          console.log("resposta: ", resposta);

          if(resposta.ok){
            return true;
          }else{
            return false;
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
}

function salvarToken(token,idEmpresa,email){

    fetch(`/tokens/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },body: JSON.stringify({
            token: token,
            idEmpresa: idEmpresa,
            email: email
        })
      }).then(function (resposta) {
          console.log("resposta: ", resposta);

          if(resposta.ok){
            console.log("Token Salvo com sucesso!");
            return true;
          }else{
            console.log("Não foi possivel salvar o token");
            return false;
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
}