import React, { createContext, useContext, useState, useEffect } from 'react';

const StyleContext = createContext();

export const useStyles = () => useContext(StyleContext);

export const StyleProvider = ({ children, initialStyles = {} }) => {
  const [styles, setStyles] = useState(initialStyles);
  const isDev = import.meta.env.DEV;

  const refreshStyles = async () => {
    if (!isDev) return;
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      // We fetchen de data via de Vite server (die kan bestanden in src/data lezen als ze via een endpoint worden ontsloten)
      // Maar eigenlijk is het makkelijker om de style_bindings.json direct te fetchen 
      // ALS Vite hem serveert. Vite serveert bestanden in de src map tijdens dev!
      const res = await fetch(`${baseUrl}src/data/style_bindings.json`.replace(/\/+/g, '/'), {
          cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
      }
    } catch (e) {
      console.warn("StyleContext: Could not refresh styles", e);
    }
  };

  return (
    <StyleContext.Provider value={{ styles, refreshStyles }}>
      {children}
    </StyleContext.Provider>
  );
};