function mostrarVogel(){
    const contenido = document.getElementById("contenido");

    contenido.innerHTML = ` 
        <div class="formulario">
            <h2>Método de Aproixmacion de Vogel</h2>
            <h3>Tamaño de la tabla</h3>
            <div class="fila">
                <label>Número de Columnas para la Demanda:</label> <br>
                <input type="number" id="numColumnas" min="1" value="0"> <br>

                <label>Número de Filas para la Oferta:</label> <br>
                <input type="number" id="numFilas" min="1" value="0"> <br>

                <button onclick="ingresarDatosMatriz()">
                    Crear Matriz
                </button>

                <div id="matrizInicial"></div>
            </div>

            <button onclick="crearMatrizCostos ()">
                    Ver Matriz de Costos
                </button>
            <div id="verMatrizCostos"></div>

            <button onclick="resolverVogel()">
                Resolver Aproximacion de Vogel
            </button>

            <div id="resultado"></div>
        </div>
    `;

};

function resolverVogel(){
    if (!comparacionOfertaDemanda()) {
        return;
    }
    
    let datos = recoleccionDatos();
    let matrizCostos = datosMatrizCostos();
    let filasActivas = Array(numFilas).fill(true);
    let colsActivas = Array(numColumnas).fill(true);

    while (datos.ofertaRestante.some(o => o > 0) && datos.demandaRestante.some(d => d > 0)) {
        let mayorPenalizacion = -1;
        let esFila = true; 
        let indiceElegido = -1;

        let penalizacionesFilas = Array(numFilas).fill(0);
        for (let i = 0; i < numFilas; i++) {
            if (!filasActivas[i]) continue;
            let costosFila = [];
            for (let j = 0; j < numColumnas; j++) {
                if (colsActivas[j]) {
                    costosFila.push(matrizCostos[i][j]);
                }
            }
            costosFila.sort((a, b) => a - b);
            if (costosFila.length >= 2) {
                penalizacionesFilas[i] = costosFila[1] - costosFila[0];
            } else if (costosFila.length === 1) {
                penalizacionesFilas[i] = costosFila[0];
            }

            if (penalizacionesFilas[i] > mayorPenalizacion) {
                mayorPenalizacion = penalizacionesFilas[i];
                esFila = true;
                indiceElegido = i;
            }
        }

        let penalizacionesCols = Array(numColumnas).fill(0);
        for (let j = 0; j < numColumnas; j++) {
            if (!colsActivas[j]) continue;
            let costosCol = [];
            for (let i = 0; i < numFilas; i++) {
                if (filasActivas[i]) {
                    costosCol.push(matrizCostos[i][j]);
                }
            }
            costosCol.sort((a, b) => a - b);
            if (costosCol.length >= 2) {
                penalizacionesCols[j] = costosCol[1] - costosCol[0];
            } else if (costosCol.length === 1) {
                penalizacionesCols[j] = costosCol[0];
            }

            if (penalizacionesCols[j] > mayorPenalizacion) {
                mayorPenalizacion = penalizacionesCols[j];
                esFila = false;
                indiceElegido = j;
            }
        }

        if (indiceElegido === -1) break;

        let filaMin = -1;
        let colMin = -1;
        let menorCosto = Infinity;

        if (esFila) {
            let i = indiceElegido;
            for (let j = 0; j < numColumnas; j++) {
                if (colsActivas[j] && matrizCostos[i][j] < menorCosto) {
                    menorCosto = matrizCostos[i][j];
                    filaMin = i;
                    colMin = j;
                }
            }
        } else {
            let j = indiceElegido;
            for (let i = 0; i < numFilas; i++) {
                if (filasActivas[i] && matrizCostos[i][j] < menorCosto) {
                    menorCosto = matrizCostos[i][j];
                    filaMin = i;
                    colMin = j;
                }
            }
        }

        if (filaMin === -1 || colMin === -1) break;

        let cantidadAsignada = Math.min(datos.ofertaRestante[filaMin], datos.demandaRestante[colMin]);
        datos.asignaciones[filaMin][colMin] = cantidadAsignada;

        datos.ofertaRestante[filaMin] -= cantidadAsignada;
        datos.demandaRestante[colMin] -= cantidadAsignada;

        if (datos.ofertaRestante[filaMin] === 0) {
            filasActivas[filaMin] = false;
        }
        if (datos.demandaRestante[colMin] === 0) {
            colsActivas[colMin] = false;
        }
    }

    matrizFinal(matrizCostos, datos.datosOferta, datos.datosDemanda, datos.asignaciones);

}