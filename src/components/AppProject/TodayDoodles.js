import { softenSketch } from './SketchStroke.js';

export function createTodayDoodles(panel) {
    const holder = document.createElement('div');
    holder.className = 'eco-leaves today-doodles';
    holder.setAttribute('aria-hidden', 'true');
    const namespace = 'http://www.w3.org/2000/svg';
    const icons = [
        ['letter', 'M13 51 Q12 69 14 91 Q15 95 20 95 Q52 97 84 93 Q89 92 89 88 L87 49 M14 51 Q29 37 48 24 Q51 22 55 25 L87 49', 'M15 53 Q32 65 49 75 Q52 76 56 73 L87 51 M15 92 Q27 80 39 70 M87 91 Q76 78 64 70 M28 61 L27 35 Q48 33 72 34 L73 59 M39 45 Q49 44 62 45 M40 53 L57 54 M44 63 Q39 59 43 57 Q47 55 49 59 Q53 55 56 58 Q59 62 49 68 Z'],
        ['location', 'M51 98 Q39 85 29 70 C19 56 18 42 24 30 C31 16 45 13 57 16 C73 19 82 32 79 47 C77 63 63 84 51 98 Z', 'M62 43 C63 51 57 57 50 56 C42 57 37 51 38 43 C37 36 44 31 50 32 C57 31 62 37 62 43 Z M33 103 Q19 106 23 111 Q32 118 53 116 Q78 116 80 110 Q81 105 68 103 M16 86 L22 86 M83 77 L89 75'],
    ];
    icons.forEach(([name, ...paths], index) => {
        const svg = document.createElementNS(namespace, 'svg');
        svg.setAttribute('viewBox', '0 0 100 125');
        svg.setAttribute('class', `eco-leaf today-doodle--${name}`);
        svg.style.setProperty('--leaf-delay', `${index * 240}ms`);
        paths.forEach(shape => {
            const path = document.createElementNS(namespace, 'path');
            path.setAttribute('d', shape);
            path.setAttribute('pathLength', '1');
            svg.append(path);
        });
        softenSketch(svg);
        holder.append(svg);
    });
    panel.querySelector('.personal-overview-canvas').append(holder);
    return holder;
}
