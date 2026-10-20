const companyAnalysisImage = new URL('./assets/company-analysis.png', import.meta.url).href;
import { initInterview } from './team_Interview.js';
import { initPlanning } from './team_Planning.js';
import { initStructure } from './team_Structure.js';
import { initProjectLine } from './ProjectLine.js';
import { loadProjectImage } from './loadProjectImage.js';
import { initProgramSubpage } from './ProgramSubpage.js';
import { getProjectScale } from '../../projectScale.js';
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
    initProgramSubpage();
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
    let previewFrame = 0;
    let previewVisible = false;
    let distance = 0;
    let phoneDistance = 0;
    const measurePreview = () => {
        distance = screen && content ? Math.max(0, content.offsetHeight - screen.clientHeight) : 0;
        phoneDistance = phoneScreen && phoneContent ? Math.max(0, phoneContent.offsetHeight - phoneScreen.clientHeight) : 0;
    };
    const animate = time => {
        previewFrame = 0;
        if (!screen || !content || !previewVisible || document.hidden || motionPreference.matches) return;
        if (startedAt === undefined) startedAt = time;
        const progress = ((time - startedAt) % 141000) / 141000;
        const position = progress < .003 ? 0 : progress < .803 ? (progress - .003) / .8 : 1;
        content.style.transform = `translateY(${-distance * position}px)`;
        if (phoneScreen && phoneContent) {
            const cycle = ((time - startedAt) % 235000) / 235000;
            // Pause at both ends, then travel back without jumping to the start.
            const phonePosition = cycle < .003 ? 0
                : cycle < .453 ? (cycle - .003) / .45
                : cycle < .503 ? 1
                : cycle < .953 ? 1 - (cycle - .503) / .45 : 0;
            phoneContent.style.transform = `translateY(${motionPreference.matches ? 0 : -phoneDistance * phonePosition}px)`;
        }
        previewFrame = requestAnimationFrame(animate);
    };
    const refreshPreview = () => {
        cancelAnimationFrame(previewFrame);
        previewFrame = 0;
        startedAt = undefined;
        measurePreview();
        if (previewVisible && !document.hidden && !motionPreference.matches) previewFrame = requestAnimationFrame(animate);
    };
    const previewSection = screen?.closest('.team-project');
    if (previewSection) {
        new IntersectionObserver(entries => {
            previewVisible = entries[0].isIntersecting;
            refreshPreview();
        }, { threshold: .25 }).observe(previewSection);
    }
    content?.querySelector('img')?.addEventListener('load', measurePreview);
    phoneContent?.addEventListener('load', measurePreview);
    window.addEventListener('resize', measurePreview);
    document.addEventListener('visibilitychange', refreshPreview);
    motionPreference.addEventListener('change', refreshPreview);

    const gallery = document.querySelector('.team-project-gallery');
    if (!gallery) return;
    const viewport = gallery.querySelector('.team-project-viewport');
    const track = gallery.querySelector('.team-project-track');
    if (!viewport || !track) return;
    const updateLine = initProjectLine(track);
    const comparison = track.querySelector('.team-before-after');
    const comparisonIndex = [...track.children].indexOf(comparison);
    const panels = [...track.children];
    const researchIndex = panels.findIndex(panel => panel.matches('.team-research'));
    if (researchIndex > 0) {
        panels.slice(researchIndex).forEach(panel => panel.classList.add('team-project-lower-row'));
    }
    const together = track.querySelector('.better-together');
    const togetherIndex = panels.indexOf(together);
    const editorial = track.querySelector('.team-editorial');
    const editorialIndex = panels.indexOf(editorial);
    const contribution = track.querySelector('.team-contribution');
    const contributionIndex = panels.indexOf(contribution);
    contribution?.classList.add('team-contribution--animated');
    const clamp = value => Math.max(0, Math.min(1, value));
    // Each panel has a reading interval before the next horizontal transition.
    const holds = panels.map(panel => panel === comparison ? 2.8
        : panel.matches('.better-together, .team-editorial') ? 1.25 : .7);
    const starts = [];
    let duration = 0;
    holds.forEach((hold, index) => {
        starts.push(duration);
        duration += hold + (index < panels.length - 1 ? 1 : 0);
    });
    gallery.style.setProperty('--project-scroll-range', `${duration * 160}svh`);
    const measure = () => {
        const scale = getProjectScale(gallery.clientWidth, window.innerHeight);
        gallery.style.setProperty('--project-scale', scale);
        gallery.style.setProperty('--project-height', `${window.innerHeight}px`);
        gallery.style.setProperty('--project-canvas-top', `${(window.innerHeight - 1080 * scale) / 2}px`);
        gallery.style.setProperty('--project-canvas-left', `${(gallery.clientWidth - 1920 * scale) / 2}px`);
    };
    let frame = 0;
    const update = () => {
        const availableScroll = gallery.offsetHeight - viewport.offsetHeight;
        const scrolled = -gallery.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, scrolled / availableScroll));
        const timeline = progress * duration;
        let position = panels.length - 1;
        for (let index = 0; index < panels.length; index++) {
            const local = timeline - starts[index];
            if (local <= holds[index]) { position = index; break; }
            if (index < panels.length - 1 && local < holds[index] + 1) {
                const move = clamp(local - holds[index]);
                position = index + move * move * (3 - 2 * move);
                break;
            }
        }
        if (comparison) {
            const local = (timeline - starts[comparisonIndex]) / holds[comparisonIndex];
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
        if (together) {
            const local = (timeline - starts[togetherIndex]) / holds[togetherIndex];
            const photoProgress = (start, end) => {
                if (motionPreference.matches) return 1;
                const value = clamp((local - start) / (end - start));
                return value * value * (3 - 2 * value);
            };
            together.style.setProperty('--together-large', photoProgress(0, .18));
            together.style.setProperty('--together-small', photoProgress(.2, .4));
        }
        const descent = researchIndex > 0 ? clamp(position - (researchIndex - 1)) : 0;
        const horizontalPosition = position - descent;
        track.style.transform = `translate3d(${-horizontalPosition * viewport.clientWidth}px, ${-descent * viewport.clientHeight}px, 0)`;
        editorial?.classList.toggle('team-editorial--visible', Math.abs(position - editorialIndex) < .35);
        if (contribution) {
            const distance = Math.abs(position - contributionIndex);
            if (distance < .12) contribution.classList.add('team-contribution--visible');
            else if (distance > .95) contribution.classList.remove('team-contribution--visible');
        }
        updateLine(position);
        frame = 0;
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    measure();
    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', () => { measure(); scheduleUpdate(); });
    motionPreference.addEventListener('change', scheduleUpdate);
}
