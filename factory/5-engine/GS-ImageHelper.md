# GS-ImageHelper.gs

Dit Google Apps Script is een gespecialiseerde tool binnen het Athena CMS, ontworpen om de functionaliteit voor het uploaden van afbeeldingen te beheren vanuit een Google Sheet. Het script creëert een interface waarmee gebruikers eenvoudig afbeeldingen kunnen toevoegen aan hun website-repository.

## Functionaliteit

Het script omvat de volgende kernfuncties:

1.  **Menu Creatie (`onOpen`)**: Net als andere client-scripts binnen Athena, voegt deze functie bij het openen van de Google Sheet een `🚀 Athena CMS` menu toe. Dit menu bevat de optie `📸 Afbeeldingen Manager` om de upload-interface te starten.

2.  **Afbeeldingen Manager (`openImageUploader`)**: Deze functie opent een modaal venster in Google Sheets. De interface van dit venster wordt geladen vanuit een apart `UploaderUI.html` bestand en biedt een gebruiksvriendelijke "dropzone" voor het uploaden van bestanden.

3.  **Upload Verwerking (`processUpload`)**: Deze functie wordt aangeroepen door de client-side JavaScript in de `UploaderUI`. Het neemt de bestandsnaam en de base64-geëncodeerde afbeeldingsdata, leest de nodige configuratie (zoals GitHub repository details) uit het `_System` tabblad, en stuurt deze informatie door naar een centrale proxy-server. De proxy-server handelt vervolgens de daadwerkelijke opslag van de afbeelding in de GitHub repository af.

## Installatie en Gebruik

### Installatie

1.  Open de Google Sheet die als backend voor de website fungeert.
2.  Navigeer naar `Extensies` > `Apps Script`.
3.  Vervang de inhoud van `Code.gs` met de code uit `GS-ImageHelper.gs`.
4.  Maak een nieuw HTML-bestand aan via `Bestand` > `Nieuw` > `HTML-bestand` en geef het de naam `UploaderUI.html`. Vul dit bestand met de bijbehorende HTML en JavaScript voor de upload-interface.
5.  Sla het Apps Script-project op.

### Configuratie

1.  Zorg voor een tabblad genaamd `_System` in de Google Sheet.
2.  Definieer de volgende parameters in dit tabblad (kolom A voor de naam, kolom B voor de waarde):
    *   `github_user`: De gebruikersnaam van het GitHub-account.
    *   `github_repo_name`: De naam van de GitHub-repository waarin de afbeeldingen moeten worden opgeslagen.
    *   Let op: het script bevat een hardcoded `secret_key` die eventueel aangepast kan worden voor extra beveiliging.

### Gebruik

1.  Ververs de Google Sheet nadat het script is geïnstalleerd.
2.  Klik op het menu `🚀 Athena CMS` in de menubalk.
3.  Selecteer `📸 Afbeeldingen Manager`.
4.  Het upload-venster verschijnt. Sleep een afbeelding naar het venster of klik om een bestand te selecteren.
5.  Het script zal de afbeelding uploaden en een bevestiging of foutmelding tonen.
