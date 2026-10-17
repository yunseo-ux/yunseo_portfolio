const includePattern = /<!-- @include \/(src\/components\/[\w/]+\.html) -->/g;

async function expandSections(html) {
    // Live Server injects its reload script before every closing SVG tag.
    // Inside fragments, that script's CDATA can swallow the following HTML
    // when the combined document is assigned to innerHTML.
    html = html.replace(/<!--\s*Code injected by live-server\s*-->\s*<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
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
