async function gerarTokenSalvar(idEmpresa,email) {
    let token = "";
    let existe = true;

    while (existe) {
        token = gerarToken();

        existe = await verificarTokenExiste(token); 

        if (!existe) {
            console.log(`AVISO: Token ${token} já existe, gerando outro...`);
        }


        console.log(`SUCESSO: Token único gerado [${token}]. Salvando...`);
        

        await salvarToken(token, idEmpresa, email); 
        
        return token;
    }
}

async function gerarToken(){
    let tamanho = 6;
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let token = "";

    for (let i = 0; i < tamanho; i++) {
        let aleatorio = Math.floor(Math.random() * caracteres.length);
        token += caracteres.charAt(aleatorio);
    }

    return token;
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

function auteticar(token){
    fetch(`/tokens/autenticar/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
    })
    .then(function (resposta) {
        if (resposta.ok) {
            return resposta.json(); // Passa a Promise do JSON para o próximo .then
        } else {
            console.log("Token inválido ou expirado");
            return null;
        }
    })
    .then(function (dados) {
            if (dados) {
                console.log("Token autenticado com sucesso!");
                return dados.idEmpresa || dados.id_empresa;
            }
            return null;
    })
    .catch(function (erro) {
            console.log(`#ERRO: ${erro}`);
            return null;
    });
}

function atualizarToken(tokenAntigo){
    let tokenNovo = gerarToken();

    fetch(`/tokens/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },body: JSON.stringify({
            tokenNovo: tokenNovo,
            tokenAntigo: tokenAntigo
        })
      }).then(function (resposta) {
          console.log("resposta: ", resposta);

          if(resposta.ok){
            console.log("Token atualizado com sucesso!");
            return true;
          }else{
            console.log("Não foi possivel atualizar o token");
            return false;
          }
        })
        .catch(function (resposta) {
          console.log(`#ERRO: ${resposta}`);
        });
}

