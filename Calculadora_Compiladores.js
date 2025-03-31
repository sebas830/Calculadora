const readlineSync = require('readline-sync');

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
        num_One = 24
        num_Two = 12
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
