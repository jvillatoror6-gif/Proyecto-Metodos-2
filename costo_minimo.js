let numColumnas = 0;
let numFilas = 0;

function mostrarCostoMinimo(){
    const contenido = document.getElementById("contenido");

    contenido.innerHTML = ` 
        <div class="formulario">
            <h2>Método Costo Minimo</h2>
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

            <button onclick="resolverCostoMinimo()">
                Resolver Costo Minimo
            </button>

            <div id="resultado"></div>
        </div>
    `;
}

function ingresarDatosMatriz(){
    numColumnas = Number(document.getElementById("numColumnas").value);
    numFilas = Number (document.getElementById("numFilas").value);

    if (numColumnas < 1 || numFilas < 1 ){
        alert("Los valores deben ser mayores que 0");
        return;
    }

    let html = "";

    html += `
        <h3>Cantidades de la Oferta</h3>
        <div class="fila">
    `;

    for (let i = 1; i <= numFilas; i++) {
        html += `
            <input type="number"
            id="z${i}"
            placeholder="Oferta ${i}">`;
    }

    html += `
        </div>
    `;

    html += `
        <h3>Cantidades de la Demanda</h3>
        <div class="fila">
    `;

    for (let j = 1; j <= numColumnas; j++) {
        html += `
            <input 
                type="number"
                id="y${j}"
                placeholder="Demanda ${j}">
        `;
    }

    html += `
        </div>
    `;

    html += `
        <h3>Matriz de Costos</h3>
        <div class="fila"></div>
    `;

    for (let i = 1; i <= numFilas; i++) {
        html += `
            <div class="matriz">
        `;

        for (let j = 1; j <= numColumnas; j++) {
            html += `
                <input
                    type="number"
                    id="r${i}${j}">
            `;
        }
        html += `</div>`; 
    }

    document.getElementById("matrizInicial").innerHTML = html;
}

function resolverCostoMinimo(){

    if(!comparacionOfertaDemanda()){
        return;
    }

    let matrizCostos = datosMatrizCostos();
    let datos = recoleccionDatos();

    while (datos.ofertaRestante.some(orestante => orestante > 0) && 
    datos.demandaRestante.some(drestante => drestante > 0)) {
        let menorCosto = Infinity;
        let filaMin = -1;
        let colMin = -1;

        for (let i = 0; i < numFilas; i++) {
            for (let j = 0; j < numColumnas; j++) {
                if (datos.ofertaRestante[i] > 0 && datos.demandaRestante[j] > 0) {
                    if (matrizCostos[i][j] < menorCosto) {
                        menorCosto = matrizCostos[i][j];
                        filaMin = i;
                        colMin = j;
                    }
                }
            }
        }

    if (filaMin === -1 || colMin === -1) break;

    let cantidadAsignada = Math.min(datos.ofertaRestante[filaMin], datos.demandaRestante[colMin]);
    datos.asignaciones[filaMin][colMin] = cantidadAsignada;

    datos.ofertaRestante[filaMin] -= cantidadAsignada;
    datos.demandaRestante[colMin] -= cantidadAsignada;
    }
    
    matrizFinal(matrizCostos, datos.datosOferta, datos.datosDemanda, datos.asignaciones);
    
}

function comparacionOfertaDemanda(){
    let sumaOferta = 0;
    let sumaDemanda = totalOfertaDemanda('y',numColumnas)

    for (let j = 1; j <= numFilas; j++) {
        const valor = Number(document.getElementById(`z${j}`).value);
        sumaOferta += valor;
    }
    
    if (sumaDemanda !== sumaOferta){
        alert("La suma de la Oferta y Demanda debe ser Igual");
        return false;
    }

    return true;
}

function datosMatrizCostos(){
    let matrizCostos = [];

    for (let i = 1; i <= numFilas; i++) {
            let filaActual = [];

        for (let j = 1; j <= numColumnas; j++) {
            const inputCelda = document.getElementById(`r${i}${j}`);
            const valor = inputCelda ? Number(inputCelda.value) : 0;
            filaActual.push(valor);
        }

        matrizCostos.push(filaActual);
    }

    return matrizCostos;
}

