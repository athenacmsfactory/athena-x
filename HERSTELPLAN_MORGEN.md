# 🔱 Athena CMS: GitHub Auth Herstelplan (v1.0)
**Datum:** 14 maart 2026
**Status:** Kritiek - Blokade in automatische publisher workflow

## 🚨 Het Probleem
De monorepo `athenacmsfactory/athena` kan geen code pushen naar de individuele repositories onder de organisatie `athena-cms-factory`. De GitHub Action geeft consistent een `403 Forbidden` fout, ondanks het gebruik van Fine-grained PAT's met volledige rechten. Dit wijst op een beleidsbeperking op organisatie-niveau bij GitHub die HTTPS-pushes via tokens blokkeert voor dit specifieke account-construct.

## 🛠️ Voorgestelde Oplossingen (Vanaf morgen uit te voeren)

### Optie A: Overstap naar SSH Deploy Keys (Meest Robuust)
In plaats van kwetsbare HTTPS-tokens gebruiken we SSH-sleutels per repository.
1.  Genereer een dedicated SSH key-pair voor de monorepo publisher.
2.  Voeg de publieke sleutel toe aan de individuele site-repositories als **Deploy Key** met schrijfpermissies.
3.  Voeg de private sleutel toe aan de monorepo als Action Secret.
4.  **Voordeel:** Omzeilt alle HTTPS/PAT restricties van de organisatie volledig.

### Optie B: Gebruik van een GitHub App (De "Enterprise" Weg)
Dit is de door GitHub aanbevolen methode voor automatisering binnen organisaties.
1.  Maak een GitHub App aan genaamd "Athena Factory Publisher".
2.  Installeer deze app op de organisatie `athena-cms-factory`.
3.  Gebruik de App-ID en Private Key in de monorepo Action om een tijdelijke installatie-token te genereren.
4.  **Voordeel:** Geen persoonlijke tokens meer nodig; de organisatie geeft expliciet toestemming aan de "App".

### Optie C: Het "Nieuwe Start" Plan (Nuclear Option)
Indien GitHub het huidige account/organisatie construct blijft blokkeren:
1.  Maak één nieuw account aan (bijv. `athena-ops-2026`).
2.  Plaats alle repositories onder dit account (geen organisatie-laag meer).
3.  **Voordeel:** Elimineert alle cross-ownership problemen. 
4.  **Nadeel:** Veel werk om alle remotes en URL's aan te passen.

## 📋 Actiepunten voor morgen (Sessie Start)
1.  **Stap 1:** Controleer in de GitHub interface van de organisatie `athena-cms-factory` onder **Settings > Actions > General** of "Allow all actions and reusable workflows" aanstaat.
2.  **Stap 2:** Controleer onder **Settings > Third-party access > Policy** of externe toegang niet geblokkeerd is.
3.  **Stap 3:** Indien bovenstaande goed staat maar het blijft falen: **Implementeer Optie A (SSH)** voor één test-site (`test-portfolio`).
4.  **Stap 4:** Bij succes: SSH-methode uitrollen naar alle sites in de monorepo publisher.

## 📝 Notities voor de nieuwe chat-sessie
*   De fix voor het witte scherm van `test-portfolio` is live en werkend.
*   De `deploy.yml` is toegevoegd aan de site-repo.
*   De monorepo `athena` is schoon en vrij van debug-code.
*   Lokaal zijn alle paden in `.gemini/settings.json` gecorrigeerd.

---
*Gegenereerd door Athena Factory Engine - 2026*
