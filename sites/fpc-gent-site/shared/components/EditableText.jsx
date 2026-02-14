import React, { useState, useRef, useEffect } from 'react';

/**
 * EditableText
 * Maakt tekst direct bewerkbaar in de browser tijdens development.
 * Slaat wijzigingen op in de JSON via de Athena API en communiceert met de Dock.
 */
export default function EditableText({ tagName: Tag = 'span', value, cmsBind, className = "", style = {}, ...props }) {
  const isDev = import.meta.env.DEV;
  const [currentValue, setCurrentValue] = useState(value);
  const elementRef = useRef(null);

  // Update lokale staat als de prop verandert
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  // Bepaal de dock-bind string voor communicatie met de iframe parent
  const dockBind = cmsBind ? JSON.stringify({ 
    file: cmsBind.file, 
    index: cmsBind.index || 0, 
    key: cmsBind.key 
  }) : null;

  if (!isDev) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }

  const handleSave = async () => {
    const newValue = elementRef.current.innerText.trim();
    
    // Alleen opslaan als er echt iets veranderd is
    if (newValue === value) return;

    try {
      const res = await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/([^:]\/)\/+/g, "$1"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: cmsBind.file,
          index: cmsBind.index || 0,
          key: cmsBind.key,
          value: newValue
        })
      });
      const data = await res.json();
      if (data.success) {
        console.log(`✅ Opgeslagen: "${newValue}"`);
        // Forceer een reload om alles in sync te houden
        window.location.reload();
      }
    } catch (err) {
      console.error("❌ Fout bij opslaan tekst:", err);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current.blur();
    }
    if (e.key === 'Escape') {
      elementRef.current.innerText = value;
      elementRef.current.blur();
    }
  };

  return (
    <Tag
      ref={elementRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={handleSave}
      onKeyDown={onKeyDown}
      data-dock-bind={dockBind}
      data-dock-type="text"
      className={`${className} outline-none transition-all duration-200 hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-300 rounded cursor-text focus:ring-2 focus:ring-blue-500 focus:bg-transparent`}
      style={style}
      title="Klik om tekst aan te passen"
      {...props}
    >
      {currentValue}
    </Tag>
  );
}
