# 🎯 Strategisch Doel: De Google Sheets "Holy Grail"

Dit document dient als de centrale referentie voor het uiteindelijke doel van de Athena CMS Factory: **volledig site-beheer via Google Sheets voor de eindgebruiker.**

## 🏁 De Visie
Een systeem waarbij de techniek (React/Vite/Tailwind) volledig is losgekoppeld van de inhoud. De gebruiker past prijzen, teksten of afbeeldingen aan in een vertrouwde Google Sheet, en de website wordt automatisch bijgewerkt zonder dat er een developer of code aan te pas komt.

## 📊 Huidige Status (Januari 2026)

### 1. Wat al werkt (De "Plumbing")
*   **Auto-Provisioning:** `auto-sheet-provisioner.js` maakt automatisch nieuwe Sheets aan met de juiste tabbladen op basis van de blueprint.
*   **Reverse Data Pipeline:** Wijzigingen uit de Athena Dock worden via `sync-site-to-input.js` en `sync-json-to-tsv.js` teruggevoerd naar de fabriek.
*   **Master Export:** `6-utilities/export-site-to-sheets.js` is de "één-klik" oplossing om alle visuele wijzigingen naar de live Google Sheet te pushen.

### 2. Recente Doorbraken (v6.7.0)
*   **Style Bindings:** Opmaak (bold, font, kleur) wordt apart opgeslagen in `style_bindings.json`. 
    *   *Gevolg:* De Google Sheet blijft "schoon" (alleen tekst/data), wat cruciaal is voor de leesbaarheid voor de klant.
*   **Nested Property Updates:** Ondersteuning voor geneste JSON (bv. `items.0.titel`).
    *   *Gevolg:* Complexe pagina-structuren (vooral in MPA/Hydra) kunnen nu ook naar Sheets gemapt worden.

### 3. Status per Track
*   **SPA Sites (bv. Computer-shop):** **95% Klaar.** De 1-op-1 koppeling tussen kolommen en velden is stabiel.
*   **MPA Sites (bv. FPCNV):** **70% Klaar.** De techniek is er, de optimale indeling van de Sheet voor 100+ pagina's moet nog gestandaardiseerd worden.

---

## 🚀 De "Last Mile" (Nog te doen)

### 🟦 [DOCK] Publiceer Knop
Momenteel is de sync een handmatig terminal-commando.
- [ ] Voeg een knop "Sync naar Google Sheets" toe aan de Athena Dock zijbalk.
- [ ] Implementeer een visuele status-indicator (bv. "Laatste sync: 5 min geleden").

### 🟩 [AUTOMATISERING] Webhooks & Auto-Rebuild
De gebruiker moet niet afhankelijk zijn van de Dock om wijzigingen uit de Sheet live te zetten.
- [ ] Configureer een "listener" service (webhook) die wijzigingen in de Google Sheet opmerkt.
- [ ] Automatiseer de `parser -> deploy` cyclus op de server/Chromebook.

### 🟧 [UX] Gebruikersvriendelijke Sheets
- [ ] Maak "Master Templates" voor Google Sheets met duidelijke instructies en dropdown-menu's voor categorieën.
- [ ] Implementeer validatie in de Sheet (bv. waarschuwing als een tekst te lang is voor de layout).

---

## 🧠 Belangrijk om te onthouden
Het scheiden van **Inhoud (Sheets)**, **Vormgeving (Dock/Style Bindings)** en **Techniek (Factory Engine)** is wat Athena uniek maakt. We bouwen geen website, we bouwen een autonoom ecosysteem voor content-publicatie.
