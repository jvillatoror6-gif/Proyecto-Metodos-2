function mostrarSimplex() {

    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `
        <div class="formulario">

            <h2>Método Simplex</h2>

            <h3>Tipo de problema</h3>

            <select id="tipoProblema">
                <option value="max">Maximizar</option>
                <option value="min">Minimizar</option>
            </select>

            <h3>Función Objetivo</h3>

            <div class="fila">
                <input type="number" id="z1" placeholder="Coeficiente X1">
                X1 +

                <input type="number" id="z2" placeholder="Coeficiente X2">
                X2
            </div>

            <h3>Restricción 1</h3>

            <div class="restriccion">

                <input type="number" id="r11" placeholder="Coef. X1">
                X1 +

                <input type="number" id="r12" placeholder="Coef. X2">
                X2

                <select id="signo1">
                    <option value="<=">≤</option>
                    <option value=">=">≥</option>
                    <option value="=">=</option>
                </select>

                <input type="number" id="b1" placeholder="Resultado">

            </div>

            <h3>Restricción 2</h3>

            <div class="restriccion">

                <input type="number" id="r21" placeholder="Coef. X1">
                X1 +

                <input type="number" id="r22" placeholder="Coef. X2">
                X2

                <select id="signo2">
                    <option value="<=">≤</option>
                    <option value=">=">≥</option>
                    <option value="=">=</option>
                </select>

                <input type="number" id="b2" placeholder="Resultado">

            </div>

            <button onclick="resolverSimplex()">
                Resolver Simplex
            </button>

            <div id="resultado"></div>

        </div>
    `;
}


function resolverSimplex() {

    const tipo = document.getElementById("tipoProblema").value;

    const z1 = Number(document.getElementById("z1").value);
    const z2 = Number(document.getElementById("z2").value);

    const r11 = Number(document.getElementById("r11").value);
    const r12 = Number(document.getElementById("r12").value);
    const b1 = Number(document.getElementById("b1").value);

    const r21 = Number(document.getElementById("r21").value);
    const r22 = Number(document.getElementById("r22").value);
    const b2 = Number(document.getElementById("b2").value);

    const signo1 = document.getElementById("signo1").value;
    const signo2 = document.getElementById("signo2").value;

    // Validar datos
    if (
        isNaN(z1) || isNaN(z2) ||
        isNaN(r11) || isNaN(r12) || isNaN(b1) ||
        isNaN(r21) || isNaN(r22) || isNaN(b2)
    ) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Esta primera versión utiliza el Simplex clásico:
    // Maximización con restricciones <= y valores RHS positivos.

    if (tipo !== "max") {
        alert("Por ahora el algoritmo implementado trabaja con problemas de maximización.");
        return;
    }

    if (signo1 !== "<=" || signo2 !== "<=") {
        alert("Por ahora las restricciones deben ser del tipo ≤.");
        return;
    }

    if (b1 < 0 || b2 < 0) {
        alert("Por ahora los valores del lado derecho deben ser positivos.");
        return;
    }

    // Crear tabla inicial
    let tabla = [
        [r11, r12, 1, 0, b1],
        [r21, r22, 0, 1, b2],
        [-z1, -z2, 0, 0, 0]
    ];

    let nombresColumnas = ["X1", "X2", "S1", "S2", "Solución"];

    let resultadoHTML = "";

    resultadoHTML += `
        <div class="resultado">

            <h2>Solución por Método Simplex</h2>

            <p>
                <strong>Función objetivo:</strong>
                Z = ${z1}X1 + ${z2}X2
            </p>

            <p>
                <strong>Restricciones:</strong>
            </p>

            <p>${r11}X1 + ${r12}X2 ≤ ${b1}</p>
            <p>${r21}X1 + ${r22}X2 ≤ ${b2}</p>

    `;

    let iteracion = 0;

    // Mostrar tabla inicial
    resultadoHTML += generarTabla(tabla, nombresColumnas, iteracion);

    // Algoritmo Simplex
    while (true) {

        iteracion++;

        // Buscar columna pivote
        let columnaPivote = -1;
        let valorMenor = 0;

        for (let j = 0; j < tabla[2].length - 1; j++) {

            if (tabla[2][j] < valorMenor) {

                valorMenor = tabla[2][j];
                columnaPivote = j;
            }
        }

        // Si no hay negativos en la fila Z, ya es óptimo
        if (columnaPivote === -1) {
            break;
        }

        // Buscar fila pivote usando prueba de razón mínima
        let filaPivote = -1;
        let razonMenor = Infinity;

        for (let i = 0; i < tabla.length - 1; i++) {

            let elemento = tabla[i][columnaPivote];

            if (elemento > 0) {

                let razon = tabla[i][tabla[i].length - 1] / elemento;

                if (razon >= 0 && razon < razonMenor) {

                    razonMenor = razon;
                    filaPivote = i;
                }
            }
        }

        // Problema ilimitado
        if (filaPivote === -1) {

            resultadoHTML += `
                <div class="resultado">
                    <h3>Problema ilimitado</h3>
                    <p>
                        No existe una solución óptima finita.
                    </p>
                </div>
            `;

            document.getElementById("resultado").innerHTML = resultadoHTML;
            return;
        }

        // Realizar pivote
        tabla = hacerPivote(
            tabla,
            filaPivote,
            columnaPivote
        );

        // Mostrar iteración
        resultadoHTML += generarTabla(
            tabla,
            nombresColumnas,
            iteracion,
            filaPivote,
            columnaPivote
        );

        // Seguridad para evitar ciclos infinitos
        if (iteracion > 100) {

            resultadoHTML += `
                <p>
                    Se alcanzó el límite de iteraciones.
                </p>
            `;

            break;
        }
    }

    // Obtener solución
    const solucion = obtenerSolucion(tabla);

    resultadoHTML += `
        <div class="solucion">

            <h2>Solución Óptima</h2>

            <p>
                <strong>X1 = ${formatearNumero(solucion.x1)}</strong>
            </p>

            <p>
                <strong>X2 = ${formatearNumero(solucion.x2)}</strong>
            </p>

            <p>
                <strong>Z = ${formatearNumero(solucion.z)}</strong>
            </p>

        </div>
    `;

    resultadoHTML += `
        </div>
    `;

    document.getElementById("resultado").innerHTML = resultadoHTML;
}


