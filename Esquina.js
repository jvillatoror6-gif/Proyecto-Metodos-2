function mostrarNoroeste() {
    document.getElementById("contenido").innerHTML = `
        <div class="formulario">
            <h2>Método de la Esquina Noroeste</h2>
            <p>Resuelve un problema de transporte mediante una solución inicial factible.</p>

            <div class="config-metodo">
                <label>Orígenes:
                    <input type="number" id="noFilas" min="1" max="10" value="3">
                </label>
                <label>Destinos:
                    <input type="number" id="noColumnas" min="1" max="10" value="3">
                </label>
                <button onclick="generarMatrizNoroeste()">Generar matriz</button>
            </div>

            <div id="matrizNoroeste"></div>
            <div id="resultadoNoroeste"></div>
        </div>
    `;

    generarMatrizNoroeste();
}

function generarMatrizNoroeste() {
    const m = Number(document.getElementById("noFilas").value);
    const n = Number(document.getElementById("noColumnas").value);

    if (!Number.isInteger(m) || !Number.isInteger(n) ||
        m < 1 || n < 1 || m > 10 || n > 10) {
        alert("Ingresa entre 1 y 10 orígenes y destinos.");
        return;
    }

    let html = `<h3>Costos de transporte</h3>
        <div class="tabla-scroll"><table class="tabla-simplex">
        <thead><tr><th>Origen</th>`;

    for (let j = 0; j < n; j++) {
        html += `<th>Destino ${j + 1}</th>`;
    }
    html += `<th>Oferta</th></tr></thead><tbody>`;

    for (let i = 0; i < m; i++) {
        html += `<tr><th>Origen ${i + 1}</th>`;
        for (let j = 0; j < n; j++) {
            html += `<td><input type="number" step="any" id="noC_${i}_${j}" value="0"></td>`;
        }
        html += `<td><input type="number" min="0" step="any" id="noO_${i}" value="0"></td></tr>`;
    }

    html += `<tr><th>Demanda</th>`;
    for (let j = 0; j < n; j++) {
        html += `<td><input type="number" min="0" step="any" id="noD_${j}" value="0"></td>`;
    }
    html += `<td>—</td></tr></tbody></table></div>
        <button onclick="resolverNoroeste()">Resolver esquina noroeste</button>`;

    document.getElementById("matrizNoroeste").innerHTML = html;
    document.getElementById("resultadoNoroeste").innerHTML = "";
}

function resolverNoroeste() {
    const m = Number(document.getElementById("noFilas").value);
    const n = Number(document.getElementById("noColumnas").value);
    const costos = [];
    const oferta = [];
    const demanda = [];

    function leer(id) {
        const campo = document.getElementById(id);
        if (!campo || campo.value.trim() === "" || !Number.isFinite(Number(campo.value))) {
            throw new Error("Completa todos los campos con números válidos.");
        }
        return Number(campo.value);
    }

    try {
        for (let i = 0; i < m; i++) {
            const fila = [];
            for (let j = 0; j < n; j++) {
                fila.push(leer(`noC_${i}_${j}`));
            }
            costos.push(fila);
            oferta.push(leer(`noO_${i}`));
        }

        for (let j = 0; j < n; j++) {
            demanda.push(leer(`noD_${j}`));
        }

        if ([...oferta, ...demanda].some(v => v < 0)) {
            throw new Error("La oferta y la demanda no pueden ser negativas.");
        }

        const sumaOferta = oferta.reduce((a, b) => a + b, 0);
        const sumaDemanda = demanda.reduce((a, b) => a + b, 0);
        const ofertas = [...oferta];
        const demandas = [...demanda];
        const nombresO = Array.from({ length: m }, (_, i) => `Origen ${i + 1}`);
        const nombresD = Array.from({ length: n }, (_, j) => `Destino ${j + 1}`);
        const matrizCostos = costos.map(f => [...f]);
        const pasos = [];

        if (Math.abs(sumaOferta - sumaDemanda) > 1e-9) {
            if (sumaOferta < sumaDemanda) {
                matrizCostos.push(Array(n).fill(0));
                ofertas.push(sumaDemanda - sumaOferta);
                nombresO.push("Origen ficticio");
                pasos.push("Se agregó un origen ficticio con costo cero para equilibrar la oferta y la demanda.");
            } else {
                for (const fila of matrizCostos) fila.push(0);
                demandas.push(sumaOferta - sumaDemanda);
                nombresD.push("Destino ficticio");
                pasos.push("Se agregó un destino ficticio con costo cero para equilibrar la oferta y la demanda.");
            }
        } else {
            pasos.push("La oferta total y la demanda total son iguales: el problema está equilibrado.");
        }

        const asignacion = Array.from(
            { length: ofertas.length },
            () => Array(demandas.length).fill(0)
        );

        let i = 0;
        let j = 0;
        let paso = 1;

        while (i < ofertas.length && j < demandas.length) {
            const cantidad = Math.min(ofertas[i], demandas[j]);
            asignacion[i][j] += cantidad;

            pasos.push(
                `Paso ${paso}: ${nombresO[i]} → ${nombresD[j]}. ` +
                `Asignar ${formatearNumero(cantidad)} unidades.`
            );

            ofertas[i] -= cantidad;
            demandas[j] -= cantidad;

            if (Math.abs(ofertas[i]) < 1e-9) ofertas[i] = 0;
            if (Math.abs(demandas[j]) < 1e-9) demandas[j] = 0;

            const filaAgotada = ofertas[i] === 0;
            const columnaCompleta = demandas[j] === 0;

            if (filaAgotada) i++;
            if (columnaCompleta) j++;
            paso++;
        }

        const costoTotal = asignacion.reduce((total, fila, fi) =>
            total + fila.reduce((subtotal, cantidad, cj) =>
                subtotal + cantidad * matrizCostos[fi][cj], 0), 0);

        let html = `
            <div class="resultado">
                <h2>Resultado de esquina noroeste</h2>
                <p><strong>Costo total:</strong> ${formatearNumero(costoTotal)}</p>
                <p>Las celdas muestran la cantidad transportada y el costo unitario.</p>
                <div class="tabla-scroll">
                <table class="tabla-simplex">
                    <thead><tr><th>Origen / Destino</th>`;

        nombresD.forEach(nombre => html += `<th>${nombre}</th>`);
        html += `<th>Oferta asignada</th></tr></thead><tbody>`;

        asignacion.forEach((fila, fi) => {
            html += `<tr><th>${nombresO[fi]}</th>`;
            let totalFila = 0;

            fila.forEach((cantidad, cj) => {
                totalFila += cantidad;
                const clase = cantidad > 0 ? "asignada" : "";
                html += `<td class="${clase}">
                    ${formatearNumero(cantidad)}
                    <small>(costo ${formatearNumero(matrizCostos[fi][cj])})</small>
                </td>`;
            });

            html += `<td>${formatearNumero(totalFila)}</td></tr>`;
        });

        html += `</tbody></table></div>
            <h3>Procedimiento</h3><ol>`;

        pasos.forEach(p => html += `<li>${p}</li>`);
        html += `</ol>
            <p><strong>Nota:</strong> este método obtiene una solución inicial factible; no garantiza por sí solo el costo mínimo.</p>
            </div>`;

        document.getElementById("resultadoNoroeste").innerHTML = html;

    } catch (error) {
        alert(error.message);
    }
}