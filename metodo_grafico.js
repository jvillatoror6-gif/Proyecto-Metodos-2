
function mostrarGrafico() {
    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `
        <div class="formulario">
            <h2>Método Gráfico</h2>

            <h3>Tipo de problema</h3>
            <select id="tipoProblema">
                <option value="max">Maximizar</option>
                <option value="min">Minimizar</option>
            </select>

            <br><br>

            <label>Número de variables:</label>
            <br>
            <input type="number" id="numVariablesGrafico" 
            min="1"
            max="5" 
            value="2">

            <br><br>

            <label>Número de restricciones:</label>
            <br>
            <input type="number" id="numRestriccionesGrafico" 
            min="1" 
            value="2">

            <br><br>

            <button onclick="crearTablaGrafico()">Generar datos</button>

            <div id="tablaEntrada"></div>
            <div id="resultado"></div>
        </div>

        <div id="graficaContainer">
            <canvas id="grafica"></canvas>
        </div>
    `;
}

function crearTablaGrafico() {
    const tablaEntrada = document.getElementById("tablaEntrada");
    const numVariables = parseInt(document.getElementById("numVariablesGrafico").value);
    const numRestricciones = parseInt(document.getElementById("numRestriccionesGrafico").value);

    if (isNaN(numVariables) || numVariables < 1 || numVariables > 5 ||
        isNaN(numRestricciones) || numRestricciones < 1) {
        tablaEntrada.innerHTML = "<p>Ingrese entre 2 y 5 variables y al menos una restricción.</p>";
        return;
    }

    let html = `<h3>Función Objetivo</h3><div class="fila">`;

    for (let j = 0; j < numVariables; j++) {
        html += `
            <input type="number" id="objX${j}" placeholder="X${j + 1}" step="any" required>
            X${j + 1}
            ${j < numVariables - 1 ? "+" : ""}
        `;
    }

    html += `</div><br><h3>Restricciones</h3>`;

    for (let i = 0; i < numRestricciones; i++) {
        html += `<div class="fila"><label>Restricción ${i + 1}:</label><br>`;

        for (let j = 0; j < numVariables; j++) {
            html += `
                <input type="number" id="r${i}x${j}" placeholder="X${j + 1}" step="any" required>
                X${j + 1}
                ${j < numVariables - 1 ? "+" : ""}
            `;
        }

        html += `
            <select id="r${i}tipo">
                <option value="<=">&le;</option>
                <option value=">=">&ge;</option>
                <option value="=">=</option>
            </select>
            <input type="number" id="r${i}c" placeholder="Resultado" step="any" required>
            </div><br>
        `;
    }

    html += `<button onclick="resolverGrafico()">Resolver</button>`;
    tablaEntrada.innerHTML = html;

    document.getElementById("resultado").innerHTML = "";

    const canvas = document.getElementById("grafica");
    if (window.graficaMetodo) {
        window.graficaMetodo.destroy();
        window.graficaMetodo = null;
    }

    canvas.style.display = numVariables === 2 ? "block" : "none";
}

function obtenerInterseccion(L1, L2) {
    const determinante = L1.a * L2.b - L2.a * L1.b;

    if (Math.abs(determinante) < 0.000001) return null;

    return {
        x: (L1.c * L2.b - L2.c * L1.b) / determinante,
        y: (L1.a * L2.c - L2.a * L1.c) / determinante
    };
}

function esFactible(punto, restricciones) {
    for (let i = 0; i < punto.length; i++) {
        if (punto[i] < -0.0001) return false;
    }

    for (const res of restricciones) {
        const valor = res.a.reduce((suma, coef, i) => suma + coef * punto[i], 0);

        if (res.tipo === "<=" && valor > res.c + 0.0001) return false;
        if (res.tipo === ">=" && valor < res.c - 0.0001) return false;
        if (res.tipo === "=" && Math.abs(valor - res.c) > 0.0001) return false;
    }

    return true;
}

function resolverSistema(matriz, resultados) {
    const n = resultados.length;
    const a = matriz.map((fila, i) => [...fila, resultados[i]]);

    for (let col = 0; col < n; col++) {
        let pivote = col;

        for (let fila = col + 1; fila < n; fila++) {
            if (Math.abs(a[fila][col]) > Math.abs(a[pivote][col])) {
                pivote = fila;
            }
        }

        if (Math.abs(a[pivote][col]) < 0.000001) return null;

        [a[col], a[pivote]] = [a[pivote], a[col]];

        const divisor = a[col][col];

        for (let j = col; j <= n; j++) {
            a[col][j] /= divisor;
        }

        for (let fila = 0; fila < n; fila++) {
            if (fila === col) continue;

            const factor = a[fila][col];

            for (let j = col; j <= n; j++) {
                a[fila][j] -= factor * a[col][j];
            }
        }
    }

    return a.map(fila => fila[n]);
}

function combinaciones(elementos, cantidad) {
    const resultado = [];

    function generar(inicio, actual) {
        if (actual.length === cantidad) {
            resultado.push([...actual]);
            return;
        }

        for (let i = inicio; i < elementos.length; i++) {
            actual.push(elementos[i]);
            generar(i + 1, actual);
            actual.pop();
        }
    }

    generar(0, []);
    return resultado;
}

