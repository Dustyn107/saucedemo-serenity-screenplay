import { Given, Then, When } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight, notes } from '@serenity-js/core';
import { contain, Ensure, equals } from '@serenity-js/assertions';

import { NotasCompra } from '../../src/screenplay/models/DatosCompra';
import { CapturarEvidencia } from '../../src/screenplay/interactions/CapturarEvidencia';
import { AgregarProducto } from '../../src/screenplay/tasks/AgregarProducto';
import { IniciarSesion } from '../../src/screenplay/tasks/IniciarSesion';
import { RealizarPago } from '../../src/screenplay/tasks/RealizarPago';
import { RevisarCarrito } from '../../src/screenplay/tasks/RevisarCarrito';
import { MensajeConfirmacion } from '../../src/screenplay/questions/MensajeConfirmacion';
import { ProductosEnCarrito } from '../../src/screenplay/questions/ProductosEnCarrito';
import { obtenerDatosCompra } from '../../src/utils/LectorExcel';

const compra = () => notes<NotasCompra>().get('compra');

Given('que {string} tiene los datos de compra del caso {int} del archivo {string}',
    async (nombreActor: string, caso: number, archivo: string) => {
        const datos = await obtenerDatosCompra(archivo, String(caso));

        await actorCalled(nombreActor).attemptsTo(
            notes<NotasCompra>().set('compra', datos),
        );
    });

Given('que ha iniciado sesión en SauceDemo', async () =>
    actorInTheSpotlight().attemptsTo(
        IniciarSesion.con(compra().usuario, compra().clave),
    ));

When('agrega el producto al carrito', async () =>
    actorInTheSpotlight().attemptsTo(
        AgregarProducto.alCarrito(compra().producto),
    ));

When('verifica que el producto se encuentre en el carrito', async () =>
    actorInTheSpotlight().attemptsTo(
        RevisarCarrito(),
        Ensure.that(ProductosEnCarrito(), contain(compra().producto)),
    ));

When('completa el pago con sus datos personales', async () =>
    actorInTheSpotlight().attemptsTo(
        RealizarPago.con({
            nombre: compra().nombre,
            apellido: compra().apellido,
            codigoPostal: compra().codigoPostal,
        }),
    ));

Then('debería ver el mensaje de confirmación de la compra', async () =>
    actorInTheSpotlight().attemptsTo(
        Ensure.eventually(MensajeConfirmacion(), equals(compra().mensaje)),
        CapturarEvidencia.de('Confirmación de la compra'),
    ));
