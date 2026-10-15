import { loadProjectImage } from './loadProjectImage.js';

const directionImages = {
    WIREFRAME: new URL('./assets/wireframe.png', import.meta.url).href,
    'DESIGN SYSTEM': new URL('./assets/design-system.png', import.meta.url).href,
    MOODBOARD: new URL('./assets/moodboard.png', import.meta.url).href,
    'DESIGN MIND MAP': new URL('./assets/design-mind-map.png', import.meta.url).href,
};

const views = {
    minutes: { src: new URL('./assets/meeting-minutes-source.png', import.meta.url).href, title: 'MEETING MINUTES' },
    menu: { src: new URL('./assets/menu-tree.png', import.meta.url).href, title: 'MENU TREE' },
    flow: { src: new URL('./assets/user-flowchart.png', import.meta.url).href, title: 'USER FLOWCHART' },
    requirements: { src: new URL('./assets/requirements-source.png', import.meta.url).href, title: 'REQUIREMENTS SPECIFICATION' },
};
export function initStructure() {
    document.querySelectorAll('[data-design-title]').forEach(button => button.addEventListener('click', () => {
        const panel = button.closest('.team-additional');
        const directionImage = panel.querySelector('.team-direction-image, .team-screen-image');
        if (directionImage && directionImages[button.dataset.designTitle]) {
            panel.classList.toggle('team-design-direction--mind-map', button.dataset.designTitle === 'DESIGN MIND MAP');
            panel.classList.toggle('team-screen-design--system', button.dataset.designTitle === 'DESIGN SYSTEM');
            loadProjectImage(directionImage, directionImages[button.dataset.designTitle]);
            directionImage.alt = button.querySelector('span').textContent;
        }
        panel.querySelector('.team-additional-subtitle').textContent = button.dataset.designTitle;
        panel.querySelector('h2').textContent = panel.classList.contains('team-design-direction')
            ? '디자인 방향 설정'
            : '화면 설계와 구체화';
        panel.querySelectorAll('[data-design-title]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
    const section = document.querySelector('.team-structure');
    if (!section) return;
    const buttons = section.querySelectorAll('[data-structure]');
    buttons.forEach(button => button.addEventListener('click', () => {
        const selected = button.dataset.structure;
        const view = views[selected];
        for (const key of Object.keys(views)) section.classList.toggle(`team-structure--${key}`, selected === key);
        const image = section.querySelector('.team-structure-image');
        loadProjectImage(image, view.src);
        image.alt = button.querySelector('span').textContent;
        section.querySelector('.team-additional-subtitle').textContent = view.title;
        section.querySelector('h2').textContent = '팀 논의와 구조 설계';
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
}
