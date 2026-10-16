import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, XIcon, type LucideIcon } from 'lucide-react';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type MouseEvent,
    type PointerEvent,
} from 'react';
import {
    Dialog,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { type ListingShowImage } from '@/lib/listing';
import { cn } from '@/lib/utils';

export function ListingGallery({
    images,
    title,
}: {
    images: ListingShowImage[];
    title: string;
}) {
    const coverIndex = Math.max(
        0,
        images.findIndex((image) => image.is_cover),
    );
    const [activeIndex, setActiveIndex] = useState(coverIndex);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const stripRef = useRef<HTMLDivElement>(null);
    const thumbsRef = useRef<HTMLUListElement>(null);
    const pointerStart = useRef<number | null>(null);

    useLayoutEffect(() => {
        scrollStrip(stripRef.current, coverIndex, 'auto');
    }, [coverIndex]);

    useLayoutEffect(() => {
        scrollActiveThumb(thumbsRef.current, activeIndex, 'auto');
    }, [activeIndex]);

    function showIndex(index: number, behavior: ScrollBehavior) {
        const next = clampIndex(index, images.length);

        setActiveIndex(next);
        scrollStrip(stripRef.current, next, behavior);
    }

    function handleStripScroll() {
        const scroller = stripRef.current;

        if (!scroller || scroller.clientWidth === 0) {
            return;
        }

        setActiveIndex(
            clampIndex(
                Math.round(scroller.scrollLeft / scroller.clientWidth),
                images.length,
            ),
        );
    }

    function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
        pointerStart.current = event.clientX;
    }

    function openLightbox(event: MouseEvent<HTMLButtonElement>, index: number) {
        const start = pointerStart.current;

        pointerStart.current = null;

        if (start !== null && Math.abs(event.clientX - start) > 8) {
            return;
        }

        showIndex(index, 'auto');
        setLightboxOpen(true);
    }

    const hasMany = images.length > 1;

    return (
        <div className="grid gap-3">
            <div className="relative">
                <div
                    ref={stripRef}
                    onScroll={handleStripScroll}
                    className="bg-muted flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onPointerDown={handlePointerDown}
                            onClick={(event) => openLightbox(event, index)}
                            className="w-full shrink-0 snap-center focus-visible:outline-none"
                            aria-label={`Ver foto ${index + 1} de ${images.length} en grande`}
                        >
                            <img
                                src={image.url}
                                alt=""
                                draggable={false}
                                // className="aspect-video min-h-56 w-full object-cover lg:min-h-72"
                                className="aspect-[16/9.9225] min-h-[15.435rem] w-full object-cover lg:min-h-[24rem]"
                            />
                        </button>
                    ))}
                </div>
            </div>
            {hasMany ? (
                <ul
                    ref={thumbsRef}
                    className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain p-0.5 [scrollbar-width:none] lg:gap-3 [&::-webkit-scrollbar]:hidden"
                >
                    {images.map((image, index) => (
                        <li key={image.id} className="shrink-0">
                            <button
                                type="button"
                                onClick={() => showIndex(index, 'smooth')}
                                aria-label={
                                    image.is_cover
                                        ? 'Portada'
                                        : 'Seleccionar foto'
                                }
                                aria-current={
                                    index === activeIndex ? 'true' : undefined
                                }
                                className={cn(
                                    'block overflow-hidden rounded-md border',
                                    index === activeIndex &&
                                        'ring-2 ring-gray-500',
                                )}
                            >
                                <img
                                    src={image.url}
                                    alt=""
                                    className="h-14 w-16 object-cover lg:size-18"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
            <ListingLightbox
                images={images}
                title={title}
                open={lightboxOpen}
                index={activeIndex}
                onOpenChange={setLightboxOpen}
                onIndexChange={(index) => showIndex(index, 'auto')}
            />
        </div>
    );
}

function ListingLightbox({
    images,
    title,
    open,
    index,
    onOpenChange,
    onIndexChange,
}: {
    images: ListingShowImage[];
    title: string;
    open: boolean;
    index: number;
    onOpenChange: (open: boolean) => void;
    onIndexChange: (index: number) => void;
}) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef(index);
    const pointerStart = useRef<{ x: number; y: number } | null>(null);
    const hasMany = images.length > 1;
    const active = images[index] ?? images[0];

    indexRef.current = index;

    useEffect(() => {
        if (!open) {
            return;
        }

        let cancelled = false;
        let frames = 0;
        const target = indexRef.current;

        function align() {
            if (cancelled) {
                return;
            }

            const scroller = scrollerRef.current;

            if (!scroller || scroller.clientWidth === 0) {
                if (frames < 20) {
                    frames += 1;
                    requestAnimationFrame(align);
                }

                return;
            }

            scroller.scrollTo({
                left: target * scroller.clientWidth,
                behavior: 'auto',
            });
        }

        const frame = requestAnimationFrame(align);

        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
        };
    }, [open]);

    function handleScroll() {
        const scroller = scrollerRef.current;

        if (!scroller || scroller.clientWidth === 0) {
            return;
        }

        const next = clampIndex(
            Math.round(scroller.scrollLeft / scroller.clientWidth),
            images.length,
        );

        if (next !== index) {
            onIndexChange(next);
        }
    }

    function goTo(next: number) {
        const clamped = clampIndex(next, images.length);

        if (clamped === indexRef.current) {
            return;
        }

        const scroller = scrollerRef.current;

        if (scroller && scroller.clientWidth > 0) {
            scroller.scrollTo({
                left: clamped * scroller.clientWidth,
                behavior: 'auto',
            });
        }

        onIndexChange(clamped);
    }

    useEffect(() => {
        if (!open || !hasMany) {
            return;
        }

        function onKeyDown(event: globalThis.KeyboardEvent) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                return;
            }

            event.preventDefault();
            const delta = event.key === 'ArrowLeft' ? -1 : 1;
            goTo(indexRef.current + delta);
        }

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, hasMany, images.length, onIndexChange]);

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
        pointerStart.current = { x: event.clientX, y: event.clientY };
    }

    function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
        const start = pointerStart.current;

        pointerStart.current = null;

        if (
            start !== null &&
            Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8
        ) {
            return;
        }

        if (!(event.target instanceof Element)) {
            return;
        }

        if (event.target.closest('img, button')) {
            return;
        }

        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay
                    className="fixed inset-0 z-50 bg-black"
                    style={{ animation: 'none' }}
                />
                <DialogPrimitive.Content
                    className="fixed inset-0 z-50 flex h-dvh w-screen items-center justify-center bg-black outline-none"
                    style={{ animation: 'none' }}
                    onPointerDown={handlePointerDown}
                    onClick={handleBackdropClick}
                >
                <DialogTitle className="sr-only">Fotos de {title}</DialogTitle>
                <DialogDescription className="sr-only">
                    {active
                        ? `Foto ${index + 1} de ${images.length}`
                        : 'Sin fotos'}
                </DialogDescription>
                <div
                    ref={scrollerRef}
                    onScroll={handleScroll}
                    className="flex h-full w-full snap-x snap-mandatory items-center overflow-x-auto [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
                >
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4"
                        >
                            <img
                                src={image.url}
                                alt=""
                                draggable={false}
                                className="max-h-[85dvh] max-w-full object-contain"
                            />
                        </div>
                    ))}
                </div>
                {active ? (
                    <div className="hidden h-full w-full items-center justify-center px-16 lg:flex">
                        <img
                            src={active.url}
                            alt={title}
                            draggable={false}
                            className="max-h-[85dvh] max-w-full object-contain"
                        />
                    </div>
                ) : null}
                {hasMany ? (
                    <>
                        <PhotoNavButton
                            direction="previous"
                            className="left-3 bg-white/90 text-neutral-900 hover:bg-white focus-visible:ring-neutral-900"
                            disabled={index === 0}
                            onClick={() => goTo(index - 1)}
                        />
                        <PhotoNavButton
                            direction="next"
                            className="right-3 bg-white/90 text-neutral-900 hover:bg-white focus-visible:ring-neutral-900"
                            disabled={index === images.length - 1}
                            onClick={() => goTo(index + 1)}
                        />
                        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                            {index + 1} / {images.length}
                        </p>
                    </>
                ) : null}
                <DialogPrimitive.Close className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 text-white opacity-100 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
                    <XIcon className="size-4" />
                    <span className="sr-only">Cerrar</span>
                </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    );
}

