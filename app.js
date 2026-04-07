// Importa bibliotecas
const express=require("express");
const sqlite3=require("sqlite3").verbose();

const app=express();

// Permite receber JSON
app.use(express.json());

// Define pasta pública
app.use(express.static("public"));

// Conexão com banco SQLite
const db=new sqlite3.Database("banco.db");

// Cria tabela se não existir
db.run(`
CREATE TABLE IF NOT EXISTS onibus(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    modelo TEXT,
    servico TEXT,
    status TEXT
)
`);

// ===== LISTAR COM PAGINAÇÃO =====
app.get("/api/onibus",(req,res)=>{

    const page=parseInt(req.query.page)||1;
    const limit=9;
    const offset=(page-1)*limit;

    db.all(
        "SELECT * FROM onibus ORDER BY numero ASC LIMIT ? OFFSET ?",
        [limit,offset],
        (err,rows)=>{

            db.get("SELECT COUNT(*) as total FROM onibus",(err,total)=>{
                res.json({
                    dados:rows,
                    total:total.total,
                    pagina:page,
                    totalPaginas:Math.max(1,Math.ceil(total.total/limit))
                });
            });
        }
    );
});

// ===== CADASTRAR =====
app.post("/api/onibus",(req,res)=>{

    const {numero,modelo,servico,status}=req.body;

    db.run(
        "INSERT INTO onibus(numero,modelo,servico,status) VALUES(?,?,?,?)",
        [numero,modelo,servico,status],
        ()=>res.json({sucesso:true})
    );
});

// ===== EXCLUIR =====
app.delete("/api/onibus/:id",(req,res)=>{
    db.run("DELETE FROM onibus WHERE id=?",[req.params.id],
        ()=>res.json({sucesso:true})
    );
});

// ===== EDITAR =====
app.put("/api/onibus/:id",(req,res)=>{

    const {numero,modelo,servico,status}=req.body;

    db.run(
        `UPDATE onibus
         SET numero=?,modelo=?,servico=?,status=?
         WHERE id=?`,
        [numero,modelo,servico,status,req.params.id],
        ()=>res.json({sucesso:true})
    );
});

// Inicia servidor
app.listen(3000,()=>{
    console.log("Servidor rodando em http://localhost:3000");
});