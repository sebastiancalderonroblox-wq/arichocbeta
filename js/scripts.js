// Scroll del carrusel
function desplazarCarrusel(direccion) {
    const carrusel = document.getElementById('carrusel');
    const cantidadDesplazamiento = 250;

    if (direccion === -1) {
        carrusel.scrollBy({
            left: -cantidadDesplazamiento,
            behavior: 'smooth'
        });
    } else {
        carrusel.scrollBy({
            left: cantidadDesplazamiento,
            behavior: 'smooth'
        });
    }
}

// Verificar autenticación al cargar
function actualizarUIAuth(logueado) {
    const elementoUsuario = document.getElementById("usuario-nombre");
    const menuUsuario = document.getElementById("menuUsuario");
    const botonLoginHeader = document.getElementById("botonLoginHeader");

    if (elementoUsuario) {
        elementoUsuario.textContent = logueado
            ? localStorage.getItem("usuario")
            : "Usuario";
    }

    // Mostrar/ocultar menú de usuario (botón + dropdown)
    if (menuUsuario) {
        menuUsuario.style.display = logueado ? 'flex' : 'none';
    }

    // Mostrar/ocultar botón de login
    if (botonLoginHeader) {
        botonLoginHeader.style.display = logueado ? 'none' : 'inline-flex';
    }
}

function configurarDropdownUsuario() {
    const botonUsuario = document.getElementById("botonUsuario");
    const dropdownUsuario = document.getElementById("dropdownUsuario");
    const dropdownNombreUsuario = document.getElementById("dropdownNombreUsuario");
    const dropdownEmailUsuario = document.getElementById("dropdownEmailUsuario");
    const botonCerrarSesion = document.getElementById("botonCerrarSesion");

    if (!botonUsuario || !dropdownUsuario) return;

    // Llenar datos del usuario (textContent para evitar XSS)
    if (dropdownNombreUsuario) dropdownNombreUsuario.textContent = localStorage.getItem("usuario") || "Usuario";
    if (dropdownEmailUsuario) dropdownEmailUsuario.textContent = localStorage.getItem("usuarioEmail") || "";

    // Alternar dropdown
    botonUsuario.addEventListener("click", (e) => {
        e.stopPropagation();
        const abierto = dropdownUsuario.classList.toggle("mostrar");
        botonUsuario.setAttribute("aria-expanded", abierto);
    });

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
        if (!botonUsuario.contains(e.target) && !dropdownUsuario.contains(e.target)) {
            dropdownUsuario.classList.remove("mostrar");
            botonUsuario.setAttribute("aria-expanded", "false");
        }
    });

    // Cerrar sesión
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("usuarioEmail");
            sessionStorage.removeItem("usuario");
            sessionStorage.removeItem("usuarioEmail");
            window.location.href = "index.html";
        });
    }

    // Perfil y pedidos (marcadores de posición - usar logs en lugar de alert)
    const botonPerfil = document.getElementById("botonPerfil");
    const botonPedidos = document.getElementById("botonPedidos");

    if (botonPerfil) {
        botonPerfil.addEventListener("click", () => {
            dropdownUsuario.classList.remove("mostrar");
            console.log("Navegar a: Mi perfil");
        });
    }

    if (botonPedidos) {
        botonPedidos.addEventListener("click", () => {
            dropdownUsuario.classList.remove("mostrar");
            console.log("Navegar a: Mis pedidos");
        });
    }

    // Cambiar contraseña
    const botonCambiarPassword = document.getElementById("botonCambiarPassword");
    if (botonCambiarPassword) {
        botonCambiarPassword.addEventListener("click", () => {
            dropdownUsuario.classList.remove("mostrar");
            window.location.href = "login/login.html?cambiar=1";
        });
    }
}

// Alternar bot de chat
function alternarChat() {
    console.log("Chat bot abierto");
    // Aquí se puede agregar la lógica para abrir el chat
}

function inicializarChat() {
    const botonChat = document.getElementById('botonChat');
    if (botonChat) {
        botonChat.addEventListener('click', alternarChat);
    }
}

