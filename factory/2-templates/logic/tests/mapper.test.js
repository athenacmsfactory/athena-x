import { describe, it, expect } from 'vitest';
import { createMapper } from '../mapper.js';

describe('mapper.js', () => {
    it('Mapper translates headers correctly', () => {
        const schema = {
            mapping: {
                "onderdeel": "Section_Type",
                "titel": "Title"
            }
        };
        const mapper = createMapper(schema);
        
        expect(mapper.mapHeader('Onderdeel')).toBe('Section_Type');
        expect(mapper.mapHeader('titel ')).toBe('Title');
        expect(mapper.mapHeader('Onbekend')).toBe('Onbekend');
    });

    it('Mapper translates values correctly', () => {
        const schema = {
            mapping: {
                "spoed": "emergency",
                "team": "specialist_grid"
            }
        };
        const mapper = createMapper(schema);
        
        expect(mapper.mapValue('Spoed')).toBe('emergency');
        expect(mapper.mapValue(' team ')).toBe('specialist_grid');
        expect(mapper.mapValue('Normaal')).toBe('Normaal');
    });

    it('Mapper handles missing schema gracefully', () => {
        const mapper = createMapper(null);
        expect(mapper.mapHeader('Test')).toBe('Test');
        expect(mapper.mapValue('Test')).toBe('Test');
    });
});