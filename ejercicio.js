const palabrasReservadas = new Set(["int", "float", "if", "while", "return"]);
const operadores = new Set(["+", "-", "*", "/", "=", ">", "<", "=="]);
const delimitadores = new Set([";", "{", "}", "(", ")"]);

function analizarCodigo(codigo) {
    const patronTokens = /(".*?"|\b\d+\.\d+\b|\b\d+\b|\b[a-zA-Z_]\w*\b|[+\-*/=<>!]=?|[;{}()])/g;
    let coincidencias = [...codigo.matchAll(patronTokens)];
    let listaTokens = [];
    let tablaSimbolos = {};
    let numeroLinea = 1;

    for (let coincidencia of coincidencias) {
        let token = coincidencia[0];
        let tipoToken;

        if (palabrasReservadas.has(token)) {
            tipoToken = 'PALABRA_RESERVADA';
        } else if (operadores.has(token)) {
            tipoToken = 'OPERADOR';
        } else if (delimitadores.has(token)) {
            tipoToken = 'DELIMITADOR';
        } else if (/".*?"/.test(token)) {
            tipoToken = 'CADENA';
        } else if (/\d+\.\d+/.test(token) || /\d+/.test(token)) {
            tipoToken = 'NÚMERO';
        } else {
            tipoToken = 'IDENTIFICADOR';
            if (!tablaSimbolos[token]) {
                tablaSimbolos[token] = { Tipo: 'Desconocido', Token: 'Variable', Lineas: [] };
            }
            tablaSimbolos[token].Lineas.push(numeroLinea);
        }

        listaTokens.push({ token, tipoToken, numeroLinea });
        numeroLinea += (token.match(/\n/g) || []).length;
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

const codigoEjemplo = `
int x = 10;
float y = 20.5;
if (x < y) {
    return "x es menor";
}
`;

const { listaTokens, tablaSimbolos } = analizarCodigo(codigoEjemplo);
mostrarResultados(listaTokens, tablaSimbolos);