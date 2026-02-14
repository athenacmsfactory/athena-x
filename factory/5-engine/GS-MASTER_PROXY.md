# GS-MASTER_PROXY.gs

Dit Google Apps Script fungeert als een centrale en veilige proxy-server. Het is ontworpen om als een web-app te worden ingezet en vormt de schakel tussen de client-side scripts in Google Sheets (zoals `GS-ClientDeployer.gs`) en de GitHub API. De primaire functie is het afhandelen van verzoeken voor het publiceren van websites en het uploaden van media, zonder dat gevoelige informatie zoals API-sleutels op de client hoeven te worden opgeslagen.

## Functionaliteit

Het script luistert naar inkomende `POST`-verzoeken via de `doPost(e)` functie en voert acties uit op basis van de meegestuurde data.

1.  **Authenticatie en Beveiliging**:
    *   **Geheime Sleutel**: Elk inkomend verzoek wordt gevalideerd aan de hand van een `secret_key`. Verzoeken met een ongeldige sleutel worden direct geweigerd.
    *   **GitHub PAT**: Het script haalt een GitHub Personal Access Token (PAT) op uit de `ScriptProperties`. Dit token wordt gebruikt om te authenticeren bij de GitHub API. Door het token op de server op te slaan, wordt het nooit blootgesteld aan de client (de Google Sheet).

2.  **Actie-afhandeling**: Het script onderscheidt twee hoofdacties, gespecificeerd in de `action` parameter van het verzoek:

    *   **`action: "deploy"`**:
        *   **Doel**: Het starten van een publicatieproces voor een website.
        *   **Werking**: Het script stuurt een `repository_dispatch` event naar de opgegeven GitHub-repository. Dit event triggert een vooraf gedefinieerde GitHub Actions workflow (bijvoorbeeld een workflow die de website bouwt en implementeert op een server).

    *   **`action: "upload"`**:
        *   **Doel**: Het uploaden van een afbeeldingsbestand naar de GitHub-repository.
        *   **Werking**: Het script gebruikt de GitHub Contents API om een bestand aan te maken of bij te werken.
            *   Het ontvangt een bestandsnaam en base64-geëncodeerde content.
            *   Het controleert of het bestand al bestaat. Als dat zo is, wordt het bijgewerkt; anders wordt er een nieuw bestand aangemaakt in de `public/images/` map van de repository.
            *   Het commit-bericht wordt automatisch gegenereerd.

## Installatie en Configuratie

### Installatie

1.  Maak een nieuw, op zichzelf staand Google Apps Script-project aan.
2.  Plak de code van `GS-MASTER_PROXY.gs` in het `Code.gs` bestand.
3.  Sla het project op.

### Configuratie

1.  **GitHub PAT instellen**:
    *   Ga naar `Projectinstellingen` (tandwiel-icoon) in de Apps Script-editor.
    *   Scroll naar beneden naar `Scriptattributen`.
    *   Klik op `Scriptattributen toevoegen`.
    *   Voeg een attribuut toe met de naam `GITHUB_PAT` en plak je GitHub Personal Access Token als waarde. Zorg ervoor dat dit token de juiste rechten heeft (`repo` scope).
2.  **Geheime Sleutel aanpassen**:
    *   Vervang `"KIES_HIER_EEN_EIGEN_WACHTWOORD"` in het script door een sterke, unieke geheime sleutel. Deze sleutel moet identiek zijn aan de sleutel die in de client-scripts (zoals `GS-ClientDeployer.gs`) wordt gebruikt.

### Deployment

1.  Klik op `Implementeren` > `Nieuwe implementatie`.
2.  Kies als type `Web-app`.
3.  Configureer de web-app:
    *   **Beschrijving**: Geef een herkenbare naam (bijv. "Athena Master Proxy").
    *   **Uitvoeren als**: `Ikzelf`.
    *   **Wie heeft toegang**: `Iedereen`. **Belangrijk**: Het script is beveiligd met de `secret_key`, dus alleen geautoriseerde verzoeken worden verwerkt.
4.  Klik op `Implementeren`.
5.  Kopieer de resulterende **Web-app-URL**. Dit is de URL die moet worden ingevuld in de client-scripts.
