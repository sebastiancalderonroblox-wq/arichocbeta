// Scroll del carrusel
function scrollCarousel(direction) {
    const carousel = document.getElementById('carousel');
    const scrollAmount = 250;
    
    if (direction === -1) {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    } else {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Verificar autenticación al cargar

    
    // Mostrar nombre de usuario
    const userElement = document.getElementById("usuario-nombre");
    if (userElement) {
        userElement.textContent = localStorage.getItem("usuario") || "Usuario";
    }
    
    // Configurar dropdown de usuario
    setupUserDropdown();
;

function setupUserDropdown() {
    const userBtn = document.getElementById("userBtn");
    const userDropdown = document.getElementById("userDropdown");
    const dropdownUserName = document.getElementById("dropdownUserName");
    const dropdownUserEmail = document.getElementById("dropdownUserEmail");
    const btnLogout = document.getElementById("btnLogout");
    
    if (!userBtn || !userDropdown) return;
    
    // Llenar datos del usuario
    if (dropdownUserName) dropdownUserName.textContent = localStorage.getItem("usuario") || "Usuario";
    if (dropdownUserEmail) dropdownUserEmail.textContent = localStorage.getItem("usuarioEmail") || "";
    
    // Toggle dropdown
    userBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
        if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove("show");
        }
    });
    
    // Logout
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("usuarioEmail");
            sessionStorage.removeItem("usuario");
            sessionStorage.removeItem("usuarioEmail");
            window.location.href = "../index.html";
        });
    }
    
    // Perfil y pedidos (placeholders)
    const btnPerfil = document.getElementById("btnPerfil");
    const btnPedidos = document.getElementById("btnPedidos");
    
    if (btnPerfil) {
        btnPerfil.addEventListener("click", () => {
            userDropdown.classList.remove("show");
            window.location.href = "../login/login.html";
        });
    }
    
    if (btnPedidos) {
        btnPedidos.addEventListener("click", () => {
            userDropdown.classList.remove("show");
            alert("Próximamente: Mis pedidos");
        });
    }
}

// Toggle del chat bot
function toggleChat() {
    alert('Chat bot abierto');
    // Aquí puedes agregar la lógica para abrir un chat real
}

// Agregar evento de click a las tarjetas de productos
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card, .carousel-item');
    
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productName = card.querySelector('h3').textContent;
            const productPrice = card.querySelector('.price').textContent;
            console.log(`Producto: ${productName} - Precio: ${productPrice}`);
            // Aquí puedes agregar la lógica para agregar al carrito o ver detalles
        });
    });

    // Funcionalidad de búsqueda
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            alert('Abrir búsqueda');
        });
    }

    // Funcionalidad de carrito
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            alert('Carrito de compras');
        });
    }

    // Smooth scroll para los links de navegación
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId !== '#') {
                let targetSection = document.querySelector(targetId);
                // Manejar mesas-dulces -> scroll a meriendas
                if (targetId === '#mesas-dulces') {
                    targetSection = document.querySelector('#meriendas');
                }
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// Agregar IDs a las secciones para el smooth scroll
document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.querySelector('.welcome-section');
    const surpriseSection = document.querySelector('.surprise-section');
    const bestSellersSection = document.querySelector('.best-sellers-section');
    const footer = document.querySelector('.footer');
    
    welcomeSection.id = 'inicio';
    surpriseSection.id = 'meriendas';
    // Agregar ID adicional para mesas de dulces (usa la misma sección)
    surpriseSection.dataset.mesasId = 'mesas-dulces';
    bestSellersSection.id = 'detalles';
    footer.id = 'adicionales';
});

// Animación de aparición de elementos al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card, .carousel-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});