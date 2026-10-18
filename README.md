# Automatización de compras en SauceDemo

Proyecto de automatización de pruebas E2E sobre [SauceDemo](https://www.saucedemo.com/) que realiza la
compra de productos usando:

- **Serenity/JS** (Serenity BDD para TypeScript) con el patrón de diseño **Screenplay**
- **Cucumber** con escenarios escritos en **Gherkin en español**
- **Playwright** como motor del navegador (Chromium)
- **Excel** como fuente de datos de prueba (`exceljs`)
- **PDF** de evidencias generado en cada ejecución (`pdfkit`)

---

## Tabla de contenido

1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Ejecución](#ejecución)
4. [Resultados de la ejecución](#resultados-de-la-ejecución)
5. [Datos de prueba (Excel)](#datos-de-prueba-excel)
6. [Escenario Gherkin](#escenario-gherkin)
7. [Patrón Screenplay](#patrón-screenplay)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Solución de problemas](#solución-de-problemas)

---

## Requisitos

| Herramienta | Versión | Uso |
|---|---|---|
| Node.js | 18 o superior | Ejecutar el proyecto |
| npm | 9 o superior | Gestionar dependencias |
| Java | 17 o superior | Sólo para generar el reporte HTML de Serenity BDD |

## Instalación

```bash
npm install
npx playwright install chromium
```

`npm install` también descarga automáticamente el CLI de Serenity BDD (script `postinstall`).

## Ejecución

Las pruebas se pueden ejecutar **sin ver el navegador** (headless) o **viendo el navegador**:

| Comando | Navegador | Qué hace |
|---|---|---|
| `npm test` | Oculto | Limpia, ejecuta las pruebas, genera el PDF y el reporte de Serenity BDD |
| `npm run test:headed` | Visible | Limpia, ejecuta las pruebas, genera el PDF y el reporte de Serenity BDD |
| `npm run test:execute` | Oculto | Sólo ejecuta las pruebas y genera el PDF |
| `npm run test:execute:headed` | Visible | Sólo ejecuta las pruebas y genera el PDF |
| `npm run test:report` | — | Genera el reporte de Serenity BDD de la última ejecución |
| `npm run data:excel` | — | Regenera `data/compras.xlsx` con los datos de ejemplo |
| `npm run lint:types` | — | Verifica los tipos de TypeScript |

Los comandos funcionan igual en PowerShell, CMD y Git Bash (las variables se definen con `cross-env`).

### Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `HEADLESS` | `true` | `false` muestra el navegador |
| `SLOW_MO` | `0` | Milisegundos de pausa entre acciones (el modo visible usa `300`) |

## Resultados de la ejecución

### PDF de evidencias

Se genera en `evidencias/Evidencia_Compra_SauceDemo_<AAAAMMDD_HHMMSS>.pdf` y contiene:

- **Portada:** fecha, cantidad de escenarios ejecutados, exitosos/fallidos y resumen por escenario.
- **Una sección por escenario** con su estado y los pantallazos de cada paso:
  1. Ingreso de credenciales
  2. Producto agregado al carrito
  3. Carrito de compras
  4. Datos personales del comprador
  5. Resumen de la compra
  6. Confirmación de la compra

Al iniciar cada ejecución se borra el contenido de la carpeta `evidencias/`, de modo que **sólo queda el PDF
de la ejecución actual**.

### Reporte de Serenity BDD

Con `npm test` o `npm run test:headed` se genera el reporte HTML en `target/site/serenity/index.html`.

## Datos de prueba (Excel)

Archivo: `data/compras.xlsx` (se usa la primera hoja). La primera fila contiene los encabezados:

| caso | usuario | clave | producto | nombre | apellido | codigoPostal | mensaje |
|---|---|---|---|---|---|---|---|
| 1 | standard_user | secret_sauce | Sauce Labs Backpack | Dustyn | Lopez | 110111 | Thank you for your order! |
| 2 | standard_user | secret_sauce | Sauce Labs Bike Light | Ana | Gomez | 050001 | Thank you for your order! |

### Agregar una nueva compra

1. Agrega una fila en `data/compras.xlsx` con un número de `caso` nuevo.
   El nombre del `producto` debe coincidir exactamente con el que aparece en SauceDemo.
2. Agrega ese número en la tabla `Ejemplos` de `features/compra_producto.feature`:

```gherkin
    Ejemplos:
      | caso |
      | 1    |
      | 2    |
      | 3    |
```

## Escenario Gherkin

`features/compra_producto.feature`

```gherkin
# language: es
Característica: Compra de productos en SauceDemo

  @compra
  Esquema del escenario: Compra exitosa de un producto - caso <caso> del Excel
    Dado que "Dustyn" tiene los datos de compra del caso <caso> del archivo "compras.xlsx"
    Y que ha iniciado sesión en SauceDemo
    Cuando agrega el producto al carrito
    Y verifica que el producto se encuentre en el carrito
    Y completa el pago con sus datos personales
    Entonces debería ver el mensaje de confirmación de la compra
```

## Patrón Screenplay

En Screenplay un **actor** con **habilidades** realiza **tareas**, compuestas por **interacciones**, y
responde **preguntas** sobre el estado de la aplicación.

| Elemento | Implementación en el proyecto |
|---|---|
| Actor | `Dustyn`, creado con `actorCalled()` |
| Habilidades | `BrowseTheWebWithPlaywright` (navegar) y `TakeNotes` (recordar los datos del Excel) |
| Tareas | `IniciarSesion`, `AgregarProducto`, `RevisarCarrito`, `RealizarPago` |
| Interacciones | `Navigate`, `Enter`, `Click` (Serenity/JS) y `CapturarEvidencia` (propia) |
| Preguntas | `ProductosEnCarrito`, `MensajeConfirmacion` |
| UI (localizadores) | `PaginaLogin`, `PaginaProductos`, `PaginaCarrito`, `PaginaCheckout` |

Flujo de un escenario:

```
Excel ──► LectorExcel ──► Notepad del actor
                               │
Actor ──► IniciarSesion ──► AgregarProducto ──► RevisarCarrito ──► RealizarPago
                │                 │                  │                  │
                └────── CapturarEvidencia (pantallazos) ────────────────┘
                                         │
                                  GestorEvidencias ──► PDF
```

## Estructura del proyecto

```
├── cucumber.js                          Configuración de Cucumber
├── data/
│   └── compras.xlsx                     Datos de prueba
├── evidencias/                          PDF de la ejecución actual (se regenera)
├── features/
│   ├── compra_producto.feature          Escenarios Gherkin
│   ├── step-definitions/
│   │   └── compra.steps.ts              Pasos: conectan Gherkin con el actor y sus tareas
│   └── support/
│       └── serenity.config.ts           Navegador, reportes y hooks de evidencias
├── scripts/
│   └── crear-excel.ts                   Generador del Excel de ejemplo
├── src/
│   ├── screenplay/
│   │   ├── interactions/
│   │   │   └── CapturarEvidencia.ts
│   │   ├── models/
│   │   │   └── DatosCompra.ts
│   │   ├── questions/
│   │   │   ├── MensajeConfirmacion.ts
│   │   │   └── ProductosEnCarrito.ts
│   │   ├── tasks/
│   │   │   ├── AgregarProducto.ts
│   │   │   ├── IniciarSesion.ts
│   │   │   ├── RealizarPago.ts
│   │   │   └── RevisarCarrito.ts
│   │   └── ui/
│   │       ├── PaginaCarrito.ts
│   │       ├── PaginaCheckout.ts
│   │       ├── PaginaLogin.ts
│   │       └── PaginaProductos.ts
│   └── utils/
│       ├── GestorEvidencias.ts          Limpieza de evidencias y generación del PDF
│       └── LectorExcel.ts               Lectura del archivo Excel
├── target/site/serenity/                Reporte de Serenity BDD (se regenera)
├── package.json
└── tsconfig.json
```

## Solución de problemas

| Problema | Causa / solución |
|---|---|
| Aviso `No se pudo borrar ... (¿está abierto en otro programa?)` | El PDF anterior está abierto en un visor y Windows lo bloquea. Ciérralo; se borrará en la siguiente ejecución. Las pruebas se ejecutan igual. |
| `browserType.launch: Executable doesn't exist` | Falta el navegador: ejecuta `npx playwright install chromium`. |
| El reporte de Serenity BDD no se genera | Verifica que Java 17+ esté instalado (`java -version`). |
| `No existe el caso X en el archivo compras.xlsx` | El número de la tabla `Ejemplos` no está en la columna `caso` del Excel. |
| No encuentra el producto en la página | El nombre en la columna `producto` no coincide exactamente con el de SauceDemo. |
