import { Form, Head } from '@inertiajs/react';
import { GoogleAuthButton } from '@/components/google-auth-button';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    error?: string;
    canResetPassword: boolean;
};

export default function Login({ status, error, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <div className="flex flex-col gap-6">
                {status && (
                    <div className="text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                {error && (
                    <div className="text-center text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                <GoogleAuthButton />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-background text-muted-foreground px-2">
                            o
                        </span>
                    </div>
                </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Correo electrónico"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-[14px] lg:text-sm"
                                            tabIndex={5}
                                        >
                                            Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Recordarme</Label>
                            </div>

                            <Button
                                size="lg"
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm lg:text-base">
                            No tienes una cuenta?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Crear cuenta
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
            </div>
        </>
    );
}

Login.layout = {
    title: 'Iniciar sesión',
    description: 'Continúa con tu cuenta de google o ingresa tu correo y contraseña',
};
