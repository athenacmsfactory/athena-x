# 🛠️ Athena Monorepo: Onderhoud & Git Strategie

Omdat de Athena Factory een **Monorepo** is, moet de hoofdmap de enige plek zijn met een `.git` administratie.

## 🚀 Geautomatiseerde Workflow

De site-generatie engine (`factory.js`) is nu intelligent genoeg om te detecteren of hij binnen een bestaande Git repository (zoals deze Monorepo) draait.

### Hoe het werkt:
1.  **Detectie:** Tijdens de `finalize` stap controleert de engine of de bovenliggende map deel uitmaakt van een Git work-tree.
2.  **Actie:** Als een Monorepo wordt gedetecteerd, slaat de engine de `git init` stap voor de nieuwe site over.
3.  **Resultaat:** De nieuwe site wordt direct als een normale map gezien door de Monorepo, zonder dat er handmatige "flattening" (zoals `rm -rf .git`) nodig is.

## 📦 Publicatie naar Klant-Repositories

Sinds de implementatie van de geautomatiseerde workflow, pushen GitHub Actions de inhoud van de `sites/` mappen automatisch naar hun respectievelijke standalone repositories op de `athena-cms-factory` GitHub organisatie. Deze aanpak vervangt submodules voor het beheer van klant-repositories. Zie `MONOREPO_TO_CLIENTREPOS_PLAN.md` voor meer details.

## 🧠 Geheugenbeheer (RAM)
- Voer zware builds (`pnpm build`) altijd uit met `NODE_OPTIONS="--max-old-space-size=512"`.
- Gebruik achtergrondprocessen (`&`) en logs om de interactieve sessie niet te belasten.

---
*Gemaakt op 1 februari 2026 door Gemini-CLI.*