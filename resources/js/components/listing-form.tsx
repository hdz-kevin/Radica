import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { ListingImageUploader } from '@/components/listing-image-uploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
    includedUtilities,
    type ListingCategoryValue,
    type ListingFormData,
} from '@/lib/listing';

const selectClassName =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

type ListingFormProps = {
    action: string;
    method: 'post' | 'put' | 'patch';
    listing?: ListingFormData;
    defaults?: {
        state: string;
        city: string;
    };
    submitLabel: string;
};

export function ListingForm({
    action,
    method,
    listing,
    defaults,
    submitLabel,
}: ListingFormProps) {
    const [category, setCategory] = useState<ListingCategoryValue>(
        listing?.category ?? 'apartment',
    );

    const state = listing?.state ?? defaults?.state ?? '';
    const city = listing?.city ?? defaults?.city ?? '';

    return (
        <Form action={action} method={method} encType="multipart/form-data" className="flex flex-col gap-8 lg:mt-4 novalidate">
            {({ processing, errors }) => (
                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
                    <div className="lg:sticky lg:top-4">
                        <ListingImageUploader
                            existing={listing?.images ?? []}
                            errors={errors}
                            withOrderFields={listing != null}
                        />
                    </div>

                    <div className="flex flex-col gap-8">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            name="title"
                            autoFocus
                            defaultValue={listing?.title}
                            autoComplete="off"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={6}
                            defaultValue={listing?.description}
                        />

                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Categoría</Label>
                            <select
                                id="category"
                                name="category"
                                className={selectClassName}
                                value={category}
                                onChange={(event) => setCategory(event.target.value as ListingCategoryValue)}
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
                            />

                            <InputError message={errors.rent_amount} />
                        </div>
                    </div>

                    {['apartment', 'house'].includes(category) && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="bedrooms">Recámaras</Label>
                                <Input
                                    id="bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    min={1}
                                    defaultValue={listing?.bedrooms ?? ''}
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
                                />

                                <InputError message={errors.bathrooms} />
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3">
                        <BooleanField
                            id="is_furnished"
                            name="is_furnished"
                            label="Amueblado"
                            defaultChecked={listing?.is_furnished ?? false}
                            error={errors.is_furnished}
                        />
                        <BooleanField
                            id="pets_allowed"
                            name="pets_allowed"
                            label="Se aceptan mascotas"
                            defaultChecked={listing?.pets_allowed ?? false}
                            error={errors.pets_allowed}
                        />
                        <BooleanField
                            id="has_parking"
                            name="has_parking"
                            label="Estacionamiento"
                            defaultChecked={listing?.has_parking ?? false}
                            error={errors.has_parking}
                        />
                    </div>

                    <fieldset className="grid gap-3">
                        <legend className="text-sm font-medium">
                            Incluidos en la renta
                        </legend>
                        {includedUtilities.map((utility) => (
                            <BooleanField
                                key={utility.name}
                                id={utility.name}
                                name={utility.name}
                                label={utility.label}
                                defaultChecked={listing?.[utility.name] ?? false}
                                error={errors[utility.name]}
                            />
                        ))}
                    </fieldset>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="state">Estado</Label>
                            <Input id="state" value={state} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input id="city" value={city} disabled />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="zone">Zona o colonia</Label>
                        <Input
                            id="zone"
                            name="zone"
                            defaultValue={listing?.zone}
                        />
                        <InputError message={errors.zone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="street_address">
                            Dirección (opcional)
                        </Label>
                        <Input
                            id="street_address"
                            name="street_address"
                            defaultValue={listing?.street_address ?? ''}
                        />
                        <InputError message={errors.street_address} />
                    </div>

                    <fieldset className="grid gap-3">
                        <legend className="text-sm font-medium">Contacto</legend>
                        <BooleanField
                            id="contact_via_whatsapp"
                            name="contact_via_whatsapp"
                            label="WhatsApp"
                            defaultChecked={
                                listing?.contact_via_whatsapp ?? true
                            }
                            error={errors.contact_via_whatsapp}
                        />
                        <BooleanField
                            id="contact_via_phone"
                            name="contact_via_phone"
                            label="Llamada"
                            defaultChecked={listing?.contact_via_phone ?? true}
                            error={errors.contact_via_phone}
                        />
                    </fieldset>

                    <div>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner />}
                            {submitLabel}
                        </Button>
                    </div>
                    </div>
                </div>
            )}
        </Form>
    );
}

function BooleanField({
    id,
    name,
    label,
    defaultChecked,
    error,
}: {
    id: string;
    name: string;
    label: string;
    defaultChecked: boolean;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <div className="flex items-center gap-3">
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
                    className="border-input size-4 rounded-lg border shadow-xs"
                />
                <Label htmlFor={id}>{label}</Label>
            </div>
            <InputError message={error} />
        </div>
    );
}
