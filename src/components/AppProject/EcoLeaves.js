import { softenSketch } from './SketchStroke.js';

export function createEcoLeaves(panel) {
    const holder = document.createElement('div');
    holder.className = 'eco-leaves';
    holder.setAttribute('aria-hidden', 'true');
    const namespace = 'http://www.w3.org/2000/svg';
    ['#194C01', '#607751', '#95AD86'].forEach((color, index) => {
        const svg = document.createElementNS(namespace, 'svg');
        svg.setAttribute('viewBox', '0 0 100 140');
        svg.setAttribute('class', `eco-leaf eco-leaf--${index + 1}`);
        svg.style.color = color;
        svg.style.setProperty('--leaf-delay', `${index * 180}ms`);
        const outline = document.createElementNS(namespace, 'path');
        outline.setAttribute('d', [
            'M43 108 C22 103 16 85 22 65 Q27 48 45 34 Q60 23 68 12 C66 31 79 48 76 66 Q73 93 43 108 Z',
            'M47 109 Q25 103 24 83 C21 62 42 39 61 22 Q67 16 70 10 C69 30 81 44 79 65 C78 84 65 102 47 109 Z',
            'M46 109 C23 103 19 88 25 70 Q31 51 49 36 Q60 27 66 14 C66 32 79 47 77 66 Q74 94 46 109 Z',
        ][index]);
        const veins = document.createElementNS(namespace, 'path');
        veins.setAttribute('d', 'M35 132 Q42 117 48 99 C55 77 61 53 68 17 M49 99 Q39 92 30 80 M54 84 Q65 79 72 69 M57 69 Q44 61 37 53 M61 52 Q68 47 73 40');
        [outline, veins].forEach(path => {
            path.setAttribute('pathLength', '1');
            svg.append(path);
        });
        softenSketch(svg);
        holder.append(svg);
    });
    panel.querySelector('.personal-overview-canvas').append(holder);
    return holder;
}
