import { Answerable, Task } from '@serenity-js/core';
import { Click, Enter } from '@serenity-js/web';

import { CapturarEvidencia } from '../interactions/CapturarEvidencia';
import { PaginaCarrito } from '../ui/PaginaCarrito';
import { PaginaCheckout } from '../ui/PaginaCheckout';

interface DatosPersonales {
    nombre: Answerable<string>;
    apellido: Answerable<string>;
    codigoPostal: Answerable<string>;
}

export const RealizarPago = {
    con: ({ nombre, apellido, codigoPostal }: DatosPersonales) =>
        Task.where(`#actor realiza el pago de la compra`,
            Click.on(PaginaCarrito.botonCheckout()),

            Enter.theValue(nombre).into(PaginaCheckout.campoNombre()),
            Enter.theValue(apellido).into(PaginaCheckout.campoApellido()),
            Enter.theValue(codigoPostal).into(PaginaCheckout.campoCodigoPostal()),
            CapturarEvidencia.de('Datos personales del comprador'),
            Click.on(PaginaCheckout.botonContinuar()),

            CapturarEvidencia.de('Resumen de la compra'),
            Click.on(PaginaCheckout.botonFinalizar()),
        ),
};
