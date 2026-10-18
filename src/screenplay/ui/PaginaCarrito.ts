import { By, PageElement, PageElements } from '@serenity-js/web';

export const PaginaCarrito = {
    nombresProductos: () =>
        PageElements.located(By.css('[data-test="inventory-item-name"]')).describedAs('productos en el carrito'),

    botonCheckout: () =>
        PageElement.located(By.id('checkout')).describedAs('botón Checkout'),
};
