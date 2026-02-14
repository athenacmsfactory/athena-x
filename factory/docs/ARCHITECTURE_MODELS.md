# ATHENA PRODUCTION MODELS: SPA VS MPA

Athena supports two fundamentally different architectural models to meet the diverse needs of the SME market.

## 1. SINGLE-PAGE ARCHITECTURE (SPA)
**Ideal for:** Local merchants, portfolios, event sites, and simple landing pages.

*   **Navigation:** Uses anchor links (`#services`, `#contact`) with smooth scrolling.
*   **Structure:** One central `App.jsx` that renders all sections sequentially.
*   **Data:** Fetches all data at once during page load.
*   **Advantage:** Maximum speed and simplicity.

## 2. MULTI-PAGE ARCHITECTURE (MPA)
**Ideal for:** Institutions (hospitals, schools), larger companies with multiple locations, or complex services.

*   **Navigation:** Uses `react-router-dom` for real URL paths (`/services/cardiology`, `/about-us`).
*   **Structure:** A routing map that renders unique page components based on the URL.
*   **Data:** Can load page-specific data, increasing scalability.
*   **Advantage:** Better SEO segmentation and logical structure for large amounts of information.

## CONFIGURATION
The model is selected during creation in the **Site Wizard**.
- **SPA** is the default setting.
- **MPA** automatically installs `react-router-dom` and uses the MPA boilerplate templates.
