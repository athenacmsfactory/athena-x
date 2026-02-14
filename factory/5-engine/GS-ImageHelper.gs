/**
 * Athena CMS - Image Helper v2.0 (Premium Dropzone)
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Athena CMS')
      .addItem('Website Live Zetten', 'triggerDeploy')
      .addSeparator()
      .addItem('📸 Afbeeldingen Manager', 'openImageUploader')
      .addToUi();
}

function openImageUploader() {
  const html = HtmlService.createHtmlOutputFromFile('UploaderUI')
      .setWidth(500)
      .setHeight(450)
      .setTitle('Athena Media Manager');
  SpreadsheetApp.getUi().showModalDialog(html, '📸 Afbeeldingen Manager');
}

/**
 * Functie die vanuit de browser (JS) wordt aangeroepen
 */
function processUpload(filename, base64Data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const systemSheet = ss.getSheetByName('_System');
  const data = systemSheet.getDataRange().getValues();
  let config = {};
  data.forEach(row => { if (row[0]) config[row[0]] = row[1]; });

  const proxyUrl = "https://script.google.com/macros/s/AKfycbwwpJIY030kC8F1a8W-z9yZrIpXosL2B39PschIDcj39uuD-21TddhmCA-zP0gLPiBo/exec";

  const payload = {
    action: "upload",
    user: config.github_user,
    repo: config.github_repo_name,
    secret_key: "KIES_HIER_EEN_EIGEN_WACHTWOORD",
    filename: filename,
    content: base64Data // Alleen de base64 string, zonder data:image/... prefix
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(proxyUrl, options);
  return response.getContentText();
}