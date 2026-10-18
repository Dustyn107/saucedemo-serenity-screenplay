import { Text } from '@serenity-js/web';

import { PaginaCarrito } from '../ui/PaginaCarrito';

export const ProductosEnCarrito = () =>
    Text.ofAll(PaginaCarrito.nombresProductos()).describedAs('los productos del carrito');
