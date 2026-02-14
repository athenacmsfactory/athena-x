/**
 * Athena CMS - Unified Client Script v3.5
 * Bevat: Website Deployer & Media Manager
 *
 * INSTALLATIE:
 * 1. Kopieer deze code naar Code.gs in de Google Sheet Script Editor.
 * 2. Zorg dat er ook een UploaderUI.html bestand aanwezig is.
 */

// 1. Maak het menu aan
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Athena CMS')
      .addItem('Website Live Zetten', 'triggerDeploy')
      .addSeparator()
      .addItem('📸 Afbeeldingen Manager', 'openImageUploader')
      .addToUi();
}

// 2. FUNCTIE: Website Live Zetten (Deploy)
function triggerDeploy() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const systemSheet = ss.getSheetByName('_System');
  
  if (!systemSheet) {
    SpreadsheetApp.getUi().alert('❌ Fout: Het tabblad _System werd niet gevonden.');
    return;
  }

  const data = systemSheet.getDataRange().getValues();
  let config = {};
  data.forEach(row => { 
    if (row[0]) config[row[0]] = row[1]; 
  });

  // Jouw Master Proxy URL
  // Jouw Master Proxy URL
  const proxyUrl = "https://script.google.com/macros/s/AKfycbwwpJIY030kC8F1a8W-z9yZrIpXosL2B39PschIDcj39uuD-21TddhmCA-zP0gLPiBo/exec";

  const payload = {
    action: "deploy",
    user: config.github_user,
    repo: config.github_repo_name,
    secret_key: "KIES_HIER_EEN_EIGEN_WACHTWOORD" 
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true 
  };

  try {
    const response = UrlFetchApp.fetch(proxyUrl, options);
    const resultText = response.getContentText();
    
    if (response.getResponseCode() === 200 && resultText.includes("Build gestart")) {
      SpreadsheetApp.getUi().alert('🚀 Succes! De website wordt nu bijgewerkt (ca. 2 min).');
    } else {
      SpreadsheetApp.getUi().alert('⚠️ De server antwoordde: ' + resultText);
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert('❌ Er ging iets mis: ' + e.toString());
  }
}

// 3. FUNCTIE: Afbeeldingen Manager openen
function openImageUploader() {
  const html = HtmlService.createHtmlOutputFromFile('UploaderUI')
      .setWidth(500)
      .setHeight(450)
      .setTitle('Athena Media Manager');
  SpreadsheetApp.getUi().showModalDialog(html, '📸 Afbeeldingen Manager');
}

// 4. FUNCTIE: Het daadwerkelijke uploaden (wordt aangeroepen vanuit de UI)
function processUpload(filename, base64Data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const systemSheet = ss.getSheetByName('_System');
  const data = systemSheet.getDataRange().getValues();
  let config = {};
  data.forEach(row => { if (row[0]) config[row[0]] = row[1]; });

  // Jouw Master Proxy URL
  const proxyUrl = "https://script.google.com/macros/s/AKfycbwwpJIY030kC8F1a8W-z9yZrIpXosL2B39PschIDcj39uuD-21TddhmCA-zP0gLPiBo/exec";

  const payload = {
    action: "upload",
    user: config.github_user,
    repo: config.github_repo_name,
    secret_key: "KIES_HIER_EEN_EIGEN_WACHTWOORD",
    filename: filename,
    content: base64Data
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(proxyUrl, options);
  return response.getContentText();
}