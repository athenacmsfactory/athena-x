# Developer Manual - Athena CMS Factory (v7.6.1)

## Two-Track Strategy (Docked vs Autonomous)
Since v6.2, Athena has maintained a strict separation in the architecture of sitetypes and templates. This ensures maximum flexibility when choosing between centralized management or complete independence.

### 1. Docked Track (`3-sitetypes/docked/`)
The 'Docked' track is designed for sites managed via the **Athena Dock**.
- **Characteristics:** Extremely lightweight code. Contains no internal editor interface.
- **Data flow:** Edits move from Dock -> Site Plugin -> Local JSON.

### 2. Autonomous Track (`3-sitetypes/autonomous/`)
The 'Autonomous' track is designed for sites that must operate completely independently.
- **Characteristics:** Includes built-in editor tools directly within the site code.
- **Data flow:** Local Editor -> Local JSON.

---

## 🏆 The "Golden Standard" (v7.4+)
Since v7.4, Athena has employed a standardized approach to site identity and contact information to prevent inconsistencies in headers and footers.

### 1. `site_settings.json` (Array format)
Every site MUST contain a `site_settings.json` file as an **array with one object**.
- **Required fields:** `site_name`, `tagline`, `logo_text`, `site_logo_image`.
- **Why an array?** The Athena Editor indexes based on `index: 0`.

### 2. `contact.json` (Array format)
Instead of hiding contact details in a hero or intro section, we use a dedicated `contact.json`.
- **Fixed keys:** `title`, `email`, `phone`, `location`, `vat_number`, `linkedin_url`.
- **Benefit:** The boilerplate `Footer.jsx` automatically recognizes these keys and builds a professional section.

---

## 🖼️ Media Binding Best Practices (v7.4.3)
To prevent the Athena Editor from mistaking a media slot for a text field ("Edit Text" modal), the following rules apply:

1.  **Bind-on-Target**: ALWAYS place `data-dock-bind` and `data-dock-type="media"` directly on the `<img>` or `<video>` tag. Use the `EditableMedia` component, which handles this internally.
2.  **Hard IMG Rendering**: The editor must see an active `img` tag to activate the dropzone.
3.  **The `fallback` Prop**: Use the `fallback` prop in `EditableMedia` for empty slots. The component will generate a graphical SVG placeholder (letter or icon), acting as a valid drop target without polluting the database.
4.  **Semantic Naming**: Use suffixes like `_image` or `_logo` for keys in your blueprint (e.g., `site_logo_image`).

---

## 🔍 Smart Asset Discovery & Data Handover
To ensure generated sites are not missing images or data, the engine (`factory.js`) includes two automatic safety mechanisms:

### 1. Guaranteed Data Handover
During site creation, the `input/[project]/json-data/` directory is copied directly to the new site's `src/data/` with high priority. This occurs via a hard `fs.cpSync` before any synchronization with external scripts or Google Sheets.

### 2. Automatic Asset Scavenging
After data handover, the engine runs a `scavengeAssets` routine:
- **Scan**: All JSON files in `src/data/` are scanned for strings ending in media extensions (`.jpg`, `.png`, `.mp4`, etc.).
- **Search**: The engine recursively searches for these files in:
    1. `input/[project]/images/`
    2. `input/[project]/input/`
    3. `inputsites/` (for cloned prototypes)
- **Recovery**: Found files are automatically copied to the `public/images/` directory of the new site.

---

## ⏪ Undo/Redo Engine (v7.5)
The Athena Dock features a robust Undo/Redo system (`Ctrl+Z` / `Ctrl+Y`) to quickly recover from editing errors.

### 1. How it Works
- **History Stack**: Changes are stored in a stack within `DockFrame.jsx`.
- **RAM Limit**: To stay within the **4GB RAM limit**, only the last **20 actions** are preserved.
- **Silent Saving**: During an undo/redo, data is pushed to the server with the `silent: true` flag, preventing a full Dock reload.

