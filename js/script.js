/* =============================================
   Portfolio JavaScript
   Mohammad Dicky Darmawan
   ============================================= */

(function () {
    'use strict';

    /* ---------- Theme Toggle ---------- */
    const THEME_KEY = 'portfolio_theme';

    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch { /* ignore */ }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = themeToggle && themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    const themeToggle = document.getElementById('theme-toggle');

    /* Apply persisted or default dark theme */
    const initialTheme = getStoredTheme() || 'dark';
    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            setStoredTheme(next);
        });
    }

    /* ---------- Mobile Nav ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.contains('open');
            navLinks.classList.toggle('open', !isOpen);
            navToggle.classList.toggle('active', !isOpen);
            navToggle.setAttribute('aria-expanded', String(!isOpen));
        });

        /* Close on link click */
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        /* Close on outside click */
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---------- Navbar scroll effect ---------- */
    const navbar = document.querySelector('.navbar');
    function handleNavbarScroll() {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 90;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    }
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ---------- Back to Top ---------- */
    const backToTop = document.getElementById('back-to-top');

    function handleBackToTop() {
        if (backToTop) {
            backToTop.classList.toggle('show', window.scrollY > 350);
        }
    }
    window.addEventListener('scroll', handleBackToTop, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Scroll Reveal ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        /* Fallback for older browsers */
        revealEls.forEach(el => el.classList.add('visible'));
    }

    /* ---------- Staggered card animations ---------- */
    const cardGroups = document.querySelectorAll('.tech-grid, .project-grid, .contact-cards');
    cardGroups.forEach(group => {
        const cards = group.querySelectorAll('.reveal');
        cards.forEach((card, i) => {
            card.style.transitionDelay = `${i * 0.08}s`;
        });
    });

})();