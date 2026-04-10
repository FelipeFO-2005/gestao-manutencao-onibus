require("dotenv").config();

// Importa bibliotecas
const express = require("express");
const mysql = require("mysql2");

const app = express();

// Permite receber JSON
app.use(express.json());

// Define pasta pública
app.use(express.static("public"));

// Conexão com banco MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao MySQL!");
});

// Cria tabela se não existir
const createTableQuery = `
CREATE TABLE IF NOT EXISTS onibus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prefixo VARCHAR(255),
    responsavel VARCHAR(255),
    servico VARCHAR(255),
    status VARCHAR(255)
)
`;
db.query(createTableQuery, (err) => {
  if (err) throw err;
});

// Listagem + paginação
app.get("/api/onibus", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  db.query(
    "SELECT * FROM onibus ORDER BY prefixo ASC LIMIT ? OFFSET ?",
    [limit, offset],
    (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });

      db.query("SELECT COUNT(*) as total FROM onibus", (err, totalRows) => {
        if (err) return res.status(500).json({ erro: err.message });

        res.json({
          dados: rows,
          total: totalRows[0].total,
          pagina: page,
          totalPaginas: Math.max(1, Math.ceil(totalRows[0].total / limit))
        });
      });
    }
  );
});

// Cadastrar
app.post("/api/onibus", (req, res) => {
  const { prefixo, responsavel, servico, status } = req.body;

  db.query(
    "INSERT INTO onibus (prefixo, responsavel, servico, status) VALUES (?, ?, ?, ?)",
    [prefixo, responsavel, servico, status],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true, id: result.insertId });
    }
  );
});

// Excluir
app.delete("/api/onibus/:id", (req, res) => {
  db.query("DELETE FROM onibus WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ sucesso: true });
  });
});

// Editar
app.put("/api/onibus/:id", (req, res) => {
  const { prefixo, responsavel, servico, status } = req.body;

  db.query(
    "UPDATE onibus SET prefixo = ?, responsavel = ?, servico = ?, status = ? WHERE id = ?",
    [prefixo, responsavel, servico, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ sucesso: true });
    }
  );
});

module.exports = app;