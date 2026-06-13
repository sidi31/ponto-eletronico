const SALVAR_EM_ARQUIVOS_JSON = false;
const CHAVE_BACKUP_JSON = "pe_backup_json";

function lerDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));

    if (SALVAR_EM_ARQUIVOS_JSON) {
        salvarBackupJson(chave, dados);
    }
}

function salvarBackupJson(chave, dados) {
    const backup = JSON.parse(localStorage.getItem(CHAVE_BACKUP_JSON)) || {};
    backup[`${chave}.json`] = dados;
    localStorage.setItem(CHAVE_BACKUP_JSON, JSON.stringify(backup));
}

function baixarJson(nomeArquivo, dados) {
    const conteudo = JSON.stringify(dados, null, 2);
    const blob = new Blob([conteudo], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo;
    link.click();

    URL.revokeObjectURL(link.href);
}

function baixarDadosJson() {
    baixarJson("usuarios.json", lerDados("pe_usuarios"));
    baixarJson("registros.json", lerDados("pe_registros"));
}