// Controle do Formulário
const toggleBtn = document.getElementById("toggleFormBtn");
const formCadastro = document.getElementById("form");

let formVisivel = true;

toggleBtn.addEventListener("click", () => {
    formVisivel = !formVisivel;
    formCadastro.style.display = formVisivel ? "" : "none";
});


// Paginação
let paginaAtual = 1;
let totalPaginas = 1;
let editando = false;


// Cache DOM
const tabela = document.getElementById("tabela");
const paginaTexto = document.getElementById("pagina");


// Cor do status
function corStatus(status){
    if(status === "Finalizado") return "green";
    if(status === "Em manutenção") return "orange";
    return "red";
}


// Carregar ônibus
async function carregarOnibus(){

    if(editando) return;

    const resposta = await fetch(`/api/onibus?page=${paginaAtual}`);
    const dados = await resposta.json();

    let html = "";

    dados.dados.forEach(onibus => {

        html += `
        <tr>
            <td>${onibus.prefixo}</td>
            <td>${onibus.responsavel}</td>
            <td>${onibus.servico}</td>

            <td style="color:${corStatus(onibus.status)};font-weight:bold;">
                ${onibus.status}
            </td>

            <td>
                <button onclick="editarOnibus(${onibus.id},this)">✏️</button>
                <button class="btn-delete" onclick="excluirOnibus(${onibus.id})">❌</button>
            </td>
        </tr>`;
    });

    tabela.innerHTML = html;

    totalPaginas = dados.totalPaginas;

    paginaTexto.innerText =
        `Página ${paginaAtual} de ${totalPaginas}`;
}


// Cadastrar
document.getElementById("form").onsubmit = async (e)=>{

    e.preventDefault();

    const prefixo = document.getElementById("prefixo").value;
    const responsavel = document.getElementById("responsavel").value;
    const servico = document.getElementById("servico").value;
    const status = document.getElementById("status").value;

    await fetch("/api/onibus",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            prefixo,
            responsavel,
            servico,
            status
        })
    });

    e.target.reset();
    carregarOnibus();
};


// Excluir
async function excluirOnibus(id){

    if(!confirm("Excluir registro?")) return;

    await fetch(`/api/onibus/${id}`,{
        method:"DELETE"
    });

    carregarOnibus();
}


// Editar
function editarOnibus(id,botao){

    if(editando) return;
    editando = true;

    const linha = botao.closest("tr");

    const prefixo = linha.children[0].innerText;
    const responsavel = linha.children[1].innerText;
    const servico = linha.children[2].innerText;
    const status = linha.children[3].innerText;

    linha.innerHTML = `
        <td><input value="${prefixo}"></td>
        <td><input value="${responsavel}"></td>
        <td><input value="${servico}"></td>

        <td>
            <select>
                <option ${status=="Aguardando"?"selected":""}>Aguardando</option>
                <option ${status=="Em manutenção"?"selected":""}>Em manutenção</option>
                <option ${status=="Finalizado"?"selected":""}>Finalizado</option>
            </select>
        </td>

        <td>
            <button onclick="salvarEdicao(${id},this)">💾</button>
        </td>`;
}


// Salvar edição
async function salvarEdicao(id,botao){

    const linha = botao.closest("tr");

    const prefixo = linha.children[0].querySelector("input").value;
    const responsavel = linha.children[1].querySelector("input").value;
    const servico = linha.children[2].querySelector("input").value;
    const status = linha.children[3].querySelector("select").value;

    await fetch(`/api/onibus/${id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            prefixo,
            responsavel,
            servico,
            status
        })
    });

    editando = false;
    carregarOnibus();
}


// Troca automática
setInterval(()=>{

    if(editando) return;

    paginaAtual =
        paginaAtual < totalPaginas
        ? paginaAtual + 1
        : 1;

    carregarOnibus();

},10000);


// Paginação manual
function proximaPagina(){
    if(paginaAtual < totalPaginas){
        paginaAtual++;
        carregarOnibus();
    }
}

function paginaAnterior(){
    if(paginaAtual > 1){
        paginaAtual--;
        carregarOnibus();
    }
}


// Inicializa
carregarOnibus();