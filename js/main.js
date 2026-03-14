/**
 * Portfolio — Mohammad Dicky Darmawan
 * main.js — Vanilla JavaScript
 * Features: Navbar scroll, hamburger menu, active nav, scroll animations, skill bars, back-to-top
 */

'use strict';

/* =============================================
   DOM REFERENCES
   ============================================= */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navLinkEls  = document.querySelectorAll('.nav-link');
const backToTop   = document.getElementById('backToTop');
const sections    = document.querySelectorAll('section[id]');
const fadeEls     = document.querySelectorAll('.fade-in-up');
const skillFills  = document.querySelectorAll('.skill-fill');
const profileImg  = document.getElementById('profileImg');

/* =============================================
   NAVBAR — scroll effect
   ============================================= */
function onScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link based on current section
    updateActiveLink(scrollY);
}

/* =============================================
   ACTIVE NAV LINK
   ============================================= */
function updateActiveLink(scrollY) {
    let current = '';
    const offset = navbar.offsetHeight + 20;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* =============================================
   HAMBURGER MENU
   ============================================= */
function toggleMenu(forceClose) {
    const isOpen = hamburger.classList.contains('open') || forceClose;

    if (isOpen) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
    } else {
        hamburger.classList.add('open');
        navLinks.classList.add('open');
        document.body.classList.add('nav-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }
}

hamburger.addEventListener('click', () => toggleMenu());

// Close nav when a link is clicked
navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            toggleMenu(true);
        }
    });
});

// Close nav when clicking the overlay backdrop
document.addEventListener('click', e => {
    if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        toggleMenu(true);
    }
});

/* =============================================
   BACK TO TOP
   ============================================= */
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
   ============================================= */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Slight stagger delay based on sibling index
            const delay = (Array.from(entry.target.parentElement.children).indexOf(entry.target)) * 80;
            entry.target.style.animationDelay = `${delay}ms`;
            entry.target.classList.add('animate');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeEls.forEach(el => fadeObserver.observe(el));

/* =============================================
   SKILL BAR ANIMATION
   ============================================= */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-fill');
            fills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                // Small timeout so CSS transition is visible
                setTimeout(() => {
                    fill.style.width = targetWidth + '%';
                }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillBarsContainer = document.querySelector('.skill-bars');
if (skillBarsContainer) {
    skillObserver.observe(skillBarsContainer);
}

/* =============================================
   PROFILE IMAGE FALLBACK
   ============================================= */
if (profileImg) {
    profileImg.addEventListener('error', () => {
        // Render a placeholder avatar using inline SVG via data URL
        profileImg.style.background = '#1A2235';
        profileImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%231A2235'/%3E%3Ccircle cx='90' cy='70' r='35' fill='%2300D9FF' opacity='0.6'/%3E%3Cellipse cx='90' cy='155' rx='55' ry='40' fill='%2300D9FF' opacity='0.4'/%3E%3Ctext x='90' y='76' text-anchor='middle' fill='white' font-size='28' font-family='Inter,sans-serif' font-weight='700'%3EMD%3C/text%3E%3C/svg%3E";
    });
}

/* =============================================
   SMOOTH SCROLL for anchor links (fallback)
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = navbar.offsetHeight + 8;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* =============================================
   SCROLL EVENT LISTENER
   ============================================= */
window.addEventListener('scroll', onScroll, { passive: true });

// Run once on load to set initial state
onScroll();
