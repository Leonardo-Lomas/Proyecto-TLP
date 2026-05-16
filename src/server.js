const express = require('express');
const { runQuery } = require('./inference');

const app = express();
app.use(express.json());

// Endpoint raiz de prueba
app.get('/', (req, res) => {
  res.json({ message: "Motor de inferencia activo" });
});

// Endpoint de consultas logicas
app.post('/query', async (req, res) => {
  console.log("Consulta recibida:", req.body);
  const { query } = req.body;

  try {
    const result = await runQuery(query, "./knowledge/base.pl");
    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, error: String(error) });
  }
});

// Middleware de manejo de errores: evita exponer el stack trace del
// servidor (. cuando el cuerpo de la petición no es un JSON válido)
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      error: 'El cuerpo de la petición no es un JSON valido.'
    });
  }
  console.error('Error inesperado:', err);
  res.status(500).json({ success: false, error: 'Error interno del servidor.' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
