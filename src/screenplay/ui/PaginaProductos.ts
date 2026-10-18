import { Answerable } from '@serenity-js/core';
import { equals } from '@serenity-js/assertions';
import { By, PageElement, PageElements, Text } from '@serenity-js/web';

export const PaginaProductos = {
    titulo: () =>
        PageElement.located(By.css('[data-test="title"]')).describedAs('título de la página'),

    tarjetaProducto: (nombre: Answerable<string>) =>
        PageElements.located(By.css('[data-test="inventory-item"]'))
            .where(Text.of(PageElement.located(By.css('[data-test="inventory-item-name"]'))), equals(nombre))
            .first()
            .describedAs(`tarjeta del producto`),

    botonAgregar: (nombre: Answerable<string>) =>
        PageElement.located(By.css('button'))
            .of(PaginaProductos.tarjetaProducto(nombre))
            .describedAs('botón Add to cart'),

    iconoCarrito: () =>
        PageElement.located(By.css('[data-test="shopping-cart-link"]')).describedAs('icono del carrito'),

    contadorCarrito: () =>
        PageElement.located(By.css('[data-test="shopping-cart-badge"]')).describedAs('contador del carrito'),
};
