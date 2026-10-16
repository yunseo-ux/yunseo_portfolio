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
    const phoneScreen = document.querySelector('.team-project-phone-screen');
    const phoneContent = document.querySelector('.team-project-phone-content');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let startedAt;
    const animate = time => {
        if (!screen || !content) return;
        if (startedAt === undefined) startedAt = time;
        const distance = Math.max(0, content.offsetHeight - screen.clientHeight);
        const progress = ((time - startedAt) % 120000) / 120000;
        const position = progress < 0.08 ? 0 : progress < 0.88 ? (progress - 0.08) / 0.8 : 1;
        content.style.transform = `translateY(${-distance * position}px)`;
        if (phoneScreen && phoneContent) {
            const phoneDistance = Math.max(0, phoneContent.offsetHeight - phoneScreen.clientHeight);
            const cycle = ((time - startedAt) % 200000) / 200000;
            // Pause at both ends, then travel back without jumping to the start.
            const phonePosition = cycle < .05 ? 0
                : cycle < .45 ? (cycle - .05) / .4
                : cycle < .55 ? 1
                : cycle < .95 ? 1 - (cycle - .55) / .4 : 0;
            phoneContent.style.transform = `translateY(${motionPreference.matches ? 0 : -phoneDistance * phonePosition}px)`;
        }
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    const gallery = document.querySelector('.team-project-gallery');
    if (!gallery) return;
    const viewport = gallery.querySelector('.team-project-viewport');
    const track = gallery.querySelector('.team-project-track');
    if (!viewport || !track) return;
    const updateLine = initProjectLine(track);
    const comparison = track.querySelector('.team-before-after');
    const comparisonIndex = [...track.children].indexOf(comparison);
    const researchIndex = [...track.children].findIndex(panel => panel.matches('.team-research'));
    if (researchIndex > 0) {
        [...track.children].slice(researchIndex).forEach(panel => panel.classList.add('team-project-lower-row'));
    }
    const clamp = value => Math.max(0, Math.min(1, value));
    let frame = 0;
    const update = () => {
        const scale = Math.min(1, gallery.clientWidth / 1920);
        gallery.style.setProperty('--project-scale', scale);
        gallery.style.setProperty('--project-height', `${1080 * scale}px`);
        const steps = track.children.length - 1;
        const hold = comparison ? 2.8 : 0;
        gallery.style.setProperty('--project-scroll-range', `${(steps + hold) * 160}vh`);
        const availableScroll = gallery.offsetHeight - viewport.offsetHeight;
        const verticalScroll = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const scrolled = -gallery.getBoundingClientRect().top - verticalScroll;
        const progress = Math.max(0, Math.min(1, scrolled / availableScroll));
        const timeline = progress * (steps + hold);
        const position = !comparison || timeline < comparisonIndex ? timeline
            : timeline < comparisonIndex + hold ? comparisonIndex : timeline - hold;
        if (comparison) {
            const local = (timeline - comparisonIndex) / hold;
            const reveal = (start, end) => {
                if (motionPreference.matches) return Number(local >= end);
                const value = clamp((local - start) / (end - start));
                return value * value * (3 - 2 * value);
            };
            comparison.style.setProperty('--comparison-image', reveal(.1, .3));
            comparison.style.setProperty('--comparison-center', reveal(.34, .46));
            comparison.style.setProperty('--comparison-right', reveal(.52, .64));
            comparison.style.setProperty('--comparison-copy', reveal(.72, .84));
        }
        viewport.style.setProperty('--pin-top', `${-verticalScroll}px`);
        // Continue right through contributions, move down into research,
        // then resume the horizontal sequence.
        const descent = researchIndex > 0 ? clamp(position - (researchIndex - 1)) : 0;
        const horizontalPosition = position - descent;
        track.style.left = `${-Math.round(horizontalPosition * viewport.clientWidth)}px`;
        track.style.top = `${-Math.round(descent * viewport.offsetHeight)}px`;
        updateLine(position);
        frame = 0;
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
}
