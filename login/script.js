
function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.getElementById('toastNotificacion');
    const msgEl = document.getElementById('toastMensaje');
    const iconEl = document.getElementById('toastIcono');

    msgEl.textContent = mensaje;
    if (tipo === 'exito') {
        iconEl.textContent = '✓';
        iconEl.className = 'text-success text-lg';
    } else {
        iconEl.textContent = '✕';
        iconEl.className = 'text-error text-lg';
    }

    toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
    }, 3500);
}

function obtenerUsuarios() {
    const usuarios = localStorage.getItem("usuarios");
    if (!usuarios) return [];
    try { return JSON.parse(usuarios); } catch { return []; }
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

async function hashearPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function validarFortalezaPassword(password) {
    let puntuacion = 0;
    if (password.length >= 8) puntuacion++;
    if (/[A-Z]/.test(password)) puntuacion++;
    if (/[a-z]/.test(password)) puntuacion++;
    if (/[0-9]/.test(password)) puntuacion++;
    if (/[^A-Za-z0-9]/.test(password)) puntuacion++;
    return puntuacion;
}

function renderizarBarraFortaleza(elementoId, password) {
    const elemento = document.getElementById(elementoId);
    if (!elemento) return;
    const puntuacion = validarFortalezaPassword(password);
    const etiquetas = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colores = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];

    if (password.length === 0 || puntuacion === 0) {
        elemento.innerHTML = "";
        return;
    }

    const barra = document.createElement("div");
    barra.className = "barra-fortaleza";
    const relleno = document.createElement("div");
    relleno.className = "relleno-fortaleza";
    relleno.style.width = `${(puntuacion / 5) * 100}%`;
    relleno.style.background = colores[puntuacion - 1];
    barra.appendChild(relleno);

    const texto = document.createElement("span");
    texto.style.cssText = `color:${colores[puntuacion - 1]}; font-size:12px; font-weight:600;`;
    texto.textContent = etiquetas[puntuacion - 1];

    elemento.innerHTML = "";
    elemento.appendChild(barra);
    elemento.appendChild(texto);
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

function establecerCargando(boton, cargando) {
    if (cargando) {
        boton.disabled = true;
        boton.dataset.textoOriginal = boton.textContent;
        boton.textContent = "Procesando...";
    } else {
        boton.disabled = false;
        boton.textContent = boton.dataset.textoOriginal || boton.textContent;
    }
}

function alternarPassword(inputId, toggleId) {
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

function obtenerIntentosFallidos() {
    const data = localStorage.getItem("intentosFallidos");
    if (!data) return { count: 0, ultimoIntento: 0 };
    try { return JSON.parse(data); } catch { return { count: 0, ultimoIntento: 0 }; }
}

function estaBloqueado() {
    const { count, ultimoIntento } = obtenerIntentosFallidos();
    if (count >= 5) {
        const cincoMin = 5 * 60 * 1000;
        if (Date.now() - ultimoIntento < cincoMin) {
            const segs = Math.ceil((cincoMin - (Date.now() - ultimoIntento)) / 1000);
            return { bloqueado: true, segundos: segs };
        } else {
            localStorage.removeItem("intentosFallidos");
        }
    }
    return { bloqueado: false, segundos: 0 };
}

function registrarIntentoFallido() {
    const { count } = obtenerIntentosFallidos();
    localStorage.setItem("intentosFallidos", JSON.stringify({ count: count + 1, ultimoIntento: Date.now() }));
}

async function manejarLogin(e) {
    e.preventDefault();
    limpiarErrores();

    const { bloqueado, segundos } = estaBloqueado();
    if (bloqueado) {
        mostrarError("loginError", `Demasiados intentos. Espera ${segundos} segundos.`);
        return;
    }

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const recordar = document.getElementById("rememberMe").checked;
    const boton = document.getElementById("btnLogin");

    let valido = true;
    if (!email || !validarEmail(email)) { mostrarError("emailError", "Correo no válido"); valido = false; }
    if (!password) { mostrarError("passwordError", "La contraseña es requerida"); valido = false; }
    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const passwordHash = await hashearPassword(password);
        const usuario = buscarUsuario(email);

        if (!usuario) {
            registrarIntentoFallido();
            establecerCargando(boton, false);
            mostrarError("loginError", "Usuario no registrado");
            return;
        }

        if (usuario.password !== passwordHash) {
            registrarIntentoFallido();
            establecerCargando(boton, false);
            mostrarError("loginError", "Contraseña incorrecta");
            return;
        }

        localStorage.removeItem("intentosFallidos");
        if (recordar) {
            localStorage.setItem("rememberEmail", email);
        } else {
            localStorage.removeItem("rememberEmail");
        }

        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.trim();
        sessionStorage.setItem("usuario", nombreCompleto);
        sessionStorage.setItem("usuarioEmail", usuario.email);
        localStorage.setItem("usuario", nombreCompleto);
        localStorage.setItem("usuarioEmail", usuario.email);

        establecerCargando(boton, false);
        mostrarToast("Inicio de sesión exitoso. Redirigiendo...", "exito");
        setTimeout(() => {
            window.location.href = window.location.pathname.includes('/login/') ? "../index.html" : "index.html";
        }, 800);
    }, 400);
}

