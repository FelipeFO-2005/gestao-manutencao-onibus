const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("banco.db");

db.run(`
CREATE TABLE IF NOT EXISTS onibus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    modelo TEXT,
    servico TEXT,
    status TEXT
)
`);

app.get("/api/onibus", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    db.all("SELECT * FROM onibus LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
        db.get("SELECT COUNT(*) as total FROM onibus", (err, total) => {
            res.json({
                dados: rows,
                total: total.total,
                pagina: page,
                totalPaginas: Math.ceil(total.total / limit)
            });
        });
    });
});

app.post("/api/onibus", (req, res) => {
    const { numero, modelo, servico, status } = req.body;

    db.run(
        "INSERT INTO onibus (numero, modelo, servico, status) VALUES (?, ?, ?, ?)",
        [numero, modelo, servico, status],
        () => res.json({ sucesso: true })
    );
});

app.delete("/api/onibus/:id", (req, res) => {
    db.run("DELETE FROM onibus WHERE id = ?", [req.params.id], () => {
        res.json({ sucesso: true });
    });
});

app.put("/api/onibus/:id", (req, res) => {
    const { servico, status } = req.body;

    db.run(
        "UPDATE onibus SET servico = ?, status = ? WHERE id = ?",
        [servico, status, req.params.id],
        () => res.json({ sucesso: true })
    );
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
