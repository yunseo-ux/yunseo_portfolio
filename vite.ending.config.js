import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// A self-contained React island also works in the existing Live Server preview.
export default defineConfig({
    publicDir: false,
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
        outDir: 'public/ending',
        emptyOutDir: true,
        lib: {
            entry: resolve('src/components/Ending/EndingEntry.jsx'),
            formats: ['es'],
            fileName: () => 'ending.js',
        },
        minify: true,
    },
});
