# 🛠️ Developer Notes: karel-portfolio-ath

## Project Status: Hybrid Site
Deze site is handmatig "geathenaficeerd" en wijkt af van de standaard generator output.

### Architectuur & Integratie
- **Sitetype**: `karel-portfolio-ath`
- **Track**: Docked (met Autonomous elementen)
- **Rendering**: De site rendert secties dynamisch via `App.jsx`.
- **UI Tools**: Bevat een `SectionToolbar` voor direct beheer in de preview. Deze is onzichtbaar op de live site (alleen zichtbaar in `pnpm dev` of via de Dock iframe).

### Bijzonderheden
- De tekst-opmaak (vet, font-size, etc.) wordt live gesynchroniseerd via `dock-connector.js` en permanent opgeslagen in `src/data/style_bindings.json`.
- De profielfoto's zijn via CSS (`rounded-full`) rond gemaakt in `Hero.jsx`.

### Bekende Beperkingen
- Omdat dit een hybride site is, kunnen sommige automatische factory-updates handmatige aanpassingen in `App.jsx` vereisen.

---
*Laatste update: 31 januari 2026*
