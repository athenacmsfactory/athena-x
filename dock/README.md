# Athena Dock (v7.6.2)

Athena Dock is the visual editing interface for the Athena CMS Factory. It allows for real-time manipulation of generated sites using a specialized postMessage protocol and Vite-based hot-reloading.

## 🚀 Getting Started

To launch the Dock alongside a site, use the unified launcher in the project root:

```bash
./launch.sh [site-name]
```

## ⚓ Key Features
- **Visual Editing**: Click and edit text or media directly on the site preview.
- **Undo/Redo**: Full history support with `Ctrl+Z` / `Ctrl+Y`.
- **Field Management**: Hide/show specific fields or entire sections.
- **Design Controls**: Live theme switching, color picking, and spacing adjustments.
- **Cloud Sync**: One-click synchronization to Google Sheets with safety checklists.

## 🏛️ Ports
- **Athena Dock**: http://localhost:4002 (Default)
- **Target Site**: http://localhost:3000 (Expected)

## 🛠️ Interaction
- **Ctrl+Click**: Intercepts link navigation in `EditableLink` components to allow for selection in the Dock.
- **Drag & Drop**: Direct asset replacement for `EditableMedia` slots.