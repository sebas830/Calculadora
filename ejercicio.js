const palabrasReservadas = new Set(["int", "float", "if", "while", "return"]);
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
            if (token === "int" || token === "float") {
                tipoActual = token; 
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

//Por favor a la hora de digitar el codigo, colocarlo especificamente al lado del `, esto es para que empiece desde la linea 1 el codigo
const codigoEjemplo = `const readlineSync = require('readline-sync');

let rep = true;

while (rep) {
    console.log("Por favor digite una de las opciones:");
    console.log("1. Sumar");
    console.log("2. Restar");
    console.log("3. Multiplicar");
    console.log("4. Dividir");
    console.log("5. Salir");
    
    let opc = parseInt(readlineSync.question("Ingrese su opción: "));
    let num_One, num_Two, total;
    
    if (opc !== 5 && opc >= 1 && opc <= 4) {
        num_One = parseFloat(readlineSync.question("Por favor digite el número 1: "));
        num_Two = parseFloat(readlineSync.question("Por favor digite el número 2: "));
    }
    
    switch (opc) {
        case 1:
            total = num_One + num_Two;
            break;
        case 2:
            total = num_One - num_Two;
            break;
        case 3:
            total = num_One * num_Two;
            break;
        case 4:
            if (num_Two !== 0) {
                total = num_One / num_Two;
            } else {
                console.log("\nError: No se puede dividir por cero\n");
                continue;
            }
            break;
        case 5:
            rep = false;
            console.log("Saliendo del programa...");
            continue;
        default:
            console.log("La opción que digitó no se encuentra en el sistema");
            continue;
    }
    
    if (opc !== 5 && opc >= 1 && opc <= 4) {
        console.log("La respuesta es: " + total);
    }
}
`;

const { listaTokens, tablaSimbolos } = analizarCodigo(codigoEjemplo);
mostrarResultados(listaTokens, tablaSimbolos);
