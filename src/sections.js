const includePattern = /<!-- @include \/(src\/components\/[\w/]+\.html) -->/g;

async function expandSections(html) {
    const includes = [...html.matchAll(includePattern)];
    const sections = await Promise.all(includes.map(async ([, path]) => {
        const response = await fetch(`/${path}`);
        if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
        return expandSections(await response.text());
    }));
    let index = 0;
    return html.replace(includePattern, () => sections[index++]);
}

export async function loadSections(root) {
    if (!root.innerHTML.match(includePattern)) return;
    root.innerHTML = await expandSections(root.innerHTML);
}
