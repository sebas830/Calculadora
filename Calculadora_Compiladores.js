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
        num_One = parseFloat(readlineSync.question("Por favor digite el número 1: "));
        num_Two = parseFloat(readlineSync.question("Por favor digite el número 2: "));
    }

    

}