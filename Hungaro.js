
/*
 MÉTODO DE ASIGNACIÓN / HÚNGARO
 - Minimización de costos
 - Maximización de beneficios
 - Muestra las tablas de cada paso
 - Tablas sencillas sin colores ni bordes decorativos
*/


// ============================================
// 1. MOSTRAR LA INTERFAZ
// ============================================

function mostrarHungaro() {
    document.getElementById("contenido").innerHTML = `
        <div class="formulario">
            <h2>Método Húngaro de Asignación</h2>

            <p>
                Asigna trabajadores a tareas minimizando costos
                o maximizando beneficios.
            </p>

            <div class="config-metodo">
                <label>Trabajadores:
                    <input type="number" id="huFilas"
                        min="1" max="10" value="3">
                </label>

                <label>Tareas:
                    <input type="number" id="huColumnas"
                        min="1" max="10" value="3">
                </label>

                <label>Objetivo:
                    <select id="huObjetivo">
                        <option value="min">Minimizar costos</option>
                        <option value="max">Maximizar beneficios</option>
                    </select>
                </label>

                <button onclick="generarMatrizHungaro()">
                    Generar matriz
                </button>
            </div>

            <div id="matrizHungaro"></div>
            <div id="resultadoHungaro"></div>
        </div>
    `;

    generarMatrizHungaro();
}


// ============================================
// 2. GENERAR LA MATRIZ INICIAL
// ============================================

function generarMatrizHungaro() {
    const m = Number(document.getElementById("huFilas").value);
    const n = Number(document.getElementById("huColumnas").value);

    if (!Number.isInteger(m) || !Number.isInteger(n) ||
        m < 1 || n < 1 || m > 10 || n > 10) {

        alert("Ingresa entre 1 y 10 trabajadores y tareas.");
        return;
    }

    let html = `
        <h3>Matriz inicial de costos o beneficios</h3>

        <div style="width:100%;max-width:100%;overflow-x:auto;">
            <table style="
                width:100%;
                max-width:100%;
                table-layout:fixed;
                border-collapse:collapse;
                background:transparent;
                color:inherit;
            ">
                <thead>
                    <tr>
                        <th style="width:30%;text-align:left;font-weight:normal;">
                            Trabajador / Tarea
                        </th>`;

    for (let j = 0; j < n; j++) {
        html += `
            <th style="text-align:center;font-weight:normal;">
                Tarea ${j + 1}
            </th>`;
    }

    html += `</tr></thead><tbody>`;

    for (let i = 0; i < m; i++) {
        html += `
            <tr>
                <td style="text-align:left;padding:4px;">
                    Trabajador ${i + 1}
                </td>`;

        for (let j = 0; j < n; j++) {
            html += `
                <td style="padding:4px;">
                    <input
                        type="number"
                        step="any"
                        id="hu_${i}_${j}"
                        value="0"
                        style="
                            display:block;
                            width:100%;
                            min-width:0;
                            max-width:100%;
                            box-sizing:border-box;
                            padding:5px;
                            border:none;
                            border-radius:0;
                            outline:none;
                            background:transparent;
                            color:inherit;
                            font:inherit;
                        "
                    >
                </td>`;
        }

        html += `</tr>`;
    }

    html += `
        </tbody>
        </table>
        </div>

        <button onclick="resolverHungaro()">
            Resolver método húngaro
        </button>`;

    document.getElementById("matrizHungaro").innerHTML = html;
    document.getElementById("resultadoHungaro").innerHTML = "";
}


// ============================================
// 3. FORMATEAR NÚMEROS
// ============================================

function formatearNumero(numero) {
    return Number(numero.toFixed(4)).toString();
}


// ============================================
// 4. CREAR TABLAS SENCILLAS
// ============================================

