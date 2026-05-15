const pl = require('tau-prolog');
require('tau-prolog/modules/lists');

const fs = require('fs/promises');

// Función para ejecutar consultas sobre la base de conocimiento
async function runQuery(query, knowledgeBasePath) {

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
      error: reject
    });
  });

  // Ejecutar consulta
  await new Promise((resolve, reject) => {
    session.query(query, {
      success: resolve,
      error: reject
    });
  });

  // Obtener respuestas
  return new Promise((resolve, reject) => {

    const answers = [];

    session.answers(answer => {

      if (answer === false) {

        if (answers.length > 0) {
          resolve(answers);
        } else {
          reject("No se encontró respuesta");
        }

      } else {

        answers.push(
          pl.format_answer(answer)
        );

      }

    });

  });

}

module.exports = { runQuery };