# Tech Stack: Athena 2

## Core Technologies
- **Language:** JavaScript (ES Modules)
- **Runtime:** Node.js (v22+)
- **Package Manager:** pnpm (Strict workspace usage)

## Factory Engine (Backend/CLI)
- **Framework:** Express.js (v5+)
- **AI Integration:** Google Generative AI (@google/generative-ai)
- **External APIs:** Googleapis (Sheets, Auth)
- **Data Processing:** Cheerio, CSVtojson, Babel Parser/Recast (AST manipulation)
- **Testing:** Vitest

## Athena Dock (Visual Editor)
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4 (PostCSS)
- **Communication:** postMessage API (for site interaction)

## Generated Sites (Output)
- **Architecture:** React 19 SPA or MPA (Boilerplate-driven)
- **Styling:** Tailwind CSS v4
- **Deployment:** GitHub Actions (athena-publisher workflow)
