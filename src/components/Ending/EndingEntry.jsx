import React from 'react';
import { createRoot } from 'react-dom/client';
import EndingSection from './EndingSection.jsx';

export function mountEnding(container) {
    const root = createRoot(container);
    root.render(<EndingSection />);
    return () => root.unmount();
}