function crearTablaHungaro(matriz, paso = {}) {
    const filas = matriz.length;
    const columnas = matriz[0].length;

    let html = `
        <div style="width:100%;max-width:100%;overflow-x:auto;">
            <table style="
                width:100%;
                max-width:100%;
                table-layout:fixed;
                border-collapse:collapse;
                background:transparent;
                color:inherit;
            ">
                <thead>
                    <tr>
                        <th style="width:30%;text-align:left;font-weight:normal;">
                            Trabajador / Tarea
                        </th>`;

    for (let j = 0; j < columnas; j++) {
        html += `
            <th style="text-align:center;font-weight:normal;">
                Tarea ${j + 1}
            </th>`;
    }

    html += `</tr></thead><tbody>`;

    for (let i = 0; i < filas; i++) {
        html += `
            <tr>
                <td style="text-align:left;padding:6px 4px;">
                    Trabajador ${i + 1}
                </td>`;

        for (let j = 0; j < columnas; j++) {
            const valor = matriz[i][j];

            const asignada =
                paso.asignacion &&
                paso.asignacion[i] === j;

            html += `
                <td style="
                    text-align:center;
                    padding:6px 4px;
                    background:transparent;
                    color:inherit;
                    font-weight:${asignada ? "bold" : "normal"};
                    overflow-wrap:anywhere;
                ">
                    ${formatearNumero(valor)}${asignada ? " ✓" : ""}
                </td>`;
        }

        html += `</tr>`;
    }

    html += `
        </tbody>
        </table>
        </div>`;

    if (paso.minimo !== undefined) {
        html += `
            <p>
                <strong>Menor valor sin cubrir:</strong>
                ${formatearNumero(paso.minimo)}
            </p>`;
    }

    if (paso.filasCubiertas || paso.columnasCubiertas) {
        html += `
            <p>
                <strong>Filas cubiertas:</strong>
                ${paso.filasCubiertas.length
                    ? paso.filasCubiertas.map(i => i + 1).join(", ")
                    : "Ninguna"}
            </p>

            <p>
                <strong>Columnas cubiertas:</strong>
                ${paso.columnasCubiertas.length
                    ? paso.columnasCubiertas.map(j => j + 1).join(", ")
                    : "Ninguna"}
            </p>`;
    }

    return html;
}


// ============================================
// 5. RESOLVER EL MÉTODO HÚNGARO
// ============================================

