import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    MAX_LISTING_PHOTO_BYTES,
    MAX_LISTING_PHOTOS,
    type ListingImagePreview,
} from '@/lib/listing';
import { cn } from '@/lib/utils';

const ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp,image/avif';
const ACCEPTED_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
]);

type ExistingPhoto = {
    key: string;
    kind: 'existing';
    id: number;
    url: string;
};

type NewPhoto = {
    key: string;
    kind: 'new';
    file: File;
    previewUrl: string;
};

type PhotoItem = ExistingPhoto | NewPhoto;

type ListingImageUploaderProps = {
    existing: ListingImagePreview[];
    errors: Record<string, string>;
    withOrderFields: boolean;
};

export function ListingImageUploader({
    existing,
    errors,
    withOrderFields,
}: ListingImageUploaderProps) {
    const pickerId = useId();
    const pickerRef = useRef<HTMLInputElement>(null);
    const submitRef = useRef<HTMLInputElement>(null);
    const itemsRef = useRef<PhotoItem[]>([]);
    const [items, setItems] = useState<PhotoItem[]>(() =>
        existing.map((image) => ({
            key: `existing-${image.id}`,
            kind: 'existing' as const,
            id: image.id,
            url: image.url,
        })),
    );
    const [selectedKey, setSelectedKey] = useState<string | null>(
        () => items[0]?.key ?? null,
    );
    const [clientError, setClientError] = useState<string | null>(null);
    const [isFileDrag, setIsFileDrag] = useState(false);

    itemsRef.current = items;

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        return () => {
            for (const item of itemsRef.current) {
                if (item.kind === 'new') {
                    URL.revokeObjectURL(item.previewUrl);
                }
            }
        };
    }, []);

    useEffect(() => {
        const input = submitRef.current;

        if (!input) {
            return;
        }

        const transfer = new DataTransfer();

        for (const item of items) {
            if (item.kind === 'new') {
                transfer.items.add(item.file);
            }
        }

        input.files = transfer.files;
    }, [items]);

    const selected = items.find((item) => item.key === selectedKey) ?? items[0];
    const atMax = items.length >= MAX_LISTING_PHOTOS;
    const serverError =
        errors.images ??
        Object.entries(errors).find(([key]) => key.startsWith('images.') || key.startsWith('image_order'))?.[1];

    function openPicker(): void {
        pickerRef.current?.click();
    }

    function addFiles(fileList: FileList | File[]): void {
        const incoming = Array.from(fileList);
        const typed = incoming.filter(isAcceptedImage);
        const accepted = typed.filter(
            (file) => file.size <= MAX_LISTING_PHOTO_BYTES,
        );
        const remaining = MAX_LISTING_PHOTOS - items.length;
        const toAdd = accepted.slice(0, Math.max(0, remaining));

        if (typed.length < incoming.length) {
            setClientError('Solo se aceptan fotos JPEG, PNG, WebP o AVIF.');
        } else if (accepted.length < typed.length) {
            setClientError('Cada foto debe pesar 10 MB o menos.');
        } else if (accepted.length > remaining) {
            setClientError(`Puedes subir hasta ${MAX_LISTING_PHOTOS} fotos.`);
        } else {
            setClientError(null);
        }

        if (toAdd.length === 0) {
            return;
        }

        const added: NewPhoto[] = toAdd.map((file) => ({
            key: `new-${crypto.randomUUID()}`,
            kind: 'new',
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setItems((current) => [...current, ...added]);
        setSelectedKey((current) => current ?? added[0].key);
    }

    function removeSelected(): void {
        if (!selected) {
            return;
        }

        const index = items.findIndex((item) => item.key === selected.key);

        if (index === -1) {
            return;
        }

        const removed = items[index];

        if (removed.kind === 'new') {
            URL.revokeObjectURL(removed.previewUrl);
        }

        const next = items.filter((_, itemIndex) => itemIndex !== index);
        const neighbor = next[index] ?? next[index - 1] ?? null;

        setItems(next);
        setSelectedKey(neighbor?.key ?? null);
    }

    function handleDragEnd(event: DragEndEvent): void {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        setItems((current) => {
            const oldIndex = current.findIndex((item) => item.key === active.id);
            const newIndex = current.findIndex((item) => item.key === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                return current;
            }

            return arrayMove(current, oldIndex, newIndex);
        });
    }

    return (
        <fieldset className="grid gap-3">
            <legend className="text-sm font-medium mb-2">Fotos</legend>

            <input
                ref={pickerRef}
                id={pickerId}
                type="file"
                multiple
                accept={ACCEPT}
                className="sr-only"
                onChange={(event) => {
                    if (event.target.files) {
                        addFiles(event.target.files);
                    }

                    event.target.value = '';
                }}
            />
            <input
                ref={submitRef}
                type="file"
                name="images[]"
                multiple
                accept={ACCEPT}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
            />
            {withOrderFields
                ? items.map((item) => (
                      <input
                          key={item.key}
                          type="hidden"
                          name="image_order[]"
                          value={item.kind === 'existing' ? String(item.id) : 'new'}
                      />
                  ))
                : null}

            {items.length === 0 ? (
                <button
                    type="button"
                    onClick={openPicker}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsFileDrag(true);
                    }}
                    onDragOver={(event) => {
                        event.preventDefault();
                    }}
                    onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                            setIsFileDrag(false);
                        }
                    }}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsFileDrag(false);
                        addFiles(event.dataTransfer.files);
                    }}
                    className={cn(
                        'flex min-h-42 lg:min-h-72 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-sm transition-colors',
                        isFileDrag
                            ? 'border-ring bg-muted/60'
                            : 'border-input text-muted-foreground hover:bg-muted/40',
                    )}
                >
                    <ImageIcon className="size-8" />
                    Subir imágenes
                </button>
            ) : (
                <div
                    className="grid gap-3"
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsFileDrag(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                            setIsFileDrag(false);
                        }
                    }}
                    onDrop={(event) => {
                        event.preventDefault();
                        setIsFileDrag(false);
                        addFiles(event.dataTransfer.files);
                    }}
                >
                    <div className="relative overflow-hidden rounded-lg bg-muted">
                        <img
                            src={photoUrl(selected)}
                            alt=""
                            className="aspect-video w-full min-h-52 lg:min-h-72 object-cover"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 size-8 lg:size-10"
                            onClick={removeSelected}
                            aria-label="Eliminar imagen"
                        >
                            <Trash2 className="lg:size-5" />
                        </Button>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((item) => item.key)}
                            strategy={rectSortingStrategy}
                        >
                            <ul className="grid grid-cols-5 lg:grid-cols-6 gap-2">
                                {items.map((item, index) => (
                                    <SortableThumb
                                        key={item.key}
                                        item={item}
                                        isCover={index === 0}
                                        isSelected={item.key === selected.key}
                                        onSelect={() => setSelectedKey(item.key)}
                                    />
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        onClick={openPicker}
                                        disabled={atMax}
                                        aria-label="Añadir fotos"
                                        className={cn(
                                            'flex size-17 lg:size-20 items-center justify-center rounded-md border-2 border-dashed',
                                            atMax
                                                ? 'border-input text-muted-foreground/40'
                                                : 'border-input text-foreground hover:bg-muted/40',
                                            isFileDrag && !atMax && 'border-ring bg-muted/60',
                                        )}
                                    >
                                        <Plus className="size-5" />
                                    </button>
                                </li>
                            </ul>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            <InputError message={clientError ?? serverError} />
        </fieldset>
    );
}

function SortableThumb({
    item,
    isCover,
    isSelected,
    onSelect,
}: {
    item: PhotoItem;
    isCover: boolean;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.key });

    return (
        <li
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn('relative', isDragging && 'z-10 opacity-70')}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                onClick={onSelect}
                aria-label={isCover ? 'Portada' : 'Seleccionar foto'}
                aria-current={isSelected ? 'true' : undefined}
                className={cn(
                    'overflow-hidden rounded-md border',
                    isSelected && 'ring-2 ring-gray-500',
                )}
            >
                <img
                    src={photoUrl(item)}
                    alt=""
                    className="size-17 lg:size-20 object-cover"
                />
            </button>
            {isCover ? (
                <Badge className="absolute -top-1 -left-1 px-1 py-0 text-[10px]">
                    Portada
                </Badge>
            ) : null}
        </li>
    );
}

function photoUrl(item: PhotoItem | undefined): string {
    if (!item) {
        return '';
    }

    return item.kind === 'existing' ? item.url : item.previewUrl;
}

function isAcceptedImage(file: File): boolean {
    if (ACCEPTED_TYPES.has(file.type)) {
        return true;
    }

    return /\.(jpe?g|png|webp|avif)$/i.test(file.name);
}
