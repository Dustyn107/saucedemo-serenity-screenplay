import { Answerable, Task } from '@serenity-js/core';
import { Ensure, isPresent } from '@serenity-js/assertions';
import { Click, isVisible } from '@serenity-js/web';

import { CapturarEvidencia } from '../interactions/CapturarEvidencia';
import { PaginaProductos } from '../ui/PaginaProductos';

export const AgregarProducto = {
    alCarrito: (producto: Answerable<string>) =>
        Task.where(`#actor agrega el producto al carrito`,
            Ensure.that(PaginaProductos.tarjetaProducto(producto), isPresent()),
            Click.on(PaginaProductos.botonAgregar(producto)),
            Ensure.eventually(PaginaProductos.contadorCarrito(), isVisible()),
            CapturarEvidencia.de('Producto agregado al carrito'),
        ),
};