function resolverGrafico() {
    const resultado = document.getElementById("resultado");
    const n = parseInt(document.getElementById("numVariablesGrafico").value);
    const m = parseInt(document.getElementById("numRestriccionesGrafico").value);
    const tipoProblema = document.getElementById("tipoProblema").value;

    const objetivo = [];

    for (let j = 0; j < n; j++) {
        const valor = parseFloat(document.getElementById(`objX${j}`).value);

        if (!Number.isFinite(valor)) {
            resultado.innerHTML = "<p>Complete todos los coeficientes de la función objetivo.</p>";
            return;
        }

        objetivo.push(valor);
    }

    const restricciones = [];

    for (let i = 0; i < m; i++) {
        const a = [];

        for (let j = 0; j < n; j++) {
            const valor = parseFloat(document.getElementById(`r${i}x${j}`).value);

            if (!Number.isFinite(valor)) {
                resultado.innerHTML = "<p>Complete todos los coeficientes de las restricciones.</p>";
                return;
            }

            a.push(valor);
        }

        const c = parseFloat(document.getElementById(`r${i}c`).value);

        if (!Number.isFinite(c)) {
            resultado.innerHTML = "<p>Complete los resultados de las restricciones.</p>";
            return;
        }

        restricciones.push({
            a,
            c,
            tipo: document.getElementById(`r${i}tipo`).value
        });
    }

    const limites = [...restricciones];

    for (let j = 0; j < n; j++) {
        const a = Array(n).fill(0);
        a[j] = 1;

        limites.push({
            a,
            c: 0,
            tipo: ">="
        });
    }

    const grupos = combinaciones(limites, n);
    const vertices = [];

    for (const grupo of grupos) {
        const punto = resolverSistema(
            grupo.map(r => r.a),
            grupo.map(r => r.c)
        );

        if (punto && esFactible(punto, restricciones)) {
            const repetido = vertices.some(v =>
                v.every((valor, i) => Math.abs(valor - punto[i]) < 0.0001)
            );

            if (!repetido) vertices.push(punto);
        }
    }

    if (vertices.length === 0) {
        resultado.innerHTML = `
            <h3>Resultado</h3>
            <p>No se encontró un vértice factible. Revise las restricciones.</p>
        `;
        return;
    }

    let mejorValor = tipoProblema === "max" ? -Infinity : Infinity;
    let solucionOptima = null;

    const tabla = `
        <h3>Vértices factibles</h3>
        <div style="overflow-x:auto">
        <table border="1">
            <tr>
                <th>Vértice</th>
                ${objetivo.map((_, j) => `<th>X${j + 1}</th>`).join("")}
                <th>Z</th>
            </tr>
            ${vertices.map((v, i) => {
                const z = objetivo.reduce((suma, coef, j) => suma + coef * v[j], 0);

                if (
                    (tipoProblema === "max" && z > mejorValor + 0.000001) ||
                    (tipoProblema === "min" && z < mejorValor - 0.000001)
                ) {
                    mejorValor = z;
                    solucionOptima = v;
                }

                return `
                    <tr>
                        <td>${i + 1}</td>
                        ${v.map(valor => `<td>${Number(valor.toFixed(4))}</td>`).join("")}
                        <td>${Number(z.toFixed(4))}</td>
                    </tr>
                `;
            }).join("")}
        </table>
        </div>
    `;

    resultado.innerHTML = `
        ${tabla}
        <br>
        <h3>Solución óptima encontrada</h3>
        ${solucionOptima.map((valor, j) =>
            `<p><strong>X${j + 1}:</strong> ${Number(valor.toFixed(4))}</p>`
        ).join("")}
        <p><strong>Valor de Z:</strong> ${Number(mejorValor.toFixed(4))}</p>
        ${n > 2 ? "<p>Para más de dos variables, la solución se calcula mediante intersecciones de restricciones; no se puede representar toda la región en una gráfica 2D.</p>" : ""}
    `;

    if (n === 2) {
        creargrafico(restricciones);
    }
}

function creargrafico(restricciones) {
    const canvas = document.getElementById("grafica");
    if (!canvas || typeof Chart === "undefined") return;

    const datasets = [];

    restricciones.forEach((restriccion, indice) => {
        const a = restriccion.a[0];
        const b = restriccion.a[1];
        const c = restriccion.c;
        const puntos = [];

        for (let x = 0; x <= 20; x += 0.1) {
            if (Math.abs(b) > 0.000001) {
                const y = (c - a * x) / b;

                if (y >= 0 && y <= 20) puntos.push({ x, y });
            } else if (Math.abs(a) > 0.000001) {
                const xFijo = c / a;

                if (xFijo >= 0 && xFijo <= 20) {
                    puntos.push({ x: xFijo, y: 0 });
                    puntos.push({ x: xFijo, y: 20 });
                }
            }
        }

        datasets.push({
            label: `Restricción ${indice + 1}`,
            data: puntos,
            showLine: true,
            fill: false,
            tension: 0
        });
    });

    if (window.graficaMetodo) window.graficaMetodo.destroy();

    window.graficaMetodo = new Chart(canvas, {
        type: "scatter",
        data: { datasets },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: "linear",
                    min: 0,
                    max: 20,
                    title: { display: true, text: "X1" }
                },
                y: {
                    min: 0,
                    max: 20,
                    title: { display: true, text: "X2" }
                }
            }
        }
    });
}
