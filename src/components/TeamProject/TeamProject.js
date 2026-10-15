const companyAnalysisImage = new URL('./assets/company-analysis.png', import.meta.url).href;
import { initInterview } from './team_Interview.js';
import { initPlanning } from './team_Planning.js';
import { initStructure } from './team_Structure.js';
import { initProjectLine } from './ProjectLine.js';
import { loadProjectImage } from './loadProjectImage.js';
const competitiveAnalysisImage = new URL('./assets/competitive-analysis.png', import.meta.url).href;
const steepAnalysisImage = new URL('./assets/steep-source.png', import.meta.url).href;
const threeCAnalysisImage = new URL('./assets/3c-source-1.png', import.meta.url).href;

function initResearch() {
    const research = document.querySelector('.team-research');
    if (!research) return;
    const researchImage = research.querySelector('.team-research-image');
    const researchTitle = research.querySelector('h2');
    const researchSubtitle = research.querySelector('.team-research-subtitle');
    const researchCopy = research.querySelector('.team-research-copy');
    if (!researchImage || !researchTitle || !researchSubtitle || !researchCopy) return;
    const marketImage = researchImage.getAttribute('src');
    const marketCopy = researchCopy.innerHTML;
    const views = {
        market: { image: marketImage, alt: '시장과 브랜드 조사 자료', subtitle: 'BRAND & MARKET RESEARCH' },
        company: { image: companyAnalysisImage, alt: '현대모터스튜디오 자사 분석 자료', subtitle: 'COMPANY ANALYSIS' },
        competitive: { image: competitiveAnalysisImage, alt: '경쟁사 비교 분석 자료', subtitle: 'COMPETITIVE ANALYSIS' },
        steep: { image: steepAnalysisImage, alt: 'STEEP 분석 자료', subtitle: 'STEEP ANALYSIS' },
        '3c': { image: threeCAnalysisImage, alt: '3C 분석 자료', subtitle: '3C ANALYSIS' },
    };
    research.querySelectorAll('.team-research-button').forEach(button => {
        button.addEventListener('click', () => {
            const selected = button.dataset.research;
            const view = views[selected];
            if (!view) return;
            for (const key of Object.keys(views)) research.classList.toggle(`team-research--${key}`, selected === key);
            loadProjectImage(researchImage, view.image);
            researchImage.alt = view.alt;
            researchTitle.textContent = '시장과 브랜드 조사';
            researchSubtitle.textContent = view.subtitle;
            researchCopy.innerHTML = marketCopy;
            research.querySelectorAll('.team-research-button').forEach(item => {
                item.setAttribute('aria-pressed', String(item === button));
            });
        });
    });
}

export function initTeamProject() {
    initInterview();
    initPlanning();
    initStructure();
    initResearch();
    const screen = document.querySelector('.team-project-laptop-screen');
    const content = document.querySelector('.team-project-screen-scroll');
    let startedAt;
    const animate = time => {
        if (!screen || !content) return;
        if (startedAt === undefined) startedAt = time;
        const distance = Math.max(0, content.offsetHeight - screen.clientHeight);
        const progress = ((time - startedAt) % 60000) / 60000;
        const position = progress < 0.08 ? 0 : progress < 0.88 ? (progress - 0.08) / 0.8 : 1;
        content.style.transform = `translateY(${-distance * position}px)`;
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const gallery = document.querySelector('.team-project-gallery');
    if (!gallery) return;
    const viewport = gallery.querySelector('.team-project-viewport');
    const track = gallery.querySelector('.team-project-track');
    if (!viewport || !track) return;
    const updateLine = initProjectLine(track);
    let frame = 0;
    const update = () => {
        const scale = Math.min(1, gallery.clientWidth / 1920);
        gallery.style.setProperty('--project-scale', scale);
        gallery.style.setProperty('--project-height', `${1080 * scale}px`);
        gallery.style.setProperty('--project-scroll-range', `${(track.children.length - 1) * 160}vh`);
        const availableScroll = gallery.offsetHeight - viewport.offsetHeight;
        const verticalScroll = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const scrolled = -gallery.getBoundingClientRect().top - verticalScroll;
        const progress = Math.max(0, Math.min(1, scrolled / availableScroll));
        viewport.style.setProperty('--pin-top', `${-verticalScroll}px`);
        const horizontalDistance = track.scrollWidth - viewport.clientWidth;
        track.style.left = `${-Math.round(progress * horizontalDistance)}px`;
        updateLine(progress * (track.children.length - 1));
        frame = 0;
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
}
