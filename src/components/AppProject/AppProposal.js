const proposalUrl = new URL('./assets/today-proposal.png', import.meta.url).href;

export function initAppProposal() {
    const trigger = document.querySelector('.app-overview-proposal');
    if (!trigger) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'today-proposal';
    dialog.className = 'app-proposal-dialog';
    dialog.setAttribute('aria-label', '오늘 프로젝트 제안 장표');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'app-proposal-close';
    close.textContent = '닫기 ×';
    close.autofocus = true;
    const image = document.createElement('img');
    image.alt = '오늘, 위치 기반 역사 체험 플랫폼의 리서치, 서비스 목표와 앱 화면을 담은 제안 장표';
    dialog.append(close, image);
    document.body.append(dialog);
    let previousOverflow = '';
    let previousScroll = 0;
    trigger.addEventListener('click', () => {
        if (dialog.open) return;
        image.src = proposalUrl;
        previousScroll = window.scrollY;
        previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        dialog.showModal();
        dialog.scrollTop = 0;
    });
    close.addEventListener('click', () => dialog.close());
    let startedOnBackground = false;
    dialog.addEventListener('pointerdown', event => { startedOnBackground = event.target === dialog; });
    dialog.addEventListener('click', event => {
        if (event.target === dialog && startedOnBackground) dialog.close();
    });
    dialog.addEventListener('close', () => {
        document.documentElement.style.overflow = previousOverflow;
        requestAnimationFrame(() => window.scrollTo({ top: previousScroll, behavior: 'instant' }));
    });
}
