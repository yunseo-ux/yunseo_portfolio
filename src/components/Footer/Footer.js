import { initOceanWave } from '../Hero/HeroOcean.js';

export function initFooter() {
    const footer = document.querySelector('.portfolio-footer');
    const resume = footer?.querySelector('.footer-resume');
    if (resume) {
        // Vite serves public files at the root; Live Server exposes public/ itself.
        const base = import.meta.env?.BASE_URL;
        resume.href = base ? `${base}resume-oh-yunseo.html` : '/public/resume-oh-yunseo.html';
    }
    initOceanWave(footer, footer?.querySelector('.footer-wave'), { closeAtTop: true, rise: false });
}