// Productos datos - con categorías para filtrado
const PRODUCTOS = [
    { id: 1, nombre: "Merienda Clásica", precio: 20000, imagen: "img/producto-1.jpg", categoria: "meriendas" },
    { id: 2, nombre: "Merienda Dulce", precio: 25000, imagen: "img/producto-2.jpg", categoria: "meriendas" },
    { id: 3, nombre: "Mesa Dulce Pequeña", precio: 80000, imagen: "img/producto-3.jpg", categoria: "mesas-dulces" },
    { id: 4, nombre: "Mesa Dulce Mediana", precio: 120000, imagen: "img/producto-4.jpg", categoria: "mesas-dulces" },
    { id: 5, nombre: "Detalle Personalizado", precio: 15000, imagen: "img/producto-5.jpg", categoria: "mesas-dulces" },
    { id: 6, nombre: "Detalle Premium", precio: 18000, imagen: "img/producto-9.jpg", categoria: "mesas-dulces" },
    { id: 7, nombre: "Detalle Especial", precio: 22000, imagen: "img/producto-10.jpg", categoria: "mesas-dulces" },
    { id: 8, nombre: "Detalle Elegante", precio: 16000, imagen: "img/producto-11.jpg", categoria: "mesas-dulces" },
    { id: 6, nombre: "Detalle Premium", precio: 18000, imagen: "img/producto-9.jpg", categoria: "mesas-dulces" },
    { id: 7, nombre: "Detalle Especial", precio: 22000, imagen: "img/producto-10.jpg", categoria: "mesas-dulces" },
    { id: 8, nombre: "Detalle Elegante", precio: 16000, imagen: "img/producto-11.jpg", categoria: "detalles" },
    { id: 9, nombre: "Adicional Flores", precio: 10000, imagen: "img/producto-6.jpg", categoria: "detalles" },
    { id: 10, nombre: "Adicional Globos", precio: 8000, imagen: "img/producto-7.jpg", categoria: "detalles" },
    { id: 11, nombre: "Adicional Tarjetas", precio: 5000, imagen: "img/producto-8.jpg", categoria: "detalles" },
    { id: 9, nombre: "Adicional Flores", precio: 10000, imagen: "img/producto-6.jpg", categoria: "adicionales" },
    { id: 10, nombre: "Adicional Globos", precio: 8000, imagen: "img/producto-7.jpg", categoria: "adicionales" },
    { id: 11, nombre: "Adicional Tarjetas", precio: 5000, imagen: "img/producto-8.jpg", categoria: "adicionales" },
];

function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(valor);
}

function crearTarjetaProducto(producto, esCarrusel = false) {
    const tarjeta = document.createElement("div");
    tarjeta.className = esCarrusel ? "item-carrusel" : "tarjeta-producto";
    if (!esCarrusel) tarjeta.setAttribute("tabindex", "0");
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("aria-label", `${producto.nombre} - $${formatearPrecio(producto.precio)}`);

    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.loading = "lazy";

    const h3 = document.createElement("h3");
    h3.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = `$${formatearPrecio(producto.precio)}`;

    tarjeta.appendChild(img);
    tarjeta.appendChild(h3);
    tarjeta.appendChild(precio);

    tarjeta.addEventListener("click", () => {
        console.log(`Producto: ${producto.nombre} - Precio: $${formatearPrecio(producto.precio)}`);
    });

    tarjeta.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            tarjeta.click();
        }
    });

    return tarjeta;
}

// ============================================
// SORPRÉNDEME - ROTACIÓN ALEATORIA
// ============================================

let intervaloSorprendeme = null;
let sorprendemePausado = false;

function obtenerProductosAleatorios(cantidad) {
    const copia = [...PRODUCTOS];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, cantidad);
}

