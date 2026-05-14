const pl = require('tau-prolog');
require('tau-prolog/modules/lists');

// Función para ejecutar consultas sobre la base de conocimiento
function runQuery(query, knowledgeBasePath) {
  const session = pl.create();

  // Cargar la base de conocimiento desde archivo .pl
  try {
    session.consult(knowledgeBasePath);
  } catch (err) {
    return Promise.reject(`Error al cargar la base de conocimiento: ${err}`);
  }

  // Ejecutar la consulta
  try {
    session.query(query);
  } catch (err) {
    return Promise.reject(`Error en la consulta: ${err}`);
  }

  return new Promise((resolve, reject) => {
    let answers = [];
    session.answers(answer => {
      if (answer) {
        answers.push(pl.format_answer(answer));
      } else {
        if (answers.length > 0) {
          resolve(answers);
        } else {
          reject("No se encontró respuesta");
        }
      }
    });
  });
}

module.exports = { runQuery };