function crearMatrizCostos (){
    let datosOferta = [];
    let datosDemanda = [];
    let html = "";
    let matrizCostos = datosMatrizCostos();
    let sumaDemanda = totalOfertaDemanda('y',numColumnas);

    for (let j = 1; j <= numFilas; j++) {
        datosOferta.push(Number(document.getElementById(`z${j}`).value));
    }

    for (let k = 1; k <= numColumnas; k++){
        datosDemanda.push(Number(document.getElementById(`y${k}`).value));
    }

    html += "<table>"; 

        html += "<tr>";
            html += "<th>-</th>"; 
            for (let j = 1; j <= numColumnas; j++) {
                html += `<th>Demanda ${j}</th>`;
            }
            html += "<th>Oferta</th>"; 
        html += "</tr>";

        for (let i = 0; i < numFilas; i++) {
            html += "<tr>";
                html += `<th>Oferta ${i + 1}</th>`; 
        
                for (let j = 0; j < numColumnas; j++) {
                    html += `<td>${matrizCostos[i][j]}</td>`;
                }
        
                html += `<td>${datosOferta[i]}</td>`;
            html += "</tr>";
        }

        html += "<tr>";
            html += "<th>Demanda</th>";
            for (let j = 0; j < numColumnas; j++) {
                html += `<td>${datosDemanda[j]}</td>`;
            }

            html += `<td>${sumaDemanda}</td>`; 
        html += "</tr>";

    html += "</table>"; 

    document.getElementById("verMatrizCostos").innerHTML = html;
}

function matrizFinal(matrizCostos, datosOferta, datosDemanda, asignaciones){
    let html = "<h3>Resultado del Método de Costo Mínimo</h3>";
    let sumaDemanda = totalOfertaDemanda('y',numColumnas)
    let precioCostoFinal =  costoFinal(matrizCostos, asignaciones);

    html += "<table>";

    html += "<tr>";
    html += "<th>-</th>";
    for (let j = 1; j <= numColumnas; j++) {
        html += `
        <th>Demanda ${j}</th>
        `;
    }
    html += "<th>Oferta</th>";
    html += "</tr>";

    for (let i = 0; i < numFilas; i++) {
        html += "<tr>";
        html += `
        <th>Oferta ${i + 1}</th>
        `; 
        
        for (let j = 0; j < numColumnas; j++) {
            
            let asignacionActual = asignaciones[i][j] > 0 ? ` [${asignaciones[i][j]}]` : "";
            html += `<td>${matrizCostos[i][j]}${asignacionActual}</td>`;
        }
        
        html += `<td>${datosOferta[i]}</td>`;
        html += "</tr>";
    }

  
    html += "<tr>";
    html += "<th>Demanda</th>";
    for (let j = 0; j < numColumnas; j++) {
        html += `<td>${datosDemanda[j]}</td>`;
    }
    html += `<td>${sumaDemanda}</td>`; 
    html += "</tr>";

    html += "</table>"; 

    html += `
    <p>Costo Total de Transporte: ${precioCostoFinal}</p>
    `;
    
    document.getElementById("resultado").innerHTML = html;
}

function totalOfertaDemanda(y, numColumnas){
    let sumaDemanda = 0;

    for (let k = 1; k <= numColumnas; k++) {
        const valor = Number(document.getElementById(`y${k}`).value);
        sumaDemanda += valor;
    }

    return sumaDemanda;
}

function costoFinal(matrizCostos, asignaciones){
    let costoTotal = 0;
    
    for (let i = 0; i < numFilas; i++) {
        for (let j = 0; j < numColumnas; j++) {
            
            if (asignaciones[i][j] > 0) {
                costoTotal += matrizCostos[i][j] * asignaciones[i][j];
            }
        }
    }
    
    return costoTotal;
}

function recoleccionDatos(){
    let datosOferta = [];
    let datosDemanda = [];

    for (let j = 1; j <= numFilas; j++) {
        datosOferta.push(Number(document.getElementById(`z${j}`).value));
    }

    for (let k = 1; k <= numColumnas; k++){
        datosDemanda.push(Number(document.getElementById(`y${k}`).value))
    }

    let ofertaRestante = [...datosOferta];
    let demandaRestante = [...datosDemanda];
    let asignaciones = Array(numFilas).fill(0).map(() => Array(numColumnas).fill(0));

    return{datosOferta, datosDemanda, ofertaRestante, demandaRestante, asignaciones};
}