# Sistema de Gestão de Oficina de Ônibus

Este projeto é um sistema web desenvolvido para auxiliar no controle de manutenção de ônibus em oficinas. A aplicação permite o cadastro de veículos, acompanhamento dos serviços realizados e atualização de status em tempo real.

## Funcionalidades

* Cadastro de ônibus
* Registro de serviços a serem realizados
* Atualização de status (Aguardando, Em manutenção, Finalizado)
* Edição direta na tabela
* Exclusão de registros
* Paginação automática e manual
* Interface em formato de planilha
* Rotação automática de páginas (ideal para painéis)

## Tecnologias utilizadas

* Node.js
* Express
* MySQL
* JavaScript (Vanilla)
* HTML + CSS

## Como executar

1. Instale o Node.js

* Baixe e instale pelo site oficial: https://nodejs.org
* Após instalar, verifique no terminal:

```bash
node -v
npm -v
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco de dados:

* Instale o MySQL
* Crie um banco de dados chamado:

```sql
gestao_oficina
```

4. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=nome
PORT=3000
```

5. (Opcional) Execute o setup para criar a tabela automaticamente:

```bash
npm run setup
```

6. Inicie o servidor:

```bash
npm run dev
```

ou

```bash
npm start
```

7. Acesse no navegador:

```
http://localhost:3000
```
