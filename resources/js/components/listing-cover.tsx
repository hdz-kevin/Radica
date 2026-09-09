import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { cn } from '@/lib/utils';

export function ListingCover({
    url,
    alt,
    className,
}: {
    url: string | null;
    alt: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'relative aspect-video overflow-hidden rounded-lg border',
                className,
            )}
        >
            {url ? (
                <img src={url} alt={alt} className="size-full object-cover" />
            ) : (
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            )}
        </div>
    );
}