### 2. Supported Actions
| Action | Type | Description |
| :--- | :--- | :--- |
| **Text/Media** | Update | Changes to titles, texts, or images. |
| **Design/Colors** | Update | Adjustments in the DesignControls (left sidebar). |
| **Delete** | Delete/Restore | On 'delete', the full object is saved. Undo activates the `restore` API. |
| **Add** | Add/Delete | Adding a new item. Undo removes the item. |

---

## 🖱️ Dock Interaction Modes (v7.8.5)
The Athena Dock uses a dual-interaction model to balance visual editing with functional testing.

### 1. Edit Mode (Standard Click)
By default, clicking any element in the site-preview (iframe) will:
- Open the relevant editor modal in the Dock (Text, Media, or Link editor).
- Highlight the element with a visual binding ring.

### 2. Action Mode (Shift + Click)
To test the actual functionality of the site (links, buttons, scrolling) without leaving the editor:
- **Hold `Shift` while clicking**: This bypasses the editor and executes the element's native behavior (e.g., following a link or triggering a scroll-to-anchor).

---

## 📐 Advanced Header & Layout Controls (v7.8.8)

Since v7.8.8, Athena provides granular control over the site's primary layout and header directly from the Dock's **Design Editor**.

### 1. Global Layout Offset
To prevent the fixed header from overlapping content (especially Hero sections), use the **Content Top Offset** slider.
- **Variable**: `--content-top-offset`
- **Application**: Applied as `padding-top` to the `<main>` element in `App.jsx`.
- **Live Preview**: Updates instantly via `dock-connector.js`.

### 2. Header Visibility & Elements
Developers can now toggle specific header components or the entire header:
- `header_visible`: Completely hides/shows the navigation bar.
- `header_show_logo/title/tagline/button`: Toggles individual elements within the header for a cleaner UI.

### 3. Header Styling
- **Transparency**: Toggle `header_transparent` to switch between a blurred/colored background and a fully transparent one.
- **Height**: Adjustable via `header_height` slider (range 40px - 150px).

---

## 🔗 Editable Links & Buttons (v7.6)

Since v7.6, Athena fully supports editable links and buttons via the `EditableLink` component. This resolves the issue of hardcoded URLs in templates.

### 1. Using `EditableLink`
The component accepts both a `label` and a `url`.
```jsx
<EditableLink 
  label={item.cta_text} 
  url={item.cta_url} 
  table="services" 
  field="cta" 
  id={index} 
  className="..."
/>
```

### 2. Data Splitting (Label vs URL) - Split-Save
To keep the primary Google Sheet (Content) clean, data is physically split during saving:
- **Label**: Saved in the specified file (e.g., `services.json`). This is what the client sees in the main tab of the Sheet.
- **URL**: Saved in `links_config.json`. In Google Sheets, this appears on a **hidden tab** named `_links_config`.

### 3. Runtime Merging
During startup (`main.jsx`), `links_config.json` is loaded. The engine automatically appends URLs back to data objects with the `_url` suffix. 
*Example:* If the key is `cta`, the URL becomes available as `cta_url`.

---

## Important Development Rules

### 1. Template Literals & Generator Logic
Source code is generated in `5-engine/logic/` files. ALWAYS use `\$` for dollar signs in generated code to avoid conflicts with Node.js.

### 2. BaseURL & Deployment
ALWAYS use `import.meta.env.BASE_URL` in React components for assets and links. This ensures sites work correctly in GitHub Pages subfolders.

