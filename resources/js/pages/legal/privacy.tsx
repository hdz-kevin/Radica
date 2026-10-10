import TextLink from '@/components/text-link';
import {
    LegalDocument,
    LegalEmail,
    LegalSection,
    type LegalDetails,
} from '@/components/legal-document';
import { home } from '@/routes';
import { privacy, terms } from '@/routes/legal';
import { edit as profile } from '@/routes/profile';
import { mine } from '@/routes/listings';

export default function Privacy({ legal }: { legal: LegalDetails }) {
    return (
        <LegalDocument title="Aviso de Privacidad" updatedAt={legal.updated_at}>
            <p>
                Este Aviso de Privacidad explica cómo Radica recaba, usa y
                protege tus datos personales, conforme a la Ley Federal de
                Protección de Datos Personales en Posesión de los Particulares
                (LFPDPPP) y demás normativa aplicable en México.
            </p>

            <LegalSection title="1. Responsable de tus datos">
                <p>
                    El responsable del tratamiento de tus datos personales es{' '}
                    <strong>{legal.owner_name}</strong>, persona física, con
                    domicilio para oír y recibir notificaciones en{' '}
                    {legal.jurisdiction}. Para cualquier asunto
                    relacionado con tus datos puedes escribir a{' '}
                    <LegalEmail email={legal.contact_email} />.
                </p>
            </LegalSection>

            <LegalSection title="2. Datos personales que recabamos">
                <p>Recabamos únicamente los datos que tú nos proporcionas o que se generan al usar Radica:</p>
                <ul>
                    <li>
                        <strong>Datos de cuenta:</strong> nombre, correo
                        electrónico y contraseña (guardada cifrada; nadie puede
                        leerla). Si entras con Google, recibimos tu nombre,
                        correo y un identificador de tu cuenta de Google. No
                        recibimos tu contraseña de Google.
                    </li>
                    <li>
                        <strong>Datos de contacto:</strong> número de teléfono,
                        si decides agregarlo en tu perfil. Es necesario para
                        publicar un anuncio.
                    </li>
                    <li>
                        <strong>Datos de tus publicaciones:</strong> tipo de
                        inmueble, título, descripción, precio, características,
                        zona o colonia, dirección (opcional) y fotografías.
                    </li>
                    <li>
                        <strong>Actividad en la plataforma:</strong> las
                        publicaciones que guardas en favoritos.
                    </li>
                    <li>
                        <strong>Datos técnicos:</strong> dirección IP, tipo de
                        navegador y datos de sesión, necesarios para mantener tu
                        sesión iniciada y proteger la plataforma.
                    </li>
                </ul>
                <p>
                    No recabamos datos personales sensibles (como salud,
                    religión u origen étnico) ni datos financieros o bancarios.
                    Te pedimos no incluir este tipo de información en tus
                    publicaciones.
                </p>
            </LegalSection>

            <LegalSection title="3. Para qué usamos tus datos">
                <p>Usamos tus datos para las siguientes finalidades, que son necesarias para darte el servicio:</p>
                <ul>
                    <li>Crear y administrar tu cuenta y permitirte iniciar sesión.</li>
                    <li>Publicar, mostrar, editar y ocultar tus anuncios de renta.</li>
                    <li>
                        Mostrar tu teléfono a usuarios con una cuenta creada en Radica que
                        quieran contactarte por llamada o WhatsApp sobre tus
                        anuncios.
                    </li>
                    <li>Guardar tus publicaciones favoritas.</li>
                    <li>
                        Enviarte correos necesarios para el servicio, como la
                        verificación de tu correo o el restablecimiento de tu
                        contraseña.
                    </li>
                    <li>
                        Prevenir fraudes, abusos y usos indebidos, y mantener la
                        seguridad de la plataforma.
                    </li>
                    <li>Atender tus solicitudes, dudas y reportes.</li>
                </ul>
                <p>
                    No usamos tus datos para finalidades secundarias: no te
                    enviamos publicidad, no hacemos perfiles comerciales y no
                    vendemos ni rentamos tus datos. Si en el futuro quisiéramos
                    usarlos para algo distinto, actualizaremos este aviso y te
                    pediremos tu consentimiento cuando la ley lo exija.
                </p>
            </LegalSection>

            <LegalSection title="4. Qué información es pública">
                <p>
                    Radica es un catálogo de anuncios, por lo que parte de la
                    información que publicas está a la vista de otras personas:
                </p>
                <ul>
                    <li>
                        <strong>Visible para cualquier persona:</strong> el
                        título, la descripción, el precio, las características,
                        las fotos, la zona o colonia y, solo si la escribes, la
                        dirección del inmueble.
                    </li>
                    <li>
                        <strong>Visible solo para usuarios con una cuenta en Radica:
                        </strong> tu número de teléfono, en los
                        anuncios donde elijas recibir llamadas o mensajes de
                        WhatsApp.
                    </li>
                    <li>
                        <strong>Nunca público:</strong> tu correo electrónico,
                        tu contraseña y tus favoritos.
                    </li>
                </ul>
                <p>
                    Ten en cuenta que, una vez que otra persona ve o copia tu
                    información pública, Radica no puede controlar lo que haga
                    con ella. Publica solo lo que estés de acuerdo en compartir.
                </p>
            </LegalSection>

            <LegalSection title="5. Con quién compartimos tus datos">
                <p>
                    Para operar Radica nos apoyamos en proveedores que tratan
                    datos por cuenta nuestra (encargados), únicamente para
                    prestarnos su servicio:
                </p>
                <ul>
                    <li>
                        <strong>Proveedor de hospedaje y almacenamiento:</strong>{' '}
                        servidores donde viven la aplicación, la base de datos y
                        las fotos de los anuncios.
                    </li>
                    <li>
                        <strong>Proveedor de correo electrónico:</strong> para
                        enviarte los correos del servicio.
                    </li>
                    <li>
                        <strong>Google:</strong> solo si eliges iniciar sesión
                        con Google, para confirmar tu correo electrónico.
                    </li>
                </ul>
                <p>
                    Algunos de estos proveedores pueden estar fuera de México.
                    Fuera de estos casos, solo compartiremos tus datos cuando
                    una autoridad competente lo requiera conforme a la ley.
                </p>
            </LegalSection>

            <LegalSection title="6. Tus derechos ARCO">
                <p>
                    Tienes derecho a <strong>Acceder</strong> a tus datos,{' '}
                    <strong>Rectificarlos</strong> si son inexactos,{' '}
                    <strong>Cancelarlos</strong> (pedir que los eliminemos) y{' '}
                    <strong>Oponerte</strong> a su uso para fines específicos.
                    También puedes revocar el consentimiento que nos diste.
                </p>
                <p>
                    Puedes hacerlo de dos formas:
                </p>
                <ul>
                    <li>
                        <strong>Directamente en Radica:</strong> en{' '}
                        <TextLink href={profile()}>Ajustes &gt; Perfil</TextLink>{' '}
                        puedes corregir tu nombre, correo y teléfono, y eliminar
                        tu cuenta de forma permanente. Tus anuncios se pueden
                        editar, ocultar o borrar desde <TextLink href={mine()}>Mis publicaciones</TextLink>.
                    </li>
                    <li>
                        <strong>Por correo:</strong> escribe a{' '}
                        <LegalEmail email={legal.contact_email} /> indicando tu
                        nombre, el correo de tu cuenta, el derecho que quieres
                        ejercer y una descripción clara de tu solicitud.
                        Podremos pedirte información adicional para confirmar
                        que eres el titular de la cuenta.
                    </li>
                </ul>
                <p>
                    Responderemos en un plazo máximo de 20 días hábiles y, si la
                    solicitud procede, la haremos efectiva dentro de los 15 días
                    hábiles siguientes. Si consideras que no atendimos tu
                    solicitud correctamente, puedes acudir a la autoridad
                    encargada de la protección de datos personales en México.
                </p>
            </LegalSection>

            <LegalSection title="7. Cuánto tiempo guardamos tus datos">
                <p>
                    Conservamos tus datos mientras tu cuenta exista. Cuando
                    eliminas tu cuenta, borramos tus datos de cuenta, tus
                    publicaciones, sus fotos y tus favoritos.
                    Podemos conservar registros técnicos
                    por un tiempo limitado cuando sea necesario por seguridad o
                    para cumplir obligaciones legales.
                </p>
            </LegalSection>

            <LegalSection title="8. Cookies">
                <p>
                    Radica usa únicamente cookies técnicas, necesarias para que
                    puedas iniciar sesión, mantener tu sesión abierta,
                    recordar tu preferencia de tema (claro u oscuro) y proteger
                    los formularios contra ataques. No usamos cookies de
                    publicidad ni herramientas de rastreo o analítica de
                    terceros.
                </p>
            </LegalSection>

            <LegalSection title="9. Seguridad">
                <p>
                    Aplicamos medidas razonables para proteger tus datos, como
                    conexiones cifradas (HTTPS), contraseñas cifradas y acceso
                    restringido a la base de datos. Ningún sistema es
                    completamente infalible; si ocurre una vulneración que
                    afecte tus derechos de forma significativa, te lo
                    informaremos.
                </p>
            </LegalSection>

            <LegalSection title="10. Menores de edad">
                <p>
                    Radica está dirigida a personas mayores de 18 años. No
                    recabamos intencionalmente datos de menores de edad. Si
                    detectamos una cuenta de un menor, la eliminaremos.
                </p>
            </LegalSection>

            <LegalSection title="11. Cambios a este aviso">
                <p>
                    Podemos actualizar este Aviso de Privacidad. La versión
                    vigente siempre estará en{' '}
                    <TextLink href={privacy()}>esta página</TextLink>, con su
                    fecha de última actualización. Si el cambio es importante,
                    también te avisaremos dentro de la plataforma o por correo.
                </p>
                <p>
                    Al crear una cuenta confirmas que leíste este aviso y los{' '}
                    <TextLink href={terms()}>Términos y Condiciones</TextLink>.{' '}
                    <TextLink href={home()}>Volver al inicio</TextLink>.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}

Privacy.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Aviso de Privacidad',
            href: privacy(),
        },
    ],
};
