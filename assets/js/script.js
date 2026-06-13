const CHAVE_USUARIOS = "pe_usuarios";
const CHAVE_REGISTROS = "pe_registros";
const CHAVE_ULTIMO_REGISTRO = "pe_ultimo_registro";
const ADMIN_USUARIO = "admin";
const ADMIN_SENHA = "admin123";

function formatarData(data) {
    return data.toLocaleDateString("pt-BR");
}

function formatarHora(data) {
    return data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function limparTexto(texto) {
    return texto.trim();
}

function criarId(prefixo) {
    return `${prefixo}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function buscarUsuarioPorNome(nome) {
    const usuarios = lerDados(CHAVE_USUARIOS);
    return usuarios.find(function (usuario) {
        return usuario.nome.toLowerCase() === nome.toLowerCase();
    });
}

function atualizarUsuario(usuarioAtualizado) {
    const usuarios = lerDados(CHAVE_USUARIOS);
    const novosUsuarios = usuarios.map(function (usuario) {
        if (usuario.id === usuarioAtualizado.id) {
            return usuarioAtualizado;
        }

        return usuario;
    });

    salvarDados(CHAVE_USUARIOS, novosUsuarios);
}

function registrosDoUsuario(usuarioId) {
    return lerDados(CHAVE_REGISTROS)
        .filter(function (registro) {
            return registro.servidorId === usuarioId;
        })
        .sort(function (a, b) {
            return new Date(b.dataHora) - new Date(a.dataHora);
        });
}

function ultimoRegistro(usuarioId) {
    return registrosDoUsuario(usuarioId)[0] || null;
}

function registrarPonto() {
    const nome = limparTexto(document.getElementById("nome").value);
    const tipo = document.getElementById("tipo").value;

    if (nome === "") {
        alert("Preencha o nome.");
        return;
    }

    const usuario = buscarUsuarioPorNome(nome);

    if (!usuario) {
        alert("Servidor não cadastrado. Procure o administrador.");
        return;
    }

    if (usuario.status === "bloqueado") {
        alert("Este servidor está bloqueado.");
        return;
    }

    const ultimo = ultimoRegistro(usuario.id);

    if (tipo === "entrada" && ultimo && ultimo.tipo === "entrada") {
        alert("Já existe uma entrada registrada. Registre a saída antes de uma nova entrada.");
        return;
    }

    if (tipo === "saida" && (!ultimo || ultimo.tipo === "saida")) {
        alert("Registre uma entrada antes de registrar a saída.");
        return;
    }

    const agora = new Date();
    const registro = {
        id: criarId("reg"),
        servidorId: usuario.id,
        servidorNome: usuario.nome,
        tipo: tipo,
        data: formatarDataISO(agora),
        hora: formatarHora(agora),
        dataFormatada: formatarData(agora),
        dataHora: agora.toISOString()
    };

    const registros = lerDados(CHAVE_REGISTROS);
    registros.push(registro);

    salvarDados(CHAVE_REGISTROS, registros);
    localStorage.setItem(CHAVE_ULTIMO_REGISTRO, registro.id);

    window.location = "confirmado.html";
}

function mostrarConfirmacao() {
    const mensagem = document.getElementById("mensagem");

    if (!mensagem) {
        return;
    }

    const registros = lerDados(CHAVE_REGISTROS);
    const ultimoId = localStorage.getItem(CHAVE_ULTIMO_REGISTRO);
    const registro = registros.find(function (item) {
        return item.id === ultimoId;
    });

    if (!registro) {
        mensagem.innerHTML = "Nenhum registro encontrado.";
        return;
    }

    mensagem.innerHTML = `
        Servidor: <strong>${registro.servidorNome}</strong><br>
        Registro: <strong>${registro.tipo}</strong><br>
        Horário: <strong>${registro.dataFormatada}, ${registro.hora}</strong>
    `;
}

function entrarAdmin() {
    const usuario = limparTexto(document.getElementById("loginAdmin").value);
    const senha = document.getElementById("senhaAdmin").value;

    if (usuario === ADMIN_USUARIO && senha === ADMIN_SENHA) {
        localStorage.setItem("pe_admin_logado", "true");
        window.location = "admin.html";
        return;
    }

    alert("Usuário ou senha incorretos.");
}

function sairAdmin() {
    localStorage.removeItem("pe_admin_logado");
    window.location = "../index.html";
}

function validarAdmin() {
    if (!document.body.dataset.admin) {
        return true;
    }

    if (localStorage.getItem("pe_admin_logado") === "true") {
        return true;
    }

    window.location = "login-admin.html";
    return false;
}

function mostrarStatusRegistro() {
    const nomeCampo = document.getElementById("nome");
    const status = document.getElementById("statusRegistro");

    if (!nomeCampo || !status) {
        return;
    }

    nomeCampo.addEventListener("input", function () {
        const nome = limparTexto(nomeCampo.value);

        if (nome === "") {
            status.innerHTML = "";
            return;
        }

        const usuario = buscarUsuarioPorNome(nome);

        if (!usuario) {
            status.innerHTML = "Servidor não cadastrado.";
            return;
        }

        if (usuario.status === "bloqueado") {
            status.innerHTML = "Servidor bloqueado.";
            return;
        }

        const ultimo = ultimoRegistro(usuario.id);

        if (!ultimo) {
            status.innerHTML = "Nenhum ponto registrado para este servidor.";
            return;
        }

        status.innerHTML = `Último registro: ${ultimo.tipo} em ${ultimo.dataFormatada}, ${ultimo.hora}.`;
    });
}

function consultarHistorico() {
    const campo = document.getElementById("nomeHistorico");
    const lista = document.getElementById("listaHistorico");
    const resumo = document.getElementById("resumoHistorico");

    if (!campo || !lista || !resumo) {
        return;
    }

    const nome = limparTexto(campo.value);

    if (nome === "") {
        alert("Preencha o nome.");
        return;
    }

    const usuario = buscarUsuarioPorNome(nome);

    if (!usuario) {
        resumo.innerHTML = "Servidor não encontrado.";
        lista.innerHTML = "";
        return;
    }

    const registros = registrosDoUsuario(usuario.id);

    if (registros.length === 0) {
        resumo.innerHTML = "Nenhum ponto registrado.";
        lista.innerHTML = "";
        return;
    }

    resumo.innerHTML = `${usuario.nome} possui ${registros.length} registro(s).`;
    lista.innerHTML = registros.map(function (registro) {
        return `
            <tr>
                <td>${registro.dataFormatada}</td>
                <td>${registro.hora}</td>
                <td>${registro.tipo}</td>
            </tr>
        `;
    }).join("");
}

function cadastrarServidor() {
    const id = document.getElementById("adminId").value;
    const nome = limparTexto(document.getElementById("adminNome").value);
    const matricula = limparTexto(document.getElementById("adminMatricula").value);
    const cargo = limparTexto(document.getElementById("adminCargo").value);
    const setor = limparTexto(document.getElementById("adminSetor").value);
    const carga = Number(document.getElementById("adminCarga").value) || 8;

    if (nome === "") {
        alert("Preencha o nome.");
        return;
    }

    const usuarioComMesmoNome = buscarUsuarioPorNome(nome);

    if (usuarioComMesmoNome && usuarioComMesmoNome.id !== id) {
        alert("Este servidor já está cadastrado.");
        return;
    }

    const usuarios = lerDados(CHAVE_USUARIOS);

    if (id) {
        const usuario = usuarios.find(function (item) {
            return item.id === id;
        });

        if (usuario) {
            usuario.nome = nome;
            usuario.matricula = matricula;
            usuario.cargo = cargo;
            usuario.setor = setor;
            usuario.cargaHorariaDiaria = carga;
        }
    } else {
        usuarios.push({
            id: criarId("srv"),
            nome: nome,
            matricula: matricula,
            cargo: cargo,
            setor: setor,
            perfil: "servidor",
            status: "ativo",
            cargaHorariaDiaria: carga
        });
    }

    salvarDados(CHAVE_USUARIOS, usuarios);
    cancelarEdicao();
    window.location = "admin-relatorios.html";
}

function editarServidor(id) {
    localStorage.setItem("pe_admin_editar_id", id);
    window.location = "admin-servidor.html";
}

function carregarServidorParaEdicao() {
    const form = document.getElementById("formServidor");

    if (!form) {
        return;
    }

    const id = localStorage.getItem("pe_admin_editar_id");

    if (!id) {
        return;
    }

    const usuario = lerDados(CHAVE_USUARIOS).find(function (item) {
        return item.id === id;
    });

    if (!usuario) {
        return;
    }

    document.getElementById("adminId").value = usuario.id;
    document.getElementById("adminNome").value = usuario.nome;
    document.getElementById("adminMatricula").value = usuario.matricula || "";
    document.getElementById("adminCargo").value = usuario.cargo || "";
    document.getElementById("adminSetor").value = usuario.setor || "";
    document.getElementById("adminCarga").value = usuario.cargaHorariaDiaria || 8;
    document.getElementById("botaoServidor").innerText = "Salvar Alterações";
    document.getElementById("botaoCancelar").classList.remove("oculto");
    localStorage.removeItem("pe_admin_editar_id");
}

function cancelarEdicao() {
    const form = document.getElementById("formServidor");

    if (!form) {
        return;
    }

    form.reset();
    document.getElementById("adminId").value = "";
    document.getElementById("adminCarga").value = 8;
    document.getElementById("botaoServidor").innerText = "Cadastrar";
    document.getElementById("botaoCancelar").classList.add("oculto");
    localStorage.removeItem("pe_admin_editar_id");
}

function alternarBloqueio(id) {
    const usuarios = lerDados(CHAVE_USUARIOS);
    const usuario = usuarios.find(function (item) {
        return item.id === id;
    });

    if (!usuario) {
        return;
    }

    usuario.status = usuario.status === "bloqueado" ? "ativo" : "bloqueado";
    atualizarUsuario(usuario);
    carregarAdmin();
}

function buscarPerfil() {
    const nome = limparTexto(document.getElementById("perfilNome").value);
    const mensagem = document.getElementById("mensagemPerfil");
    const dados = document.getElementById("dadosPerfil");

    if (nome === "") {
        alert("Preencha o nome.");
        return;
    }

    const usuario = buscarUsuarioPorNome(nome);

    if (!usuario) {
        dados.classList.add("oculto");
        mensagem.innerHTML = "Servidor não encontrado.";
        return;
    }

    localStorage.setItem("pe_perfil_editando", usuario.id);
    document.getElementById("perfilEmail").value = usuario.email || "";
    document.getElementById("perfilTelefone").value = usuario.telefone || "";
    document.getElementById("perfilInfo").innerHTML = `${usuario.cargo || "Servidor"} - ${usuario.setor || "Sem setor informado"}`;
    mensagem.innerHTML = "";
    dados.classList.remove("oculto");
}

function salvarPerfil() {
    const id = localStorage.getItem("pe_perfil_editando");
    const usuarios = lerDados(CHAVE_USUARIOS);
    const usuario = usuarios.find(function (item) {
        return item.id === id;
    });

    if (!usuario) {
        return;
    }

    usuario.email = limparTexto(document.getElementById("perfilEmail").value);
    usuario.telefone = limparTexto(document.getElementById("perfilTelefone").value);
    salvarDados(CHAVE_USUARIOS, usuarios);
    document.getElementById("mensagemPerfil").innerHTML = "Dados atualizados.";
}

function calcularHorasUsuario(usuario) {
    const registros = registrosDoUsuario(usuario.id).reverse();
    let entrada = null;
    let minutos = 0;
    let incompletos = 0;
    const dias = {};

    registros.forEach(function (registro) {
        dias[registro.data] = true;

        if (registro.tipo === "entrada") {
            entrada = registro;
            return;
        }

        if (registro.tipo === "saida" && entrada) {
            minutos += (new Date(registro.dataHora) - new Date(entrada.dataHora)) / 60000;
            entrada = null;
            return;
        }

        if (registro.tipo === "saida" && !entrada) {
            incompletos++;
        }
    });

    if (entrada) {
        incompletos++;
    }

    const totalDias = Object.keys(dias).length;
    const horasTrabalhadas = minutos / 60;
    const horasEsperadas = totalDias * usuario.cargaHorariaDiaria;

    return {
        registros: registros.length,
        horasTrabalhadas: horasTrabalhadas,
        horasEsperadas: horasEsperadas,
        saldo: horasTrabalhadas - horasEsperadas,
        incompletos: incompletos
    };
}

function formatarHoras(valor) {
    return `${valor.toFixed(2).replace(".", ",")}h`;
}

function carregarAdmin() {
    const tabela = document.getElementById("listaServidores");
    const resumo = document.getElementById("resumoAdmin");

    if (!tabela || !resumo) {
        return;
    }

    const usuarios = lerDados(CHAVE_USUARIOS);
    const registros = lerDados(CHAVE_REGISTROS);
    const ativos = usuarios.filter(function (usuario) {
        return usuario.status === "ativo";
    }).length;
    const bloqueados = usuarios.filter(function (usuario) {
        return usuario.status === "bloqueado";
    }).length;

    resumo.innerHTML = `
        <span>Servidores: <strong>${usuarios.length}</strong></span>
        <span>Ativos: <strong>${ativos}</strong></span>
        <span>Bloqueados: <strong>${bloqueados}</strong></span>
        <span>Registros: <strong>${registros.length}</strong></span>
    `;

    if (usuarios.length === 0) {
        tabela.innerHTML = `
            <tr>
                <td colspan="7">Nenhum servidor cadastrado.</td>
            </tr>
        `;
        return;
    }

    tabela.innerHTML = usuarios.map(function (usuario) {
        const horas = calcularHorasUsuario(usuario);
        const botao = usuario.status === "bloqueado" ? "Desbloquear" : "Bloquear";

        return `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.matricula || "-"}</td>
                <td>${usuario.setor || "-"}</td>
                <td>${usuario.status}</td>
                <td>${horas.registros}</td>
                <td>${formatarHoras(horas.saldo)}</td>
                <td class="acoes-tabela">
                    <button class="botao-tabela" onclick="editarServidor('${usuario.id}')">Editar</button>
                    <button class="botao-tabela" onclick="alternarBloqueio('${usuario.id}')">${botao}</button>
                </td>
            </tr>
        `;
    }).join("");
}

function iniciarPagina() {
    if (!validarAdmin()) {
        return;
    }

    mostrarConfirmacao();
    mostrarStatusRegistro();
    carregarServidorParaEdicao();
    carregarAdmin();
}

window.onload = iniciarPagina;
