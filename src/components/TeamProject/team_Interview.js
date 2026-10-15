import { loadProjectImage } from './loadProjectImage.js';

const images = {
    questions: new URL('./assets/interview-questions.png', import.meta.url).href,
    summary: new URL('./assets/response-summary.png', import.meta.url).href,
    affinity: new URL('./assets/affinity-diagram.png', import.meta.url).href,
};

export function initInterview() {
    const section = document.querySelector('.team-placeholder');
    if (!section) return;
    const image = section.querySelector('.team-placeholder-image');
    const subtitle = section.querySelector('.team-placeholder-subtitle');
    const views = {
        transcripts: { src: image.getAttribute('src'), title: 'INTERVIEW TRANSCRIPTS', alt: '사용자 인터뷰 설문조사 원문' },
        questions: { src: images.questions, title: 'INTERVIEW QUESTIONS', alt: '사용자 인터뷰 질문' },
        summary: { src: images.summary, title: 'RESPONSE SUMMARY', alt: '인터뷰 응답 요약' },
        affinity: { src: images.affinity, title: 'AFFINITY DIAGRAM', alt: '어피니티 다이어그램' },
    };
    const buttons = section.querySelectorAll('.team-interview-button');
    buttons.forEach(button => button.addEventListener('click', () => {
        const selected = button.dataset.interview;
        const view = views[selected];
        if (!view) return;
        for (const key of Object.keys(views)) section.classList.toggle(`team-interview--${key}`, selected === key);
        loadProjectImage(image, view.src);
        image.alt = view.alt;
        subtitle.textContent = view.title;
        section.querySelector('h2').textContent = '사용자 인터뷰와 분석';
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
}
