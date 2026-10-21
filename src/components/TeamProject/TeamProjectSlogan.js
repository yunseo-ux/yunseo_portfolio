export function initTeamProjectSlogan() {
    document.querySelectorAll('.team-project-slogan, .personal-project-slogan, .app-project-slogan').forEach(initSlogan);
}

function initSlogan(section) {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!section || preference.matches) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'team-slogan-scroll';
    if (section.matches('.personal-project-slogan')) wrapper.classList.add('personal-slogan-scroll');
    if (section.matches('.app-project-slogan')) wrapper.classList.add('app-slogan-scroll');
    section.before(wrapper);
    wrapper.append(section);
    const title = section.querySelector('h2');
    const label = section.querySelector('.team-project-slogan-label, .personal-project-label, .app-project-label');
    const character = section.querySelector('.team-project-slogan-character, .personal-project-character, .app-project-character');
    const line = section.querySelector('.team-project-slogan-line');
    const stars = [...section.querySelectorAll('.team-project-slogan-star')];
    const elements = [title, label, character, line, ...stars].filter(Boolean);
    const clamp = value => Math.max(0, Math.min(1, value));
    const wipe = (element, progress) => {
        if (element) element.style.clipPath = `inset(0 ${(1 - clamp(progress)) * 100}% 0 0)`;
    };
    const draw = (element, progress) => {
        if (!element) return;
        const p = clamp(progress);
        element.style.clipPath = p === 1 ? 'none' : p === 0 ? 'inset(0 100% 0 0)' : `polygon(0 0, ${Math.min(100, p * 200)}% 0, 100% ${Math.max(0, p * 200 - 100)}%, ${Math.max(0, p * 200 - 100)}% 100%, 0 ${Math.min(100, p * 200)}%)`;
    };
    let frame = 0;
    const update = () => {
        frame = 0;
        if (preference.matches) {
            elements.forEach(element => { element.style.clipPath = ''; });
            return;
        }
        const scroll = -wrapper.getBoundingClientRect().top;
        wipe(label, (scroll - 140) / 220);
        wipe(title, (scroll - 220) / 650);
        draw(character, (scroll - 1100) / 600);
        wipe(line, (scroll - 1900) / 650);
        stars.forEach((star, index) => draw(star, (scroll - 2750 - index * 230) / 230));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
}
