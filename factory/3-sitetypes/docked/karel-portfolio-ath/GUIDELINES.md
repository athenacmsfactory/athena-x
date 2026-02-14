# 📘 Sitetype Guidelines: karel-portfolio-ath

## Status: Semi-Autonomous (Hybrid)
Dit sitetype is een hybride tussen de **Docked** en **Autonomous** tracks.

### Bijzondere Kenmerken:
- **Directe Sectie Tools**: Bevat een `SectionToolbar` die direct in de site wordt gerenderd (zichtbaar in `DEV` mode of in de Dock).
- **Dynamische Rendering**: Gebruikt een `App.jsx` die secties bouwt op basis van `section_order.json`.
- **Handmatige Athenaficatie**: Dit type is ontstaan uit een bestaande portfolio-codebase die handmatig is voorzien van Athena hooks.

### Maintenance Notes:
- Bij het toevoegen van nieuwe componenten: zorg dat ze omringd zijn door een `div` met `data-dock-section` en een `SectionToolbar` in `App.jsx`.
- Gebruik altijd `EditableMedia` in plaats van `EditableImage` voor volledige Dock-compatibiliteit.
- De opmaak wordt bewaard in `src/data/style_bindings.json`.

---
*Gegenereerd op 31 januari 2026*
