// --- Custom Cursor Logic ---
const cursor = document.getElementById('cursor');

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseover', (e) => {
    if (!cursor) return;
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('.card')) {
        cursor.classList.add('hovered');
    } else {
        const isInteractive = e.target.closest('a') || e.target.closest('button') || e.target.closest('.card');
        if (!isInteractive) {
            cursor.classList.remove('hovered');
        }
    }
});


// --- Starfield Canvas Logic ---
const canvas = document.getElementById('starfield');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    const starCount = 600;

    // Star colors: White, Pale Blue (AstroBin theme), Pale Yellow
    const starColors = ['255, 255, 255', '200, 220, 255', '255, 250, 220', '88, 166, 255'];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Star {
        constructor() {
            this.baseX = Math.random() * width;
            this.baseY = Math.random() * height;
            this.z = Math.random() * 1.5 + 0.5;
            this.size = Math.random() * 1.8;
            this.color = starColors[Math.floor(Math.random() * starColors.length)];
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleOffset = Math.random() * Math.PI * 2;
        }
        update() {
            this.baseY += 0.08 * this.z;
            if (this.baseY > height) {
                this.baseY = -10;
                this.baseX = Math.random() * width;
            }
        }
        draw() {
            const centerX = width / 2;
            const centerY = height / 2;

            const mx = (mouseX === 0 && mouseY === 0) ? centerX : mouseX;
            const my = (mouseY === 0 && mouseY === 0) ? centerY : mouseY;

            const offsetX = (mx - centerX) * 0.008 * this.z;
            const offsetY = (my - centerY) * 0.008 * this.z;

            const scrollY = window.scrollY;
            const scrollOffset = (scrollY % height) * 0.08 * this.z;

            let x = this.baseX - offsetX;
            let y = this.baseY - offsetY - scrollOffset;

            if (height > 0) {
                y = ((y % height) + height) % height;
            }

            // No twinkle
            const alpha = (this.z / 2.5);

            ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        resize();
        stars = [];
        for (let i = 0; i < starCount; i++) stars.push(new Star());
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(s => {
            s.update();
            s.draw();
        });
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
        resize();
        initStars();
    });

    initStars();
    animateStars();
}


// --- Page Animations ---
function initPageAnimations() {
    const sections = document.querySelectorAll('.section, .hero, .container > *');
    sections.forEach((el, index) => {
        if (!el.classList.contains('float-in')) {
            el.style.animationDelay = `${index * 0.1}s`;
            el.classList.add('float-in');
        }
    });
}

// Intersection Observer for fade-in-up elements
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// --- Gallery Filter Logic ---
function initGalleryFilters() {
    const buttons = document.querySelectorAll('.btn-filter');
    const sections = document.querySelectorAll('.category-section');

    if (!buttons.length || !sections.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'transparent';
                b.style.color = 'var(--text-color)';
            });

            // Add active class to clicked button
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--accent-cyan)';
            btn.style.color = 'var(--bg-color)';

            const filterValue = btn.getAttribute('data-filter');

            sections.forEach(section => {
                if (filterValue === 'all' || section.getAttribute('data-category') === filterValue) {
                    section.style.display = 'block';
                    section.classList.add('fade-in-up');
                    section.classList.add('visible');
                } else {
                    section.style.display = 'none';
                    section.classList.remove('visible');
                }
            });
        });
    });

    // Set initial active state style
    const activeBtn = document.querySelector('.btn-filter.active');
    if (activeBtn) {
        activeBtn.style.backgroundColor = 'var(--accent-cyan)';
        activeBtn.style.color = 'var(--bg-color)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initPageAnimations();
    initScrollAnimations();
    initGalleryFilters();
});


// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});


// --- SPA Logic ---
let lastPathname = window.location.pathname;

document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');

    if (!link) return;
    const href = link.getAttribute('href');

    if (!href || href.startsWith('mailto') || link.hasAttribute('download') || link.target === '_blank') return;

    const linkUrl = new URL(link.href, window.location.origin);
    const currentUrl = new URL(window.location.href);

    if (linkUrl.pathname === currentUrl.pathname && linkUrl.search === currentUrl.search && linkUrl.hash) {
        e.preventDefault();
        const targetId = linkUrl.hash.substring(1);
        let targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 60;
            const extraPadding = 0;

            const elementRect = targetElement.getBoundingClientRect();
            const targetPos = elementRect.top + window.pageYOffset - navbarHeight - extraPadding;
            const startPos = window.pageYOffset;
            const distance = targetPos - startPos;
            const duration = 1000; // Slower 1000ms smooth scroll (doubled)
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);

                const ease = percentage < 0.5
                    ? 4 * percentage * percentage * percentage
                    : 1 - Math.pow(-2 * percentage + 2, 3) / 2;

                window.scrollTo(0, startPos + distance * ease);

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    document.documentElement.style.scrollBehavior = ''; // Restore CSS smooth scroll
                }
            }

            // Disable CSS smooth scroll to prevent conflict with JS manual scroll
            document.documentElement.style.scrollBehavior = 'auto';

            window.requestAnimationFrame(step);
        }
        return;
    }

    if (linkUrl.origin !== currentUrl.origin) return;

    if (href.match(/\.(png|jpg|jpeg|gif|webp|pdf)$/i)) return;

    if (window.location.protocol === 'file:') return;

    e.preventDefault();
    await navigateTo(href);
});

window.addEventListener('popstate', () => {
    const currentPathname = window.location.pathname;

    if (currentPathname === lastPathname) {
        return;
    }

    lastPathname = currentPathname;
    navigateTo(currentPathname, false);
});

async function navigateTo(url, pushState = true) {
    const mainContent = document.querySelector('#main-content');

    if (!mainContent) {
        window.location.href = url;
        return;
    }

    mainContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(20px)';

    await new Promise(r => setTimeout(r, 300));

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newContent = doc.querySelector('#main-content');

        if (!newContent) throw new Error('No #main-content in target page');

        if (pushState) {
            window.history.pushState({}, '', url);
            lastPathname = window.location.pathname;
        }

        document.title = doc.title;
        mainContent.innerHTML = newContent.innerHTML;

        window.scrollTo(0, 0);

        if (window.renderHeader) window.renderHeader();
        if (window.renderFooter) window.renderFooter();

        if (window.updateActiveLink) window.updateActiveLink();

        requestAnimationFrame(() => {
            mainContent.style.transition = 'none';
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(20px)';

            requestAnimationFrame(() => {
                mainContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
                initPageAnimations();
                initScrollAnimations();
                initGalleryFilters();
            });
        });

    } catch (err) {
        console.warn('SPA Navigation failed, falling back to reload:', err);
        window.location.href = url;
    }
}