function resolverHungaro() {
    const m = Number(document.getElementById("huFilas").value);
    const n = Number(document.getElementById("huColumnas").value);
    const objetivo = document.getElementById("huObjetivo").value;

    const original = [];

    try {
        // Leer y validar la matriz ingresada
        for (let i = 0; i < m; i++) {
            const fila = [];

            for (let j = 0; j < n; j++) {
                const campo = document.getElementById(`hu_${i}_${j}`);

                if (!campo || campo.value.trim() === "" ||
                    !Number.isFinite(Number(campo.value))) {

                    throw new Error(
                        "Completa todos los campos con números válidos."
                    );
                }

                fila.push(Number(campo.value));
            }

            original.push(fila);
        }

        const tam = Math.max(m, n);
        const maximo = Math.max(...original.flat());
        const pasos = [];

        // Guardar cada tabla sin alterar las anteriores
        function guardarPaso(titulo, descripcion, datos, extras = {}) {
            pasos.push({
                titulo,
                descripcion,
                matriz: datos.map(fila => [...fila]),
                ...extras
            });
        }

        guardarPaso(
            "1. Matriz original",
            "Matriz de costos o beneficios ingresada por el usuario.",
            original
        );

        // Crear matriz cuadrada
        let matriz = Array.from({ length: tam }, (_, i) =>
            Array.from({ length: tam }, (_, j) => {
                if (i >= m || j >= n) {
                    return 0;
                }

                return objetivo === "max"
                    ? maximo - original[i][j]
                    : original[i][j];
            })
        );

        if (m !== n) {
            guardarPaso(
                "2. Matriz cuadrada",
                "Se agregan filas o columnas ficticias con valores cero para equilibrar la matriz.",
                matriz
            );
        }

        if (objetivo === "max") {
            guardarPaso(
                "3. Conversión a minimización",
                `Se transforma cada beneficio utilizando: ${formatearNumero(maximo)} − beneficio.`,
                matriz
            );
        }

        // Reducir filas
        matriz = matriz.map(fila => {
            const minimo = Math.min(...fila);

            return fila.map(valor => {
                const resultado = valor - minimo;

                return Math.abs(resultado) < 1e-9 ? 0 : resultado;
            });
        });

        guardarPaso(
            "Reducción por filas",
            "Se resta el menor valor de cada fila a todos sus elementos.",
            matriz
        );

        // Reducir columnas
        for (let j = 0; j < tam; j++) {
            let minimo = Infinity;

            for (let i = 0; i < tam; i++) {
                minimo = Math.min(minimo, matriz[i][j]);
            }

            for (let i = 0; i < tam; i++) {
                matriz[i][j] -= minimo;

                if (Math.abs(matriz[i][j]) < 1e-9) {
                    matriz[i][j] = 0;
                }
            }
        }

        guardarPaso(
            "Reducción por columnas",
            "Se resta el menor valor de cada columna a todos sus elementos.",
            matriz
        );

        // Resolver y registrar los ajustes
        const asignacion = algoritmoHungaro(matriz, guardarPaso);

        // Calcular el total con los valores originales
        const parejas = [];
        let total = 0;

        asignacion.forEach((j, i) => {
            if (i < m && j >= 0 && j < n) {
                parejas.push({
                    trabajador: i,
                    tarea: j,
                    valor: original[i][j]
                });

                total += original[i][j];
            }
        });

        // Mostrar todas las tablas
        let html = `
            <div>
                <h2>Procedimiento del método húngaro</h2>`;

        pasos.forEach(paso => {
            html += `
                <div style="margin:16px 0;padding:0;border:none;">
                    <h3>${paso.titulo}</h3>
                    <p>${paso.descripcion}</p>
                    ${crearTablaHungaro(paso.matriz, paso)}
                </div>`;
        });

        // Tabla final sin estilos decorativos
        html += `
            <h2>Resultado final</h2>

            <p>
                <strong>
                    ${objetivo === "min"
                        ? "Costo mínimo total"
                        : "Beneficio máximo total"}:
                    ${formatearNumero(total)}
                </strong>
            </p>

            <div style="width:100%;max-width:100%;overflow-x:auto;">
                <table style="
                    width:100%;
                    max-width:100%;
                    table-layout:fixed;
                    border-collapse:collapse;
                    background:transparent;
                    color:inherit;
                ">
                    <thead>
                        <tr>
                            <th style="text-align:left;font-weight:normal;">
                                Trabajador
                            </th>
                            <th style="text-align:left;font-weight:normal;">
                                Tarea asignada
                            </th>
                            <th style="text-align:left;font-weight:normal;">
                                ${objetivo === "min" ? "Costo" : "Beneficio"}
                            </th>
                        </tr>
                    </thead>
                    <tbody>`;

        parejas.forEach(p => {
            html += `
                <tr>
                    <td style="padding:6px 4px;">
                        Trabajador ${p.trabajador + 1}
                    </td>
                    <td style="padding:6px 4px;">
                        Tarea ${p.tarea + 1}
                    </td>
                    <td style="padding:6px 4px;">
                        ${formatearNumero(p.valor)}
                    </td>
                </tr>`;
        });

        html += `</tbody></table></div>`;

        // Mostrar trabajadores asignados a tareas ficticias
        asignacion.forEach((j, i) => {
            if (i < m && j >= n) {
                html += `
                    <p>
                        Trabajador ${i + 1} queda asignado a una tarea ficticia.
                    </p>`;
            }
        });

        html += `</div>`;

        document.getElementById("resultadoHungaro").innerHTML = html;

    } catch (error) {
        alert(error.message);
    }
}


// ============================================
// 6. ALGORITMO HÚNGARO
// ============================================

