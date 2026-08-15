function mostrarCrearCuenta() {
    document.getElementById("login").style.display = "none";
    document.getElementById("crearCuenta").style.display = "block";
    document.getElementById("regNombre").focus();
    limpiarErrores();
}

function mostrarLogin() {
    document.getElementById("crearCuenta").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("email").focus();
    limpiarErrores();
}

function obtenerUsuarios() {
    const usuarios = localStorage.getItem("usuarios");
    return usuarios ? JSON.parse(usuarios) : [];
}

function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function buscarUsuario(email) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
}

function mostrarFortaleza(password) {
    const strengthEl = document.getElementById("passwordStrength");
    if (!strengthEl) return;
    const score = validarPasswordStrength(password);
    const labels = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colors = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
    if (password.length === 0) {
        strengthEl.innerHTML = "";
        return;
    }
    strengthEl.innerHTML = `<div class="strength-bar"><div class="strength-fill" style="width: ${(score/5)*100}%; background: ${colors[score-1]}"></div></div><span style="color:${colors[score-1]}; font-size:12px;">${labels[score-1]}</span>`;
}

function mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    if (el) el.textContent = mensaje;
}

function limpiarError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
}

function limpiarErrores() {
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

function setLoading(btn, loading) {
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = "Cargando...";
    } else {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || btn.textContent;
    }
}

function togglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (input.type === "password") {
        input.type = "text";
        toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        input.type = "password";
        toggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("rememberMe").checked = true;
    }
    document.getElementById("email").focus();

    document.getElementById("togglePassword").addEventListener("click", () => togglePassword("password", "togglePassword"));
    document.getElementById("toggleRegPassword").addEventListener("click", () => togglePassword("regPassword", "toggleRegPassword"));
    document.getElementById("toggleConfirmPassword").addEventListener("click", () => togglePassword("regConfirmPassword", "toggleConfirmPassword"));

    document.getElementById("regPassword").addEventListener("input", (e) => {
        mostrarFortaleza(e.target.value);
        limpiarError("regPasswordError");
    });

    ["regNombre", "regApellido", "regEmail", "regConfirmPassword"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    document.getElementById("email").addEventListener("input", () => limpiarError("emailError"));
    document.getElementById("password").addEventListener("input", () => limpiarError("passwordError"));
    document.getElementById("loginError").textContent = "";

    document.getElementById("btnRegistrar").addEventListener("click", handleRegister);
    document.getElementById("btnLogin").addEventListener("click", handleLogin);

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (document.getElementById("crearCuenta").style.display !== "none") {
                    handleRegister(e);
                } else {
                    handleLogin(e);
                }
            }
        });
    });
});

function handleRegister(e) {
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById("regNombre").value.trim();
    const apellido = document.getElementById("regApellido").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;
    const btn = document.getElementById("btnRegistrar");

    let valido = true;

    if (!nombre) { mostrarError("regNombreError", "Nombre requerido"); valido = false; }
    if (!apellido) { mostrarError("regApellidoError", "Apellido requerido"); valido = false; }
    if (!email || !validarEmail(email)) { mostrarError("regEmailError", "Email inválido"); valido = false; }
    if (!password) { mostrarError("regPasswordError", "Contraseña requerida"); valido = false; }
    else if (password.length < 8) { mostrarError("regPasswordError", "Mínimo 8 caracteres"); valido = false; }
    if (password !== confirmPassword) { mostrarError("regConfirmError", "Las contraseñas no coinciden"); valido = false; }

    if (buscarUsuario(email)) { mostrarError("regEmailError", "Este correo ya está registrado"); valido = false; }

    if (!valido) return;

    setLoading(btn, true);
    setTimeout(() => {
        guardarUsuario({ nombre, apellido, email, password });
        setLoading(btn, false);
        alert("Cuenta creada exitosamente");
        mostrarLogin();
    }, 500);
}

function handleLogin(e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("rememberMe").checked;
    const btn = document.getElementById("btnLogin");

    let valido = true;

    if (!email || !validarEmail(email)) { mostrarError("emailError", "Email inválido"); valido = false; }
    if (!password) { mostrarError("passwordError", "Contraseña requerida"); valido = false; }

    if (!valido) return;

    setLoading(btn, true);
    setTimeout(() => {
        const usuario = buscarUsuario(email);

        if (!usuario) {
            setLoading(btn, false);
            mostrarError("loginError", "Usuario no registrado");
            return;
        }

        if (usuario.password !== password) {
            setLoading(btn, false);
            mostrarError("loginError", "Contraseña incorrecta");
            return;
        }

        if (remember) {
            localStorage.setItem("rememberEmail", email);
        } else {
            localStorage.removeItem("rememberEmail");
        }

        sessionStorage.setItem("usuario", usuario.nombre + " " + usuario.apellido);
        sessionStorage.setItem("usuarioEmail", usuario.email);
        localStorage.setItem("usuario", usuario.nombre + " " + usuario.apellido);
        localStorage.setItem("usuarioEmail", usuario.email);

        setLoading(btn, false);
        window.location.href = "../index.html";
    }, 500);
}