/*
    Realiza la operación de pivoteo.
*/
function hacerPivote(tabla, filaPivote, columnaPivote) {

    let nuevaTabla = tabla.map(fila => [...fila]);

    const pivote = nuevaTabla[filaPivote][columnaPivote];

    // 1. Convertir el pivote en 1
    for (let j = 0; j < nuevaTabla[filaPivote].length; j++) {

        nuevaTabla[filaPivote][j] =
            nuevaTabla[filaPivote][j] / pivote;
    }

    // 2. Convertir el resto de la columna pivote en 0
    for (let i = 0; i < nuevaTabla.length; i++) {

        if (i !== filaPivote) {

            const factor =
                nuevaTabla[i][columnaPivote];

            for (let j = 0; j < nuevaTabla[i].length; j++) {

                nuevaTabla[i][j] =
                    nuevaTabla[i][j] -
                    factor * nuevaTabla[filaPivote][j];
            }
        }
    }

    return nuevaTabla;
}


/*
    Genera visualmente una tabla Simplex.
*/
function generarTabla(
    tabla,
    nombresColumnas,
    iteracion,
    filaPivote = -1,
    columnaPivote = -1
) {

    let html = `
        <h3>Tabla ${iteracion}</h3>

        <table class="tabla-simplex">

            <thead>
                <tr>
                    <th>Base</th>
    `;

    for (let nombre of nombresColumnas) {

        html += `<th>${nombre}</th>`;
    }

    html += `
                </tr>
            </thead>

            <tbody>
    `;

    for (let i = 0; i < tabla.length; i++) {

        let nombreBase = "";

        if (i === tabla.length - 1) {
            nombreBase = "Z";
        } else if (i === 0) {
            nombreBase = "S1";
        } else if (i === 1) {
            nombreBase = "S2";
        }

        html += `<tr>`;

        html += `<td><strong>${nombreBase}</strong></td>`;

        for (let j = 0; j < tabla[i].length; j++) {

            let clase = "";

            if (
                i === filaPivote &&
                j === columnaPivote
            ) {
                clase = "pivote";
            }

            html += `
                <td class="${clase}">
                    ${formatearNumero(tabla[i][j])}
                </td>
            `;
        }

        html += `</tr>`;
    }

    html += `
            </tbody>
        </table>
    `;

    return html;
}


/*
    Obtiene X1, X2 y Z de la tabla final.
*/
function obtenerSolucion(tabla) {

    let x1 = 0;
    let x2 = 0;

    // Buscar X1
    for (let i = 0; i < tabla.length - 1; i++) {

        if (
            Math.abs(tabla[i][0] - 1) < 0.000001 &&
            Math.abs(tabla[i][1]) < 0.000001
        ) {
            x1 = tabla[i][4];
        }
    }

    // Buscar X2
    for (let i = 0; i < tabla.length - 1; i++) {

        if (
            Math.abs(tabla[i][1] - 1) < 0.000001 &&
            Math.abs(tabla[i][0]) < 0.000001
        ) {
            x2 = tabla[i][4];
        }
    }

    const z = tabla[tabla.length - 1][4];

    return {
        x1: x1,
        x2: x2,
        z: z
    };
}


/*
    Evita mostrar números como:
    9.999999999
*/
function formatearNumero(numero) {

    if (Math.abs(numero) < 0.000001) {
        return "0";
    }

    return Number(numero.toFixed(4));
}


/*
    Método Gráfico
*/
function mostrarGrafico() {

    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `
        <div class="formulario">

            <h2>Método Gráfico</h2>

            <p>
                La sección del Método Gráfico será
                implementada después.
            </p>

        </div>
    `;
}