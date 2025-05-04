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
}
