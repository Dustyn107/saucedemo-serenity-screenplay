import ExcelJS from 'exceljs';
import path from 'path';

/**
 * Genera el archivo data/compras.xlsx con los datos de prueba.
 * Ejecutar con: npm run data:excel
 * Puede editarse luego directamente en Excel agregando más filas.
 */
async function crearExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Compras');

    sheet.columns = [
        { header: 'caso',         key: 'caso',         width: 8 },
        { header: 'usuario',      key: 'usuario',      width: 18 },
        { header: 'clave',        key: 'clave',        width: 14 },
        { header: 'producto',     key: 'producto',     width: 32 },
        { header: 'nombre',       key: 'nombre',       width: 14 },
        { header: 'apellido',     key: 'apellido',     width: 14 },
        { header: 'codigoPostal', key: 'codigoPostal', width: 14 },
        { header: 'mensaje',      key: 'mensaje',      width: 30 },
    ];

    sheet.addRows([
        { caso: 1, usuario: 'standard_user', clave: 'secret_sauce', producto: 'Sauce Labs Backpack',
          nombre: 'Dustyn', apellido: 'Lopez', codigoPostal: '110111', mensaje: 'Thank you for your order!' },
        { caso: 2, usuario: 'standard_user', clave: 'secret_sauce', producto: 'Sauce Labs Bike Light',
          nombre: 'Ana', apellido: 'Gomez', codigoPostal: '050001', mensaje: 'Thank you for your order!' },
    ]);

    sheet.getRow(1).font = { bold: true };

    const destino = path.resolve(__dirname, '..', 'data', 'compras.xlsx');
    await workbook.xlsx.writeFile(destino);
    console.log(`Excel generado en ${destino}`);
}

crearExcel().catch(error => {
    console.error(error);
    process.exit(1);
});
