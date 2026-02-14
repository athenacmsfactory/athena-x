# GS-LinkGenerator.gs

Dit Google Apps Script is een hulpprogramma dat is ontworpen om het proces van het genereren van configuratie-instellingen voor het Athena CMS te automatiseren. Specifiek genereert het een JSON-object dat de exportlinks bevat voor elk tabblad (sheet) in een Google Sheet. Deze links zijn in TSV-formaat (Tab-Separated Values) en worden gebruikt door andere onderdelen van het Athena-systeem om gegevens uit de spreadsheet te importeren.

## Functionaliteit

De kern van het script wordt gevormd door de functie `generateSiteSourcesConfig()`:

1.  **Iteratie over Tabbladen**: Het script doorloopt alle tabbladen in de actieve Google Sheet.
2.  **Systeembladen Overslaan**: Tabbladen waarvan de naam begint met een underscore (`_`) worden genegeerd. Dit is een conventie om configuratie- of systeemspecifieke tabbladen uit te sluiten van de data-export.
3.  **URL-generatie**: Voor elk geldig tabblad wordt een unieke export-URL geconstrueerd. Deze URL is gebaseerd op de unieke ID van de spreadsheet en de specifieke ID van het tabblad (`gid`). De URL wordt geformatteerd om de data direct als TSV-bestand te downloaden.
4.  **JSON-output**: Het script formatteert de verzamelde data als een JSON-object, waarbij de naam van elk tabblad de sleutel is en de gegenereerde TSV-exportlink de waarde.
5.  **Logging**: De resulterende JSON-output wordt naar het Apps Script-uitvoeringslogboek geschreven, zodat de gebruiker deze eenvoudig kan kopiëren. Daarnaast wordt er een pop-upmelding getoond om de gebruiker te informeren waar de output te vinden is.

## Installatie en Gebruik

### Installatie

1.  Open de betreffende Google Sheet.
2.  Ga naar `Extensies` > `Apps Script`.
3.  Maak een nieuw scriptbestand aan of voeg de code uit `GS-LinkGenerator.gs` toe aan een bestaand bestand (bijvoorbeeld `Code.gs`).
4.  Sla het project op door op het diskette-icoon te klikken.

### Vereisten

*   **Publicatie**: De Google Sheet moet op het web gepubliceerd zijn. Dit kan via `Bestand` > `Delen` > `Publiceren op internet`. Zorg ervoor dat "Gehele document" is geselecteerd en klik op "Publiceren". Dit is noodzakelijk om de exportlinks te laten werken.

### Gebruik

1.  Selecteer in de Apps Script-editor de functie `generateSiteSourcesConfig` in de werkbalk (naast de "Debug" knop).
2.  Klik op de "Uitvoeren" knop.
3.  Het script wordt uitgevoerd. Open het "Uitvoeringslogboek" onderaan het scherm (of druk op `Ctrl+Enter`) om de output te zien.
4.  Kopieer de volledige JSON-output uit het logboek. Deze kan vervolgens worden geplakt in het `project-settings/url-sheet.json` bestand van het Athena-project.
