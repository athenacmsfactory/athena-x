# Athena CMS Factory

This repository contains the core logic for the Athena CMS Factory, a Node.js-based tool for generating static websites using Google Gemini for AI-driven content structuring.

## Project Structure

The factory is organized into five main directories:

-   `5-engine/`: Contains all core logic, including the interactive wizards and the project generation engine.
-   `2-templates/`: Holds all templates and components specific to each site-type.
-   `input/`: A workspace for providing input data for the AI parsers.
-   `../sites/`: The sibling directory where all generated websites are created.
-   `3-sitetypes/`: The directory where all site-type blueprints are stored.

## Usage: The Dual-Wizard System

The factory's workflow is managed by two specialized, interactive wizards.

### 1. Creating a New Website

To generate a new website from an **existing site-type**, use the **Site Wizard**. This tool will guide you through selecting a project name, providing content, and choosing a layout and visual style.

**Start the Site Wizard:**
(Run from the root of the `athena/factory` directory)
```bash
node 5-engine/site-wizard.js
```

### 2. Creating a New Site-Type

To define a completely **new type of website** (including its data structure and component templates), use the **Site-Type Wizard**. This is a developer tool that generates all the necessary boilerplate files.

**Start the Site-Type Wizard:**
(Run from the root of the `athena/factory` directory)
```bash
node 5-engine/sitetype-wizard.js
```

---

For complete technical details, architecture diagrams, and advanced usage, please refer to the main [**Developer Manual**](docs/DEVELOPER_MANUAL.md).
