# Specification: Rename 'basisgegevens' to 'basis'

## Goal
Simplify and unify the core data key for site metadata and basic information from 'basisgegevens' to 'basis' across all system components.

## Scope
- **Factory Engine:** Update all logic in `factory/5-engine/` that references the table name.
- **Templates:** Update all boilerplates in `factory/2-templates/` and site types in `factory/3-sitetypes/`.
- **Visual Editor:** Update `dock/` components (e.g., `EditableText` usage).
- **Google Sheets:** Update Apps Script files (`.gs`) and proxy logic.
- **Utility Scripts:** Update maintenance tools in `factory/6-utilities/`.

## Technical Requirements
- Exact string replacement for 'basisgegevens' -> 'basis'.
- Case-insensitive check to catch variations if they exist.
- Ensure backwards compatibility or migration path for existing `sites/` if necessary (though the focus is the factory).
