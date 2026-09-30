import { describe, expect, it } from 'vitest';
import { googleMapsUrl } from './listing';

describe('googleMapsUrl', () => {
    it('builds a Google Maps search URL for a Mexican address', () => {
        const url = googleMapsUrl('Hidalgo 803, Centro, Teziutlán, Puebla');

        expect(url).toBe(
            'https://www.google.com/maps/search/?api=1&query=Hidalgo%20803%2C%20Centro%2C%20Teziutl%C3%A1n%2C%20Puebla%2C%20M%C3%A9xico',
        );
    });
});
