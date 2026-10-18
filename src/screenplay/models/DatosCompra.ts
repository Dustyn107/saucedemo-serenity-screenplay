/**
 * Representa una fila del archivo Excel data/compras.xlsx
 */
export interface DatosCompra {
    caso: string;
    usuario: string;
    clave: string;
    producto: string;
    nombre: string;
    apellido: string;
    codigoPostal: string;
    mensaje: string;
}

/**
 * Estructura del Notepad del actor (memoria del actor durante el escenario)
 */
export interface NotasCompra {
    compra: DatosCompra;
}
