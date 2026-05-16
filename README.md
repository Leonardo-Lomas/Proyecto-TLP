
# Proyecto-TLP — Motor de Inferencia Lógica como Servicio

Servicio web basado en **lógica declarativa** que permite ejecutar consultas
sobre una base de conocimiento escrita en **Prolog** a través de una API REST
desarrollada en **Node.js** con **Express**.

El sistema actúa como un motor de inferencia simbólica: el usuario envía
consultas lógicas y recibe resultados derivados mediante reglas declarativas,
integrando tres paradigmas de programación estudiados en la materia de Teoría
de Lenguajes de Programación:

- **Programación lógica** — base de conocimiento en Prolog (Tau Prolog).
- **Programación funcional** — transformación de datos en JavaScript.
- **Programación asíncrona** — modelo de ejecución de Node.js (`async/await` y *Promises*).

---

## Tabla de contenido

- [Requisitos previos](#requisitos-previos)
- [Instalación local](#instalación-local)
- [Ejecución](#ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso de la API](#uso-de-la-api)
- [Ejemplos de consultas](#ejemplos-de-consultas)
- [Base de conocimiento](#base-de-conocimiento)
- [Reporte del proyecto](#reporte-del-proyecto)

---

## Requisitos previos

| Herramienta | Versión recomendada | Notas |
|-------------|---------------------|-------|
| [Node.js](https://nodejs.org/) | 18 LTS o superior | Incluye `npm` |
| `npm`       | 9 o superior        | Gestor de paquetes |

Verifica que estén instalados:

```bash
node --version
npm --version
```

---

## Instalación local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/Leonardo-Lomas/Proyecto-TLP.git
   cd Proyecto-TLP
   ```

2. **Instalar las dependencias** (Express y Tau Prolog):

   ```bash
   npm install
   ```

   Esto crea la carpeta `node_modules/` con las dependencias declaradas en
   `package.json`:

   - `express` — framework para el servidor HTTP y el ruteo.
   - `tau-prolog` — intérprete de Prolog que ejecuta la inferencia lógica.
   - `nodemon` (dependencia de desarrollo) — reinicio automático del servidor.

---

## Ejecución

### Modo normal

```bash
npm start
```

### Modo desarrollo (recarga automática con nodemon)

```bash
npm run dev
```

En ambos casos, al iniciar correctamente verás en la consola:

```
Servidor corriendo en http://localhost:3000
```

El servicio queda escuchando en **http://localhost:3000**. Para detenerlo,
presiona `Ctrl + C` en la terminal.

---

## Estructura del proyecto

```
Proyecto-TLP/
├── knowledge/
│   └── base.pl          # Base de conocimiento: hechos y reglas en Prolog
├── src/
│   ├── server.js        # Servidor Express y definición de endpoints
│   └── inference.js     # Motor de inferencia: integración con Tau Prolog
├── test.http            # Consultas de ejemplo (extensión REST Client)
├── package.json         # Metadatos y dependencias del proyecto
└── README.md
```

---

## Uso de la API

| Método | Ruta     | Descripción                                         |
|--------|----------|-----------------------------------------------------|
| `GET`  | `/`      | Endpoint de prueba. Confirma que el motor está activo. |
| `POST` | `/query` | Recibe una consulta lógica y devuelve la inferencia. |

### `POST /query`

**Cuerpo de la petición** (JSON):

```json
{
  "query": "valid_contract(contract2)."
}
```

> La consulta debe ser un término Prolog válido. Si se omite el punto final
> (`.`), el servicio lo agrega automáticamente al **normalizar la entrada**.

**Respuesta exitosa** — el resultado es un arreglo con cada solución encontrada:

```json
{
  "success": true,
  "result": ["true"]
}
```

**Respuesta sin solución** — cuando la consulta no se puede satisfacer:

```json
{
  "success": false,
  "error": "No se encontró respuesta"
}
```

---

## Ejemplos de consultas

### Con `curl`

```bash
# Endpoint de prueba
curl http://localhost:3000/

# Verificar si un contrato tiene penalidad (hecho)
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"penalty_applicable(contract1).\"}"

# Verificar un contrato válido (regla)
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"valid_contract(contract2).\"}"

# Consulta con variable: lista todos los contratos válidos
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"valid_contract(X).\"}"
```

Salida esperada de la última consulta:

```json
{ "success": true, "result": ["X = contract2", "X = contract3"] }
```

### Con la extensión REST Client (VS Code)

El archivo [`test.http`](./test.http) contiene consultas listas para ejecutar.
Con la extensión **REST Client** instalada, abre el archivo y pulsa
*"Send Request"* sobre cualquiera de los bloques.

---

## Base de conocimiento

El archivo [`knowledge/base.pl`](./knowledge/base.pl) modela un dominio de
**contratos y clientes**:

- **Hechos:** `contract/1`, `penalty_applicable/1`, `client/1`, `owns/2`.
- **Reglas:**
  - `valid_contract(X)` — el contrato existe y **no** tiene penalidad.
  - `valid_client(C)` — el cliente posee un contrato válido.
  - `penalized_client(C)` — el cliente posee un contrato con penalidad.

Para modificar el dominio basta con editar `base.pl`; el motor recarga la base
en cada consulta, por lo que no es necesario reiniciar el servidor.

---

## Reporte del proyecto

El documento [`Reporte-Proyecto-TLP.pdf`](./Reporte-Proyecto-TLP.pdf) contiene
el reporte completo del proyecto: introducción, explicación de los paradigmas
de programación, arquitectura, ejemplo de ejecución y conclusiones.
