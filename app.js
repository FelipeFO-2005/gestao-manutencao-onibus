// Importa bibliotecas
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();

// Permite receber JSON
app.use(express.json());

// Define pasta pública
app.use(express.static("public"));

// Conexão com banco SQLite
const db = new sqlite3.Database("banco.db");

// Cria tabela se não existir
db.run(`
CREATE TABLE IF NOT EXISTS onibus(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prefixo TEXT,
    responsavel TEXT,
    servico TEXT,
    status TEXT
)
`);

// ===== Listagem + paginação =====
app.get("/api/onibus", (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    db.all(
        "SELECT * FROM onibus ORDER BY prefixo ASC LIMIT ? OFFSET ?",
        [limit, offset],
        (err, rows) => {
            if (err) return res.status(500).json({ erro: err.message });

            db.get("SELECT COUNT(*) as total FROM onibus", (err, total) => {
                if (err) return res.status(500).json({ erro: err.message });

                res.json({
                    dados: rows,
                    total: total.total,
                    pagina: page,
                    totalPaginas: Math.max(1, Math.ceil(total.total / limit))
                });
            });
        }
    );
});

// ===== Cadastrar =====
app.post("/api/onibus", (req, res) => {

    const { prefixo, responsavel, servico, status } = req.body;

    db.run(
        "INSERT INTO onibus(prefixo, responsavel, servico, status) VALUES(?,?,?,?)",
        [prefixo, responsavel, servico, status],
        (err) => {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ sucesso: true });
        }
    );
});

// ===== Excluir =====
app.delete("/api/onibus/:id", (req, res) => {
    db.run("DELETE FROM onibus WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ sucesso: true });
    });
});

// ===== Editar =====
app.put("/api/onibus/:id", (req, res) => {

    const { prefixo, responsavel, servico, status } = req.body;

    db.run(
        `UPDATE onibus
         SET prefixo=?, responsavel=?, servico=?, status=?
         WHERE id=?`,
        [prefixo, responsavel, servico, status, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ erro: err.message });
            res.json({ sucesso: true });
        }
    );
});

// Inicia servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});