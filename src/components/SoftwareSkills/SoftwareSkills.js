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
    const stage = document.createElement('div');
    stage.className = 'skills-content-stage';
    stage.style.display = 'flow-root';
    stage.style.transformOrigin = 'top center';
    content.append(stage);
    stage.append(tools, paper);

    section.classList.add('skills--animated');
    [heading, tools, paper].forEach(element => element.classList.add('skills--revealed'));
    [...tools.children].forEach((card, index) => {
        card.style.setProperty('--tool-delay', `${350 + index * 120}ms`);
        card.style.setProperty('--float-duration', `${3 + index % 4 * .35}s`);
        card.style.setProperty('--float-direction', index % 2 ? 'reverse' : 'normal');
    });
    // Scrub finite reveal animations; leave the decorative floating animation separate.
    const animationsOf = element => element.getAnimations({ subtree: true })
        .filter(animation => animation.effect.getTiming().iterations !== Infinity);
    const headingAnimations = animationsOf(heading);
    const toolAnimations = animationsOf(tools);
    const paperAnimations = animationsOf(paper);
    const animations = [...headingAnimations, ...toolAnimations, ...paperAnimations];
    animations.forEach(animation => animation.pause());
    const toolsDuration = 1450 + (tools.children.length - 1) * 120;
    const clamp = value => Math.max(0, Math.min(1, value));
    let frame = 0;
    const seek = (items, time) => items.forEach(animation => { animation.currentTime = time; });
    const update = () => {
        frame = 0;
        if (reduced.matches) return;
        const headingProgress = clamp(-headingHold.getBoundingClientRect().top /
            Math.max(1, headingHold.offsetHeight - innerHeight));
        seek(headingAnimations, headingProgress * 3300);
        const stickyTop = parseFloat(content.style.top) || 0;
        const progress = clamp((stickyTop - contentHold.getBoundingClientRect().top) /
            Math.max(1, contentHold.offsetHeight - content.offsetHeight));
        const time = progress * (toolsDuration + 1350 + 700);
        seek(toolAnimations, time);
        seek(paperAnimations, Math.max(0, time - toolsDuration));
        const rect = tools.getBoundingClientRect();
        tools.classList.toggle('skills-tools--active', !document.hidden && rect.bottom > 0 && rect.top < innerHeight);
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measureContent = () => {
        const desktop = innerWidth > 800;
        stage.style.width = desktop ? '1600px' : '';
        stage.style.position = desktop ? 'relative' : '';
        stage.style.left = desktop ? '50%' : '';
        const naturalHeight = stage.offsetHeight;
        const scale = desktop ? Math.min(contentHold.clientWidth / 1600, innerHeight / 900) : 1;
        stage.style.transform = desktop ? `translateX(-50%) scale(${scale})` : '';
        content.style.height = `${naturalHeight * scale}px`;
        contentHold.style.height = `${naturalHeight * scale + innerHeight * 1.8}px`;
        content.style.top = `${(innerHeight - naturalHeight * scale) / 2}px`;
        requestUpdate();
    };
    const contentObserver = new ResizeObserver(measureContent);
    contentObserver.observe(stage);
    window.addEventListener('resize', measureContent);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    document.addEventListener('visibilitychange', requestUpdate);
    measureContent();
    reduced.addEventListener('change', () => {
        if (!reduced.matches) return;
        contentObserver.disconnect();
        window.removeEventListener('resize', measureContent);
        window.removeEventListener('scroll', requestUpdate);
        document.removeEventListener('visibilitychange', requestUpdate);
        cancelAnimationFrame(frame);
        animations.forEach(animation => animation.cancel());
        stage.style.transform = '';
        stage.style.width = '';
        stage.style.position = '';
        stage.style.left = '';
        content.style.height = '';
        section.classList.remove('skills--animated');
        tools.classList.remove('skills-tools--active');
    });
}
