import { By, PageElement, PageElements } from '@serenity-js/web';

export const PaginaCheckout = {
    campoNombre: () =>
        PageElement.located(By.id('first-name')).describedAs('campo nombre'),

    campoApellido: () =>
        PageElement.located(By.id('last-name')).describedAs('campo apellido'),

    campoCodigoPostal: () =>
        PageElement.located(By.id('postal-code')).describedAs('campo código postal'),

    botonContinuar: () =>
        PageElement.located(By.id('continue')).describedAs('botón Continue'),

    productosResumen: () =>
        PageElements.located(By.css('[data-test="inventory-item-name"]')).describedAs('productos del resumen'),

    totalCompra: () =>
        PageElement.located(By.css('[data-test="total-label"]')).describedAs('total de la compra'),

    botonFinalizar: () =>
        PageElement.located(By.id('finish')).describedAs('botón Finish'),

    mensajeConfirmacion: () =>
        PageElement.located(By.css('[data-test="complete-header"]')).describedAs('mensaje de confirmación'),
};
