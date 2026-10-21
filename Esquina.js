function mostrarNoroeste() {
    const contenido = document.getElementById("contenido");

    contenido.innerHTML = `
        <div style="width:100%; max-width:100%; box-sizing:border-box;">
            <h2>Método de la Esquina Noroeste</h2>

            <p>
                Ingresa el número de orígenes y destinos para generar
                la matriz de costos de transporte.
            </p>

            <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:end;">
                <div>
                    <label for="noFilas">Número de orígenes:</label><br>
                    <input
                        type="number"
                        id="noFilas"
                        min="1"
                        step="1"
                        value="3"
                        style="max-width:120px; box-sizing:border-box;"
                    >
                </div>

                <div>
                    <label for="noColumnas">Número de destinos:</label><br>
                    <input
                        type="number"
                        id="noColumnas"
                        min="1"
                        step="1"
                        value="3"
                        style="max-width:120px; box-sizing:border-box;"
                    >
                </div>

                <button type="button" onclick="generarMatrizNoroeste()">
                    Generar matriz
                </button>
            </div>

            <div id="matrizNoroeste" style="width:100%; max-width:100%; margin-top:20px;"></div>
            <div id="resultadoNoroeste" style="width:100%; max-width:100%; margin-top:20px;"></div>
        </div>
    `;
}


