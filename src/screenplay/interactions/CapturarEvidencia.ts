import { Interaction } from '@serenity-js/core';
import { BrowseTheWeb } from '@serenity-js/web';

import { GestorEvidencias } from '../../utils/GestorEvidencias';

/**
 * Interacción que toma un pantallazo de la página actual y lo agrega al PDF de evidencias
 */
export const CapturarEvidencia = {
    de: (descripcion: string) =>
        Interaction.where(`#actor captura evidencia: ${ descripcion }`, async actor => {
            const pagina = await BrowseTheWeb.as(actor).currentPage();
            const imagenBase64 = await pagina.takeScreenshot();
            GestorEvidencias.agregarCaptura(descripcion, Buffer.from(imagenBase64, 'base64'));
        }),
};
