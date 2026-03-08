# 📋 TODO - Athena CMS (Master Plan)

## 🎯 Upcoming Sprint (Next Week): Validation & Launch
- [ ] **System-Wide Quality Audit**: Perform architectural scan and identify technical debt.
- [ ] **Onboarding Validation**: Execute first live "Digital Strategist" onboarding session via CLI/Dashboard.
- [ ] **Operation War Game**: Execute first end-to-end autonomous agent test via Gmail.
- [ ] **Athena Hub Launch**: Final content polish and live Stripe payment test.
- [ ] **Autonomous Reliability**: Configure cronjobs for nightly monitor and storage pruning.

## 🏢 Operations & Governance
- [ ] **Client Onboarding Protocol**: Implement the "Discovery Agent" and automated client technical provisioning.
- [ ] **Infrastructure Migration**: Plan and execute the full transition of GCP and AI services from `karel.test.special@gmail.com` to `athena.cms.factory@gmail.com` once commercial viability is established.
- [ ] **Corporate Entity Setup**: Legal and financial preparation for the Factory as a standalone entity.

## 🤖 AI Tasks (Jules 2.0)
- [ ] **Systemic Audit:** Map all redundant components across the factory and site repositories.
- [ ] **Modular Engine Refactor:** Redesign `factory.js` into a more modular, plugin-based architecture.
- [ ] **Shared Component Migration:** Transition sites to use a unified shared component library in `factory/2-templates/shared/`.
- [ ] **Advanced Generator:** Explore AST-based or template-based code injection for safer project generation.

## 🛠️ Engine Improvements
- [x] **Migratie: paginastructuur -> navbar (de-schaar-site)**
  - [x] Hernoem `src/data/paginastructuur.json` naar `navbar.json`
  - [x] Update `project-settings/url-sheet.json` (Key & GID mapping)
  - [x] Update `App.jsx` (`navData={data['navbar']}`)
  - [x] Update `Header.jsx` (`cmsBind={{ file: 'navbar', ... }}`)
  - [x] Update `Section.jsx` (Config mapping)
  - [x] Update `src/data/section_settings.json` (ID en titels)
  - [x] Update `src/data/section_order.json`
  - [x] Update `src/data/schema.json`
  - [x] Hernoem tabblad in Google Sheet via API naar 'navbar'
- [x] **Data Gateway**: Replaced legacy 'Sync' with a unified Data Gateway (Cloud Pull/Push + Pull from local input folder).
- [x] **Terminology Unification**: Standardized "Data Bron" (Data Source) for all input folders across the system and documentation.
- [ ] Streamline `scavengeAssets` for faster and more reliable asset mapping.
- [ ] Implement a unified data aggregator for complex sites and MPA structures.
- [ ] Optimize the internal build and dev-server orchestration.
- [x] **Sitetype from Site**: Added functionality to create a new sitetype based on an existing site's structure and components (implemented via `premium-webshop-filter`).

## 🎨 UI/UX (Dock)
- [x] Implement a robust Undo/Redo history engine.
- [x] **Hero & Dock Interaction & Transparency Slider (v8.3)** (Completed)
- [x] **Individual Text Styling (v8.3)** (Completed)
- [x] **Footer Editability (v8.3)** (Completed)
- [ ] Develop a "Visual Component Library" for real-time section management.

## 🏗️ Infrastructure & Scalability
- [ ] **Site Portfolio Audit**: Systematisch overlopen van alle 35+ sites via de Site Reviewer (voortgang bijhouden).
- [ ] Streamline `scavengeAssets` for faster and more reliable asset mapping.
