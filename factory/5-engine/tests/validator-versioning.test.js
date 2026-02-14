import { describe, it, expect } from 'vitest';
import { Validator } from '../lib/validator.js';

describe('Validator - Blueprint Versioning', () => {
    const validBlueprint = {
        blueprint_name: 'test',
        sections: [{ id: 'hero' }],
        data_structure: [{ table_name: 'basisgegevens', columns: [{ name: 'title' }] }],
        version: '2.0'
    };

    it('should pass with no warnings for v2.0 blueprint', () => {
        const result = Validator.validateBlueprint(validBlueprint);
        expect(result.valid).toBe(true);
        expect(result.warnings).toEqual([]);
    });

    it('should warn when version is missing', () => {
        const bp = { ...validBlueprint };
        delete bp.version;
        const result = Validator.validateBlueprint(bp);
        expect(result.valid).toBe(true);
        expect(result.warnings.length).toBe(1);
        expect(result.warnings[0]).toContain('no \'version\' field');
    });

    it('should warn when version is outdated', () => {
        const result = Validator.validateBlueprint({ ...validBlueprint, version: '1.0' });
        expect(result.valid).toBe(true);
        expect(result.warnings.length).toBe(1);
        expect(result.warnings[0]).toContain('outdated');
    });

    it('should still fail on missing required fields', () => {
        const result = Validator.validateBlueprint({ version: '2.0' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should return both errors and warnings', () => {
        const result = Validator.validateBlueprint({ sections: 'not-an-array' });
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.warnings.length).toBe(1); // missing version
    });
});