async function manejarRegistro(e) {
    e.preventDefault();
    limpiarErrores();

    const nombre = document.getElementById("regNombre").value.trim();
    const apellido = document.getElementById("regApellido").value.trim();
    const email = document.getElementById("regEmail").value.trim().toLowerCase();
    const password = document.getElementById("regPassword").value;
    const confirmarPassword = document.getElementById("regConfirmPassword").value;
    const boton = document.getElementById("btnRegistrar");

    let valido = true;
    if (!nombre) { mostrarError("regNombreError", "El nombre es obligatorio"); valido = false; }
    if (!apellido) { mostrarError("regApellidoError", "El apellido es obligatorio"); valido = false; }
    if (!email || !validarEmail(email)) { mostrarError("regEmailError", "Formato de correo no válido"); valido = false; }
    if (!password || password.length < 8) { mostrarError("regPasswordError", "Debe tener al menos 8 caracteres"); valido = false; }
    if (password !== confirmarPassword) { mostrarError("regConfirmError", "Las contraseñas no coinciden"); valido = false; }

    if (buscarUsuario(email)) {
        mostrarError("regEmailError", "Este correo ya está registrado");
        valido = false;
    }

    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const passwordHash = await hashearPassword(password);
        guardarUsuario({ nombre, apellido, email, password: passwordHash });
        establecerCargando(boton, false);
        mostrarToast("Cuenta creada exitosamente. Inicia sesión", "exito");
        mostrarLogin();
        document.getElementById("email").value = email;
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    const emailGuardado = localStorage.getItem("rememberEmail");
    if (emailGuardado) {
        document.getElementById("email").value = emailGuardado;
        document.getElementById("rememberMe").checked = true;
    }

    document.getElementById("togglePassword").addEventListener("click", () => alternarPassword("password", "togglePassword"));
    document.getElementById("toggleRegPassword").addEventListener("click", () => alternarPassword("regPassword", "toggleRegPassword"));
    document.getElementById("toggleConfirmPassword").addEventListener("click", () => alternarPassword("regConfirmPassword", "toggleConfirmPassword"));

    document.getElementById("regPassword").addEventListener("input", (e) => {
        renderizarBarraFortaleza("passwordStrength", e.target.value);
        limpiarError("regPasswordError");
    });

    ["regNombre", "regApellido", "regEmail", "regConfirmPassword", "email", "password"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    document.getElementById("login").addEventListener("submit", manejarLogin);
    document.getElementById("crearCuenta").addEventListener("submit", manejarRegistro);
});