function PhotoNavButton({
    direction,
    className,
    disabled,
    onClick,
}: {
    direction: 'previous' | 'next';
    className?: string;
    disabled: boolean;
    onClick: () => void;
}) {
    const Icon: LucideIcon =
        direction === 'previous' ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            disabled={disabled}
            aria-label={
                direction === 'previous' ? 'Foto anterior' : 'Foto siguiente'
            }
            onClick={onClick}
            className={cn(
                'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 lg:inline-flex',
                className,
            )}
        >
            <Icon className="size-5" />
        </button>
    );
}

function scrollActiveThumb(
    list: HTMLUListElement | null,
    index: number,
    behavior: ScrollBehavior,
) {
    const thumb = list?.children.item(index);

    if (!list || !(thumb instanceof HTMLElement) || list.clientWidth === 0) {
        return;
    }

    const listRect = list.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const style = getComputedStyle(list);
    const visibleLeft = listRect.left + Number.parseFloat(style.paddingLeft);
    const visibleRight = listRect.right - Number.parseFloat(style.paddingRight);
    let delta = 0;

    if (thumbRect.left < visibleLeft) {
        delta = thumbRect.left - visibleLeft;
    } else if (thumbRect.right > visibleRight) {
        delta = thumbRect.right - visibleRight;
    }

    if (delta === 0) {
        return;
    }

    list.scrollTo({ left: list.scrollLeft + delta, behavior });
}

function scrollStrip(
    scroller: HTMLDivElement | null,
    index: number,
    behavior: ScrollBehavior,
) {
    if (!scroller || scroller.clientWidth === 0) {
        return;
    }

    scroller.scrollTo({
        left: index * scroller.clientWidth,
        behavior,
    });
}

function clampIndex(index: number, length: number): number {
    return Math.min(length - 1, Math.max(0, index));
}
