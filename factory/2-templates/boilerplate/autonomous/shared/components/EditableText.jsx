import React, { useState, useEffect } from 'react';
import VisualEditor from './ui/VisualEditor';
import { useStyles } from './StyleContext';

/**
 * EditableText (Autonomous Track)
 * Built-in inline editing logic.
 */
export default function EditableText({ tagName: Tag = 'span', value, children, cmsBind, table, field, id, className = "", style = {}, ...props }) {
  const { styles, refreshStyles } = useStyles() || { styles: {} };
  const [isOpen, setIsOpen] = useState(false);
  
  const initialValue = value !== undefined ? value : children;
  const [currentValue, setCurrentValue] = useState(initialValue);
  
  const binding = cmsBind || { file: table, index: id, key: field };
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    setCurrentValue(value !== undefined ? value : children);
  }, [value, children]);

  const handleSave = async (newValue, newFormatting) => {
    setIsOpen(false);
    setCurrentValue(newValue);

    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const apiUrl = `${baseUrl}__athena/update-json`.replace(/\/+/g, '/');
      
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: binding.file,
          index: binding.index || 0,
          key: binding.key,
          value: newValue,
          formatting: newFormatting
        })
      });
      
      const data = await res.json();
      if (data.success && refreshStyles) {
          refreshStyles();
      }
    } catch (err) {
      console.error("❌ Fout bij opslaan:", err);
    }
  };

  const styleKey = `${binding.file}:${binding.index || 0}:${binding.key}`;
  const formatting = styles[styleKey];

  const finalStyle = { ...style };
  if (formatting) {
      if (formatting.bold) finalStyle.fontWeight = 'bold';
      if (formatting.italic) finalStyle.fontStyle = 'italic';
      if (formatting.fontSize) finalStyle.fontSize = formatting.fontSize;
      if (formatting.textAlign) finalStyle.textAlign = formatting.textAlign;
      if (formatting.fontFamily && formatting.fontFamily !== 'inherit') finalStyle.fontFamily = formatting.fontFamily;
  }

  const displayValue = (typeof currentValue === 'object' && currentValue !== null && !React.isValidElement(currentValue)) 
    ? (currentValue.text || currentValue.title || currentValue.label || JSON.stringify(currentValue)) 
    : currentValue;

  if (!isDev) {
    return <Tag className={className} style={finalStyle} {...props}>{displayValue}</Tag>;
  }

  return (
    <>
      <Tag
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        className={`${className} cursor-pointer hover:ring-2 hover:ring-blue-400/40 hover:bg-blue-50/10 rounded-sm transition-all duration-200`}
        style={finalStyle}
        title={`Edit "${binding.key}"`}
        {...props}
      >
        {displayValue}
      </Tag>

      {isOpen && (
        <VisualEditor 
            item={{ currentValue, currentFormatting: formatting, binding }}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
