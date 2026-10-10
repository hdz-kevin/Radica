import TextLink from '@/components/text-link';
import {
    LegalDocument,
    LegalEmail,
    LegalSection,
    type LegalDetails,
} from '@/components/legal-document';
import { home } from '@/routes';
import { privacy, terms } from '@/routes/legal';

export default function Terms({ legal }: { legal: LegalDetails }) {
    return (
        <LegalDocument
            title="Términos y Condiciones"
            updatedAt={legal.updated_at}
        >
            <p>
                Estos Términos y Condiciones regulan el uso de Radica. Al crear
                una cuenta o usar la plataforma aceptas estos términos y
                nuestro{' '}
                <TextLink href={privacy()}>Aviso de Privacidad</TextLink>. Si no
                estás de acuerdo, por favor no uses Radica. Radica es operada
                por <strong>{legal.owner_name}</strong> (en adelante,
                &quot;Radica&quot;, &quot;nosotros&quot;).
            </p>

            <LegalSection title="1. Qué es Radica">
                <p>
                    Radica es un tablero gratuito de anuncios donde las personas
                    publican cuartos, departamentos y casas en renta, y donde
                    otras personas pueden consultarlos y contactar a quien
                    publica.
                </p>
                <p>
                    Radica <strong>no es una inmobiliaria</strong>, no actúa
                    como intermediario, agente ni representante de nadie y{' '}
                    <strong>no es parte de ningún acuerdo o contrato</strong>{' '}
                    de arrendamiento. No cobramos comisiones, no recibimos
                    pagos, depósitos ni rentas, y no participamos en las
                    negociaciones entre arrendadores e interesados.
                </p>
            </LegalSection>

            <LegalSection title="2. Tu cuenta">
                <ul>
                    <li>Debes tener al menos 18 años para crear una cuenta.</li>
                    <li>
                        La información que proporcionas (nombre, correo y
                        teléfono) debe ser verdadera y estar actualizada.
                    </li>
                    <li>
                        Eres responsable de mantener segura tu contraseña y de
                        toda la actividad que ocurra en tu cuenta. Avísanos si
                        detectas un uso no autorizado.
                    </li>
                    <li>Cada cuenta es personal; no puedes venderla ni cederla.</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Si publicas un anuncio">
                <p>Al publicar declaras y garantizas que:</p>
                <ul>
                    <li>
                        Eres el propietario del inmueble o tienes autorización
                        para ofrecerlo en renta.
                    </li>
                    <li>
                        La información del anuncio (precio, características,
                        servicios incluidos y ubicación) es verdadera y no
                        induce a error.
                    </li>
                    <li>
                        Las fotos corresponden al inmueble anunciado y tienes
                        derecho a usarlas.
                    </li>
                </ul>
                <p>
                    Eres el único responsable del contenido que publicas y de
                    los acuerdos que hagas con los interesados.
                </p>
            </LegalSection>

            <LegalSection title="4. Contenido y conductas prohibidas">
                <p>No está permitido:</p>
                <ul>
                    <li>
                        Publicar inmuebles que no existen, que no están
                        disponibles o sobre los que no tienes derechos, o usar
                        Radica para cometer fraudes.
                    </li>
                    <li>
                        Publicar anuncios discriminatorios, por ejemplo,
                        rechazar a personas por su origen étnico o nacional,
                        género, edad, discapacidad, condición social, religión,
                        preferencias sexuales, estado civil o cualquier otra
                        causa prohibida por el artículo 1 de la Constitución y
                        la Ley Federal para Prevenir y Eliminar la
                        Discriminación.
                    </li>
                    <li>
                        Subir fotos o textos de otras personas sin permiso, o
                        contenido ofensivo, violento, sexual o ilegal.
                    </li>
                    <li>
                        Incluir en los anuncios datos personales de terceros o
                        datos sensibles.
                    </li>
                    <li>
                        Publicar spam, anuncios duplicados o contenido que no
                        sea un inmueble en renta.
                    </li>
                    <li>
                        Usar la información de otros usuarios (por ejemplo, sus
                        teléfonos) para fines distintos a la renta anunciada,
                        como publicidad, acoso o recopilación masiva de datos.
                    </li>
                    <li>
                        Intentar acceder sin autorización a cuentas ajenas o
                        afectar el funcionamiento de la plataforma.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Seguridad y prevención de fraudes">
                <p>
                    Radica <strong>no verifica</strong> la identidad de los
                    usuarios ni la existencia, el estado o la propiedad de los
                    inmuebles anunciados. Te recomendamos:
                </p>
                <ul>
                    <li>
                        No depositar dinero (apartados, anticipos o depósitos)
                        antes de visitar el inmueble y confirmar quién es el
                        propietario.
                    </li>
                    <li>
                        Firmar un contrato de arrendamiento por escrito y pedir
                        recibos de cada pago.
                    </li>
                    <li>
                        Desconfiar de precios demasiado bajos, prisas o
                        presiones para pagar.
                    </li>
                    <li>Hacer las visitas acompañado y en horarios seguros.</li>
                </ul>
                <p>
                    Si detectas un anuncio sospechoso, escríbenos a{' '}
                    <LegalEmail email={legal.contact_email} /> con el enlace
                    del anuncio.
                </p>
            </LegalSection>

            <LegalSection title="6. Moderación">
                <p>
                    Podemos, sin previo aviso, ocultar o eliminar anuncios y
                    suspender o cancelar cuentas que incumplan estos términos,
                    que recibamos como reportados por posible fraude o que
                    pongan en riesgo a otros usuarios o a la plataforma.
                </p>
            </LegalSection>

            <LegalSection title="7. Uso de tu contenido">
                <p>
                    Sigues siendo dueño de los textos y fotos que publicas. Al
                    publicarlos nos das un permiso gratuito y no exclusivo para
                    almacenarlos, mostrarlos y adaptarlos (por ejemplo,
                    cambiarles el tamaño) dentro de Radica, únicamente para
                    operar la plataforma. Este permiso termina cuando borras el
                    anuncio o tu cuenta.
                </p>
            </LegalSection>

            <LegalSection title="8. Limitación de responsabilidad">
                <p>
                    Radica se ofrece &quot;tal cual&quot; y según su
                    disponibilidad, sin garantías de que funcione sin
                    interrupciones o errores. En la medida permitida por la
                    ley, Radica no es responsable de:
                </p>
                <ul>
                    <li>
                        La veracidad de los anuncios ni la conducta de los
                        usuarios, dentro o fuera de la plataforma.
                    </li>
                    <li>
                        Los acuerdos, contratos, pagos, daños o pérdidas que
                        resulten de la relación entre arrendadores e
                        interesados.
                    </li>
                    <li>
                        Interrupciones del servicio o pérdida de información
                        por causas fuera de nuestro control.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="9. Eliminar tu cuenta">
                <p>
                    Puedes eliminar tu cuenta en cualquier momento desde
                    Ajustes &gt; Perfil. Al hacerlo se borran tus datos y tus
                    anuncios de forma permanente, como se explica en el{' '}
                    <TextLink href={privacy()}>Aviso de Privacidad</TextLink>.
                </p>
            </LegalSection>

            <LegalSection title="10. Cambios a estos términos">
                <p>
                    Podemos modificar estos términos para reflejar cambios en
                    Radica o en la ley. La versión vigente siempre estará en{' '}
                    <TextLink href={terms()}>esta página</TextLink> con su
                    fecha de actualización. Si el cambio es importante, te
                    avisaremos dentro de la plataforma o por correo. Si sigues
                    usando Radica después del cambio, se entiende que aceptas
                    la nueva versión.
                </p>
            </LegalSection>

            <LegalSection title="11. Ley aplicable y contacto">
                <p>
                    Estos términos se rigen por las leyes de los Estados Unidos
                    Mexicanos. Para cualquier controversia, las partes se
                    someten a los tribunales competentes de{' '}
                    {legal.jurisdiction}, renunciando a cualquier otro fuero
                    que pudiera corresponderles, salvo que la ley aplicable
                    disponga otra cosa.
                </p>
                <p>
                    Para dudas sobre estos términos escríbenos a{' '}
                    <LegalEmail email={legal.contact_email} />.
                </p>
            </LegalSection>
        </LegalDocument>
    );
}

Terms.layout = {
    breadcrumbs: [
        {
            title: 'Inicio',
            href: home(),
        },
        {
            title: 'Términos y Condiciones',
            href: terms(),
        },
    ],
};
