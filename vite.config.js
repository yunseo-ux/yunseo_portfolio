import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function expandSections(html) {
    return html.replace(/<!-- @include \/(src\/components\/[\w/]+\.html) -->/g, (_match, file) =>
        expandSections(readFileSync(resolve(file), 'utf8').trimEnd())
    );
}

export default defineConfig({
    server: { watch: { ignored: ['**/verification/**', '**/backups/**'] } },
    plugins: [{
        name: 'html-sections',
        transformIndexHtml: { order: 'pre', handler: expandSections },
        handleHotUpdate({ file, server }) {
            if (file.endsWith('.html')) {
                server.ws.send({ type: 'full-reload' });
                return [];
            }
        },
    }],
});
