export function initSoftwareSkills() {
    const section = document.querySelector('.software-skills');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (!section || reduced.matches) return;
    const heading = section.querySelector('.software-skills-heading');
    const headingHold = document.createElement('div');
    headingHold.className = 'skills-heading-hold';
    heading.before(headingHold);
    headingHold.append(heading);
    const tools = section.querySelector('.software-skills-tools');
    const paper = section.querySelector('.software-skills-paper');
    const stages = [heading, tools, paper];
    const ready = new Set();
    const durations = [1850, 1200 + (tools.children.length - 1) * 130, 1950];
    let nextStage = 0;
    let waiting = false;
    let stageTimer;
    const revealNext = () => {
        if (waiting || reduced.matches || !ready.has(stages[nextStage])) return;
        stages[nextStage].classList.add('skills--revealed');
        waiting = true;
        stageTimer = setTimeout(() => {
            nextStage++;
            waiting = false;
            revealNext();
        }, durations[nextStage] + 700);
    };
    section.classList.add('skills--animated');
    [...tools.children].forEach((card, index) => {
        card.style.setProperty('--tool-delay', `${200 + index * 130}ms`);
        card.style.setProperty('--float-duration', `${3 + index % 4 * .35}s`);
        card.style.setProperty('--float-direction', index % 2 ? 'reverse' : 'normal');
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) ready.add(entry.target);
            if (entry.target === tools) tools.classList.toggle('skills-tools--active', entry.isIntersecting && !document.hidden);
        });
        revealNext();
    }, { threshold: .15, rootMargin: '0px 0px -15% 0px' });
    stages.forEach(element => observer.observe(element));
    document.addEventListener('visibilitychange', () => {
        const rect = tools.getBoundingClientRect();
        tools.classList.toggle('skills-tools--active', !document.hidden && rect.bottom > 0 && rect.top < innerHeight);
    });
    reduced.addEventListener('change', () => {
        if (!reduced.matches) return;
        observer.disconnect();
        clearTimeout(stageTimer);
        section.classList.remove('skills--animated');
        tools.classList.remove('skills-tools--active');
    });
}
