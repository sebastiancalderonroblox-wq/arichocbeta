function mostrarCrearCuenta() {
    document.getElementById("login").style.display = "none";
    document.getElementById("crearCuenta").style.display = "block";
    document.getElementById("regNombre").focus();
    limpiarErrores();
}

function mostrarLogin() {
    document.getElementById("crearCuenta").style.display = "none";
    document.getElementById("cambiarPassword").style.display = "none";
    document.getElementById("recuperarPassword").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("email").focus();
    limpiarErrores();
}

function mostrarCambiarPassword() {
    document.getElementById("login").style.display = "none";
    document.getElementById("crearCuenta").style.display = "none";
    document.getElementById("cambiarPassword").style.display = "block";
    document.getElementById("pwdActual").focus();
    limpiarErrores();
}

function obtenerUsuarios() {
    const usuarios = localStorage.getItem("usuarios");
    if (!usuarios) return [];
    try {
        return JSON.parse(usuarios);
    } catch {
        return [];
    }
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

function actualizarPasswordUsuario(email, nuevoPasswordHash) {
    const usuarios = obtenerUsuarios();
    const index = usuarios.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index !== -1) {
        usuarios[index].password = nuevoPasswordHash;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        return true;
    }
    return false;
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

function mostrarFortaleza(password) {
    const elementoFortaleza = document.getElementById("passwordStrength");
    if (!elementoFortaleza) return;
    const puntuacion = validarFortalezaPassword(password);
    const etiquetas = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colores = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
    if (password.length === 0 || puntuacion === 0) {
        elementoFortaleza.textContent = "";
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
    texto.style.cssText = `color:${colores[puntuacion - 1]}; font-size:12px;`;
    texto.textContent = etiquetas[puntuacion - 1];
    elementoFortaleza.innerHTML = "";
    elementoFortaleza.appendChild(barra);
    elementoFortaleza.appendChild(texto);
}

function mostrarFortalezaCambio(password) {
    const elementoFortaleza = document.getElementById("passwordStrengthCambio");
    if (!elementoFortaleza) return;
    const puntuacion = validarFortalezaPassword(password);
    const etiquetas = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colores = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
    if (password.length === 0 || puntuacion === 0) {
        elementoFortaleza.textContent = "";
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
    texto.style.cssText = `color:${colores[puntuacion - 1]}; font-size:12px;`;
    texto.textContent = etiquetas[puntuacion - 1];
    elementoFortaleza.innerHTML = "";
    elementoFortaleza.appendChild(barra);
    elementoFortaleza.appendChild(texto);
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
        boton.textContent = "Cargando...";
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

function obtenerIntentosFallidos() {
    const data = localStorage.getItem("intentosFallidos");
    if (!data) return { count: 0, ultimoIntento: 0 };
    try {
        return JSON.parse(data);
    } catch {
        return { count: 0, ultimoIntento: 0 };
    }
}

function guardarIntentosFallidos(count, ultimoIntento = Date.now()) {
    localStorage.setItem("intentosFallidos", JSON.stringify({ count, ultimoIntento }));
}

function resetearIntentosFallidos() {
    localStorage.removeItem("intentosFallidos");
}

function estaBloqueado() {
    const { count, ultimoIntento } = obtenerIntentosFallidos();
    if (count >= 5) {
        const cincoMinutos = 5 * 60 * 1000;
        if (Date.now() - ultimoIntento < cincoMinutos) {
            const segundosRestantes = Math.ceil((cincoMinutos - (Date.now() - ultimoIntento)) / 1000);
            return { bloqueado: true, segundos: segundosRestantes };
        } else {
            resetearIntentosFallidos();
        }
    }
    return { bloqueado: false, segundos: 0 };
}

function registrarIntentoFallido() {
    const { count } = obtenerIntentosFallidos();
    guardarIntentosFallidos(count + 1);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const debeCambiarPassword = urlParams.get("cambiar") === "1";
    const estaLogueado = !!localStorage.getItem("usuarioEmail");

    if (debeCambiarPassword && estaLogueado) {
        mostrarCambiarPassword();
    } else {
        const emailGuardado = localStorage.getItem("rememberEmail");
        if (emailGuardado) {
            document.getElementById("email").value = emailGuardado;
            document.getElementById("rememberMe").checked = true;
        }
        document.getElementById("email").focus();
    }

    document.getElementById("togglePassword").addEventListener("click", () => alternarPassword("password", "togglePassword"));
    document.getElementById("toggleRegPassword").addEventListener("click", () => alternarPassword("regPassword", "toggleRegPassword"));
    document.getElementById("toggleConfirmPassword").addEventListener("click", () => alternarPassword("regConfirmPassword", "toggleConfirmPassword"));
    document.getElementById("togglePwdActual").addEventListener("click", () => alternarPassword("pwdActual", "togglePwdActual"));
    document.getElementById("togglePwdNueva").addEventListener("click", () => alternarPassword("pwdNueva", "togglePwdNueva"));
    document.getElementById("togglePwdConfirmar").addEventListener("click", () => alternarPassword("pwdConfirmar", "togglePwdConfirmar"));
    document.getElementById("toggleRecNuevaPassword").addEventListener("click", () => alternarPassword("recNuevaPassword", "toggleRecNuevaPassword"));
    document.getElementById("toggleRecConfirmarPassword").addEventListener("click", () => alternarPassword("recConfirmarPassword", "toggleRecConfirmarPassword"));

    document.getElementById("btnVerificarEmail").addEventListener("click", manejarVerificarEmail);
    document.getElementById("btnActualizarPassword").addEventListener("click", manejarActualizarPassword);

    document.getElementById("regPassword").addEventListener("input", (e) => {
        mostrarFortaleza(e.target.value);
        limpiarError("regPasswordError");
    });

    document.getElementById("pwdNueva").addEventListener("input", (e) => {
        mostrarFortalezaCambio(e.target.value);
        limpiarError("pwdNuevaError");
    });

    document.getElementById("recNuevaPassword").addEventListener("input", (e) => {
        mostrarFortalezaRecuperar(e.target.value);
        limpiarError("recNuevaPasswordError");
    });

    ["regNombre", "regApellido", "regEmail", "regConfirmPassword"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    ["pwdActual", "pwdNueva", "pwdConfirmar"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    ["recEmail"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    ["recNuevaPassword", "recConfirmarPassword"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    document.getElementById("email").addEventListener("input", () => limpiarError("emailError"));
    document.getElementById("password").addEventListener("input", () => limpiarError("passwordError"));
    document.getElementById("loginError").textContent = "";

    document.getElementById("login").addEventListener("submit", manejarLogin);
    document.getElementById("crearCuenta").addEventListener("submit", manejarRegistro);
    document.getElementById("cambiarPassword").addEventListener("submit", manejarCambiarPassword);
    document.getElementById("recuperarPassword").addEventListener("submit", (e) => {
        e.preventDefault();
        if (document.getElementById("pasoEmail").style.display !== "none") {
            manejarVerificarEmail(e);
        } else {
            manejarActualizarPassword(e);
        }
    });
});

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

    if (!nombre) { mostrarError("regNombreError", "Nombre requerido"); valido = false; }
    if (!apellido) { mostrarError("regApellidoError", "Apellido requerido"); valido = false; }
    if (!email || !validarEmail(email)) { mostrarError("regEmailError", "Email inválido"); valido = false; }
    if (!password) { mostrarError("regPasswordError", "Contraseña requerida"); valido = false; }
    else if (password.length < 8) { mostrarError("regPasswordError", "Mínimo 8 caracteres"); valido = false; }
    if (password !== confirmarPassword) { mostrarError("regConfirmError", "Las contraseñas no coinciden"); valido = false; }

    if (buscarUsuario(email)) { mostrarError("regEmailError", "Este correo ya está registrado"); valido = false; }

    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const passwordHash = await hashearPassword(password);
        guardarUsuario({ nombre, apellido, email, password: passwordHash });
        establecerCargando(boton, false);
        alert("Cuenta creada exitosamente");
        mostrarLogin();
    }, 500);
}

async function manejarLogin(e) {
    e.preventDefault();
    limpiarErrores();

    const { bloqueado, segundos } = estaBloqueado();
    if (bloqueado) {
        mostrarError("loginError", `Demasiados intentos. Intenta en ${segundos} segundos.`);
        return;
    }

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const recordar = document.getElementById("rememberMe").checked;
    const boton = document.getElementById("btnLogin");

    let valido = true;

    if (!email || !validarEmail(email)) { mostrarError("emailError", "Email inválido"); valido = false; }
    if (!password) { mostrarError("passwordError", "Contraseña requerida"); valido = false; }

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

        resetearIntentosFallidos();

        if (recordar) {
            localStorage.setItem("rememberEmail", email);
        } else {
            localStorage.removeItem("rememberEmail");
        }

        sessionStorage.setItem("usuario", usuario.nombre + " " + usuario.apellido);
        sessionStorage.setItem("usuarioEmail", usuario.email);
        localStorage.setItem("usuario", usuario.nombre + " " + usuario.apellido);
        localStorage.setItem("usuarioEmail", usuario.email);

        establecerCargando(boton, false);
        window.location.href = "../index.html";
    }, 500);
}

async function manejarCambiarPassword(e) {
    e.preventDefault();
    limpiarErrores();

    const email = localStorage.getItem("usuarioEmail");
    if (!email) {
        mostrarError("cambiarPasswordError", "No hay sesión activa");
        return;
    }

    const pwdActual = document.getElementById("pwdActual").value;
    const pwdNueva = document.getElementById("pwdNueva").value;
    const pwdConfirmar = document.getElementById("pwdConfirmar").value;
    const boton = document.getElementById("btnCambiarPassword");

    let valido = true;

    if (!pwdActual) { mostrarError("pwdActualError", "Contraseña actual requerida"); valido = false; }
    if (!pwdNueva) { mostrarError("pwdNuevaError", "Nueva contraseña requerida"); valido = false; }
    else if (pwdNueva.length < 8) { mostrarError("pwdNuevaError", "Mínimo 8 caracteres"); valido = false; }
    if (pwdNueva !== pwdConfirmar) { mostrarError("pwdConfirmarError", "Las contraseñas no coinciden"); valido = false; }

    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const hashActual = await hashearPassword(pwdActual);
        const usuario = buscarUsuario(email);

        if (!usuario || usuario.password !== hashActual) {
            establecerCargando(boton, false);
            mostrarError("pwdActualError", "Contraseña actual incorrecta");
            return;
        }

        const hashNueva = await hashearPassword(pwdNueva);
        const actualizado = actualizarPasswordUsuario(email, hashNueva);

        if (!actualizado) {
            establecerCargando(boton, false);
            mostrarError("cambiarPasswordError", "Error al actualizar");
            return;
        }

        establecerCargando(boton, false);
        alert("Contraseña cambiada exitosamente");
        mostrarLogin();
    }, 500);
}

