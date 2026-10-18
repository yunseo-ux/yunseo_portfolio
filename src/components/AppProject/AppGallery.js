import { createEcoLeaves } from './EcoLeaves.js';
import { createTodayDoodles } from './TodayDoodles.js';

export function initAppGallery() {
    const gallery = document.querySelector('.app-gallery');
    if (!gallery) return;
    const viewport = gallery.querySelector('.app-gallery-viewport');
    const track = gallery.querySelector('.app-gallery-track');
    const todayDetail = track.querySelector('.app-detail--today');
    track.querySelector('.app-overview--today').after(todayDetail);
    const panels = [...track.children];
    const ecoPanel = track.querySelector('.app-detail--eco');
    const leaves = createEcoLeaves(ecoPanel);
    const drawings = [
        { index: panels.indexOf(todayDetail), holder: createTodayDoodles(todayDetail), drawn: false },
        { index: panels.indexOf(ecoPanel), holder: leaves, drawn: false },
    ];
    let lockUntil = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const hold = .55;
    const duration = panels.length * hold + panels.length - 1 + .5;
    let frame = 0;
    const measure = () => {
        gallery.style.height = reduced.matches ? '' : `${viewport.offsetHeight + duration * viewport.clientWidth}px`;
    };
    const update = () => {
        frame = 0;
        if (reduced.matches) { track.style.transform = ''; drawings.forEach(item => item.holder.classList.add('eco-leaves--draw')); lockUntil = 0; return; }
        const time = Math.max(0, -gallery.getBoundingClientRect().top) / viewport.clientWidth;
        const index = Math.min(panels.length - 1, Math.floor(time / (hold + 1)));
        const progress = Math.max(0, Math.min(1, time - index * (hold + 1) - hold));
        const position = Math.min(panels.length - 1, index + progress * progress * (3 - 2 * progress));
        track.style.transform = `translate3d(${-position * viewport.clientWidth}px,0,0)`;
        drawings.forEach(item => {
            if (Math.abs(position - item.index) < .001 && !item.drawn) {
                item.holder.classList.add('eco-leaves--draw');
                item.drawn = true;
                lockUntil = performance.now() + 1200;
            } else if (Math.abs(position - item.index) > 1 && item.drawn) {
                item.holder.classList.remove('eco-leaves--draw');
                item.drawn = false;
            }
        });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    const locked = () => !reduced.matches && performance.now() < lockUntil;
    addEventListener('wheel', event => {
        if (event.ctrlKey || event.target.closest('.portfolio-chatbot, dialog')) return;
        if (event.deltaY > 0 && locked()) event.preventDefault();
        if (event.deltaY < 0) lockUntil = 0;
    }, { passive: false });
    let touchY = 0;
    addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY ?? 0; }, { passive: true });
    addEventListener('touchmove', event => {
        if (event.target.closest('.portfolio-chatbot, dialog')) return;
        const y = event.touches[0]?.clientY ?? touchY;
        if (y < touchY && locked()) event.preventDefault();
        if (y > touchY) lockUntil = 0;
        touchY = y;
    }, { passive: false });
    addEventListener('resize', () => { measure(); schedule(); });
    reduced.addEventListener('change', () => { measure(); schedule(); });
    track.addEventListener('focusin', event => {
        if (reduced.matches) return;
        const index = panels.indexOf(event.target.closest('section'));
        if (index < 0) return;
        scrollTo({ top: gallery.getBoundingClientRect().top + scrollY + index * (hold + 1) * viewport.clientWidth, behavior: 'instant' });
    });
    measure();
    update();
}
