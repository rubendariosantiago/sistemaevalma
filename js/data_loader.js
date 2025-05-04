export async function cargarEjercicios() {
    try {
        const response = await fetch('./data/ejercicios.json');
        if (!response.ok) throw new Error("Error HTTP: " + response.status);
        const data = await response.json();
        
        // Validar estructura básica
        if (!data.tipo1 || !data.tipo2 || !data.tipo3) {
            throw new Error("Estructura de JSON inválida");
        }
        
        return data;
    } catch (error) {
        console.error("Usando datos de respaldo:", error);
        return {
            tipo1: {
                plantilla: {
                    enunciado: "Resolver: $\\frac{dy}{dx} + {{a}}y = {{b}}e^{{{c}}x}$",
                    pasos: [
                        "Paso 1 genérico...",
                        "Paso 2 genérico..."
                    ],
                    parametros: {
                        a: { tipo: "entero" },
                        b: { tipo: "entero" },
                        c: { tipo: "entero", diferenteDe: "-a" }
                    }
                }
            }
            // ... otros tipos básicos
        };
    }
}
