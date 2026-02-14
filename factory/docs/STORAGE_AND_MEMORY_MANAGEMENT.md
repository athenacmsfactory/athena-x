# STORAGE AND MEMORY MANAGEMENT ON CHROMEBOOK (Update Jan 2026)

This document describes proven strategies for running the Athena CMS Factory stably and efficiently on an Acer Chromebook (4GB RAM, 25GB Storage).

## 1. THE PNPM ADVANTAGE: THE NUMBERS
Thanks to the use of **pnpm**, the disk space impact of new sites is virtually zero.
*   **Measured Result:** The `node_modules` folder of a new showcase site occupies only **44KB** of metadata.
*   **Central Store:** The actual files are located in the central pnpm store. This allows us to manage hundreds of sites without exceeding the 25GB storage limit.
*   **Action:** Periodically run `pnpm store prune` to clean up the central storage.

## 2. RAM OPTIMIZATION (4GB LIMIT)
Memory is the primary bottleneck. To prevent "JavaScript heap out of memory" errors, we apply the following rules:

### A. Serial Installation
ALWAYS perform installations with limited concurrency.
*   **Command:** `pnpm install --child-concurrency 1`
*   **Automation:** The `deploy-wizard.js` is set by default to use this flag when restoring dependencies.

### B. Memory-Aware Development
*   **Browser Management:** Close unnecessary tabs in Chrome OS when running the Factory Engine or heavy builds.
*   **Silent Mode:** Prefer CLI tools over GUI alternatives whenever possible.
*   **Node v22:** Use the latest Node.js versions, which handle memory management more efficiently.

## 3. MAINTENANCE & CLEANING
To keep the system running smoothly:
1.  **Project Cleaning:** Use `rm -rf sites/*/node_modules` to remove all local links. Projects remain functional as they are registered as Git Submodules and hosted on GitHub.
2.  **System Cleaning:**
    *   `sudo apt autoremove --purge`
    *   `sudo apt clean`
3.  **Monitoring:** Use `free -h` and `df -h` to monitor RAM and storage status.

## 4. CONCLUSION
The practical test on January 13, 2026 (generation of 10 sites in one session) demonstrated that these strategies work. The system remained stable, and disk usage stayed well within limits (41% occupancy including OS and 10 demo sites).

---
*Optimization by Athena Factory Engine - Build for Performance.*
