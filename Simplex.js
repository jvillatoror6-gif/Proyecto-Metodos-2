function mostrarSimplex() {

    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `

        <div class="formulario">

            <h2>Método Simplex</h2>

            <h3>Tipo de problema</h3>

            <select id="tipoProblema">
                <option value="min">Minimizar</option>
            </select>

            <h3>Tamaño del problema</h3>

            <div class="fila">

                <label>Número de variables:</label> <br>

                <input
                    type="number"
                    id="numVariables"
                    min="2"
                    value="2"
                > <br>

                <label>Número de restricciones:</label> <br>

                <input
                    type="number"
                    id="numRestricciones"
                    min="1"
                    value="2"
                > <br>

                <button onclick="crearTablaSimplex()">
                    Crear tabla
                </button>

            </div>

            <div id="tablaEntrada"></div>

            <div id="resultado"></div>

        </div>

    `;
}


function crearTablaSimplex() {

    const numVariables = Number(
        document.getElementById("numVariables").value
    );

    const numRestricciones = Number(
        document.getElementById("numRestricciones").value
    );

    if (numVariables < 1 || numRestricciones < 1) {

        alert("Los valores deben ser mayores que 0.");

        return;
    }

    let html = "";

    html += `

        <h3>Función Objetivo</h3>

        <div class="fila">

    `;

    for (let j = 1; j <= numVariables; j++) {

        html += `

            <input
                type="number"
                id="z${j}"
                placeholder="Coeficiente X${j}"
            >

            X${j}

        `;

        if (j < numVariables) {

            html += ` + `;
        }
    }

    html += `

        </div>

    `;

    for (let i = 1; i <= numRestricciones; i++) {

        html += `

            <h3>Restricción ${i}</h3>

            <div class="restriccion">

        `;

        for (let j = 1; j <= numVariables; j++) {

            html += `

                <input
                    type="number"
                    id="r${i}${j}"
                    placeholder="Coef. X${j}"
                >

                X${j}

            `;

            if (j < numVariables) {

                html += ` + `;
            }
        }

        html += `

            <select id="signo${i}">

                <option value="<=">≤</option>
                <option value=">=">≥</option>
                <option value="=">=</option>

            </select>

            <input
                type="number"
                id="b${i}"
                placeholder="Resultado"
            >

            </div>

        `;
    }

    html += `

        <br>

        <button onclick="resolverSimplex()">
            Resolver Simplex
        </button>

    `;

    document.getElementById("tablaEntrada").innerHTML = html;
}


