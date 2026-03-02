---
name: standard-sop
description: De standaard werkwijze (SOP) voor Athena CMS Factory. Gebruik dit bij de start van ELKE taak om te garanderen dat we op een nieuwe branch werken en de integriteit bewaken.
---

# Standard SOP (Standard Operating Procedure)

Deze skill dwingt de absolute basisregels af voor ontwikkeling binnen het Athena ecosysteem.

## 1. Altijd een Nieuwe Branch
Voordat er ÉÉN letter code wordt gewijzigd, moet er een nieuwe branch worden aangemaakt.

1.  **Status Check**: Voer `git status` uit.
2.  **Base Branch**: Zorg dat je op `main` staat.
3.  **Naamgeving**: Gebruik `type/beschrijving` (bv. `fix/image-resolution`, `feat/new-section`).
4.  **Create**: Voer `git checkout -b <naam>` uit.

## 2. Documentatie Bijwerken
Elke wijziging moet worden gereflecteerd in:
- `factory/TASKS/_CHANGELOG.md`
- `factory/TASKS/_DONE.md` (indien voltooid)

## 3. Veiligheid
- Nooit secrets of `.env` bestanden committen.
- Altijd `pnpm` gebruiken voor Node.js operaties.
