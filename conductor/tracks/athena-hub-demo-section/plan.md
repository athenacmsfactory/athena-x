# Plan: Demo Section for Athena Hub

## Objective
The "Bekijk de Demo's" button in the hero section of `athena-hub` should link to a showcase section that displays a curated list of demo sites.

## Tasks
- [ ] **Data Entry**: Populate `sites/athena-hub/src/data/showcase.json` with a selection of sites:
  - `athena-pro`
  - `cloud-architects`
  - `demo-bakkerij`
  - `pure-relaxation`
  - `urban-oasis`
- [ ] **Verification**: Ensure `showcase` is included in `section_order.json` (or `all_data.json`).
- [ ] **Link Hero Button**: Verify that the hero CTA links to `#showcase`.
- [ ] **Build & Sync**: Run `pnpm fetch-data` in `sites/athena-hub` to ensure `all_data.json` is aggregated.
- [ ] **Final Check**: Verify visual appearance and interaction (Shift + Click for demo links).

## Selection Details (Source Data)
- **athena-pro**: `https://athena-cms-factory.github.io/athena-pro/`
  - Image: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015`
- **cloud-architects**: `https://athena-cms-factory.github.io/cloud-architects/`
  - Image: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600`
- **demo-bakkerij**: `https://athena-cms-factory.github.io/demo-bakkerij/`
  - Image: `https://athena-cms-factory.github.io/demo-bakkerij/images/artisanal-1-1770398212360.jpeg`
- **pure-relaxation**: `https://athena-cms-factory.github.io/pure-relaxation/`
  - Image: `https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600`
- **urban-oasis**: `https://athena-cms-factory.github.io/urban-oasis/`
  - Image: `https://images.unsplash.com/photo-1616489953149-7551745cae7a?w=1600`

