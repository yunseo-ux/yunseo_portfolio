import { initHeroOcean } from './HeroOcean.js';

export function initHero() {
    document.querySelector('.hero-menu a[href="#home"]').addEventListener('click', event => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '#home');
    });
    initHeroOcean();
}
