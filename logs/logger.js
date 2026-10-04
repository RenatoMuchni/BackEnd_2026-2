const fs = require('fs');
const path = require('path');

// Classe responsavel por gravar os erros no arquivo logs/errors.log
class Logger {
    constructor(arquivo) {
        this.arquivo = arquivo;
    }

    registrar(rota, erro) {
        const agora = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo'
        });

        const linha = agora + ' - ' + rota + ' - ' + erro.message + '\n';
        fs.appendFileSync(this.arquivo, linha);
    }
}

module.exports = new Logger(path.join(__dirname, 'errors.log'));