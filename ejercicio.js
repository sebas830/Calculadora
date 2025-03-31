const palabrasReservadas = new Set(["int", "float", "if", "while", "return", "string", "void"]);
const operadores = new Set(["+", "-", "*", "/", "=", ">", "<", "=="]);
const delimitadores = new Set([";", "{", "}", "(", ")"]);

function analizarCodigo(codigo) {
    const patronTokens = /(".*?"|\b\d+\.\d+\b|\b\d+\b|\b[a-zA-Z_]\w*\b|[+\-*/=<>!]=?|[;{}()])/g;
    let coincidencias = [...codigo.matchAll(patronTokens)];
    let listaTokens = [];
    let tablaSimbolos = {};
    let numeroLinea = 1;
    let tipoActual = null;

    let posicionActual = 0;

    for (let coincidencia of coincidencias) {
        let token = coincidencia[0];
        let tipoToken;

        let antesDelToken = codigo.substring(posicionActual, coincidencia.index);
        numeroLinea += (antesDelToken.match(/\n/g) || []).length;
        posicionActual = coincidencia.index + token.length;

        if (palabrasReservadas.has(token)) {
            tipoToken = 'PALABRA_RESERVADA';
            if (token === "int" || token === "float" || token === "string") {
                tipoActual = token; 
            } else if (token === "void") {
                tipoActual = "void";  // Asignación para void
            }
        } else if (operadores.has(token)) {
            tipoToken = 'OPERADOR';
            tipoActual = null; 
        } else if (delimitadores.has(token)) {
            tipoToken = 'DELIMITADOR';
            tipoActual = null; 
        } else if (/".*?"/.test(token)) {
            tipoToken = 'CADENA';
        } else if (/\d+\.\d+/.test(token)) {
            tipoToken = 'NÚMERO_DECIMAL';
        } else if (/\d+/.test(token)) {
            tipoToken = 'NÚMERO_ENTERO';
        } else {
            tipoToken = 'IDENTIFICADOR';
            if (!tablaSimbolos[token]) {
                tablaSimbolos[token] = { Tipo: tipoActual || 'Desconocido', Token: 'Variable', Lineas: [] };
            }
            tablaSimbolos[token].Lineas.push(numeroLinea);
            if (tipoActual) {
                tablaSimbolos[token].Tipo = tipoActual;
                tipoActual = null; 
            }
        }

        listaTokens.push({ token, tipoToken, numeroLinea });
    }

    return { listaTokens, tablaSimbolos };
}

function imprimirTabla(encabezados, datos) {
    const anchosColumnas = encabezados.map(encabezado => encabezado.length);
    
    datos.forEach(fila => {
        encabezados.forEach((encabezado, i) => {
            anchosColumnas[i] = Math.max(anchosColumnas[i], String(fila[encabezado]).length);
        });
    });
    
    const separador = '+' + anchosColumnas.map(w => '-'.repeat(w + 2)).join('+') + '+';
    const filaEncabezado = '| ' + encabezados.map((encabezado, i) => encabezado.padEnd(anchosColumnas[i])).join(' | ') + ' |';
    
    console.log(separador);
    console.log(filaEncabezado);
    console.log(separador);
    
    datos.forEach(fila => {
        const filaString = '| ' + encabezados.map((encabezado, i) => String(fila[encabezado]).padEnd(anchosColumnas[i])).join(' | ') + ' |';
        console.log(filaString);
    });
    
    console.log(separador);
}

function mostrarResultados(tokens, tablaSimbolos) {
    console.log("\nTokens:");
    imprimirTabla(["token", "tipoToken", "numeroLinea"], tokens);
    
    let datosTablaSimbolos = Object.entries(tablaSimbolos).map(([clave, valor]) => ({
        Nombre: clave,
        Tipo: valor.Tipo,
        Token: valor.Token,
        Lineas: valor.Lineas.join(", ")
    }));
    
    console.log("\nTabla de Símbolos:");
    imprimirTabla(["Nombre", "Tipo", "Token", "Lineas"], datosTablaSimbolos);
}
// por favor pegar el codigo al lado de `, ya que esa es la linea 1 del programa
const codigoEjemplo = `int x = 10;
float y = 5.5;
string mensaje = "Hola";
if (x > y) {
x = x + 1;
}
void imprimir() {
return;
}
`;

const { listaTokens, tablaSimbolos } = analizarCodigo(codigoEjemplo);
mostrarResultados(listaTokens, tablaSimbolos);
