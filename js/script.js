function registrarPonto() {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;

    if (nome === "") {
        alert("Por favor, preencha o nome.");
        return;
    }

    localStorage.setItem("registro_nome", nome);
    localStorage.setItem("registro_tipo", tipo);
    localStorage.setItem("registro_hora", new Date().toLocaleString());

    window.location = "confirmado.html";
}

window.onload = function () {
    const mensagem = document.getElementById("mensagem");

    if (mensagem) {
        const nome = localStorage.getItem("registro_nome");
        const tipo = localStorage.getItem("registro_tipo");
        const hora = localStorage.getItem("registro_hora");

        mensagem.innerHTML = `
            Servidor: <strong>${nome}</strong><br>
            Registro: <strong>${tipo}</strong><br>
            Horário: <strong>${hora}</strong>
        `;
    }
};
