import { initHeroOcean } from './HeroOcean.js';

export function initHero() {
    document.querySelector('.hero-menu a[href="#home"]').addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '#home');
    });
    document.querySelectorAll('.hero-menu a[href="#project-preview"], .hero-menu a[href="#app-gallery"]').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            window.history.replaceState(null, '', link.getAttribute('href'));
        });
    });
    initHeroOcean();
}
