export function initProjectLine(track) {
    const sections = [...track.querySelectorAll(':scope > section')];
    const startIndex = sections.findIndex(section => section.matches('.team-research'));
    const panels = startIndex < 0 ? [] : sections.slice(startIndex);
    const ns = 'http://www.w3.org/2000/svg';
    let curve = 'M -40 927';
    panels.forEach((_, index) => {
        const x = index * 1920;
        const rise = [822, 850, 864, 800, 846, 825, 858][index % 7];
        const dip = [986, 1000, 1010, 978, 995, 1006, 984][index % 7];
        if ([1, 4].includes(index)) {
            curve += ` C ${x + 250} 927 ${x + 430} ${rise} ${x + 700} ${rise} C ${x + 990} ${rise} ${x + 1220} ${dip} ${x + 1490} ${dip} C ${x + 1640} ${dip} ${x + 1690} 945 ${x + 1730} 936 C ${x + 1820} 916 ${x + 1910} 852 ${x + 1870} 801 C ${x + 1837} 758 ${x + 1798} 801 ${x + 1824} 861 C ${x + 1846} 912 ${x + 1890} 927 ${x + 1920} 927`;
        } else {
            curve += ` C ${x + 230} 927 ${x + 380} ${rise} ${x + 650} ${rise} C ${x + 950} ${rise} ${x + 1130} ${dip} ${x + 1410} ${dip} C ${x + 1620} ${dip} ${x + 1770} 927 ${x + 1920} 927`;
        }
    });
    const paths = [];
    const cars = [];
    panels.forEach((panel, index) => {
        const canvas = panel.querySelector('[class$="-canvas"]');
        if (!canvas) return;
        const svg = document.createElementNS(ns, 'svg');
        svg.classList.add('project-pencil-line');
        svg.setAttribute('viewBox', `${index * 1920} 0 1920 1080`);
        svg.setAttribute('aria-hidden', 'true');
        const filterId = `project-pencil-grain-${index}`;
        svg.innerHTML = `<defs><filter id="${filterId}" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".035 .32" numOctaves="3" seed="8" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs>`;
        for (const [width, opacity, offset] of [
            [3.8, 0.17, 0],
            [1.2, 0.16, 0.5],
        ]) {
            const path = document.createElementNS(ns, 'path');
            path.setAttribute('d', curve);
            path.setAttribute('pathLength', '1');
            path.setAttribute('stroke-width', width);
            path.setAttribute('opacity', opacity);
            path.setAttribute('transform', `translate(0 ${offset - 100})`);
            path.setAttribute('filter', `url(#${filterId})`);
            path.style.strokeDasharray = '1';
            path.style.strokeDashoffset = '1';
            svg.append(path);
            paths.push(path);
        }
        if ([0, 3, 5].includes(index)) {
            const sketch = document.createElementNS(ns, 'g');
            sketch.setAttribute(
                'transform',
                `translate(${index * 1920 + 1350} ${index === 3 ? 350 : 365}) rotate(${index === 5 ? 4 : -5})`
            );
            sketch.setAttribute('opacity', '.42');
            const strokes = [
                'M8 50 Q3 48 5 40 L9 32 Q13 28 23 27 L35 11 Q40 6 51 6 L72 7 Q81 8 88 19 L96 29 Q106 30 113 35 L116 48 Q114 53 103 53 M83 53 L40 53 M20 53 L8 50',
                'M29 27 L40 14 Q43 12 51 12 L57 12 L58 27 Z M64 13 L72 13 Q77 14 83 23 L86 28 L65 27 Z',
                'M39 51 C39 65 19 65 19 51 C19 37 39 37 39 51 Z M103 52 C103 66 83 66 83 52 C83 38 103 38 103 52 Z',
                'M25 51 C25 45 33 45 33 51 C33 57 25 57 25 51 M89 52 C89 46 97 46 97 52 C97 58 89 58 89 52 M68 34 L75 34 M9 35 L17 36 M109 37 L114 39',
            ];
            strokes.forEach((d, part) => {
                const path = document.createElementNS(ns, 'path');
                path.setAttribute('d', d);
                path.setAttribute('pathLength', '1');
                path.setAttribute('stroke-width', part === 0 ? '2' : '1.6');
                path.setAttribute('filter', `url(#${filterId})`);
                path.style.strokeDasharray = '1';
                path.style.strokeDashoffset = '1';
                sketch.append(path);
                cars.push({
                    path,
                    start: (index + 0.08 + part * 0.12) / (panels.length - 0.5),
                    duration: 0.22 / (panels.length - 0.5),
                });
            });
            svg.append(sketch);
        }
        canvas.prepend(svg);
    });
    let target = 0;
    let drawn = 0;
    let frame = 0;
    let previous = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = (time) => {
        const elapsed = previous ? Math.min(64, time - previous) : 16;
        previous = time;
        drawn += (target - drawn) * (1 - Math.exp(-elapsed / 260));
        if (Math.abs(target - drawn) < 0.0001) drawn = target;
        paths.forEach((path) => {
            path.style.strokeDashoffset = String(1 - drawn);
        });
        cars.forEach(({ path, start, duration }) => {
            path.style.strokeDashoffset = String(
                1 - Math.max(0, Math.min(1, (drawn - start) / duration))
            );
        });
        frame = drawn === target ? 0 : requestAnimationFrame(draw);
        if (!frame) previous = 0;
    };
    return (position) => {
        target = panels.length ? Math.max(0, Math.min(1, (position - startIndex + 0.5) / (panels.length - 0.5))) : 0;
        if (reduced) drawn = target;
        if (!frame) frame = requestAnimationFrame(draw);
    };
}
