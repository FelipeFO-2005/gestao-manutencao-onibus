let paginaAtual = 1;

function corStatus(status){
    if(status === "Finalizado") return "green";
    if(status === "Em manutenção") return "orange";
    return "red";
}

async function carregar() {
    const res = await fetch(`/api/onibus?page=${paginaAtual}`);
    const data = await res.json();

    const tabela = document.getElementById("tabela");
    tabela.innerHTML = "";

    data.dados.forEach(o => {
        tabela.innerHTML += `
            <tr>
                <td>${o.numero}</td>
                <td>${o.modelo}</td>
                <td>
                    <input value="${o.servico}" class="form-control"
                    onchange="editar(${o.id}, this.value, '${o.status}')">
                </td>
                <td style="color:${corStatus(o.status)}; font-weight:bold;">
                    <select onchange="editar(${o.id}, '${o.servico}', this.value)">
                        <option ${o.status=="Aguardando"?"selected":""}>Aguardando</option>
                        <option ${o.status=="Em manutenção"?"selected":""}>Em manutenção</option>
                        <option ${o.status=="Finalizado"?"selected":""}>Finalizado</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluir(${o.id})">❌</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("pagina").innerText =
        `Página ${data.pagina} de ${data.totalPaginas}`;
}

document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/onibus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            numero: document.getElementById("numero").value,
            modelo: document.getElementById("modelo").value,
            servico: document.getElementById("servico").value,
            status: document.getElementById("status").value
        })
    });

    e.target.reset();
    carregar();
};

async function excluir(id) {
    if (!confirm("Excluir ônibus?")) return;
    await fetch(`/api/onibus/${id}`, { method: "DELETE" });
    carregar();
}

async function editar(id, servico, status) {
    await fetch(`/api/onibus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servico, status })
    });
}

setInterval(async () => {
    const res = await fetch(`/api/onibus?page=${paginaAtual}`);
    const data = await res.json();

    if (paginaAtual < data.totalPaginas) {
        paginaAtual++;
    } else {
        paginaAtual = 1;
    }

    carregar();
}, 30000);

carregar();
