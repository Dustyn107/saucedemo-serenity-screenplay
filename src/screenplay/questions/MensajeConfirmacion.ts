import { Text } from '@serenity-js/web';

import { PaginaCheckout } from '../ui/PaginaCheckout';

export const MensajeConfirmacion = () =>
    Text.of(PaginaCheckout.mensajeConfirmacion()).describedAs('el mensaje de confirmación');
