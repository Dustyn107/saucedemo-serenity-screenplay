import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';

import { CapturarEvidencia } from '../interactions/CapturarEvidencia';
import { PaginaProductos } from '../ui/PaginaProductos';

export const RevisarCarrito = () =>
    Task.where(`#actor revisa el carrito de compras`,
        Click.on(PaginaProductos.iconoCarrito()),
        CapturarEvidencia.de('Carrito de compras'),
    );
