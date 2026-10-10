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
import { login } from '@/routes';
import { privacy, terms } from '@/routes/legal';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <div className="flex flex-col gap-6">
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
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
                noValidate
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Crea una contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Repite tu contraseña"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-start gap-2.5">
                                    <Checkbox
                                        id="terms"
                                        name="terms"
                                        required
                                        tabIndex={5}
                                        className="mt-0.5"
                                    />
                                    <Label
                                        htmlFor="terms"
                                        className="text-muted-foreground block text-[13px] leading-5 font-normal lg:text-sm"
                                    >
                                        Acepto los{' '}
                                        <a
                                            href={terms.url()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground underline underline-offset-4"
                                        >
                                            Términos
                                        </a>{' '}
                                        y el{' '}
                                        <a
                                            href={privacy.url()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground underline underline-offset-4"
                                        >
                                            Aviso de Privacidad
                                        </a>
                                    </Label>
                                </div>
                                <InputError message={errors.terms} />
                            </div>

                            <Button
                                size="lg"
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </div>

                        <div className="text-muted-foreground text-center text-sm lg:text-base">
                            Ya tienes una cuenta?{' '}
                            <TextLink href={login()} tabIndex={7}>
                                Iniciar sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Crear cuenta',
    description: 'Puedes registrarte con tu cuenta de google o ingresando tus datos en el formulario',
};
