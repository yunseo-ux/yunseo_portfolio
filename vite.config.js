import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function expandSections(html) {
    return html.replace(/<!-- @include \/(src\/components\/[\w/]+\.html) -->/g, (_match, file) =>
        expandSections(readFileSync(resolve(file), 'utf8').trimEnd())
    );
}

function deferOffscreenImages(html) {
    return html.replace(/<img\b[^>]*>/gi, tag => {
        const criticalHeroAsset = /class=["'][^"']*\b(?:hero-pen-icon|hero-pen-line)\b[^"']*["']/.test(tag);
        const loading = criticalHeroAsset ? 'eager' : 'lazy';
        if (/\bloading=["'][^"']*["']/.test(tag)) {
            tag = tag.replace(/\bloading=["'][^"']*["']/, `loading="${loading}"`);
        } else {
            tag = tag.replace(/\s*\/?>$/, end => ` loading="${loading}"${end}`);
        }
        if (!/\bdecoding=["'][^"']*["']/.test(tag)) {
            tag = tag.replace(/\s*\/?>$/, end => ` decoding="async"${end}`);
        }
        return tag;
    });
}

export default defineConfig({
    optimizeDeps: { entries: ['index.html'] },
    server: {
        hmr: false,
        watch: { ignored: ['**/verification/**', '**/backups/**'] },
    },
    plugins: [{
        name: 'html-sections',
        configureServer(server) {
            // The ending is a prebuilt, self-contained module in public/.
            // Serve it directly instead of passing it through Vite's import transform.
            server.middlewares.use((request, response, next) => {
                if (request.url?.split('?')[0] !== '/ending/ending.js') return next();
                response.setHeader('Content-Type', 'text/javascript');
                response.end(readFileSync(resolve('public/ending/ending.js')));
            });
        },
        transformIndexHtml: {
            order: 'pre',
            handler: html => deferOffscreenImages(expandSections(html)),
        },
    }],
});
