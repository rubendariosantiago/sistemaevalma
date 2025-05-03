import { GeneradorEjercicios } from './ejercicios.js';
import { cargarEjercicios } from './data-loader.js';
import { CONFIG } from './config1.js';

document.addEventListener('DOMContentLoaded', async () => {
    const ejerciciosData = await cargarEjercicios();
    const generador = new GeneradorEjercicios(ejerciciosData);
    
    document.getElementById('generar-btn').addEventListener('click', () => {
        const tipo = document.getElementById('tipo-ejercicio').value;
        const ejercicio = generador.generar(tipo);
        
        document.getElementById('titulo-ejercicio').textContent = 
            `Ejercicio ${tipo.toUpperCase()}`;
        document.getElementById('enunciado').innerHTML = ejercicio.enunciado;
        
        const solucionHTML = ejercicio.pasos.map((paso, i) => 
            `<div class="paso-solucion"><span>${i+1}.</span> ${paso}</div>`
        ).join('');
        
        document.getElementById('solucion').innerHTML = solucionHTML;
        document.getElementById('solucion').style.display = 'none';
        MathJax.typeset();
    });

    document.getElementById('mostrar-solucion').addEventListener('click', () => {
        const solucion = document.getElementById('solucion');
        solucion.style.display = solucion.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('evaluar-btn').addEventListener('click', () => {
        window.location.href = 'index1.html';
    });
});
