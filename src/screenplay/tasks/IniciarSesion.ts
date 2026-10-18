import { Answerable, Task } from '@serenity-js/core';
import { Click, Enter, Navigate } from '@serenity-js/web';

import { CapturarEvidencia } from '../interactions/CapturarEvidencia';
import { PaginaLogin } from '../ui/PaginaLogin';

export const IniciarSesion = {
    con: (usuario: Answerable<string>, clave: Answerable<string>) =>
        Task.where(`#actor inicia sesión en SauceDemo`,
            Navigate.to('/'),
            Enter.theValue(usuario).into(PaginaLogin.campoUsuario()),
            Enter.theValue(clave).into(PaginaLogin.campoClave()),
            CapturarEvidencia.de('Ingreso de credenciales'),
            Click.on(PaginaLogin.botonIngresar()),
        ),
};
