import pandas as pd
import numpy as np
import tkinter as tk
import networkx as nx 
import matplotlib.pyplot as plt

# LEER ARCHIVO EXCEL


archivo = pd.read_excel("Municipios progra.xlsx", index_col=0)

# Guardar nombres de municipios
nodos = list(archivo.index)

# Convertir Excel a matriz numpy
matriz = archivo.to_numpy(dtype=float)

# Cambiar ceros por infinito
matriz[matriz == 0] = float('inf')

# Mantener diagonal principal en 0
np.fill_diagonal(matriz, 0)


# ALGORITMO DE DIJKSTRA
def dijkstra(matriz, inicio):

    n = len(matriz)

    visitado = [False] * n
    distancia = [float('inf')] * n
    anterior = [-1] * n

    distancia[inicio] = 0

    for _ in range(n):

        min_dist = float('inf')
        u = -1

# Buscar nodo con menor distancia
        for i in range(n):

            if not visitado[i] and distancia[i] < min_dist:

                min_dist = distancia[i]
                u = i

        visitado[u] = True

# Revisar vecinos
        for v in range(n):

            if not visitado[v]:

                if matriz[u][v] != float('inf'):

                    nueva_distancia = distancia[u] + matriz[u][v]

                    if nueva_distancia < distancia[v]:

                        distancia[v] = nueva_distancia
                        anterior[v] = u

    return distancia, anterior
     
# OBTENER RUTA
def obtener_ruta(anterior, destino):

    ruta = []

    while destino != -1:

        ruta.insert(0, destino)

        destino = anterior[destino]

    return ruta


# FUNCIÓN PRINCIPAL

def calcular():

    origen = combo_municipio_origen.get()
    destino = combo_municipio_destino.get()

    peso = float(entry_peso.get())

    inicio = nodos.index(origen)
    fin = nodos.index(destino)

    # Ejecutar Dijkstra
    distancias, anterior = dijkstra(matriz, inicio)

    # Obtener ruta
    ruta = obtener_ruta(anterior, fin)

    # calcualar COSTO

    Costo_base = 25
    Utilidad = 0.30

    if distancias[fin] >= 0 and distancias[fin] <= 10:
        costo_km = 2.5
    elif distancias[fin] <= 50:
        costo_km = 2.20
    else:
        costo_km = 2

    if peso >= 0 and peso <= 1:
        costo_libra = 5
    elif peso > 1 and peso <= 5:
        costo_libra = 3
    elif peso > 5 and peso <= 10:
        costo_libra = 2.5
    else:
        costo_libra = 10

    Costo_total = (
        Costo_base +
        (costo_km * distancias[fin]) +
        (costo_libra * peso)
    )

    Precio_final = (
        Costo_total + (Costo_total * Utilidad)
    )

    # MOSTRAR RUTA

    texto_ruta = ""

    for i in ruta:

        texto_ruta += nodos[i] + "\n"

    # MOSTRAR RESULTADOS

    resultado.config(
        text=
        f"Distancia mínima: {distancias[fin]} km\n\n"
        f"Ruta:\n{texto_ruta}\n"
        f"Costo Total: Q{Costo_total:.2f}\n"
        f"Precio Final: Q{Precio_final:.2f}"
    )

# ALGORITMO DE FLOYD

def floyd(matriz):

    N = len(matriz)

    matriz_dist = matriz.copy()

    for k in range(0, N):

        for i in range(0, N):

            for j in range(0, N):

                if (matriz_dist[i,k] + matriz_dist[k,j]) < matriz_dist[i,j]:

                    matriz_dist[i,j] = (
                        matriz_dist[i,k] + matriz_dist[k,j]
                    )

    return matriz_dist

def calcular_floyd():

    origen = combo_municipio_origen.get()
    destino = combo_municipio_destino.get()

    inicio = nodos.index(origen)
    fin = nodos.index(destino)

    distancias = floyd(matriz)

    resultado.config(
        text=
        f"Distancia mínima con Floyd:\n\n"
        f"{distancias[inicio][fin]} km"
    )


def grafo():

    archivo = 'Municipios proyectoProgra.xlsx'

    df = pd.read_excel(archivo, sheet_name= 'Hoja1', index_col=0)

    nombres_municipios = df.index.tolist()

    municipios = df.index.tolist()

    matriz = df.to_numpy(dtype=float) 

    G= nx.from_numpy_array(matriz)

    mapeo_nombres = {i: nombre for i, nombre in enumerate(nombres_municipios)}
    G = nx.relabel_nodes(G, mapeo_nombres)

    posicion = nx.spring_layout(G)

    nx.draw(G, posicion, with_labels=True, node_color="green", node_size=500, font_size=7)

    distancia = nx.get_edge_attributes(G, 'weight')

    nx.draw_networkx_edge_labels(G, posicion, edge_labels= distancia, font_size=7)

    plt.show()

    return 0


# INTERFAZ TKINTER

ventana = tk.Tk()
ventana.configure(bg="#dfe6e9")
ventana.title("Envios NeonCore")

ventana.geometry("500x300")


# DEPARTAMENTO ORIGEN 

departamentos = [
    "Retalhuleu",
    "Suchitepequez",
    "Escuintla"
]

tk.Label(
    ventana,
    text="Departamento Origen"
).pack(pady=5)

combo_departamento_origen = tk.StringVar()

combo_departamento_origen.set(departamentos[0])

tk.OptionMenu(
    ventana,
    combo_departamento_origen,
    *departamentos
).pack(pady=5)

#MUNICIPIO ORIGEN 

tk.Label(
    ventana,
    text="Municipio Origen"
).pack(pady=5)

combo_municipio_origen = tk.StringVar()

combo_municipio_origen.set(nodos[0])

tk.OptionMenu(
    ventana,
    combo_municipio_origen,
    *nodos
).pack(pady=5)

#  DEPARTAMENTO DESTINO 

tk.Label(
    ventana,
    text="Departamento Destino"
).pack(pady=5)

combo_departamento_destino = tk.StringVar()

combo_departamento_destino.set(departamentos[0])

tk.OptionMenu(
    ventana,
    combo_departamento_destino,
    *departamentos
).pack(pady=5)

# MUNICIPIO DESTINO 

tk.Label(
    ventana,
    text="Municipio Destino"
).pack(pady=5)

combo_municipio_destino = tk.StringVar()

combo_municipio_destino.set(nodos[1])

tk.OptionMenu(
    ventana,
    combo_municipio_destino,
    *nodos
).pack(pady=5)

# PESO
tk.Label(
    ventana,
    text="Peso del paquete"
).pack(pady=5)

entry_peso = tk.Entry(ventana)

entry_peso.pack()

# BOTÓN

tk.Button(
    ventana,
    text="Calcular Ruta",
    command=calcular
      ) .pack(pady=5)



tk.Button(
    ventana,
    text="Grafo",
    command= grafo
      ) .pack(pady=5)


tk.Button(
    ventana,
    text="Floyd",
    command=calcular_floyd
       ).pack(pady=5)

# RESULTADOS
resultado = tk.Label(
    ventana,
    text="",
    justify="left",
    font=("Arial", 9),
    bg="white",
    width=60,
    height=30,
    anchor="nw",
    relief="solid"
)

resultado.pack()

# EJECUTAR VENTAN

ventana.mainloop()