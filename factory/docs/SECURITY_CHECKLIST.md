# SECURITY CHECKLIST FOR ENTREPRENEURS

Although the Athena Factory is technically inherently secure, the human factor remains crucial. Use this checklist to optimally secure your Google Sheets CMS.

## 1. ACCESS TO THE GOOGLE SHEET

*   [ ] **No Public Sharing:** Ensure the Sheet is **NEVER** set to "Anyone with the link can edit."
*   [ ] **Specific Permissions:** Share the Sheet only with necessary individuals via their email addresses.
*   [ ] **Service Account:** Preferably use the Athena Service Account method for data sync, so the Sheet can remain completely private.
*   [ ] **Regular Cleanup:** Every 3 months, check who has access to your Sheets and remove former employees or partners.

## 2. GOOGLE ACCOUNT SECURITY (THE BACKEND)

Since your Google Sheet is your CMS, your Google account is the key to your website.

*   [ ] **Multi-Factor Authentication (MFA):** Enable 2-step verification on all Google accounts that have access to the Sheet.
*   [ ] **Strong Passwords:** Use a unique and complex password for your Google management account.
*   [ ] **App Passwords:** Where possible, use Google's "App Passwords" for specific integrations.

## 3. DATA & PRIVACY (GDPR)

*   [ ] **No Sensitive Personal Data:** Use the Sheet for product info, prices, and public content. Do **not** store medical records, passwords, or credit card information in the cells.
*   [ ] **Privacy Policy:** State in your privacy policy that website content is managed via Google Cloud infrastructure.
*   [ ] **Condolence Register:** If applicable (Memorial Hub), inform users that their messages will appear on the public website.

## 4. INCIDENT MANAGEMENT

*   [ ] **Version History:** Familiarize yourself with "Version History" in Google Sheets. If data is accidentally deleted or incorrectly modified, you can restore a backup in seconds.
*   [ ] **Offline Backup:** Periodically download an export (XLSX or CSV) of your most important data and store it in a secure location (e.g., your 128GB SD card).

## 5. REPOSITORY SECURITY

*   [ ] **GitHub Secrets:** Use GitHub Secrets for API keys and sensitive tokens. Never hardcode these in the source code or in the Sheet.
*   [ ] **SSH Keys:** Use SSH keys for interaction with GitHub instead of passwords.

---
*By following these steps, you make optimal use of Athena's secure architecture and minimize operational risks.*