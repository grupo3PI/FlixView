function validarSessao() {
    var id = sessionStorage.getItem("ID_USUARIO");
    var email = sessionStorage.getItem("EMAIL_USUARIO");

    if (email == null || id == null) {
        return false;
    } else {
        return true;
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location.reload();
}