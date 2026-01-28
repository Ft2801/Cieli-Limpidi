const siteConfig = {
    name: "Cieli Limpidi",
    root: "/",
};

function getPathPrefix() {
    const path = window.location.pathname.replace(/\\/g, '/');
    return path.includes('/pages/') ? '../' : '';
}

function renderHeader() {
    const prefix = getPathPrefix();
    const existingNavbar = document.querySelector('.navbar');

    if (existingNavbar) {
        // Update links in place
        const logo = existingNavbar.querySelector('.logo');
        if (logo) logo.setAttribute('href', `${prefix}index.html`);

        const navLinks = existingNavbar.querySelectorAll('.nav-links a');
        const linksData = [
            'index.html',
            'pages/storia.html',
            'pages/gallery.html',
            'pages/software.html',
            'pages/tutorials.html'
        ];

        navLinks.forEach((link, index) => {
            if (linksData[index]) {
                link.setAttribute('href', `${prefix}${linksData[index]}`);
            }
        });
        return;
    }

    // Initial render
    const headerHTML = `
    <nav class="navbar">
        <div class="container nav-container">
            <a href="${prefix}index.html" class="logo ajax-link">Cieli Limpidi</a>
            
            <button class="hamburger" aria-label="Menu">
                <span class="hamburger-inner"></span>
            </button>

            <ul class="nav-links">
                <li><a href="${prefix}index.html" class="ajax-link">Home</a></li>
                <li><a href="${prefix}pages/storia.html" class="ajax-link">La Nostra Storia</a></li>
                <li><a href="${prefix}pages/gallery.html" class="ajax-link">Galleria</a></li>
                <li><a href="${prefix}pages/software.html" class="ajax-link">Software</a></li>
                <li><a href="${prefix}pages/tutorials.html" class="ajax-link">Tutorial</a></li>
            </ul>
        </div>
    </nav>
    <div class="mobile-nav-overlay"></div>
    `;

    const body = document.body;
    body.insertAdjacentHTML('afterbegin', headerHTML);

    setTimeout(() => {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.mobile-nav-overlay');

        function toggleMenu() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        }

        if (hamburger) {
            hamburger.addEventListener('click', toggleMenu);
        }

        if (overlay) {
            overlay.addEventListener('click', toggleMenu);
        }

        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) toggleMenu();
                });
            });
        }
    }, 50);
}

function renderFooter() {
    const old = document.querySelector('footer');
    if (old) old.remove();

    const prefix = getPathPrefix();

    const footerHTML = `
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>Cieli Limpidi</h3>
                    <p>Gruppo di Astrofili Abruzzesi. Passione per l'astronomia e l'astrofotografia dal cuore dell'Abruzzo.</p>
                </div>
                
                <div class="footer-links">
                    <h4>Navigazione</h4>
                    <ul>
                        <li><a href="${prefix}index.html" class="ajax-link">Home</a></li>
                        <li><a href="${prefix}pages/storia.html" class="ajax-link">La Nostra Storia</a></li>
                        <li><a href="${prefix}pages/gallery.html" class="ajax-link">Galleria</a></li>
                        <li><a href="${prefix}pages/software.html" class="ajax-link">Software TStar</a></li>
                        <li><a href="${prefix}pages/tutorials.html" class="ajax-link">Tutorial</a></li>
                    </ul>
                </div>


            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 Cieli Limpidi. Tutti i diritti riservati.</p>
                <p style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">
                    Sito realizzato da <a href="https://ft2801.github.io/Portfolio/" target="_blank">Fabio Tempera</a>
                </p>
            </div>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    updateActiveLink();
});

function updateActiveLink() {
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        const filename = href.split('/').pop();

        link.classList.remove('active');
        link.style.color = '';

        if (filename === 'index.html') {
            if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || !currentPath.endsWith('.html')) {
                if (!currentPath.includes('/pages/')) {
                    link.classList.add('active');
                    return;
                }
            }
        }

        if (currentPath.includes(filename) && filename !== '') {
            link.classList.add('active');
        }
    });
}
