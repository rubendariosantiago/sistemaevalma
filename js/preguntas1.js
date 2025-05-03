import { GeneradorExamenes } from './examenes.js';
import { CONFIG } from './config1.js';

document.addEventListener('DOMContentLoaded', async () => {
    const generadorExamen = new GeneradorExamenes(CONFIG);
    const examen = generadorExamen.crearExamen();
    
    mostrarPreguntas(examen);
    
    document.getElementById('calificar-btn').addEventListener('click', () => {
        const respuestas = obtenerRespuestasUsuario(examen);
        const resultado = generadorExamen.calificarExamen(examen, respuestas);
        mostrarResultados(resultado);
    });
});

function mostrarPreguntas(examen) {
    const container = document.getElementById('preguntas-container');
    
    examen.preguntas.forEach((pregunta, index) => {
        const preguntaHTML = `
            <div class="pregunta">
                <h3>Pregunta ${index + 1}</h3>
                <div class="enunciado">${pregunta.enunciado}</div>
                <div class="opciones">
                    ${generarOpciones(pregunta, index)}
                </div>
            </div>
        `;
        container.innerHTML += preguntaHTML;
    });
    
    MathJax.typeset();
}

function generarOpciones(pregunta, index) {
    if (pregunta.tipo === 'opcion_multiple') {
        return Object.entries(pregunta.opciones).map(([key, value]) => `
            <label>
                <input type="radio" name="pregunta-${index}" value="${key}">
                ${value}
            </label>
        `).join('');
    }
    // Para otros tipos de preguntas
    return `<input type="text" name="pregunta-${index}" placeholder="Ingrese su respuesta">`;
}
