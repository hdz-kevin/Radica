import { describe, expect, it } from 'vitest';
import { googleMapsUrl, telUrl, whatsAppUrl } from './listing';

describe('googleMapsUrl', () => {
    it('builds a Google Maps search URL for a Mexican address', () => {
        const url = googleMapsUrl('Hidalgo 803, Centro, Teziutlán, Puebla');

        expect(url).toBe(
            'https://www.google.com/maps/search/?api=1&query=Hidalgo%20803%2C%20Centro%2C%20Teziutl%C3%A1n%2C%20Puebla%2C%20M%C3%A9xico',
        );
    });
});

describe('contact links', () => {
    it('keeps the WhatsApp mobile prefix and drops it when dialing', () => {
        const stored = '5215512345678';

        expect(whatsAppUrl(stored, 'https://radica.test/listings/1')).toContain(
            'https://wa.me/5215512345678?text=',
        );
        expect(telUrl(stored)).toBe('tel:+525512345678');
    });

    it('prefills a short inquiry and the listing link for WhatsApp', () => {
        const url = whatsAppUrl(
            '5215512345678',
            'https://radica.test/listings/1',
        );
        const text = new URL(url).searchParams.get('text');

        expect(text).toBe(
            'Hola, vi tu publicación en radicaMX. ¿Sigue disponible?\n\nhttps://radica.test/listings/1',
        );
    });
});
