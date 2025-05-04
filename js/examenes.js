import { GeneradorEjercicios } from './ejercicios.js';
import { CONFIG } from './config1.js';

export class GeneradorExamenes {
    constructor(config) {
        this.config = config;
    }

    async crearExamen() {
        const ejerciciosData = await this._cargarEjercicios();
        const generador = new GeneradorEjercicios(ejerciciosData);
        const preguntas = [];

        for (let i = 0; i < this.config.cantidadPreguntasExamen; i++) {
            const tipoAleatorio = this.config.tiposEjercicios[
                Math.floor(Math.random() * this.config.tiposEjercicios.length)
            ];
            preguntas.push(generador.generar(tipoAleatorio));
        }

        return {
            fecha: new Date().toISOString(),
            preguntas: preguntas,
            respuestasCorrectas: preguntas.map(p => this._generarRespuestaCorrecta(p))
        };
    }

    _generarRespuestaCorrecta(pregunta) {
        // Para preguntas de opción múltiple
        if (pregunta.tipo === 'opcion_multiple') {
            return pregunta.respuestaCorrecta;
        }
        // Para ejercicios desarrollados
        return {
            pasos: pregunta.pasos,
            solucionFinal: pregunta.pasos[pregunta.pasos.length - 1]
        };
    }

    calificarExamen(examen, respuestasUsuario) {
        let puntaje = 0;
        const resultados = [];

        examen.preguntas.forEach((pregunta, index) => {
            const esCorrecta = this._evaluarRespuesta(
                pregunta, 
                respuestasUsuario[index]
            );
            if (esCorrecta) puntaje++;
            resultados.push({
                pregunta: pregunta.enunciado,
                correcta: esCorrecta,
                respuestaUsuario: respuestasUsuario[index],
                solucion: pregunta.pasos
            });
        });

        return {
            puntaje,
            porcentaje: (puntaje / examen.preguntas.length) * 100,
            resultados
        };
    }

    _evaluarRespuesta(pregunta, respuestaUsuario) {
        // Lógica de evaluación según tipo de pregunta
        if (pregunta.tipo === 'opcion_multiple') {
            return pregunta.respuestaCorrecta === respuestaUsuario;
        }
        // Para ejercicios desarrollados (comparación simplificada)
        return respuestaUsuario.includes(pregunta.pasos[pregunta.pasos.length - 1]);
    }

    async _cargarEjercicios() {
        try {
            const response = await fetch('../data/ejercicios.json');
            return await response.json();
        } catch (error) {
            console.error("Error cargando ejercicios:", error);
            return {};
        }
    }

        generarInformePDF(resultado) {
        const { puntaje, porcentaje, resultados } = resultado;
        const fecha = new Date().toLocaleString();
        
        // Crear contenido HTML para el PDF
        const contenido = `
            <h1>Resultado de Evaluación</h1>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Puntaje:</strong> ${puntaje}/${resultados.length} (${porcentaje.toFixed(1)}%)</p>
            <h2>Retroalimentación Detallada</h2>
            ${this._generarDetalleResultados(resultados)}
            <style>
                body { font-family: Arial; line-height: 1.6; }
                .pregunta { margin-bottom: 20px; }
                .correcta { color: green; }
                .incorrecta { color: red; }
                table { width: 100%; border-collapse: collapse; }
                td, th { border: 1px solid #ddd; padding: 8px; }
            </style>
        `;

        // Generar PDF (usando jsPDF)
        const doc = new jsPDF();
        doc.fromHTML(contenido, 15, 15, { width: 180 });
        doc.save(`resultado-examen-${fecha.replace(/[/:]/, '-')}.pdf`);
    }

    _generarDetalleResultados(resultados) {
        return resultados.map((r, i) => `
            <div class="pregunta">
                <h3>Pregunta ${i + 1}: ${r.correcta ? '✅' : '❌'}</h3>
                <p><strong>Enunciado:</strong> ${r.pregunta}</p>
                <p class="${r.correcta ? 'correcta' : 'incorrecta'}">
                    <strong>Tu respuesta:</strong> ${r.respuestaUsuario}
                </p>
                ${!r.correcta ? `
                    <p><strong>Solución correcta:</strong></p>
                    <ul>
                        ${r.solucion.map(paso => `<li>${paso}</li>`).join('')}
                    </ul>
                ` : ''}
                <hr>
            </div>
        `).join('');
    }
}
