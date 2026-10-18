import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const CARPETA_EVIDENCIAS = path.resolve(process.cwd(), 'evidencias');

interface Captura {
    descripcion: string;
    imagen: Buffer;
    fecha: Date;
}

interface EvidenciaEscenario {
    nombre: string;
    estado: string;
    inicio: Date;
    capturas: Captura[];
}

const ALTO_IMAGEN = 300;

/**
 * Recolecta las capturas tomadas durante la ejecución y al final genera
 * un único PDF con la evidencia de la ejecución actual.
 */
class Evidencias {
    private escenarios: EvidenciaEscenario[] = [];
    private inicioEjecucion = new Date();

    /**
     * Borra la carpeta de evidencias para que sólo quede el PDF de la ejecución actual
     */
    limpiarCarpeta(): void {
        fs.mkdirSync(CARPETA_EVIDENCIAS, { recursive: true });

        for (const archivo of fs.readdirSync(CARPETA_EVIDENCIAS)) {
            const ruta = path.join(CARPETA_EVIDENCIAS, archivo);
            try {
                fs.rmSync(ruta, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
            }
            catch (error) {
                // En Windows un PDF abierto en un visor queda bloqueado (EBUSY/EPERM): no se detiene la ejecución
                console.warn(`No se pudo borrar ${ archivo } (¿está abierto en otro programa?): ${ (error as Error).message }`);
            }
        }

        this.escenarios = [];
        this.inicioEjecucion = new Date();
    }

    iniciarEscenario(nombre: string): void {
        this.escenarios.push({ nombre, estado: 'EN EJECUCIÓN', inicio: new Date(), capturas: [] });
    }

    agregarCaptura(descripcion: string, imagen: Buffer): void {
        this.escenarioActual().capturas.push({ descripcion, imagen, fecha: new Date() });
    }

    finalizarEscenario(estado: string): void {
        this.escenarioActual().estado = estado;
    }

    async generarPdf(): Promise<string> {
        const archivo = path.join(CARPETA_EVIDENCIAS, `Evidencia_Compra_SauceDemo_${ marcaDeTiempo(this.inicioEjecucion) }.pdf`);
        const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true });
        const escritura = fs.createWriteStream(archivo);
        doc.pipe(escritura);

        this.portada(doc);
        this.escenarios.forEach(escenario => this.detalleEscenario(doc, escenario));
        this.numerarPaginas(doc);

        doc.end();
        await new Promise<void>((resolve, reject) => {
            escritura.on('finish', resolve);
            escritura.on('error', reject);
        });

        return archivo;
    }

    private portada(doc: PDFKit.PDFDocument): void {
        const exitosos = this.escenarios.filter(escenario => escenario.estado === 'PASSED').length;

        doc.fontSize(22).font('Helvetica-Bold').text('Evidencia de Ejecución', { align: 'center' });
        doc.moveDown(0.3);
        doc.fontSize(14).font('Helvetica').text('Compra de productos - SauceDemo', { align: 'center' });
        doc.moveDown(1.5);

        doc.fontSize(11)
            .text('Aplicación: https://www.saucedemo.com/')
            .text('Framework: Serenity/JS (Serenity BDD) + Cucumber + Playwright - patrón Screenplay')
            .text(`Fecha de ejecución: ${ this.inicioEjecucion.toLocaleString('es-CO') }`)
            .text(`Escenarios ejecutados: ${ this.escenarios.length }`)
            .text(`Exitosos: ${ exitosos }   Fallidos: ${ this.escenarios.length - exitosos }`);

        doc.moveDown(1.5);
        doc.fontSize(13).font('Helvetica-Bold').text('Resumen');
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(11);
        this.escenarios.forEach((escenario, indice) => {
            doc.fillColor(colorEstado(escenario.estado))
                .text(`${ indice + 1 }. [${ escenario.estado }] `, { continued: true })
                .fillColor('black')
                .text(escenario.nombre);
        });
    }

    private detalleEscenario(doc: PDFKit.PDFDocument, escenario: EvidenciaEscenario): void {
        doc.addPage();
        doc.fillColor('black').fontSize(15).font('Helvetica-Bold').text(escenario.nombre);
        doc.moveDown(0.3);
        doc.fontSize(11).font('Helvetica')
            .text('Estado: ', { continued: true })
            .fillColor(colorEstado(escenario.estado)).text(escenario.estado)
            .fillColor('black')
            .text(`Inicio: ${ escenario.inicio.toLocaleString('es-CO') }`);
        doc.moveDown();

        const anchoDisponible = doc.page.width - doc.page.margins.left - doc.page.margins.right;

        escenario.capturas.forEach((captura, indice) => {
            if (doc.y + ALTO_IMAGEN + 40 > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
            }
            doc.fontSize(11).font('Helvetica-Bold').fillColor('black')
                .text(`Paso ${ indice + 1 }: ${ captura.descripcion }`, { continued: true })
                .font('Helvetica').fillColor('gray')
                .text(`   (${ captura.fecha.toLocaleTimeString('es-CO') })`)
                .fillColor('black');
            doc.moveDown(0.3);

            const y = doc.y;
            doc.image(captura.imagen, doc.page.margins.left, y, { fit: [ anchoDisponible, ALTO_IMAGEN ], align: 'center' });
            doc.y = y + ALTO_IMAGEN;
            doc.moveDown();
        });
    }

    private numerarPaginas(doc: PDFKit.PDFDocument): void {
        const rango = doc.bufferedPageRange();
        for (let i = rango.start; i < rango.start + rango.count; i++) {
            doc.switchToPage(i);
            const margenInferior = doc.page.margins.bottom;
            doc.page.margins.bottom = 0;
            doc.fontSize(9).fillColor('gray')
                .text(`Página ${ i + 1 } de ${ rango.count }`, 0, doc.page.height - 30, { align: 'center', width: doc.page.width });
            doc.page.margins.bottom = margenInferior;
        }
    }

    private escenarioActual(): EvidenciaEscenario {
        const actual = this.escenarios.at(-1);
        if (! actual) {
            throw new Error('No hay un escenario en ejecución para registrar evidencias');
        }
        return actual;
    }
}

function colorEstado(estado: string): string {
    if (estado === 'PASSED') {
        return 'green';
    }
    return estado === 'FAILED' ? 'red' : 'orange';
}

function marcaDeTiempo(fecha: Date): string {
    const dos = (n: number) => String(n).padStart(2, '0');
    return `${ fecha.getFullYear() }${ dos(fecha.getMonth() + 1) }${ dos(fecha.getDate()) }_${ dos(fecha.getHours()) }${ dos(fecha.getMinutes()) }${ dos(fecha.getSeconds()) }`;
}

export const GestorEvidencias = new Evidencias();
