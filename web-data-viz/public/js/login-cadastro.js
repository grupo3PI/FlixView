if (window.location.hash === "#cadastro") {
        exibirCadastrar();
    }
    
    async function autenticarUsuario() {
        const email = document.getElementById("login_email").value.trim();
        const senha = document.getElementById("login_senha").value;

        if (!email || !senha) {
            alert("Informe seu email e senha.");
            return;
        }

        try {
            const resposta = await fetch("/usuarios/autenticar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailServer: email,
                    senhaServer: senha
                })
            });
            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.erro || "Email ou senha incorretos.");
            }

            window.location.href = "area-usuario.html";
        } catch (erro) {
            alert(erro.message || "Não foi possível conectar ao servidor.");
        }
    }

    async function cadastrarUsuario(event) {
        event.preventDefault();
        const nome = document.getElementById("usuario_nome").value.trim();
        const email = document.getElementById("cadastro_email").value.trim();
        const senha = document.getElementById("cadastro_senha").value;
        const confirmacaoSenha = document.getElementById("usuario_senha_confirmacao").value;
        const codigo = document.getElementById("usuario_codigo").value;

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmacaoSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        try {
            const resposta = await fetch("/usuarios/cadastrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomeServer: nome,
                    emailServer: email,
                    senhaServer: senha,
                    codigoServer: codigo
                })
            });

            const resultado = await resposta.json();
            if (!resposta.ok) {
                throw new Error(resultado.erro || "Não foi possível realizar o cadastro.");
            }

            document.getElementById("form-cadastrar").reset();
            exibirEntrar();
        } catch (erro) {
            alert(erro.message || "Não foi possível conectar ao servidor.");
        }
    }