function renderProductosSorprendeme() {
    const grid = document.getElementById('cuadricula-productos');
    if (!grid) return;

    const tarjetasActuales = grid.querySelectorAll('.tarjeta-producto');
    tarjetasActuales.forEach(t => t.classList.add('fade-out'));

    setTimeout(() => {
        const nuevos = obtenerProductosAleatorios(4);
        grid.innerHTML = '';
        nuevos.forEach(p => grid.appendChild(crearTarjetaProducto(p, false)));

        const nuevasTarjetas = grid.querySelectorAll('.tarjeta-producto');
        nuevasTarjetas.forEach((t, i) => {
            t.style.animationDelay = `${i * 0.1}s`;
            t.classList.add('fade-in');
        });

        inicializarObservadorScroll();
    }, 400);
}

function iniciarRotacionSorprendeme() {
    if (intervaloSorprendeme) clearInterval(intervaloSorprendeme);
    intervaloSorprendeme = setInterval(() => {
        if (!sorprendemePausado) renderProductosSorprendeme();
    }, 15000);
}

function pausarRotacionSorprendeme() {
    sorprendemePausado = true;
}

function reanudarRotacionSorprendeme() {
    sorprendemePausado = false;
}

function renderProductos() {
    const grid = document.querySelector(".cuadricula-productos");
    if (!grid) return;
    grid.innerHTML = "";
    PRODUCTOS.forEach(producto => {
        grid.appendChild(crearTarjetaProducto(producto, false));
    });
}

function renderCarrusel() {
    const carrusel = document.getElementById("carrusel");
    if (!carrusel) return;
    carrusel.innerHTML = "";
    PRODUCTOS.slice(0, 4).forEach(producto => {
        carrusel.appendChild(crearTarjetaProducto(producto, true));
    });
}

function renderProductosSeccion(idContenedor, categoria) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    contenedor.innerHTML = "";
    const productosFiltrados = PRODUCTOS.filter(p => p.categoria === categoria);
    productosFiltrados.forEach(producto => {
        contenedor.appendChild(crearTarjetaProducto(producto, false));
    });
}

// ============================================
// FUNCIONALIDAD DEL MODAL DE BÚSQUEDA
// ============================================

// Estado de la búsqueda
let estadoBusqueda = {
    termino: '',
    categoria: 'todas',
    filtro: 'todas',
    precioMaximo: 115000
};

// Elementos del DOM para búsqueda
let modalBusqueda = null;
let inputBusqueda = null;
let gridResultados = null;
let noResultados = null;
let inputPrecio = null;
let precioValor = null;
let filtrosTabs = null;
let itemsSidebar = null;

// Inicializar modal de búsqueda
function inicializarModalBusqueda() {
    modalBusqueda = document.getElementById('searchModal');
    inputBusqueda = document.getElementById('searchInput');
    gridResultados = document.getElementById('searchResultsGrid');
    noResultados = document.getElementById('noResults');
    inputPrecio = document.getElementById('priceRange');
    precioValor = document.getElementById('priceRangeValue');
    botonBuscar = document.querySelector('.boton-buscar');
    botonCerrar = document.querySelector('.boton-cerrar');
    filtrosTabs = document.querySelectorAll('.pestana-filtro');
    itemsSidebar = document.querySelectorAll('.elemento-barra-lateral');

    if (!modalBusqueda) return; // No hay modal en esta página

    // Botón abrir búsqueda
    const botonBuscarHeader = document.querySelector('.boton-buscar');
    if (botonBuscarHeader) {
        botonBuscarHeader.addEventListener('click', abrirModalBusqueda);
    }

    // Botón cerrar
    if (botonCerrar) {
        botonCerrar.addEventListener('click', cerrarModalBusqueda);
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBusqueda?.classList.contains('activa')) {
            cerrarModalBusqueda();
        }
    });

    // Cerrar al hacer click fuera del contenido
    modalBusqueda.addEventListener('click', (e) => {
        if (e.target === modalBusqueda) {
            cerrarModalBusqueda();
        }
    });

    // Campo de búsqueda en tiempo real
    const inputBusquedaEl = document.getElementById('searchInput');
    if (inputBusquedaEl) {
        let timeoutBusqueda;
        inputBusquedaEl.addEventListener('input', (e) => {
            clearTimeout(timeoutBusqueda);
            timeoutBusqueda = setTimeout(() => {
                estadoBusqueda.termino = e.target.value.toLowerCase();
                filtrarResultados();
            }, 300);
        });
    }

    // Filtros de pestañas
    document.querySelectorAll('.pestana-filtro').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.pestana-filtro').forEach(t => t.classList.remove('activa'));
            this.classList.add('activa');
            estadoBusqueda.filtro = this.dataset.filter;
            filtrarResultados();
        });
    });

    // Categorías en barra lateral
    document.querySelectorAll('.elemento-barra-lateral').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.elemento-barra-lateral').forEach(i => i.classList.remove('activa'));
            this.classList.add('activa');
            estadoBusqueda.categoria = this.dataset.category;
            filtrarResultados();
        });
    });

    // Control deslizante de precio
    const inputPrecioEl = document.getElementById('priceRange');
    const precioValorEl = document.getElementById('priceRangeValue');
    if (inputPrecioEl && precioValorEl) {
        inputPrecioEl.addEventListener('input', function() {
            estadoBusqueda.precioMaximo = parseInt(this.value);
            precioValorEl.textContent = formatearPrecio(estadoBusqueda.precioMaximo);
            filtrarResultados();
        });
    }
}

