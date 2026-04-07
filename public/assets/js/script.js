// Página atual da paginação
let paginaAtual = 1;

// Total de páginas vindas do backend
let totalPaginas = 1;

// Controla se usuário está editando
let editando = false;

// Define cor do status
function corStatus(status){
    if(status==="Finalizado") return "green";
    if(status==="Em manutenção") return "orange";
    return "red";
}

// ===== CARREGAR ÔNIBUS =====
async function carregarOnibus(){

    // evita atualização enquanto edita
    if(editando) return;

    const resposta = await fetch(`/api/onibus?page=${paginaAtual}`);
    const dados = await resposta.json();

    const tabela = document.getElementById("tabela");
    tabela.innerHTML="";

    // monta tabela dinamicamente
    dados.dados.forEach(onibus=>{
        tabela.innerHTML+=`
        <tr>
            <td>${onibus.numero}</td>
            <td>${onibus.modelo}</td>
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

    totalPaginas=dados.totalPaginas;

    document.getElementById("pagina").innerText=
        `Página ${paginaAtual} de ${totalPaginas}`;
}

// ===== CADASTRAR ÔNIBUS =====
document.getElementById("form").onsubmit=async(e)=>{
    e.preventDefault();

    const numero=document.getElementById("numero").value;
    const modelo=document.getElementById("modelo").value;
    const servico=document.getElementById("servico").value;
    const status=document.getElementById("status").value;

    await fetch("/api/onibus",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({numero,modelo,servico,status})
    });

    e.target.reset();
    carregarOnibus();
};

// ===== EXCLUIR =====
async function excluirOnibus(id){
    if(!confirm("Excluir ônibus?")) return;

    await fetch(`/api/onibus/${id}`,{method:"DELETE"});
    carregarOnibus();
}

// ===== EDITAR =====
function editarOnibus(id,botao){

    if(editando) return;
    editando=true;

    const linha=botao.closest("tr");

    const numero=linha.children[0].innerText;
    const modelo=linha.children[1].innerText;
    const servico=linha.children[2].innerText;
    const status=linha.children[3].innerText;

    linha.innerHTML=`
        <td><input value="${numero}"></td>
        <td><input value="${modelo}"></td>
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

// ===== SALVAR EDIÇÃO =====
async function salvarEdicao(id,botao){

    const linha=botao.closest("tr");

    const numero=linha.children[0].querySelector("input").value;
    const modelo=linha.children[1].querySelector("input").value;
    const servico=linha.children[2].querySelector("input").value;
    const status=linha.children[3].querySelector("select").value;

    await fetch(`/api/onibus/${id}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({numero,modelo,servico,status})
    });

    editando=false;
    carregarOnibus();
}

// ===== AUTO TROCA DE PÁGINA =====
setInterval(async()=>{

    if(editando) return;

    const res=await fetch(`/api/onibus?page=${paginaAtual}`);
    const dados=await res.json();

    paginaAtual=
        paginaAtual<dados.totalPaginas
        ?paginaAtual+1
        :1;

    carregarOnibus();

},15000);

// ===== PAGINAÇÃO MANUAL =====
function proximaPagina(){
    if(paginaAtual<totalPaginas){
        paginaAtual++;
        carregarOnibus();
    }
}

function paginaAnterior(){
    if(paginaAtual>1){
        paginaAtual--;
        carregarOnibus();
    }
}

carregarOnibus();