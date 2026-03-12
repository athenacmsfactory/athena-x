import { DisplayConfigProvider } from './components/DisplayConfigContext';
import React, { useMemo, useState, useEffect } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import StyleInjector from './components/StyleInjector';

const App = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, file, index, key, value, config, section } = event.data;

      if (type === 'DOCK_REQUEST_SYNC') {
        const sourceFile = file || 'site_settings';
        const sourceData = data[sourceFile];
        const row = Array.isArray(sourceData) ? sourceData[index || 0] : sourceData;
        
        window.parent.postMessage({
          type: 'SITE_SYNC_RESPONSE',
          key,
          value: row ? row[key] : null,
          fullRow: row
        }, '*');
      }

      if (type === 'DOCK_UPDATE_TEXT' || type === 'DOCK_UPDATE_COLOR') {
        setData(prev => {
          const newData = { ...prev };
          const targetFile = file || (key.startsWith('header_') ? 'header_settings' : 'site_settings');
          
          // Ensure target file entry exists in state
          if (!newData[targetFile]) {
            newData[targetFile] = (index !== undefined) ? [] : {};
          }

          if (Array.isArray(newData[targetFile])) {
            newData[targetFile] = [...newData[targetFile]];
            newData[targetFile][index || 0] = { ...newData[targetFile][index || 0], [key]: value };
          } else {
            newData[targetFile] = { ...newData[targetFile], [key]: value };
          }
          return newData;
        });
      }

      if (type === 'DOCK_UPDATE_SECTION_CONFIG') {
        setData(prev => {
          const newData = { ...prev };
          newData.display_config = {
            ...newData.display_config,
            sections: {
              ...(newData.display_config?.sections || {}),
              [file]: config
            }
          };
          return newData;
        });
      }

      if (type === 'DOCK_UPDATE_SECTION_VISIBILITY') {
          setData(prev => {
              const newData = { ...prev };
              const settings = [...(newData.section_settings || [])];
              const target = section || file;
              const idx = settings.findIndex(s => s.id === target);
              if (idx !== -1) {
                  settings[idx] = { ...settings[idx], visible: value };
                  newData.section_settings = settings;
              }
              return newData;
          });
      }

      if (type === 'DOCK_UPDATE_SECTION_PADDING') {
          setData(prev => {
              const newData = { ...prev };
              const settings = [...(newData.section_settings || [])];
              const target = section || file;
              const idx = settings.findIndex(s => s.id === target);
              if (idx !== -1) {
                  settings[idx] = { ...settings[idx], padding: value };
                  newData.section_settings = settings;
              }
              return newData;
          });
      }

      if (type === 'DOCK_UPDATE_LAYOUT') {
          setData(prev => {
             const newData = { ...prev };
             const layouts = { ...(newData.layout_settings || {}) };
             const target = section || file;
             layouts[target] = value;
             newData.layout_settings = layouts;
             return newData;
          });
      }

      if (type === 'DOCK_UPDATE_SECTION_ORDER') {
          setData(prev => {
              const newData = { ...prev };
              newData.section_order = value;
              return newData;
          });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 🔥 [v33 Bridge]: Deel actuele data met de Dock-connector
  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data]);

  const primaryTable = data['footer'] || [];
  
  return (
    <DisplayConfigProvider data={data}>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
        <StyleInjector data={data} />
        
        <Header 
          primaryTable={primaryTable} 
          tableName="footer" 
          hero={data['hero']} 
          headerSettings={data['header_settings']}
          navData={data['navbar']}
        />
        
        <main>
          <Section data={data} />
        </main>

        <Footer 
          primaryTable={data['footer']} 
          socialData={data['social_media']}
          openingData={data['openingsuren']}
        />
      </div>
    </DisplayConfigProvider>
  );
};

export default App;
