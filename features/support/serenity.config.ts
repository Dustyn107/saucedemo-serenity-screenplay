import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber';
import { ArtifactArchiver, Cast, configure, Duration, TakeNotes } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import { Photographer, TakePhotosOfInteractions } from '@serenity-js/web';
import * as playwright from 'playwright';

import { GestorEvidencias } from '../../src/utils/GestorEvidencias';

const URL_BASE = 'https://www.saucedemo.com';
const TIEMPO_MAXIMO = Duration.ofSeconds(30);

setDefaultTimeout(TIEMPO_MAXIMO.inMilliseconds());

let navegador: playwright.Browser;

BeforeAll(async () => {
    // Cada ejecución borra la evidencia anterior: sólo queda el PDF de la ejecución actual
    GestorEvidencias.limpiarCarpeta();

    // HEADLESS=false muestra el navegador; SLOW_MO (ms) hace pausas entre acciones para poder seguirlas
    navegador = await playwright.chromium.launch({
        headless: process.env.HEADLESS !== 'false',
        slowMo: Number(process.env.SLOW_MO ?? 0),
    });

    configure({
        actors: Cast.where(actor => actor.whoCan(
            BrowseTheWebWithPlaywright.using(navegador, {
                baseURL: URL_BASE,
                viewport: { width: 1280, height: 720 },
            }, {
                defaultNavigationTimeout: TIEMPO_MAXIMO.inMilliseconds(),
                defaultTimeout: Duration.ofSeconds(10).inMilliseconds(),
            }),
            TakeNotes.usingAnEmptyNotepad(),
        )),
        crew: [
            ArtifactArchiver.storingArtifactsAt(process.cwd(), 'target/site/serenity'),
            SerenityBDDReporter.fromJSON({ specDirectory: './features' }),
            ConsoleReporter.fromJSON({ theme: 'auto' }),
            Photographer.whoWill(TakePhotosOfInteractions),
        ],
    });
});

Before(({ pickle }) => {
    GestorEvidencias.iniciarEscenario(pickle.name);
});

After(({ result }) => {
    GestorEvidencias.finalizarEscenario(result?.status ?? 'UNKNOWN');
});

AfterAll(async () => {
    const pdf = await GestorEvidencias.generarPdf();
    console.log(`\nEvidencia PDF generada: ${ pdf }\n`);

    await navegador?.close();
});
