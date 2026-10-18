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
    const contentHold = document.createElement('div');
    contentHold.className = 'skills-content-hold';
    const content = document.createElement('div');
    content.className = 'skills-content-sticky';
    tools.before(contentHold);
    contentHold.append(content);
    content.append(tools, paper);
    const measureContent = () => {
        contentHold.style.height = `${content.offsetHeight + innerHeight * .9}px`;
        content.style.top = `${Math.min(85, innerHeight - content.offsetHeight - 30)}px`;
    };
    const contentObserver = new ResizeObserver(measureContent);
    contentObserver.observe(content);
    window.addEventListener('resize', measureContent);
    const stages = [heading, tools, paper];
    const ready = new Set();
    const durations = [2600, 1450 + (tools.children.length - 1) * 120, 1350];
    let nextStage = 0;
    let waiting = false;
    let stageTimer;
    const revealNext = () => {
        if (waiting || reduced.matches || !ready.has(stages[nextStage])) return;
        if (nextStage === 1) ready.add(paper);
        stages[nextStage].classList.add('skills--revealed');
        waiting = true;
        stageTimer = setTimeout(() => {
            nextStage++;
            waiting = false;
            revealNext();
        }, durations[nextStage] + (nextStage === 1 ? 0 : 700));
    };
    section.classList.add('skills--animated');
    [...tools.children].forEach((card, index) => {
        card.style.setProperty('--tool-delay', `${350 + index * 120}ms`);
        card.style.setProperty('--float-duration', `${3 + index % 4 * .35}s`);
        card.style.setProperty('--float-direction', index % 2 ? 'reverse' : 'normal');
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= .65) ready.add(entry.target);
            if (entry.target === tools) tools.classList.toggle('skills-tools--active', entry.isIntersecting && !document.hidden);
        });
        revealNext();
    }, { threshold: .65, rootMargin: '0px 0px -20% 0px' });
    stages.forEach(element => observer.observe(element));
    const checkPaper = () => { if (nextStage === 2 && !waiting) revealNext(); };
    window.addEventListener('scroll', checkPaper, { passive: true });
    document.addEventListener('visibilitychange', () => {
        const rect = tools.getBoundingClientRect();
        tools.classList.toggle('skills-tools--active', !document.hidden && rect.bottom > 0 && rect.top < innerHeight);
    });
    reduced.addEventListener('change', () => {
        if (!reduced.matches) return;
        observer.disconnect();
        contentObserver.disconnect();
        window.removeEventListener('resize', measureContent);
        window.removeEventListener('scroll', checkPaper);
        clearTimeout(stageTimer);
        section.classList.remove('skills--animated');
        tools.classList.remove('skills-tools--active');
    });
}
