import React, { createContext, useContext, useEffect, useState } from 'react';

const StyleContext = createContext();

export const useStyles = () => useContext(StyleContext);

/**
 * StyleProvider for docked track.
 * Reads style_config from data and applies CSS variables to :root.
 * Dock can override these variables via postMessage.
 */
export const StyleProvider = ({ children, data = {} }) => {
    const styleConfig = Array.isArray(data.style_config)
        ? (data.style_config[0] || {})
        : (data.style_config || {});

    const [styles, setStyles] = useState(styleConfig);

    // Apply CSS variables to :root whenever styles change
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(styles).forEach(([key, value]) => {
            // Skip metadata keys (prefixed with _)
            if (key.startsWith('_')) return;
            // Only set CSS custom properties (--prefixed)
            if (key.startsWith('--')) {
                root.style.setProperty(key, value);
            }
        });

        return () => {
            // Cleanup: remove custom properties on unmount
            Object.keys(styles).forEach(key => {
                if (key.startsWith('--')) {
                    root.style.removeProperty(key);
                }
            });
        };
    }, [styles]);

    // Listen for Dock style updates via postMessage
    useEffect(() => {
        const handler = (event) => {
            if (event.data?.type === 'athena-style-update' && event.data.styles) {
                setStyles(prev => ({ ...prev, ...event.data.styles }));
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    return (
        <StyleContext.Provider value={{ styles, setStyles }}>
            {children}
        </StyleContext.Provider>
    );
};

export default StyleContext;
