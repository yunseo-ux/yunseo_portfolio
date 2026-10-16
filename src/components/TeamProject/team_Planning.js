import { loadProjectImage } from './loadProjectImage.js';

const views = {
    persona: { src: new URL('./assets/persona.png', import.meta.url).href, title: 'PERSONA', alt: '퍼소나 분석 자료' },
    journey: { src: new URL('./assets/user-journey-map.png', import.meta.url).href, title: 'USER JOURNEY MAP', alt: '사용자 저니맵 자료' },
    lean: { src: new URL('./assets/lean-canvas.png', import.meta.url).href, title: 'LEAN CANVAS', alt: '린 캔버스 자료' },
};
export function initPlanning() {
    const section = document.querySelector('.team-planning');
    if (!section) return;
    const image = section.querySelector('.team-planning-image');
    const subtitle = section.querySelector('.team-additional-subtitle');
    const buttons = section.querySelectorAll('[data-planning]');
    buttons.forEach(button => button.addEventListener('click', () => {
        const view = views[button.dataset.planning];
        section.classList.toggle('team-planning--persona', button.dataset.planning === 'persona');
        section.classList.toggle('team-planning--lean', button.dataset.planning === 'lean');
        loadProjectImage(image, view.src);
        image.alt = view.alt;
        subtitle.textContent = view.title;
        section.querySelector('h2').textContent = '문제 정의와 기획';
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
}
