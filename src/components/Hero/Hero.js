import { initHeroOcean } from './HeroOcean.js';
import { initHeroDecorations } from './HeroDecorations.js';

export function initHero() {
    // Keep the fixed navigation outside the hero's size container and sticky wrapper.
    const header = document.querySelector('.hero-header');
    if (header) document.body.append(header);
    document.querySelector('.hero-menu a[href="#home"]').addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '#home');
    });
    document.querySelectorAll('.hero-menu a:not([href="#home"])').forEach(link => {
        link.addEventListener('click', event => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            const destination = target.closest('.team-project-gallery') || target;
            window.scrollTo({ top: destination.getBoundingClientRect().top + window.scrollY, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
            window.history.replaceState(null, '', link.getAttribute('href'));
        });
    });
    initHeroOcean();
    initHeroDecorations();
}
