/**
 * @file validator.js
 * @description Provides validation logic for inputs and blueprints.
 */

import fs from 'fs';

export class Validator {

    /**
     * Validates a blueprint object against a basic schema.
     * @param {Object} blueprint 
     * @returns {Object} result { valid: boolean, errors: string[] }
     */
    static validateBlueprint(blueprint) {
        const errors = [];
        const warnings = [];

        if (!blueprint.blueprint_name) errors.push("Missing 'blueprint_name'");
        if (!blueprint.sections || !Array.isArray(blueprint.sections)) errors.push("Missing or invalid 'sections' array");
        if (!blueprint.data_structure || !Array.isArray(blueprint.data_structure)) errors.push("Missing or invalid 'data_structure' array");

        // Deep check sections
        if (Array.isArray(blueprint.sections)) {
            blueprint.sections.forEach((sec, idx) => {
                if (!sec.id) errors.push(`Section at index ${idx} missing 'id'`);
            });
        }

        // Deep check data_structure
        if (Array.isArray(blueprint.data_structure)) {
            blueprint.data_structure.forEach((tbl, idx) => {
                if (!tbl.table_name) errors.push(`Table at index ${idx} missing 'table_name'`);
                if (!tbl.columns || !Array.isArray(tbl.columns)) errors.push(`Table '${tbl.table_name || idx}' missing 'columns' array`);
            });
        }

        // Phase 4.3: Version check (warnings only, not errors)
        if (!blueprint.version) {
            warnings.push("Blueprint has no 'version' field — will be auto-migrated to v2.0");
        } else if (blueprint.version < '2.0') {
            warnings.push(`Blueprint version '${blueprint.version}' is outdated — will be auto-migrated to v2.0`);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Checks if project name is valid and available.
     * @param {string} name 
     * @param {string} sitesDir 
     * @returns {Object} { valid: boolean, error: string }
     */
    static validateProjectName(name, sitesDir) {
        if (!name || name.length < 3) return { valid: false, error: "Name too short (min 3 chars)" };
        if (!/^[a-z0-9-]+$/.test(name)) return { valid: false, error: "Name must be lowercase, numbers, and hyphens only" };

        if (fs.existsSync(`${sitesDir}/${name}`)) {
            return { valid: false, error: "Project directory already exists" };
        }

        return { valid: true };
    }

    /**
     * Validates input file.
     * @param {string} filePath 
     * @returns {Object} { valid: boolean, error: string }
     */
    static validateInputFile(filePath) {
        if (!fs.existsSync(filePath)) return { valid: false, error: "File not found" };
        const stats = fs.statSync(filePath);
        if (stats.size === 0) return { valid: false, error: "File is empty" };
        return { valid: true };
    }
}
