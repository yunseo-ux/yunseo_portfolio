import { topics, findReply } from './knowledge.js';

const icon = new URL('./assets/chatbot.png', import.meta.url).href;
const bubble = new URL('./assets/question.png', import.meta.url).href;

export function initChatbot() {
    if (document.querySelector('.portfolio-chatbot')) return;
    const widget = document.createElement('aside');
    widget.className = 'portfolio-chatbot';
    widget.setAttribute('aria-label', '오윤서 포트폴리오 챗봇');
    widget.innerHTML = `
        <button class="chatbot-nudge" type="button" aria-label="오윤서에게 궁금한 점 질문하기">
            <img src="${bubble}" alt="" width="230" height="88" />
            <span>궁금한 점이 있으신가요?</span>
        </button>
        <button class="chatbot-launcher" type="button" aria-label="챗봇 열기" aria-expanded="false" aria-controls="portfolio-chat-panel">
            <img src="${icon}" alt="" width="104" height="104" />
        </button>
        <section class="chatbot-panel" id="portfolio-chat-panel" role="dialog" aria-labelledby="chatbot-title" hidden>
            <header class="chatbot-header">
                <img src="${icon}" alt="" width="42" height="42" />
                <div><p>YUNSEO PORTFOLIO</p><h2 id="chatbot-title">윤서에게 물어보세요</h2></div>
                <button class="chatbot-close" type="button" aria-label="챗봇 닫기">×</button>
            </header>
            <div class="chatbot-messages" role="log" aria-label="대화 내용" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
            <div class="chatbot-topics" aria-label="추천 질문"></div>
            <form class="chatbot-form">
                <label class="chatbot-input-label" for="chatbot-question">궁금한 내용</label>
                <input id="chatbot-question" name="question" placeholder="윤서에 대해 궁금한 점을 적어 주세요" maxlength="300" autocomplete="off" required />
                <button type="submit" aria-label="질문 보내기">보내기</button>
            </form>
        </section>`;
    document.body.append(widget);
    const panel = widget.querySelector('.chatbot-panel');
    const launcher = widget.querySelector('.chatbot-launcher');
    const nudge = widget.querySelector('.chatbot-nudge');
    const input = widget.querySelector('input');
    const messages = widget.querySelector('.chatbot-messages');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let nudgeTimer;
    let nudgeHideTimer;
    const message = (text, author, reply) => {
        const row = document.createElement('div');
        row.className = `chatbot-message chatbot-message--${author}`;
        const label = document.createElement('span');
        label.className = 'chatbot-author';
        label.textContent = author === 'user' ? '방문자' : '윤서 소개 도우미';
        const content = document.createElement('p');
        content.textContent = text;
        row.append(label, content);
        if (reply?.section) {
            const link = document.createElement('a');
            link.href = `#${reply.section}`;
            link.textContent = `${reply.link} ↗`;
            link.addEventListener('click', event => {
                const target = document.getElementById(reply.section);
                if (!target) return;
                event.preventDefault();
                close();
                target.scrollIntoView({ behavior: preference.matches ? 'instant' : 'smooth', block: 'start' });
            });
            row.append(link);
        }
        messages.append(row);
        messages.scrollTop = messages.scrollHeight;
    };
    const ask = question => {
        const text = question.trim();
        if (!text) return;
        message(text, 'user');
        const reply = findReply(text);
        message(reply.answer, 'bot', reply);
        input.value = '';
        input.focus({ preventScroll: true });
    };
    const scheduleNudge = () => {
        clearTimeout(nudgeTimer);
        clearTimeout(nudgeHideTimer);
        nudgeTimer = setTimeout(() => {
            if (!panel.hidden || document.hidden) return;
            nudge.classList.add('is-visible');
            nudgeHideTimer = setTimeout(() => {
                nudge.classList.remove('is-visible');
                scheduleNudge();
            }, 5500);
        }, 12000);
    };
    function close() {
        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
        launcher.setAttribute('aria-label', '챗봇 열기');
        launcher.focus({ preventScroll: true });
        scheduleNudge();
    }
    const open = () => {
        clearTimeout(nudgeTimer);
        clearTimeout(nudgeHideTimer);
        nudge.classList.remove('is-visible');
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        launcher.setAttribute('aria-label', '챗봇 닫기');
        input.focus({ preventScroll: true });
    };
    launcher.addEventListener('click', () => panel.hidden ? open() : close());
    nudge.addEventListener('click', open);
    widget.querySelector('.chatbot-close').addEventListener('click', close);
    widget.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); close(); }
    });
    widget.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        ask(input.value);
    });
    for (const topic of topics) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = topic.label;
        button.addEventListener('click', () => ask(topic.label));
        widget.querySelector('.chatbot-topics').append(button);
    }
    message('안녕하세요! 윤서의 포트폴리오에 오신 걸 환영해요. 소개나 작업에 대해 궁금한 점을 물어보세요.', 'bot');
    nudgeTimer = setTimeout(() => {
        if (!panel.hidden || document.hidden) return;
        nudge.classList.add('is-visible');
        nudgeHideTimer = setTimeout(() => { nudge.classList.remove('is-visible'); scheduleNudge(); }, 5500);
    }, 2500);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearTimeout(nudgeTimer);
            clearTimeout(nudgeHideTimer);
            nudge.classList.remove('is-visible');
        } else if (panel.hidden) scheduleNudge();
    });
}
