import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

import { DatosCompra } from '../screenplay/models/DatosCompra';

const CARPETA_DATOS = path.resolve(process.cwd(), 'data');

/**
 * Lee la hoja indicada de un archivo Excel y devuelve cada fila como un objeto
 * cuyas llaves son los encabezados de la primera fila.
 */
export async function leerFilas(archivo: string, hoja?: string): Promise<Array<Record<string, string>>> {
    const ruta = path.resolve(CARPETA_DATOS, archivo);
    if (! fs.existsSync(ruta)) {
        throw new Error(`No se encontró el archivo de datos: ${ ruta }`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(ruta);

    const sheet = hoja ? workbook.getWorksheet(hoja) : workbook.worksheets[0];
    if (! sheet) {
        throw new Error(`No se encontró la hoja "${ hoja }" en ${ archivo }`);
    }

    const encabezados: string[] = [];
    sheet.getRow(1).eachCell((celda, columna) => {
        encabezados[columna] = celda.text.trim();
    });

    const filas: Array<Record<string, string>> = [];
    sheet.eachRow((fila, numero) => {
        if (numero === 1) {
            return;
        }
        const registro: Record<string, string> = {};
        encabezados.forEach((encabezado, columna) => {
            if (encabezado) {
                registro[encabezado] = fila.getCell(columna).text.trim();
            }
        });
        filas.push(registro);
    });

    return filas;
}

/**
 * Obtiene los datos de compra del caso indicado (columna "caso" del Excel)
 */
export async function obtenerDatosCompra(archivo: string, caso: string): Promise<DatosCompra> {
    const filas = await leerFilas(archivo);
    const fila = filas.find(registro => registro.caso === String(caso));

    if (! fila) {
        throw new Error(`No existe el caso ${ caso } en el archivo ${ archivo }`);
    }

    return fila as unknown as DatosCompra;
}
