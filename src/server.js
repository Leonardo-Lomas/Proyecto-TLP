const express = require('express');
const { runQuery } = require('./inference');

const app = express();
app.use(express.json());

// Endpoint raíz de prueba
app.get('/', (req, res) => {
  res.json({ message: "Motor de inferencia activo" });
});

// Endpoint de consultas lógicas
app.post('/query', async (req, res) => {
    console.log("Consulta recibida:", req.body);
  const { query } = req.body;

  try {
    const result = await runQuery(query, "./knowledge/base.pl");
    res.json({ success: true, result });
  } catch (error) {
    res.json({ success: false, error });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
