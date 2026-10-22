function obterDataHoraFormatada(){
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

module.exports = {
    obterDataHoraFormatada
}