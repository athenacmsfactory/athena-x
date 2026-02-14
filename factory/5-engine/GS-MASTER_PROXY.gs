/**
 * MASTER PROXY SCRIPT v2.0
 * Handelt zowel Deploys als Image Uploads af.
 */
function doPost(e) {
  const GITHUB_PAT = PropertiesService.getScriptProperties().getProperty('GITHUB_PAT');
  const params = JSON.parse(e.postData.contents);
  const { user, repo, secret_key, action } = params;

  // Beveiliging
  if (secret_key !== "KIES_HIER_EEN_EIGEN_WACHTWOORD") {
    return ContentService.createTextOutput("Verboden: Ongeldige sleutel").setMimeType(ContentService.MimeType.TEXT);
  }

  // ACTIE: DEPLOY (Trigger GitHub Action)
  if (action === "deploy") {
    const url = `https://api.github.com/repos/${user}/${repo}/dispatches`;
    const options = {
      method: "post",
      headers: {
        "Authorization": "Bearer " + GITHUB_PAT,
        "Accept": "application/vnd.github.v3+json"
      },
      payload: JSON.stringify({ event_type: "publish_button" })
    };
    UrlFetchApp.fetch(url, options);
    return ContentService.createTextOutput("Build gestart").setMimeType(ContentService.MimeType.TEXT);
  }

  // ACTIE: UPLOAD (Nieuwe afbeelding naar public/images)
  if (action === "upload") {
    const { filename, content } = params; // content is base64 string
    const url = `https://api.github.com/repos/${user}/${repo}/contents/public/images/${filename}`;
    
    // Check of bestand al bestaat (om de SHA te krijgen voor een update)
    let sha = null;
    try {
      const checkRes = UrlFetchApp.fetch(url, {
        headers: { "Authorization": "Bearer " + GITHUB_PAT }
      });
      sha = JSON.parse(checkRes.getContentText()).sha;
    } catch(err) { /* Bestand bestaat nog niet, prima */ }

    const payload = {
      message: `Upload ${filename} via Athena CMS`,
      content: content,
      branch: "main"
    };
    if (sha) payload.sha = sha;

    const options = {
      method: "put",
      headers: {
        "Authorization": "Bearer " + GITHUB_PAT,
        "Accept": "application/vnd.github.v3+json"
      },
      payload: JSON.stringify(payload)
    };

    try {
      UrlFetchApp.fetch(url, options);
      return ContentService.createTextOutput("Upload succesvol").setMimeType(ContentService.MimeType.TEXT);
    } catch(err) {
      return ContentService.createTextOutput("Fout bij upload: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
    }
  }

  return ContentService.createTextOutput("Onbekende actie").setMimeType(ContentService.MimeType.TEXT);
}