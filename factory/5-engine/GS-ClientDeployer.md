# GS-ClientDeployer.gs

Dit Google Apps Script is ontworpen om te worden geïntegreerd met een Google Sheet en biedt een interface voor het beheren van een Athena CMS-website. Het voegt een aangepast menu toe aan de Google Sheet, waarmee gebruikers de website kunnen publiceren (deployen) en afbeeldingen kunnen beheren.

## Functionaliteit

Het script biedt de volgende hoofdfuncties:

1.  **Menu Creatie (`onOpen`)**: Bij het openen van de Google Sheet wordt automatisch een menu genaamd `🚀 Athena CMS` aangemaakt. Dit menu bevat twee opties:
    *   `Website Live Zetten`: Start het publicatieproces van de website.
    *   `📸 Afbeeldingen Manager`: Opent een dialoogvenster voor het uploaden van afbeeldingen.

2.  **Website Deploy (`triggerDeploy`)**: Deze functie wordt geactiveerd via de menuoptie 'Website Live Zetten'. Het leest de configuratie-instellingen (zoals de GitHub-gebruikersnaam en repositorynaam) uit een tabblad genaamd `_System`, stelt een verzoek samen en stuurt dit naar een centrale proxy-server om de website te bouwen en te publiceren.

3.  **Afbeeldingen Manager (`openImageUploader` en `processUpload`)**:
    *   `openImageUploader`: Opent een modaal venster met een gebruikersinterface (gedefinieerd in `UploaderUI.html`) waarmee gebruikers afbeeldingen kunnen selecteren en uploaden.
    *   `processUpload`: Deze functie wordt aangeroepen vanuit de upload-interface en verwerkt de daadwerkelijke upload. Het verstuurt de afbeeldingsgegevens (bestandsnaam en base64-geëncodeerde data) naar dezelfde proxy-server, die de afbeelding vervolgens opslaat in de juiste repository.

## Installatie en Gebruik

### Installatie

1.  Open de Google Sheet die je wilt gebruiken als backend voor de website.
2.  Ga naar `Extensies` > `Apps Script`.
3.  Kopieer de volledige inhoud van `GS-ClientDeployer.gs` en plak deze in het `Code.gs` bestand in de Apps Script editor.
4.  Maak een nieuw HTML-bestand aan in de editor (`Bestand` > `Nieuw` > `HTML-bestand`) en noem dit `UploaderUI.html`. Plak hier de inhoud van het bijbehorende `UploaderUI.html` bestand.
5.  Sla het project op.

### Configuratie

1.  Zorg ervoor dat er een tabblad (sheet) in je Google Sheet is met de exacte naam `_System`.
2.  In dit tabblad moeten de volgende configuratieparameters worden ingesteld in kolom A en hun waarden in kolom B:
    *   `github_user`: De gebruikersnaam van het GitHub-account.
    *   `github_repo_name`: De naam van de GitHub-repository waar de website zich bevindt.

### Gebruik

Nadat het script is geïnstalleerd en geconfigureerd, vernieuw je de Google Sheet. Het `🚀 Athena CMS` menu verschijnt nu in de menubalk.

*   **Website publiceren**: Klik op `🚀 Athena CMS` > `Website Live Zetten`. Het script zal de publicatieprocedure starten en een melding tonen over de voortgang.
*   **Afbeeldingen uploaden**: Klik op `🚀 Athena CMS` > `📸 Afbeeldingen Manager`. Het uploadvenster verschijnt, waarin je een afbeelding kunt kiezen en uploaden.
