import { initOceanWave } from '../Hero/HeroOcean.js';

export function initFooter() {
    const footer = document.querySelector('.portfolio-footer');
    initOceanWave(footer, footer?.querySelector('.footer-wave'), { closeAtTop: true, rise: false });
}
