import { GeneradorExamenes } from './examenes.js';
import { CONFIG } from './config1.js';

document.addEventListener('DOMContentLoaded', async () => {
    const generadorExamen = new GeneradorExamenes(CONFIG);
    const examen = await generadorExamen.crearExamen();
    
    mostrarPreguntas(examen);
    
    document.getElementById('calificar-btn').addEventListener('click', () => {
        const respuestas = obtenerRespuestasUsuario(examen);
        const resultado = generadorExamen.calificarExamen(examen, respuestas);
        mostrarResultados(resultado);
        
        // Nuevo: Evento para generar PDF
        document.getElementById('generar-pdf').addEventListener('click', () => {
            generadorExamen.generarInformePDF(resultado);
        });
    });
});

function mostrarResultados(resultado) {
    const container = document.getElementById('resultados-detalle');
    const porcentaje = resultado.porcentaje.toFixed(1);
    
    let html = `
        <div class="resumen">
            <h3>Resumen: ${resultado.puntaje}/${resultado.resultados.length} (${porcentaje}%)</h3>
            <p>${obtenerRetroalimentacionGeneral(porcentaje)}</p>
        </div>
    `;
    
    resultado.resultados.forEach((r, i) => {
        html += `
            <div class="resultado-pregunta ${r.correcta ? 'correcta' : 'incorrecta'}">
                <h4>Pregunta ${i + 1}: ${r.correcta ? 'Correcta' : 'Incorrecta'}</h4>
                <p>${r.pregunta}</p>
                ${!r.correcta ? `
                    <div class="retroalimentacion">
                        <p><strong>Tu respuesta:</strong> ${r.respuestaUsuario}</p>
                        <p><strong>Solución correcta:</strong></p>
                        <ul>
                            ${r.solucion.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
    document.getElementById('resultados').style.display = 'block';
    MathJax.typeset();
});

function obtenerRetroalimentacionGeneral(porcentaje) {
    const pct = parseFloat(porcentaje);
    if (pct >= 90) return "¡Excelente trabajo! Dominas completamente los conceptos.";
    if (pct >= 70) return "Buen trabajo, pero hay algunos conceptos que necesitas reforzar.";
    if (pct >= 50) return "Has aprobado, pero te recomendamos revisar los temas nuevamente.";
    return "Necesitas repasar los conceptos fundamentales. Te sugerimos practicar más ejercicios.";
}
