# Analyse Athena Factory Templates Structuur

Dit document beschrijft de rol en het doel van de verschillende mappen binnen `factory/2-templates/`. Deze map vormt de "blauwdruk" bibliotheek van de Athena Factory; hieruit worden alle uiteindelijke websites (`sites/`) opgebouwd.

## 🚀 Snel Overzicht

factory/2-templates/
├── boilerplate/              # De kern-architectuur van de websites
│   ├── autonomous/           # "Track A": Websites met eigen editor-tools
│   ├── docked/               # "Track B": Lichtgewicht websites voor de Dock
│   ├── static-wrapper/       # Omhulsel voor externe prototypes
│   ├── MPA/                  # ⚠️ LEGACY: Oude MPA structuur (niet gebruiken)
│   └── SPA/                  # ⚠️ LEGACY: Oude SPA structuur (niet gebruiken)
├── config/                   # Systeem-configuratie (Vite, Git, CI/CD)
├── docs/                     # Templates voor gebruikershandleidingen
├── logic/                    # Hulp-scripts voor data fetching en mapping
└── mpa/                      # Project Hydra: Moderne componenten voor MPA sites

## ⚠️ Belangrijke Opmerking over Legacy Mappen

In de map `boilerplate/` bevinden zich de mappen `SPA/` en `MPA/` direct in de root. Dit zijn **overblijfselen van de Factory v5** (vóór de invoering van de Two-Track architectuur in v6). 

*   **Gebruik deze mappen niet voor nieuwe projecten.** 
*   De moderne `factory.js` engine negeert deze mappen volledig en kijkt uitsluitend naar de `docked/` en `autonomous/` submappen.
*   **Relatie met tracks:** Hoewel de code in de legacy `SPA` map qua functionaliteit (ingebouwde bewerking) lijkt op de `autonomous` track, is het technisch verouderd. De `autonomous` track is de officiële, verbeterde opvolger van de legacy SPA structuur.
*   De code in deze mappen is "monolithisch": bewerkingslogica en weergavelogica zitten in elkaar verweven, wat ze minder efficiënt maakt voor de 4GB RAM beperking van de Chromebook.

## 1. Volledige Mappenstructuur (Gedetailleerd)


```text
factory/2-templates/
├── boilerplate/              # De kern-architectuur van de websites
│   ├── autonomous/           # "Track A": Websites met eigen editor-tools (onafhankelijk van de Dock)
│   │   ├── SPA/              # Single Page Application bronbestanden
│   │   └── shared/           # Gedeelde componenten met ingebouwde inline-editing
│   ├── docked/               # "Track B": Lichtgewicht websites beheerd via de Athena Dock
│   │   ├── SPA/              # Single Page Application bronbestanden (luisteren naar postMessage)
│   │   └── shared/           # Passieve componenten geoptimaliseerd voor de Dock-interface
│   ├── MPA/                  # Multi-Page Application bronbestanden (Project Hydra)
│   ├── SPA/                  # Generieke Single Page Application bronbestanden (legacy/fallback)
│   └── static-wrapper/       # Kaal Vite-project dat dient als omhulsel voor externe prototypes
├── config/                   # Systeem-configuratiebestanden voor nieuwe projecten
│   ├── deploy.yml            # GitHub Actions workflow voor automatische deployment naar Pages
│   ├── index.html            # De basis HTML5 entry point
│   ├── project.gitignore     # Git-instellingen voor de gegenereerde site-repository
│   └── vite.config.js        # Vite build-instellingen (inclusief Tailwind v4 integratie)
├── docs/                     # Templates voor gegenereerde documentatie
│   └── client-manual.md      # Template voor de 'HANDLEIDING_BEHEER.md' van de klant
├── logic/                    # JavaScript hulp-scripts die gekopieerd worden naar src/
│   ├── fetch-data.js         # Runtime script voor het ophalen van JSON/TSV data
│   └── mapper.js             # Logica om ruwe data te koppelen aan UI-velden
└── mpa/                      # Specifieke React componenten voor Multi-Page Applications
    ├── App.jsx               # Hoofd-router configuratie voor 100+ pagina's
    ├── Header.jsx            # Dynamisch menu op basis van paginacategorieën
    ├── PageRenderer.jsx      # Lazy-loading motor voor individuele JSON pagina's
    ├── Section.jsx           # Sectie-renderer voor gestructureerde data
    └── Sitemap.jsx           # Zoekbaar archief voor alle subpagina's
```

## 2. Gedetailleerde Rolbeschrijving

### 📂 boilerplate/
Dit is de belangrijkste map. Athena hanteert een **Two-Track Strategy**:
- **autonomous**: Gebruik deze als de klant de website zelfstandig moet kunnen bewerken zonder externe infrastructuur. De componenten bevatten hier hun eigen bewerkings-logica.
- **docked**: Gebruik deze voor maximale snelheid en RAM-efficiëntie. De site is een pure "viewer" die instructies ontvangt van de Athena Dock.
- **static-wrapper**: Wordt gebruikt door de `deploy-prototype.js` engine om extern gegenereerde HTML (zoals van v0.dev of Bolt.new) snel om te zetten naar een Athena-compatibele site.

### 📂 config/
Deze map bevat de "loodgieterij". Elk project heeft een Vite-configuratie nodig om de JSX te compileren en Tailwind v4 te verwerken. De `deploy.yml` zorgt ervoor dat zodra een site naar GitHub wordt gepusht, deze binnen enkele minuten live staat op `*.github.io`.

### 📂 docs/
Athena genereert niet alleen code, maar ook documentatie. Het bestand `client-manual.md` wordt door de `factory.js` engine ingevuld met de specifieke tabelnamen uit de blueprint, zodat de eindgebruiker precies weet wat ze in hun database kunnen invullen.

### 📂 logic/
Bevat herbruikbare code die in de `src/` map van elke gegenereerde site terechtkomt. `fetch-data.js` is cruciaal voor de "JSON-First" workflow; het zorgt ervoor dat wijzigingen in de data-map direct zichtbaar zijn in de browser.

### 📂 mpa/ (Project Hydra)
Deze map bevat de gespecialiseerde componenten voor Multi-Page Applications. In plaats van alle data in één keer te laden (wat het geheugen van een Chromebook zou belasten), laden deze componenten alleen de data voor de huidige route. Dit maakt websites met honderden pagina's (zoals het FPC archief) mogelijk op lichte hardware.