### 3. React Router v7 Ready
Always activate v7 future flags in `App.jsx` to prevent console warnings and prepare for the next major update:
```javascript
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

---

## Data Workflow (JSON-First)

### 🛡️ Mandatory Data Guard
The factory engine (`factory.js`) guarantees that every site includes the following files upon creation:
- `section_order.json`: Section sequence.
- `site_settings.json`: Branding & Logo (Array).
- `contact.json`: Business & Contact Info (Array).
- `display_config.json`: Field visibility.
- `style_bindings.json`: Design settings from the Dock.

### 🎨 Style Bindings
Design choices (fonts, colors, shadows) are stored in `style_bindings.json`. Use the `useMemo` hook in `App.jsx` to apply these styles directly to `:root` via CSS variables.

---

## Feature-Driven Architecture
Activate specific building blocks via `features` flags in `blueprint.json`:
- `ecommerce`: Activates cart and checkout flow.
- `google_search_links`: Generates source references for informative sites.

The engine automatically strips unnecessary code based on these flags during generation.

---

## Cloud Sync & CMS Workflow (v7.8.9)

Athena uses Google Sheets as a Headless CMS. Synchronization is bidirectional and managed via the **Google Sheet Manager** in the Factory Dashboard:

### 📤 Push Sync (Local -> Cloud)
Managed by `sync-full-project-to-sheet.js`.
- **Action**: Visual changes in Athena Dock are saved locally and then pushed to the cloud.
- **Intelligence**: Automatically creates missing tabs in Google Sheets based on local JSON files.
- **Migration**: Automatically handles the split between human-readable tabs and technical hidden tabs (`_style_config`).
- **Provisioning**: If no sheet is linked, it automatically triggers `auto-sheet-provisioner.js` (with Service Account fallback).

### 📥 Pull Sync (Cloud -> Local)
Managed by `sync-sheet-to-json.js`.
- **Action**: Fetches raw data from Google Sheets and overwrites `src/data/`.
- **Safety**: Automatically creates a timestamped backup in `sites/[project]/backups/` before overwriting.
- **Requirement**: The Google Sheet MUST be "Published to the web" (as TSV) for GitHub Actions to access the data.

### 🔍 Media Auditor
To safely manage project images without breaking the site, use the **Media Auditor**:
`node factory/6-utilities/audit-media.js <project-name>`
- **Detection**: Identifies broken image links (in JSON but missing from disk) and unused files (on disk but missing from JSON).

## 📝 Git Workflow SOP
1.  **Sync**: `git pull origin main` for factory and dock.
2.  **Develop**: Make changes in boilerplates or engine.
3.  **Test**: Generate a test site (e.g., `athena-pro`).
4.  **Audit**: Run `audit-media.js` before deleting any assets.
5.  **Commit**: Prefix messages with `feat:`, `fix:`, or `docs:`. 
6.  **Push**: Check remotes with `git remote -v` before pushing.

---

## 🛠️ Troubleshooting & Problem Solving
For common issues and technical hurdles, consult the specialized documentation:
- [Google Apps Script Authorization Issues](./problemsolving/google-apps-script-auth.md) - How to resolve persistent auth errors in Google Sheets.

---

## 🏛️ Governance & Data Architecture (v7.5+)

Since v7.5, Athena has employed a strict management model ("Governance") to ensure customer data integrity and keep the Google Sheets interface clean.

### 1. Governance Modes
Each site has a `governance_mode` in `athena-config.json`:

*   **`dev-mode` (Development)**:
    *   Full bidirectional sync (Push & Pull).
    *   Developer has complete control over both content and layout.
*   **`client-mode` (Production)**:
    *   **Push Lock**: The "Push to Google Sheets" button in the Dock is locked (padlock icon). This prevents local changes in the Dock from overwriting client-managed text in the Sheet.
    *   **Sheet-First Content**: The client manages all text via Google Sheets. The developer manages the style.

### 2. Clean Sheet Architecture (Style/Content Separation)
To prevent clients from seeing "JSON code" in their Google Sheet, data and form are physically separated:

*   **Google Sheets**:
    *   `site_settings` (Tab): Contains only human-readable text (title, email, tagline).
    *   `_style_config` (Hidden Tab): Contains all technical design variables (colors, fonts, shadows).
*   **Local (`src/data/`)**:
    *   `site_settings.json`: Content only.
    *   `style_config.json`: Design settings.
*   **Runtime Merge**:
    During site startup (`main.jsx`), these two sources are merged back in memory. The React application sees a single `site_settings` object for both text and style.

### 3. The "Soft Rebase" Pull
When a `Pull from Sheets` is executed, the engine (`sync-sheet-to-json.js`) recognizes if the site is in `client-mode`. It buffers local style changes (if any) and reapplies them on top of the fresh content from the Sheet, ensuring design updates in the Dock are not lost during client content updates.
