---
name: sync-athena-repos
description: Veilig synchroniseren van code tussen de Athena Sandbox (athena-x) en Productie (athena) repositories met automatische backup en URL-correctie. Gebruik deze skill wanneer de nieuwste verbeteringen van de sandbox naar productie moeten worden overgebracht zonder node_modules of .git mappen te kopiëren.
---

# Sync Athena Repos Skill

Deze skill verzorgt de veilige overdracht van code tussen de Athena monorepo's.

## Workflow

### 1. Voorbereiding (Sandbox)
- Zorg dat de feature branch is gemerged naar `main` in `athena-x`.
- Push de laatste wijzigingen naar `origin/main`.

### 2. Veiligheidsbackup (Productie)
- Maak een nieuwe backup branch aan in de `athena` repository.
- Formaat: `backup/sync-v[versie]-[timestamp]` (bijv. `backup/sync-v8.1-20260313-2200`).
- Push deze branch naar de remote.

### 3. Synchronisatie (De Oversteek)
- Gebruik `cp -r` met specifieke filters of een loop om bestanden te kopiëren.
- **STRIKT VERBODEN** te kopiëren:
  - `node_modules/`
  - `.git/`
  - `.pnpm-store/`
  - `.env` (tenzij expliciet gewenst)

### 4. Post-Sync Correcties (Productie)
Na het kopiëren moeten de volgende waarden in de `athena` repository worden hersteld naar productie-waarden:

- **README URLs**:
  - Vervang `ath-x.github.io` door `athena-cms-factory.github.io` in alle `README.md` bestanden.
- **Hub Showcase Data**:
  - Vervang `ath-x.github.io` door `athena-cms-factory.github.io` in `sites/athena-hub/src/data/*.json`.
- **Publisher Config**:
  - In `.github/workflows/athena-publisher.yml`:
    - `DEFAULT_OWNER` moet `"athena-cms-factory"` zijn.
    - Zorg dat de SSH/Token configuratie overeenkomt met de productie-omgeving.

## Commando Voorbeeld

```bash
# Kopieer alles behalve node_modules en .git
cp -rv ./* ../athena/ --exclude 'node_modules' --exclude '.git'
```
*Let op: `cp` ondersteunt geen `--exclude` op alle systemen. Gebruik indien nodig een `find` constructie.*

## Verificatie
- Controleer `git status` in de productie repo.
- Voer een `npm run build` uit op een kritieke site (bijv. `athena-hub`) om integriteit te testen.
- Push naar `main` van de productie repo om de publisher te triggeren.