function mostrarRecuperarPassword() {
    document.getElementById("login").style.display = "none";
    document.getElementById("crearCuenta").style.display = "none";
    document.getElementById("cambiarPassword").style.display = "none";
    document.getElementById("recuperarPassword").style.display = "block";
    document.getElementById("pasoEmail").style.display = "block";
    document.getElementById("pasoNuevaPassword").style.display = "none";
    document.getElementById("recEmail").focus();
    limpiarErrores();
}

async function manejarVerificarEmail(e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("recEmail").value.trim().toLowerCase();
    const boton = document.getElementById("btnVerificarEmail");

    let valido = true;

    if (!email || !validarEmail(email)) { mostrarError("recEmailError", "Email inválido"); valido = false; }

    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(() => {
        const usuario = buscarUsuario(email);
        if (!usuario) {
            establecerCargando(boton, false);
            mostrarError("recEmailError", "No existe una cuenta con este email");
            return;
        }

        document.getElementById("pasoEmail").style.display = "none";
        document.getElementById("pasoNuevaPassword").style.display = "block";
        document.getElementById("recNuevaPassword").focus();
        limpiarErrores();
        establecerCargando(boton, false);
    }, 500);
}

async function manejarActualizarPassword(e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("recEmail").value.trim().toLowerCase();
    const password = document.getElementById("recNuevaPassword").value;
    const confirmar = document.getElementById("recConfirmarPassword").value;
    const boton = document.getElementById("btnActualizarPassword");

    let valido = true;

    if (!password) { mostrarError("recNuevaPasswordError", "Nueva contraseña requerida"); valido = false; }
    else if (password.length < 8) { mostrarError("recNuevaPasswordError", "Mínimo 8 caracteres"); valido = false; }
    if (password !== confirmar) { mostrarError("recConfirmarPasswordError", "Las contraseñas no coinciden"); valido = false; }

    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const hashNuevo = await hashearPassword(password);
        const actualizado = actualizarPasswordUsuario(email, hashNuevo);

        if (!actualizado) {
            establecerCargando(boton, false);
            mostrarError("actualizarPasswordError", "Error al actualizar");
            return;
        }

        establecerCargando(boton, false);
        alert("Contraseña actualizada exitosamente");
        mostrarLogin();
    }, 500);
}

function mostrarFortalezaRecuperar(password) {
    const elementoFortaleza = document.getElementById("passwordStrengthRecuperar");
    if (!elementoFortaleza) return;
    const puntuacion = validarFortalezaPassword(password);
    const etiquetas = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
    const colores = ["#dc3545", "#fd7e14", "#ffc107", "#20c997", "#28a745"];
    if (password.length === 0 || puntuacion === 0) {
        elementoFortaleza.textContent = "";
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
    texto.style.cssText = `color:${colores[puntuacion - 1]}; font-size:12px;`;
    texto.textContent = etiquetas[puntuacion - 1];
    elementoFortaleza.innerHTML = "";
    elementoFortaleza.appendChild(barra);
    elementoFortaleza.appendChild(texto);
}