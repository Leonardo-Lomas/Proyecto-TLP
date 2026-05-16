const pl = require('tau-prolog');
require('tau-prolog/modules/lists');

const fs = require('fs/promises');

// Convierte un error de Tau Prolog en un mensaje de texto legible
// Si es una excepcin throw(error(..)), extrae el contenido del error.
function describeError(error) {
  if (pl.type.is_error(error)) {
    return error.args[0].toString();
  }
  return String(error);
}

// Normaliza la entrada (función pura — paradigma funcional): recorta los
// espacios y garantiza el punto final que exige la sintaxis de Prolog.
function normalizeQuery(query) {
  const limpia = query.trim();
  return limpia.endsWith('.') ? limpia : limpia + '.';
}

// Función para ejecutar consultas sobre la base de conocimiento
async function runQuery(query, knowledgeBasePath) {

  // Validación de entrada: la consulta debe ser una cadena no vacía
  if (typeof query !== 'string' || query.trim() === '') {
    throw 'La consulta debe ser una cadena de texto no vacía.';
  }

  // Normalización de la entrada (paradigma funcional)
  const normalizedQuery = normalizeQuery(query);

  // Leer archivo Prolog
  const knowledgeBase = await fs.readFile(
    knowledgeBasePath,
    'utf8'
  );

  const session = pl.create();

  // Cargar contenido Prolog
  await new Promise((resolve, reject) => {
    session.consult(knowledgeBase, {
      success: resolve,
      error: err => reject(
        'Error al cargar la base de conocimiento: ' + describeError(err)
      )
    });
  });

  // Ejecutar consulta
  await new Promise((resolve, reject) => {
    session.query(normalizedQuery, {
      success: resolve,
      error: err => reject('Consulta inválida: ' + describeError(err))
    });
  });

  // Obtener respuestas
  return new Promise((resolve, reject) => {

    const answers = [];

    session.answers(answer => {

      if (answer === false) {

        // No hay (más) respuestas
        if (answers.length > 0) {
          resolve(answers);
        } else {
          reject("No se encontró respuesta");
        }

      } else if (pl.type.is_error(answer)) {

        // La consulta lanzo una excepcn (p. ej. predicado inexistente)
        reject('Error durante la inferencia: ' + describeError(answer));

      } else {

        answers.push(
          pl.format_answer(answer)
        );

      }

    });

  });

}

module.exports = { runQuery };
