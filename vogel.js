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

                <button onclick="ingresarDatosMatriz()()">
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