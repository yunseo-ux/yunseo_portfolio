import fs from 'node:fs/promises';

const label = process.argv[2] || 'before';
const siteUrl = process.argv[3] || 'http://127.0.0.1:5173/';
const tabs = await fetch('http://127.0.0.1:9222/json').then(r => r.json());
const tab = tabs.find(t => t.type === 'page');
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(JSON.stringify(message.error))); else resolve(message.result);
    }
});
const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
};
await call('Page.enable');
await call('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await call('Page.navigate', { url: siteUrl });
await new Promise(resolve => setTimeout(resolve, 2500));
await evaluate('document.fonts.ready.then(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))))');
await fs.mkdir('verification', { recursive: true });
const snapshot = await evaluate(`(() => {
    const selectors = ['.portfolio-hero', '.hero-title', '.hero-doodle-controls', '.portfolio-intro', '.intro-copy', '.introduction', '.introduction-content', '.approach', '.approach-description', '.project-preview', '.project-preview-placeholder', '.team-project-gallery', '.team-project-title', '.team-project-info', '.team-project-highlight', '.team-background', '.team-research', '.team-placeholder'];
    return { text: document.getElementById('root').textContent, images: [...document.images].map(i=>({src:new URL(i.src).pathname, alt:i.alt, width:i.naturalWidth})), geometry: selectors.flatMap(selector => [...document.querySelectorAll(selector)].map(e=>{ const r=e.getBoundingClientRect(),s=getComputedStyle(e); return {selector,x:r.x,y:r.y,width:r.width,height:r.height,font:s.fontFamily,size:s.fontSize,color:s.color,background:s.backgroundColor}; })) };
})()`);
await fs.writeFile(`verification/${label}.json`, JSON.stringify(snapshot, null, 2));
for (const [name, selector] of [['hero','.portfolio-hero'],['preview','.project-preview'],['team','.team-project-gallery']]) {
    await evaluate(`window.scrollTo(0,document.querySelector('${selector}').getBoundingClientRect().top + window.scrollY)`);
    await new Promise(resolve => setTimeout(resolve, 250));
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(`verification/${label}-${name}.png`, Buffer.from(shot.data, 'base64'));
}
if (label !== 'before') {
    await evaluate('window.scrollTo(0,0)');
    await call('Input.dispatchMouseEvent', {type:'mousePressed', x:300, y:300, button:'left', clickCount:1});
    await call('Input.dispatchMouseEvent', {type:'mouseMoved', x:340, y:320, button:'left', buttons:1});
    await call('Input.dispatchMouseEvent', {type:'mouseReleased', x:340, y:320, button:'left', clickCount:1});
    const drawing = await evaluate(`({paths:document.querySelectorAll('.hero-doodle path').length,disabled:document.querySelector('.hero-doodle-controls button').disabled})`);
    if (drawing.paths !== 1 || drawing.disabled) throw new Error('Drawing verification failed');
    await evaluate(`document.querySelector('.hero-doodle-controls button').click()`);
    if (await evaluate(`document.querySelectorAll('.hero-doodle path').length`) !== 0) throw new Error('Clear failed');
    const scroll = await evaluate(`(() => {const g=document.querySelector('.team-project-gallery');window.scrollTo(0,g.offsetTop+1500);return true;})()`);
    await new Promise(resolve=>setTimeout(resolve,100));
    const left = await evaluate(`parseFloat(document.querySelector('.team-project-track').style.left)`);
    if (!(left < 0)) throw new Error('Horizontal scroll failed');
    await new Promise(resolve=>setTimeout(resolve,5200));
    const before = await evaluate(`document.querySelector('.team-project-screen-scroll').style.transform`);
    await new Promise(resolve=>setTimeout(resolve,500));
    const after = await evaluate(`document.querySelector('.team-project-screen-scroll').style.transform`);
    if (before === after) throw new Error('Laptop animation failed');
    console.log(JSON.stringify({ drawing, horizontalLeft: left, laptopAnimation: true, scroll }));
}
socket.close();
console.log(`Saved ${label} browser verification`);
