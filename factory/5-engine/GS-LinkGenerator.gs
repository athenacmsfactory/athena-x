/**
 * @file GS-LinkGenerator.gs
 * @description Hulpmiddel om snel alle TSV-links voor url-sheet.json te genereren.
 * 
 * INSTRUCTIES:
 * 1. Open uw Google Sheet.
 * 2. Ga naar Extensies > Apps Script.
 * 3. Plak deze code in een nieuw bestand (of onderaan Code.gs).
 * 4. Zorg dat uw Sheet gepubliceerd is: Bestand > Delen > Publiceren op internet > "Gehele document".
 * 5. Klik op 'Opslaan' (diskette icoon).
 * 6. Selecteer de functie 'generateSiteSourcesConfig' in de werkbalk en klik op 'Uitvoeren'.
 * 7. Bekijk de logs (Uitvoeringslogboek) en kopieer de JSON.
 */

function generateSiteSourcesConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var spreadsheetId = ss.getId();
  var config = {};

  console.log('--- KOPIEER DE ONDERSTAANDE JSON NAAR project-settings/url-sheet.json ---');
  console.log('{');
  
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var name = sheet.getName();
    // Sla systeem-bladen over die beginnen met _
    if (name.startsWith('_')) continue;
    
    var gid = sheet.getSheetId();
    // Standaard export URL voor gepubliceerde sheets
    var url = "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/export?format=tsv&gid=" + gid;
    
    // Voeg komma toe tenzij het de laatste is (simpele logica voor leesbaarheid)
    var suffix = (i < sheets.length - 1) ? ',' : '';
    console.log('  "' + name + '": "' + url + '"' + suffix);
  }
  
  console.log('}');
  console.log('---------------------------------------------------------------------------');
  
  // Toon ook een popup voor de zekerheid
  SpreadsheetApp.getUi().alert('De JSON code is gegenereerd in het "Uitvoeringslogboek" onderaan. Kunt u dit niet zien? Druk op CTRL+ENTER.');
}