function generarMatrizNoroeste() {
    const filas = Number(document.getElementById("noFilas").value);
    const columnas = Number(document.getElementById("noColumnas").value);

    const contenedor = document.getElementById("matrizNoroeste");
    const resultado = document.getElementById("resultadoNoroeste");

    resultado.innerHTML = "";

    if (
        !Number.isInteger(filas) ||
        !Number.isInteger(columnas) ||
        filas < 1 ||
        columnas < 1
    ) {
        contenedor.innerHTML = "<p>Ingresa cantidades válidas de orígenes y destinos.</p>";
        return;
    }

    let html = `
        <h3>Matriz de costos</h3>
        <div style="width:100%; max-width:100%; overflow-x:auto;">
            <table style="width:100%; table-layout:fixed; border-collapse:collapse; text-align:center;">
                <thead>
                    <tr>
                        <th></th>
    `;

    for (let j = 0; j < columnas; j++) {
        html += `<th>Destino ${j + 1}</th>`;
    }

    html += `
                        <th>Oferta</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (let i = 0; i < filas; i++) {
        html += `<tr><th>Origen ${i + 1}</th>`;

        for (let j = 0; j < columnas; j++) {
            html += `
                <td>
                    <input
                        type="number"
                        id="noC_${i}_${j}"
                        min="0"
                        step="any"
                        value="0"
                        aria-label="Costo del origen ${i + 1} al destino ${j + 1}"
                        style="width:90%; max-width:100px; box-sizing:border-box;"
                    >
                </td>
            `;
        }

        html += `
            <td>
                <input
                    type="number"
                    id="noO_${i}"
                    min="0"
                    step="any"
                    value="0"
                    aria-label="Oferta del origen ${i + 1}"
                    style="width:90%; max-width:100px; box-sizing:border-box;"
                >
            </td>
        </tr>
        `;
    }

    html += `<tr><th>Demanda</th>`;

    for (let j = 0; j < columnas; j++) {
        html += `
            <td>
                <input
                    type="number"
                    id="noD_${j}"
                    min="0"
                    step="any"
                    value="0"
                    aria-label="Demanda del destino ${j + 1}"
                    style="width:90%; max-width:100px; box-sizing:border-box;"
                >
            </td>
        `;
    }

    html += `
        <td>—</td>
        </tr>
        </tbody>
        </table>
        </div>

        <div style="margin-top:16px;">
            <button type="button" onclick="resolverNoroeste()">
                Resolver método
            </button>
        </div>
    `;

    contenedor.innerHTML = html;
}


function resolverNoroeste() {
    const filasOriginales = Number(document.getElementById("noFilas").value);
    const columnasOriginales = Number(document.getElementById("noColumnas").value);

    const resultado = document.getElementById("resultadoNoroeste");

    if (
        !Number.isInteger(filasOriginales) ||
        !Number.isInteger(columnasOriginales) ||
        filasOriginales < 1 ||
        columnasOriginales < 1
    ) {
        resultado.innerHTML = "<p>Ingresa cantidades válidas de orígenes y destinos.</p>";
        return;
    }

    let filas = filasOriginales;
    let columnas = columnasOriginales;

    const costos = [];
    const oferta = [];
    const demanda = [];

    for (let i = 0; i < filasOriginales; i++) {
        costos[i] = [];

        for (let j = 0; j < columnasOriginales; j++) {
            const campo = document.getElementById(`noC_${i}_${j}`);
            const valor = Number(campo.value);

            if (
                campo.value.trim() === "" ||
                !Number.isFinite(valor) ||
                valor < 0
            ) {
                resultado.innerHTML = "<p>Todos los costos deben ser números válidos mayores o iguales a cero.</p>";
                return;
            }

            costos[i][j] = valor;
        }
    }

    for (let i = 0; i < filasOriginales; i++) {
        const campo = document.getElementById(`noO_${i}`);
        const valor = Number(campo.value);

        if (
            campo.value.trim() === "" ||
            !Number.isFinite(valor) ||
            valor < 0
        ) {
            resultado.innerHTML = "<p>Todas las ofertas deben ser números válidos mayores o iguales a cero.</p>";
            return;
        }

        oferta.push(valor);
    }

    for (let j = 0; j < columnasOriginales; j++) {
        const campo = document.getElementById(`noD_${j}`);
        const valor = Number(campo.value);

        if (
            campo.value.trim() === "" ||
            !Number.isFinite(valor) ||
            valor < 0
        ) {
            resultado.innerHTML = "<p>Todas las demandas deben ser números válidos mayores o iguales a cero.</p>";
            return;
        }

        demanda.push(valor);
    }

    let ofertaTotal = oferta.reduce((suma, valor) => suma + valor, 0);
    let demandaTotal = demanda.reduce((suma, valor) => suma + valor, 0);

    if (ofertaTotal < demandaTotal) {
        costos.push(new Array(columnas).fill(0));
        oferta.push(demandaTotal - ofertaTotal);
        filas++;
    }

    else if (ofertaTotal > demandaTotal) {
        for (let i = 0; i < filas; i++) {
            costos[i].push(0);
        }

        demanda.push(ofertaTotal - demandaTotal);
        columnas++;
    }

    const asignacion = Array.from(
        { length: filas },
        () => Array(columnas).fill(0)
    );

    const recorrido = Array.from(
        { length: filas },
        () => Array(columnas).fill(false)
    );

    const ofertaRestante = [...oferta];
    const demandaRestante = [...demanda];

    let i = 0;
    let j = 0;
    let costoTotal = 0;

    while (i < filas && j < columnas) {
        recorrido[i][j] = true;

        const cantidad = Math.min(
            ofertaRestante[i],
            demandaRestante[j]
        );

        asignacion[i][j] = cantidad;
        costoTotal += cantidad * costos[i][j];

        ofertaRestante[i] -= cantidad;
        demandaRestante[j] -= cantidad;

        const ofertaAgotada = Math.abs(ofertaRestante[i]) < 1e-9;
        const demandaSatisfecha = Math.abs(demandaRestante[j]) < 1e-9;

        if (ofertaAgotada && demandaSatisfecha) {
            i++;
            j++;
        } else if (ofertaAgotada) {
            i++;
        } else if (demandaSatisfecha) {
            j++;
        } else {

            break;
        }
    }

    let html = `
        <h3>Resultado final</h3>

        <p>
            <strong>Costo total de transporte:</strong>
            ${formatearNumero(costoTotal)}
        </p>

        <div style="width:100%; max-width:100%; overflow-x:auto;">
            <table style="width:100%; table-layout:fixed; border-collapse:collapse; text-align:center;">
                <thead>
                    <tr>
                        <th></th>
    `;

    for (let j = 0; j < columnas; j++) {
        const nombreDestino = j < columnasOriginales
            ? `Destino ${j + 1}`
            : "Destino ficticio";

        html += `<th>${nombreDestino}</th>`;
    }

    html += `<th>Oferta</th></tr></thead><tbody>`;

    for (let i = 0; i < filas; i++) {
        const nombreOrigen = i < filasOriginales
            ? `Origen ${i + 1}`
            : "Origen ficticio";

        html += `<tr><th>${nombreOrigen}</th>`;

        for (let j = 0; j < columnas; j++) {
            const cantidad = asignacion[i][j];
            const costo = costos[i][j];

            const estilo = recorrido[i][j]
                ? "background-color:#b7e4c7;color:#14532d;"
                : "";

            html += `
                <td style="${estilo} overflow-wrap:anywhere;">
                    ${formatearNumero(cantidad)}
                    <br>
                    <small>Costo: ${formatearNumero(costo)}</small>
                </td>
            `;
        }

        html += `<td>${formatearNumero(oferta[i])}</td></tr>`;
    }

    html += `<tr><th>Demanda</th>`;

    for (let j = 0; j < columnas; j++) {
        html += `<td>${formatearNumero(demanda[j])}</td>`;
    }

    html += `
        <td>—</td>
        </tr>
        </tbody>
        </table>
        </div>

        <p style="margin-top:12px;">
            <span style="display:inline-block; width:12px; height:12px; background-color:#b7e4c7;"></span>
            Celdas recorridas por el método de la Esquina Noroeste.
        </p>
    `;

    resultado.innerHTML = html;
}

function formatearNumero(numero) {
    return Number(numero).toLocaleString("es-GT", {
        maximumFractionDigits: 4
    });
}