import { Form } from '@inertiajs/react';
import {
    Car,
    Droplet,
    Flame,
    MessageCircle,
    PawPrint,
    Phone,
    Plus,
    Sofa,
    Tv,
    Wifi,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { ListingImageUploader } from '@/components/listing-image-uploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { type ListingCategoryValue, type ListingFormData } from '@/lib/listing';
import { cn } from '@/lib/utils';

const selectClassName =
    'border-input flex h-10 lg:h-11 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm lg:text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

const amenityChips = [
    { name: 'is_furnished', label: 'Amueblado', icon: Sofa },
    { name: 'pets_allowed', label: 'Mascotas permitidas', icon: PawPrint },
    { name: 'has_parking', label: 'Estacionamiento', icon: Car },
    { name: 'include_water', label: 'Agua', icon: Droplet },
    { name: 'include_electricity', label: 'Luz', icon: Zap },
    { name: 'include_gas', label: 'Gas', icon: Flame },
    { name: 'include_internet', label: 'Internet', icon: Wifi },
    { name: 'include_cable', label: 'Cable', icon: Tv },
] as const;

const contactChips = [
    { name: 'contact_via_whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { name: 'contact_via_phone', label: 'Llamada', icon: Phone },
] as const;

type ListingFormProps = {
    action: string;
    method: 'post' | 'put' | 'patch';
    listing?: ListingFormData;
    submitLabel: string;
};

export function ListingForm({
    action,
    method,
    listing,
    submitLabel,
}: ListingFormProps) {
    const [category, setCategory] = useState<ListingCategoryValue>(
        listing?.category ?? 'apartment',
    );

    return (
        <Form
            action={action}
            method={method}
            encType="multipart/form-data"
            className="flex flex-col gap-8 lg:mt-4 novalidate"
        >
            {({ processing, errors }) => (
                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-11 lg:items-start">
                    <div className="min-w-0 lg:sticky lg:top-4 lg:col-span-5">
                        <ListingImageUploader
                            existing={listing?.images ?? []}
                            errors={errors}
                            withOrderFields={listing != null}
                        />
                    </div>

                    <div className="flex min-w-0 flex-col gap-8 lg:col-span-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={listing?.title}
                                autoComplete="off"
                                placeholder="Ingresa el título para tu publicación"
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={3}
                                defaultValue={listing?.description}
                                placeholder="Añade información más detallada para tu publicación"
                                className="min-h-28 rounded-md"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="zone">Colonia de Teziutlán</Label>
                                <Input
                                    id="zone"
                                    name="zone"
                                    defaultValue={listing?.zone}
                                    placeholder="Ejemplos: Centro, El Carmen, Francia, etc."
                                />
                                <InputError message={errors.zone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="street_address">Dirección <span className='text-muted-foreground'> (opcional)</span></Label>
                                <Input
                                    id="street_address"
                                    name="street_address"
                                    defaultValue={listing?.street_address ?? ''}
                                    placeholder="Av. Miguel Hidalgo #410"
                                />
                                <InputError message={errors.street_address} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <select
                                    id="category"
                                    name="category"
                                    className={selectClassName}
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(
                                            event.target.value as ListingCategoryValue,
                                        )
                                    }
                                >
                                    <option value="room">Cuarto</option>
                                    <option value="apartment">Departamento</option>
                                    <option value="house">Casa</option>
                                </select>
                                <InputError message={errors.category} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="rent_amount">Renta mensual (MXN)</Label>
                                <Input
                                    id="rent_amount"
                                    name="rent_amount"
                                    type="number"
                                    min={1}
                                    step={1}
                                    defaultValue={listing?.rent_amount}
                                    placeholder='2000'
                                />
                                <InputError message={errors.rent_amount} />
                            </div>
                        </div>

                        {['apartment', 'house'].includes(category) && (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="bedrooms">Recámaras</Label>
                                    <Input
                                        id="bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        min={1}
                                        defaultValue={listing?.bedrooms ?? ''}
                                        placeholder='2'
                                    />
                                    <InputError message={errors.bedrooms} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bathrooms">Baños</Label>
                                    <Input
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        min={1}
                                        defaultValue={listing?.bathrooms ?? ''}
                                        placeholder='1'
                                    />
                                    <InputError message={errors.bathrooms} />
                                </div>
                            </div>
                        )}

                        <fieldset className="grid gap-3">
                            <legend className="text-sm lg:text-base font-medium">
                                Amenidades y servicios
                            </legend>
                            <p className="text-muted-foreground text-sm lg:text-base mt-1">
                                Marca las amenidades incluidas en la renta
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {amenityChips.map((chip) => (
                                    <ChipField
                                        key={chip.name}
                                        id={chip.name}
                                        name={chip.name}
                                        label={chip.label}
                                        icon={chip.icon}
                                        defaultChecked={
                                            listing?.[chip.name] ?? false
                                        }
                                    />
                                ))}
                            </div>
                            {amenityChips.map((chip) => (
                                <InputError
                                    key={`${chip.name}-error`}
                                    message={errors[chip.name]}
                                />
                            ))}
                        </fieldset>

                        <fieldset className="grid gap-3">
                            <legend className="text-sm lg:text-base font-medium">Vías de contacto</legend>
                            <p className="text-muted-foreground text-sm lg:text-base mt-1">
                                Por dónde quieres ser contactado?
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {contactChips.map((chip) => (
                                    <ChipField
                                        key={chip.name}
                                        id={chip.name}
                                        name={chip.name}
                                        label={chip.label}
                                        icon={chip.icon}
                                        defaultChecked={
                                            listing?.[chip.name] ?? false
                                        }
                                    />
                                ))}
                            </div>
                            {contactChips.map((chip) => (
                                <InputError
                                    key={`${chip.name}-error`}
                                    message={errors[chip.name]}
                                />
                            ))}
                        </fieldset>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                size="lg"
                                className="w-full rounded-md sm:w-auto"
                            >
                                {processing && <Spinner /> }
                                {submitLabel}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Form>
    );
}

function ChipField({
    id,
    name,
    label,
    icon: Icon,
    defaultChecked,
}: {
    id: string;
    name: string;
    label: string;
    icon: LucideIcon;
    defaultChecked: boolean;
}) {
    return (
        <div>
            {/* If the checkbox is not checked, a value of "0" is submitted.
            This allows the field to be sent in the request even if it is not checked. */}
            <input type="hidden" name={name} value="0" />
            {/* If the checkbox is checked, the last input with the same name is submitted */}
            <input
                id={id}
                type="checkbox"
                name={name}
                value="1"
                defaultChecked={defaultChecked}
                className="peer sr-only"
            />
            <Label
                htmlFor={id}
                className={cn(
                    'border-input inline-flex h-10 lg:h-11 cursor-pointer items-center gap-2 rounded-md border px-4 font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:hover:bg-primary/90 peer-checked:hover:text-primary-foreground',
                    'peer-focus-visible:border-ring peer-focus-visible:ring-ring/50 peer-focus-visible:ring-[3px]',
                    'dark:peer-checked:border-primary',
                )}
            >
                <Icon className="size-4" />
                {label}
            </Label>
        </div>
    );
}