function algoritmoHungaro(costos, guardarPaso = null) {
    const n = costos.length;
    const EPS = 1e-9;

    let matriz = costos.map(fila => [...fila]);
    let iteracion = 1;

    // Buscar la mayor cantidad de ceros independientes
    function buscarAsignacion(actual) {
        const asignacion = Array(n).fill(-1);
        const asignacionColumna = Array(n).fill(-1);

        function buscar(fila, visitadas) {
            for (let j = 0; j < n; j++) {
                if (Math.abs(actual[fila][j]) > EPS ||
                    visitadas[j]) {
                    continue;
                }

                visitadas[j] = true;

                if (asignacionColumna[j] === -1 ||
                    buscar(asignacionColumna[j], visitadas)) {

                    asignacion[fila] = j;
                    asignacionColumna[j] = fila;

                    return true;
                }
            }

            return false;
        }

        for (let i = 0; i < n; i++) {
            buscar(i, Array(n).fill(false));
        }

        return asignacion;
    }

    while (true) {
        const asignacion = buscarAsignacion(matriz);

        const cantidad = asignacion.filter(
            j => j !== -1
        ).length;

        // Si existe una asignación completa, terminar
        if (cantidad === n) {
            if (guardarPaso) {
                guardarPaso(
                    "Asignación óptima",
                    "Se encontraron ceros independientes, uno por cada fila y columna.",
                    matriz,
                    { asignacion: [...asignacion] }
                );
            }

            return asignacion;
        }

        // Preparar las marcas de filas y columnas
        const filasMarcadas = Array(n).fill(false);
        const columnasMarcadas = Array(n).fill(false);

        const columnaAsignada = Array(n).fill(-1);
        const cola = [];

        asignacion.forEach((j, i) => {
            if (j !== -1) {
                columnaAsignada[j] = i;
            }
        });

        // Marcar las filas que no tienen asignación
        for (let i = 0; i < n; i++) {
            if (asignacion[i] === -1) {
                filasMarcadas[i] = true;
                cola.push(i);
            }
        }

        // Buscar caminos alternantes entre ceros
        while (cola.length > 0) {
            const i = cola.shift();

            for (let j = 0; j < n; j++) {
                if (Math.abs(matriz[i][j]) > EPS ||
                    asignacion[i] === j ||
                    columnasMarcadas[j]) {
                    continue;
                }

                columnasMarcadas[j] = true;

                const filaPareja = columnaAsignada[j];

                if (filaPareja !== -1 &&
                    !filasMarcadas[filaPareja]) {

                    filasMarcadas[filaPareja] = true;
                    cola.push(filaPareja);
                }
            }
        }

        // Determinar las líneas que cubren todos los ceros
        const filasCubiertas = [];
        const columnasCubiertas = [];

        for (let i = 0; i < n; i++) {
            if (!filasMarcadas[i]) {
                filasCubiertas.push(i);
            }

            if (columnasMarcadas[i]) {
                columnasCubiertas.push(i);
            }
        }

        // Buscar el menor valor sin cubrir
        let minimo = Infinity;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (filasMarcadas[i] &&
                    !columnasMarcadas[j]) {

                    minimo = Math.min(minimo, matriz[i][j]);
                }
            }
        }

        if (!Number.isFinite(minimo)) {
            throw new Error(
                "No se pudo encontrar el menor valor sin cubrir."
            );
        }

        if (guardarPaso) {
            guardarPaso(
                `Ajuste ${iteracion}: cubrir los ceros`,
                `Solo hay ${cantidad} ceros independientes. Se cubren los ceros con líneas y se busca el menor valor sin cubrir.`,
                matriz,
                {
                    filasCubiertas: [...filasCubiertas],
                    columnasCubiertas: [...columnasCubiertas],
                    minimo
                }
            );
        }

        // Ajustar la matriz
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const filaCubierta = !filasMarcadas[i];
                const columnaCubierta = columnasMarcadas[j];

                if (!filaCubierta && !columnaCubierta) {
                    // Elementos no cubiertos: restar el mínimo
                    matriz[i][j] -= minimo;

                } else if (filaCubierta && columnaCubierta) {
                    // Intersecciones de líneas: sumar el mínimo
                    matriz[i][j] += minimo;
                }

                // Evitar residuos numéricos pequeños
                if (Math.abs(matriz[i][j]) < EPS) {
                    matriz[i][j] = 0;
                }
            }
        }

        if (guardarPaso) {
            guardarPaso(
                `Ajuste ${iteracion}: nueva matriz`,
                `Se resta ${formatearNumero(minimo)} a los elementos no cubiertos y se suma en las intersecciones. Los demás valores permanecen iguales.`,
                matriz
            );
        }

        iteracion++;
    }
}