// Abrir modal de búsqueda
function abrirModalBusqueda() {
    const modal = document.getElementById('searchModal');
    const contenidoPrincipal = document.getElementById('mainContent');

    if (!modal) return;

    modal.classList.add('activa');
    document.body.style.overflow = 'hidden';

    // Enfocar input después de la animación
    setTimeout(() => {
        const input = document.getElementById('searchInput');
        if (input) input.focus();
    }, 100);

    // Resetear estado de búsqueda
    estadoBusqueda = {
        termino: '',
        categoria: 'all',
        filtro: 'all',
        precioMaximo: 115000
    };

    // Resetear UI
    const input = document.getElementById('searchInput');
    if (input) input.value = '';

    document.querySelectorAll('.pestana-filtro').forEach(t => t.classList.remove('activa'));
    const tabTodas = document.querySelector('.pestana-filtro[data-filter="all"]');
    if (tabTodas) tabTodas.classList.add('activa');

    document.querySelectorAll('.elemento-barra-lateral').forEach(i => i.classList.remove('activa'));
    const itemTodas = document.querySelector('.elemento-barra-lateral[data-category="all"]');
    if (itemTodas) itemTodas.classList.add('activa');

    const inputPrecio = document.getElementById('priceRange');
    if (inputPrecio) inputPrecio.value = 115000;

    const precioValorEl = document.getElementById('priceRangeValue');
    if (precioValorEl) precioValorEl.textContent = formatearPrecio(115000);

    filtrarResultados();
}

function cerrarModalBusqueda() {
    const modal = document.getElementById('searchModal');
    if (!modal) return;

    modal.classList.remove('activa');
    document.body.style.overflow = '';

    // Limpiar input
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
}

// Filtrar y mostrar resultados
function filtrarResultados() {
    if (!gridResultados) {
        gridResultados = document.getElementById('searchResultsGrid');
    }
    if (!noResultados) {
        noResultados = document.getElementById('noResults');
    }

    if (!gridResultados) return;

    let productosFiltrados = PRODUCTOS.filter(producto => {
        // Filtrar por término de búsqueda
        if (estadoBusqueda.termino && !producto.nombre.toLowerCase().includes(estadoBusqueda.termino)) {
            return false;
        }

        // Filtrar por categoría
        if (estadoBusqueda.categoria !== 'all' && producto.categoria !== estadoBusqueda.categoria) {
            return false;
        }

        // Filtrar por precio
        if (producto.precio > estadoBusqueda.precioMaximo) {
            return false;
        }

        return true;
    });

    // Renderizar resultados
    if (!gridResultados) return;
    gridResultados.innerHTML = '';

    if (productosFiltrados.length === 0) {
        if (noResultados) noResultados.style.display = 'block';
        return;
    }

    if (noResultados) noResultados.style.display = 'none';

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-resultado';
        tarjeta.setAttribute('role', 'option');
        tarjeta.setAttribute('tabindex', '0');
        tarjeta.setAttribute('aria-label', `${producto.nombre} - $${formatearPrecio(producto.precio)}`);

        tarjeta.innerHTML = `
            <div class="imagen-resultado">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span style="display:none; font-size: 32px;">🍫</span>
            </div>
            <div class="nombre-resultado">${producto.nombre}</div>
            <div class="precio-resultado">$${formatearPrecio(producto.precio)}</div>
        `;

        tarjeta.addEventListener('click', () => {
            console.log(`Producto seleccionado: ${producto.nombre} - $${formatearPrecio(producto.precio)}`);
            // Aquí podrías navegar a la página del producto
        });

        tarjeta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tarjeta.click();
            }
        });

        gridResultados.appendChild(tarjeta);
    });
}