function resolverSimplex() {

    const tipo = document.getElementById("tipoProblema").value;

    if (tipo !== "min") {

        alert("El método solamente trabaja con problemas de minimización.");

        return;
    }

    const numVariables = Number(
        document.getElementById("numVariables").value
    );

    const numRestricciones = Number(
        document.getElementById("numRestricciones").value
    );

    let objetivo = [];

    for (let j = 1; j <= numVariables; j++) {

        const valor = Number(
            document.getElementById(`z${j}`).value
        );

        if (isNaN(valor)) {

            alert("Por favor, complete todos los campos.");

            return;
        }

        objetivo.push(valor);
    }

    let restricciones = [];

    for (let i = 1; i <= numRestricciones; i++) {

        let coeficientes = [];

        for (let j = 1; j <= numVariables; j++) {

            const valor = Number(
                document.getElementById(`r${i}${j}`).value
            );

            if (isNaN(valor)) {

                alert("Por favor, complete todos los campos.");

                return;
            }

            coeficientes.push(valor);
        }

        const signo = document.getElementById(
            `signo${i}`
        ).value;

        const b = Number(
            document.getElementById(`b${i}`).value
        );

        if (isNaN(b)) {

            alert("Por favor, complete todos los campos.");

            return;
        }

        restricciones.push({
            coeficientes: coeficientes,
            signo: signo,
            b: b
        });
    }

    for (let i = 0; i < restricciones.length; i++) {

        if (restricciones[i].signo !== "<=") {

            alert("Por ahora las restricciones deben ser del tipo ≤.");

            return;
        }

        if (restricciones[i].b < 0) {

            alert(
                "Por ahora los valores del lado derecho deben ser positivos."
            );

            return;
        }
    }

    let tabla = [];

    for (let i = 0; i < numRestricciones; i++) {

        let fila = [];

        for (let j = 0; j < numVariables; j++) {

            fila.push(
                restricciones[i].coeficientes[j]
            );
        }

        for (let j = 0; j < numRestricciones; j++) {

            if (i === j) {

                fila.push(1);

            } else {

                fila.push(0);
            }
        }

        fila.push(
            restricciones[i].b
        );

        tabla.push(fila);
    }

    let filaObjetivo = [];

    for (let j = 0; j < numVariables; j++) {

        filaObjetivo.push(
            -objetivo[j]
        );
    }

    for (let j = 0; j < numRestricciones; j++) {

        filaObjetivo.push(0);
    }

    filaObjetivo.push(0);

    tabla.push(filaObjetivo);

    let nombresColumnas = [];

    for (let j = 1; j <= numVariables; j++) {

        nombresColumnas.push(`X${j}`);
    }

    for (let i = 1; i <= numRestricciones; i++) {

        nombresColumnas.push(`S${i}`);
    }

    nombresColumnas.push("Solución");

    let resultadoHTML = "";

    resultadoHTML += `

        <div class="resultado">

            <h2>Solución por Método Simplex</h2>

            <p>

                <strong>Función objetivo:</strong>

                Z =

                ${objetivo.map(
                    (valor, indice) =>
                        `${valor}X${indice + 1}`
                ).join(" + ")}

            </p>

            <p>

                <strong>Restricciones:</strong>

            </p>

    `;

    for (let i = 0; i < numRestricciones; i++) {

        let texto = "";

        for (let j = 0; j < numVariables; j++) {

            if (j > 0) {

                texto += " + ";
            }

            texto +=
                `${restricciones[i].coeficientes[j]}X${j + 1}`;
        }

        texto +=
            ` ≤ ${restricciones[i].b}`;

        resultadoHTML += `<p>${texto}</p>`;
    }

    resultadoHTML += `

        <p>

            <strong>Tipo:</strong>
            Minimización

        </p>

    `;

    let iteracion = 0;

    resultadoHTML += generarTabla(
        tabla,
        nombresColumnas,
        iteracion
    );

    while (true) {

        iteracion++;

        let columnaPivote = -1;

        let valorMenor = 0;

        for (
            let j = 0;
            j < tabla[tabla.length - 1].length - 1;
            j++
        ) {

            if (
                tabla[tabla.length - 1][j] <
                valorMenor
            ) {

                valorMenor =
                    tabla[tabla.length - 1][j];

                columnaPivote = j;
            }
        }

        if (columnaPivote === -1) {

            break;
        }

        let filaPivote = -1;

        let razonMenor = Infinity;

        for (
            let i = 0;
            i < tabla.length - 1;
            i++
        ) {

            let elemento =
                tabla[i][columnaPivote];

            if (elemento > 0) {

                let razon =
                    tabla[i][tabla[i].length - 1] /
                    elemento;

                if (
                    razon >= 0 &&
                    razon < razonMenor
                ) {

                    razonMenor = razon;

                    filaPivote = i;
                }
            }
        }

        if (filaPivote === -1) {

            resultadoHTML += `

                <div class="resultado">

                    <h3>Problema ilimitado</h3>

                    <p>
                        No existe una solución óptima finita.
                    </p>

                </div>

            `;

            document.getElementById(
                "resultado"
            ).innerHTML = resultadoHTML;

            return;
        }

        tabla = hacerPivote(
            tabla,
            filaPivote,
            columnaPivote
        );

        resultadoHTML += generarTabla(
            tabla,
            nombresColumnas,
            iteracion,
            filaPivote,
            columnaPivote
        );

        if (iteracion > 100) {

            resultadoHTML += `

                <p>
                    Se alcanzó el límite de iteraciones.
                </p>

            `;

            break;
        }
    }

    const solucion = obtenerSolucion(
        tabla,
        numVariables
    );

    resultadoHTML += `

        <div class="solucion">

            <h2>Solución Óptima</h2>

    `;

    for (
        let j = 0;
        j < numVariables;
        j++
    ) {

        resultadoHTML += `

            <p>

                <strong>

                    X${j + 1} =
                    ${formatearNumero(
                        solucion.variables[j]
                    )}

                </strong>

            </p>

        `;
    }

    resultadoHTML += `

            <p>

                <strong>

                    Z =
                    ${formatearNumero(
                        solucion.z
                    )}

                </strong>

            </p>

        </div>

    `;

    resultadoHTML += `

        </div>

    `;

    document.getElementById(
        "resultado"
    ).innerHTML = resultadoHTML;
}


