process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Promise rejeitada:", err);
});

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}).on("error", (err) => {
  console.error("Erro ao iniciar servidor:", err);
});