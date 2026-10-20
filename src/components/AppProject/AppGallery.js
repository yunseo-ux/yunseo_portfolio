import { createEcoLeaves } from './EcoLeaves.js';
import { createTodayDoodles } from './TodayDoodles.js';
import { initTodayJourney } from './TodayJourney.js';

export function initAppGallery() {
    const gallery = document.querySelector('.app-gallery');
    if (!gallery) return;
    const viewport = gallery.querySelector('.app-gallery-viewport');
    const track = gallery.querySelector('.app-gallery-track');
    const todayDetail = track.querySelector('.app-detail--today');
    track.querySelector('.app-overview--today').after(todayDetail);
    const journeyPanel = track.querySelector('.today-journey');
    todayDetail.after(journeyPanel);
    const journey = initTodayJourney(journeyPanel);
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
    let entries = [];
    let frame = 0;
    let displayedPosition = null;
    let previousTime = 0;
    const measure = () => {
        const journeyWidth = journey.measure(viewport.clientWidth);
        let time = 0;
        let offset = 0;
        entries = panels.map((panel, index) => {
            const travel = panel === journeyPanel ? Math.max(0, journeyWidth / viewport.clientWidth - 1) : 0;
            const tailHold = travel ? hold : 0;
            const panelHold = panel.matches('.app-overview') ? 1.25 : hold;
            const entry = { start: time, offset, travel, tailHold, hold: panelHold };
            time += panelHold + travel + tailHold + (index < panels.length - 1 ? 1 : 0);
            offset += 1 + travel;
            return entry;
        });
        const duration = time + .5;
        gallery.style.height = reduced.matches ? '' : `${viewport.offsetHeight + duration * viewport.clientWidth}px`;
    };
    const update = timestamp => {
        frame = 0;
        if (reduced.matches) { track.style.transform = ''; displayedPosition = null; previousTime = 0; drawings.forEach(item => item.holder.classList.add('eco-leaves--draw')); journey.update(1); lockUntil = 0; return; }
        const time = Math.max(0, -gallery.getBoundingClientRect().top) / viewport.clientWidth;
        let position = entries.at(-1).offset;
        for (const [index, entry] of entries.entries()) {
            const local = time - entry.start;
            const hold = entry.hold;
            if (local <= hold) { position = entry.offset; break; }
            if (local < hold + entry.travel) { position = entry.offset + local - hold; break; }
            if (local <= hold + entry.travel + entry.tailHold) { position = entry.offset + entry.travel; break; }
            if (index < entries.length - 1 && local < hold + entry.travel + entry.tailHold + 1) {
                const progress = local - hold - entry.travel - entry.tailHold;
                position = entry.offset + entry.travel + progress * progress * (3 - 2 * progress);
                break;
            }
        }
        const journeyEntry = entries[panels.indexOf(journeyPanel)];
        const targetPosition = position;
        const smoothJourney = position > journeyEntry.offset - 1 && position < journeyEntry.offset + journeyEntry.travel + 1;
        const elapsed = previousTime && timestamp ? Math.min(64, timestamp - previousTime) : 16;
        if (displayedPosition === null || !smoothJourney) displayedPosition = position;
        else displayedPosition += (position - displayedPosition) * (1 - Math.exp(-elapsed / 85));
        if (Math.abs(position - displayedPosition) < .00002) displayedPosition = position;
        position = displayedPosition;
        track.style.transform = `translate3d(${-position * viewport.clientWidth}px,0,0)`;
        journey.update((position - journeyEntry.offset + .12) / (journeyEntry.travel + .12));
        drawings.forEach(item => {
            if (Math.abs(position - entries[item.index].offset) < .001 && !item.drawn) {
                item.holder.classList.add('eco-leaves--draw');
                item.drawn = true;
                lockUntil = performance.now() + 1200;
            } else if (Math.abs(position - entries[item.index].offset) > 1 && item.drawn) {
                item.holder.classList.remove('eco-leaves--draw');
                item.drawn = false;
            }
        });
        if (position !== targetPosition) {
            previousTime = timestamp || performance.now();
            frame = requestAnimationFrame(update);
        } else previousTime = 0;
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
        scrollTo({ top: gallery.getBoundingClientRect().top + scrollY + entries[index].start * viewport.clientWidth, left: 0, behavior: 'instant' });
    });
    measure();
    update();
}
