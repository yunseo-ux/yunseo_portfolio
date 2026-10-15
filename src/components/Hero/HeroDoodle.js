export function initHeroDoodle() {
    const surface = document.querySelector('.hero-doodle');
    const clearButton = document.querySelector('.hero-doodle-controls button');
    let pointerId = null;
    let currentPath = null;
    const point = event => {
        const rect = surface.getBoundingClientRect();
        return `${((event.clientX - rect.left) / rect.width * 1000).toFixed(2)} ${((event.clientY - rect.top) / rect.height * 1000).toFixed(2)}`;
    };
    surface.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.pointerType === 'touch') return;
        event.preventDefault();
        pointerId = event.pointerId;
        surface.setPointerCapture(pointerId);
        const position = point(event);
        currentPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        for (const [attribute, value] of Object.entries({ d:`M${position} L${position}`, fill:'none', stroke:'#4f718d', 'stroke-width':'2.5', 'stroke-linecap':'round', 'stroke-linejoin':'round', 'vector-effect':'non-scaling-stroke' })) {
            currentPath.setAttribute(attribute, value);
        }
        surface.append(currentPath);
        clearButton.disabled = false;
    });
    surface.addEventListener('pointermove', event => {
        if (pointerId !== event.pointerId || !currentPath) return;
        currentPath.setAttribute('d', `${currentPath.getAttribute('d')} L${point(event)}`);
    });
    const end = event => {
        if (pointerId !== event.pointerId) return;
        pointerId = null;
        currentPath = null;
        if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    };
    surface.addEventListener('pointerup', end);
    surface.addEventListener('pointercancel', end);
    surface.addEventListener('lostpointercapture', () => { pointerId = null; currentPath = null; });
    clearButton.addEventListener('click', () => {
        surface.querySelectorAll('path').forEach(path => path.remove());
        clearButton.disabled = true;
    });
}