// Exponer funciones globalmente
window.abrirModalBusqueda = abrirModalBusqueda;
window.cerrarModalBusqueda = cerrarModalBusqueda;

// Inicialización principal
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const estaLogueado = !!localStorage.getItem("usuario");
    actualizarUIAuth(estaLogueado);

    // Configurar dropdown solo si está logueado
    if (estaLogueado) {
        configurarDropdownUsuario();
    }

    // Agregar IDs a las secciones para el smooth scroll
    const seccionBienvenida = document.querySelector('.seccion-bienvenida');
    const seccionSorpresa = document.querySelector('.seccion-sorpresa');
    const seccionMesasDulces = document.querySelector('.seccion-mesas-dulces');
    const seccionDetalles = document.querySelector('.seccion-detalles');
    const seccionMasVendidos = document.querySelector('.seccion-mas-vendidos');
    const piePagina = document.querySelector('.pie-pagina');

    if (seccionBienvenida) seccionBienvenida.id = 'inicio';
    if (seccionSorpresa) seccionSorpresa.id = 'meriendas';
    if (seccionMesasDulces) seccionMesasDulces.id = 'mesas-dulces';
    if (seccionDetalles) seccionDetalles.id = 'detalles';
    if (seccionMasVendidos) seccionMasVendidos.id = 'adicionales';
    if (piePagina) piePagina.id = 'contacto';

    // Renderizar productos
    renderProductosSorprendeme();
    renderCarrusel();
    renderProductosSeccion('cuadricula-mesas-dulces', 'mesas-dulces');
    renderProductosSeccion('cuadricula-detalles', 'detalles');

    // Inicializar componentes
    inicializarChat();
    inicializarModalBusqueda();

    // Iniciar rotación aleatoria en Sorpréndeme
    iniciarRotacionSorprendeme();

    // Pause on hover para Sorpréndeme
    const seccionSorpresaEl = document.querySelector('.seccion-sorpresa');
    if (seccionSorpresaEl) {
        seccionSorpresaEl.addEventListener('mouseenter', pausarRotacionSorprendeme);
        seccionSorpresaEl.addEventListener('mouseleave', reanudarRotacionSorprendeme);
    }

    // Funcionalidad de carrito
    const botonCarrito = document.querySelector('.boton-carrito');
    if (botonCarrito) {
        botonCarrito.addEventListener('click', () => {
            alert('Carrito de compras en desarrollo');
        });
    }

    // Smooth scroll para los links de navegación
    const enlacesNavegacion = document.querySelectorAll('.navegacion a');
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const idObjetivo = enlace.getAttribute('href');
            if (idObjetivo !== '#') {
                let seccionObjetivo = document.querySelector(idObjetivo);
                if (seccionObjetivo) {
                    seccionObjetivo.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Animación de aparición de elementos al scroll
    function inicializarObservadorScroll() {
        const opcionesObservador = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.style.opacity = '1';
                    entrada.target.style.transform = 'translateY(0)';
                }
            });
        }, opcionesObservador);

        const tarjetas = document.querySelectorAll('.tarjeta-producto, .item-carrusel');
        tarjetas.forEach(tarjeta => {
            tarjeta.style.opacity = '0';
            tarjeta.style.transform = 'translateY(20px)';
            tarjeta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observador.observe(tarjeta);
        });
    }

    inicializarObservadorScroll();
});