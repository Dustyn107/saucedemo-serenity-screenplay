import { By, PageElement } from '@serenity-js/web';

export const PaginaLogin = {
    campoUsuario: () =>
        PageElement.located(By.id('user-name')).describedAs('campo usuario'),

    campoClave: () =>
        PageElement.located(By.id('password')).describedAs('campo contraseña'),

    botonIngresar: () =>
        PageElement.located(By.id('login-button')).describedAs('botón Login'),
};