function hacerPivote(
    tabla,
    filaPivote,
    columnaPivote
) {

    let nuevaTabla =
        tabla.map(
            fila => [...fila]
        );

    const pivote =
        nuevaTabla[
            filaPivote
        ][columnaPivote];

    for (
        let j = 0;
        j < nuevaTabla[filaPivote].length;
        j++
    ) {

        nuevaTabla[filaPivote][j] =
            nuevaTabla[filaPivote][j] /
            pivote;
    }

    for (
        let i = 0;
        i < nuevaTabla.length;
        i++
    ) {

        if (i !== filaPivote) {

            const factor =
                nuevaTabla[i][columnaPivote];

            for (
                let j = 0;
                j < nuevaTabla[i].length;
                j++
            ) {

                nuevaTabla[i][j] =
                    nuevaTabla[i][j] -
                    factor *
                    nuevaTabla[filaPivote][j];
            }
        }
    }

    return nuevaTabla;
}


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

    for (
        let nombre of nombresColumnas
    ) {

        html += `<th>${nombre}</th>`;
    }

    html += `

                </tr>

            </thead>

            <tbody>

    `;

    for (
        let i = 0;
        i < tabla.length;
        i++
    ) {

        let nombreBase = "";

        if (
            i === tabla.length - 1
        ) {

            nombreBase = "Z";

        } else {

            let columnaBase = -1;

            for (
                let j = 0;
                j < tabla[i].length - 1;
                j++
            ) {

                let esUno =
                    Math.abs(
                        tabla[i][j] - 1
                    ) < 0.000001;

                let esCero = true;

                for (
                    let k = 0;
                    k < tabla.length - 1;
                    k++
                ) {

                    if (
                        k !== i &&
                        Math.abs(
                            tabla[k][j]
                        ) > 0.000001
                    ) {

                        esCero = false;

                        break;
                    }
                }

                if (
                    esUno &&
                    esCero
                ) {

                    columnaBase = j;

                    break;
                }
            }

            if (
                columnaBase !== -1
            ) {

                nombreBase =
                    nombresColumnas[
                        columnaBase
                    ];

            } else {

                nombreBase = "-";
            }
        }

        html += `<tr>`;

        html += `

            <td>
                <strong>
                    ${nombreBase}
                </strong>
            </td>

        `;

        for (
            let j = 0;
            j < tabla[i].length;
            j++
        ) {

            let clase = "";

            if (
                i === filaPivote &&
                j === columnaPivote
            ) {

                clase = "pivote";
            }

            html += `

                <td class="${clase}">

                    ${formatearNumero(
                        tabla[i][j]
                    )}

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


function obtenerSolucion(
    tabla,
    numVariables
) {

    let variables = [];

    for (
        let j = 0;
        j < numVariables;
        j++
    ) {

        let valor = 0;

        for (
            let i = 0;
            i < tabla.length - 1;
            i++
        ) {

            if (
                Math.abs(
                    tabla[i][j] - 1
                ) < 0.000001
            ) {

                let esBase = true;

                for (
                    let k = 0;
                    k < tabla.length - 1;
                    k++
                ) {

                    if (
                        k !== i &&
                        Math.abs(
                            tabla[k][j]
                        ) > 0.000001
                    ) {

                        esBase = false;

                        break;
                    }
                }

                if (esBase) {

                    valor =
                        tabla[i][
                            tabla[i].length - 1
                        ];

                    break;
                }
            }
        }

        variables.push(valor);
    }

    const z =
        tabla[
            tabla.length - 1
        ][
            tabla[tabla.length - 1].length - 1
        ];

    return {

        variables: variables,

        z: z
    };
}


function formatearNumero(numero) {

    if (
        Math.abs(numero) < 0.000001
    ) {

        return "0";
    }

    return Number(
        numero.toFixed(4)
    );
}