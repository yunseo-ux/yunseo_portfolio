// A faint second pencil pass gives each outline a soft, hand-traced edge.
export function softenSketch(svg) {
    [...svg.querySelectorAll('path')].forEach((path, index) => {
        const trace = path.cloneNode();
        trace.classList.add('sketch-trace');
        trace.setAttribute('transform', `translate(${index % 2 ? -.65 : .7} ${index % 2 ? .6 : -.45})`);
        svg.insertBefore(trace, path);
    });
}
