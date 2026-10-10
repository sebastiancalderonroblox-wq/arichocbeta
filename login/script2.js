
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

async function manejarVerificarEmail(e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("recEmail").value.trim().toLowerCase();
    const boton = document.getElementById("btnVerificarEmail");

    if (!email || !validarEmail(email)) {
        mostrarError("recEmailError", "Ingresa un correo electrónico válido");
        return;
    }

    establecerCargando(boton, true);
    setTimeout(() => {
        const usuario = buscarUsuario(email);
        establecerCargando(boton, false);

        if (!usuario) {
            mostrarError("recEmailError", "No existe ninguna cuenta asociada a este correo");
            return;
        }

        document.getElementById("pasoEmail").style.display = "none";
        document.getElementById("pasoNuevaPassword").style.display = "block";
        document.getElementById("recNuevaPassword").focus();
    }, 400);
}

async function manejarActualizarPassword(e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("recEmail").value.trim().toLowerCase();
    const password = document.getElementById("recNuevaPassword").value;
    const confirmar = document.getElementById("recConfirmarPassword").value;
    const boton = document.getElementById("btnActualizarPassword");

    let valido = true;
    if (!password || password.length < 8) { mostrarError("recNuevaPasswordError", "Debe tener al menos 8 caracteres"); valido = false; }
    if (password !== confirmar) { mostrarError("recConfirmarPasswordError", "Las contraseñas no coinciden"); valido = false; }
    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const hashNuevo = await hashearPassword(password);
        const actualizado = actualizarPasswordUsuario(email, hashNuevo);

        establecerCargando(boton, false);
        if (actualizado) {
            mostrarToast("Contraseña actualizada con éxito", "exito");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } else {
            mostrarError("actualizarPasswordError", "Error al actualizar la contraseña");
        }
    }, 400);
}

async function manejarCambiarPassword(e) {
    e.preventDefault();
    limpiarErrores();

    const email = localStorage.getItem("usuarioEmail");
    if (!email) {
        mostrarError("cambiarPasswordError", "No hay una sesión activa para cambiar contraseña");
        return;
    }

    const pwdActual = document.getElementById("pwdActual").value;
    const pwdNueva = document.getElementById("pwdNueva").value;
    const pwdConfirmar = document.getElementById("pwdConfirmar").value;
    const boton = document.getElementById("btnCambiarPassword");

    let valido = true;
    if (!pwdActual) { mostrarError("pwdActualError", "Ingresa tu contraseña actual"); valido = false; }
    if (!pwdNueva || pwdNueva.length < 8) { mostrarError("pwdNuevaError", "Mínimo 8 caracteres"); valido = false; }
    if (pwdNueva !== pwdConfirmar) { mostrarError("pwdConfirmarError", "Las contraseñas no coinciden"); valido = false; }
    if (!valido) return;

    establecerCargando(boton, true);
    setTimeout(async () => {
        const hashActual = await hashearPassword(pwdActual);
        const usuario = buscarUsuario(email);

        if (!usuario || usuario.password !== hashActual) {
            establecerCargando(boton, false);
            mostrarError("pwdActualError", "La contraseña actual es incorrecta");
            return;
        }

        const hashNueva = await hashearPassword(pwdNueva);
        const actualizado = actualizarPasswordUsuario(email, hashNueva);

        establecerCargando(boton, false);
        if (actualizado) {
            mostrarToast("Contraseña cambiada exitosamente", "exito");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        } else {
            mostrarError("cambiarPasswordError", "No se pudo actualizar la contraseña");
        }
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const debeCambiar = urlParams.get("cambiar") === "1";
    const estaLogueado = !!localStorage.getItem("usuarioEmail");

    if (debeCambiar && estaLogueado) {
        document.getElementById("recuperarPassword").style.display = "none";
        document.getElementById("cambiarPassword").style.display = "block";
    } else {
        document.getElementById("recuperarPassword").style.display = "block";
        document.getElementById("cambiarPassword").style.display = "none";
    }

    document.getElementById("toggleRecNuevaPassword").addEventListener("click", () => alternarPassword("recNuevaPassword", "toggleRecNuevaPassword"));
    document.getElementById("toggleRecConfirmarPassword").addEventListener("click", () => alternarPassword("recConfirmarPassword", "toggleRecConfirmarPassword"));
    document.getElementById("togglePwdActual").addEventListener("click", () => alternarPassword("pwdActual", "togglePwdActual"));
    document.getElementById("togglePwdNueva").addEventListener("click", () => alternarPassword("pwdNueva", "togglePwdNueva"));
    document.getElementById("togglePwdConfirmar").addEventListener("click", () => alternarPassword("pwdConfirmar", "togglePwdConfirmar"));

    document.getElementById("recNuevaPassword").addEventListener("input", (e) => {
        renderizarBarraFortaleza("passwordStrengthRecuperar", e.target.value);
        limpiarError("recNuevaPasswordError");
    });

    document.getElementById("pwdNueva").addEventListener("input", (e) => {
        renderizarBarraFortaleza("passwordStrengthCambio", e.target.value);
        limpiarError("pwdNuevaError");
    });

    ["recEmail", "recConfirmarPassword", "pwdActual", "pwdConfirmar"].forEach(id => {
        document.getElementById(id).addEventListener("input", () => limpiarError(id + "Error"));
    });

    document.getElementById("btnVerificarEmail").addEventListener("click", manejarVerificarEmail);
    document.getElementById("btnActualizarPassword").addEventListener("click", manejarActualizarPassword);
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
