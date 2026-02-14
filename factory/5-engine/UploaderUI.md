# Media Uploader UI (`UploaderUI.html`)

`UploaderUI.html` is een HTML-bestand dat een client-side user interface (UI) biedt voor het uploaden van mediabestanden, specifiek afbeeldingen.

## Doel

Deze UI is ontworpen om te worden gebruikt binnen een Google Apps Script (GAS) omgeving, bijvoorbeeld als een zijbalk of modaal venster in Google Sheets of Google Docs. Het biedt een eenvoudige en gebruiksvriendelijke "drag-and-drop" zone om bestanden te uploaden.

### Functionaliteit

-   **Drag-and-Drop**: Gebruikers kunnen een afbeeldingsbestand naar de dropzone slepen om het uploadproces te starten.
-   **Klik-om-te-selecteren**: Gebruikers kunnen ook op de zone klikken om een standaard bestandsselectiedialoog te openen.
-   **Bestandsvalidatie**: Het script controleert of het geselecteerde bestand een afbeelding is (`image/*`).
-   **Communicatie met GAS**: Na het selecteren van een bestand, leest de UI het bestand als een Base64-gecodeerde string en stuurt deze data naar een server-side Google Apps Script functie genaamd `processUpload`.
-   **Statusfeedback**: De interface toont de status van het uploadproces, inclusief succes- en foutmeldingen.

## Integratie

Om deze UI te gebruiken, wordt het doorgaans aangeroepen vanuit een Google Apps Script-functie met behulp van de `HtmlService`.

### Voorbeeld Google Apps Script (`Code.gs`)

```javascript
function showUploader() {
  var html = HtmlService.createHtmlOutputFromFile('UploaderUI')
      .setWidth(300)
      .setHeight(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

function processUpload(fileName, base64Content) {
  try {
    // Verwerk hier de upload, bijvoorbeeld door het bestand op te slaan in Google Drive
    var MimeType = "image/png";
    if (fileName.includes("jpeg") || fileName.includes("jpg")) MimeType = "image/jpeg"
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Content), MimeType, fileName);
    var folder = DriveApp.getFolderById("YOUR_FOLDER_ID");
    var file = folder.createFile(blob);

    return { success: true, fileUrl: file.getUrl() };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
```
