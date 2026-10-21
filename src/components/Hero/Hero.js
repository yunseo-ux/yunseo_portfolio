import { initHeroOcean } from './HeroOcean.js';
import { initHeroDecorations } from './HeroDecorations.js';

export function initHero() {
    // Keep the fixed navigation outside the hero's size container and sticky wrapper.
    const header = document.querySelector('.hero-header');
    if (header) document.body.append(header);
    header?.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest('a') || event.target.closest('.hero-menu li')?.querySelector('a');
        const hash = link?.getAttribute('href');
        if (!hash?.startsWith('#')) return;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        event.preventDefault();
        const destination = target.closest('.team-project-gallery') || target;
        const top = hash === '#home' ? 0 : destination.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        window.history.replaceState(null, '', hash);
    });
    initHeroOcean();
    initHeroDecorations();
}
