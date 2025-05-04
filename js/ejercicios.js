import { CONFIG } from './config1.js';

export class GeneradorEjercicios {
    constructor(data) {
        this.data = data;
    }

    generar(tipo) {
        const plantilla = this.data[tipo].plantilla;
        const params = this._generarParametros(plantilla.parametros);
        
        return {
            enunciado: this._sustituirVariables(plantilla.enunciado, params),
            pasos: plantilla.pasos.map(paso => this._sustituirVariables(paso, params)),
            tipo: tipo,
            params: params
        };
    }

    _generarParametros(esquema) {
        const params = {};
        for (const [param, config] of Object.entries(esquema)) {
            let valor;
            do {
                valor = CONFIG.valoresEnteros[param][
                    Math.floor(Math.random() * CONFIG.valoresEnteros[param].length)
                ];
            } while (
                config.diferenteDe && 
                valor === this._evaluaCondicion(config.diferenteDe, params)
            );
            params[param] = valor;
        }
        return params;
    }

    _evaluaCondicion(condicion, params) {
        const vars = Object.keys(params);
        const valores = Object.values(params);
        return new Function(...vars, `return ${condicion}`)(...valores);
    }

    _sustituirVariables(texto, params) {
        return texto.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key]);
    }
}
