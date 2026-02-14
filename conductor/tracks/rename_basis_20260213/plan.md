# Implementation Plan: Rename 'basisgegevens' to 'basis'

## Phase 1: Impact Analysis & Global Search
- [x] Task: Identify all occurrences of 'basisgegevens' in the codebase. 298838a
    - [x] Run a project-wide grep to map out the refactoring surface. 298838a
- [x] Task: Verify Apps Script (`.gs`) files for hardcoded references. 298838a

## Phase 2: Factory Engine & Templates Refactoring
- [x] Task: Refactor Factory Engine logic. 298838a
    - [x] Update `factory/5-engine/parser-engine.js`. 298838a
    - [x] Update `factory/5-engine/sync-*` scripts. 298838a
- [x] Task: Update Boilerplates and Blueprints. 298838a
    - [x] Update `factory/2-templates/boilerplate/`. 298838a
    - [x] Update `factory/3-sitetypes/`. 298838a
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) 298838a

## Phase 3: Visual Editor & Utilities Refactoring
- [x] Task: Update Athena Dock. 298838a
    - [x] Search and replace in `dock/src/`. 298838a
- [x] Task: Update Utility Scripts. 298838a
    - [x] Search and replace in `factory/6-utilities/`. 298838a
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) 298838a

## Phase 4: Final Verification & Commit
- [x] Task: Run tests to ensure site generation still works. 298838a
    - [x] Generate a test site and verify the 'basis' table is correctly parsed. 298838a
- [x] Task: Commit changes. 298838a
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md) 298838a
