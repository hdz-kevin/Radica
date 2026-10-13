import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { show } from '@/actions/App/Http/Controllers/ListingController';
import { Button } from '@/components/ui/button';

export function ShareListingButton({
    listingId,
    title,
    text,
}: {
    listingId: number;
    title: string;
    text: string;
}) {
    async function share(): Promise<void> {
        const url = absoluteListingUrl(listingId);

        if (typeof navigator.share === 'function') {
            try {
                await navigator.share({ title, text, url });

                return;
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Enlace copiado');
        } catch {
            toast.error('No se pudo copiar el enlace');
        }
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9 shrink-0 shadow"
            aria-label="Compartir publicación"
            onClick={() => {
                void share();
            }}
        >
            <Share2 className="size-4" />
        </Button>
    );
}

function absoluteListingUrl(listingId: number): string {
    const path = show.url(listingId);

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return new URL(path, window.location.origin).href;
}
