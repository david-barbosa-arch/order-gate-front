const BASE_ROUTE = "https://a8a5-2804-1054-301b-e490-50f3-d07e-ffb3-24f0.ngrok-free.app";
const BASE_URI = "pedidos";

// INIT - LISTA DE PEDIDOS - INIT
(async function carregarPedidos() {
    const response = await fetch(`${BASE_ROUTE}/${BASE_URI}`, {
        headers: {
            'ngrok-skip-browser-warning': 'true' // Cabeçalho para ignorar o aviso do ngrok
        }
    });

    if (!response.ok) {
        console.error(`Erro ao carregar pedidos: ${BASE_URI}`, response.statusText);
        return;
    }

    const pedidos = await response.json();
    const tbody = document.getElementById('pedidoTableBody');
    tbody.innerHTML = '';
    pedidoCount.textContent = "Total de Pedidos: " + pedidos.length;

    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.solicitante}</td>
            <td>${pedido.produto}</td>
            <td>${pedido.descricao}</td>
            <td>R$ ${pedido.valor_comprovante}</td>
            <td>${pedido.comprovante ? `<a href="${BASE_ROUTE}/${pedido.comprovante}" target="_blank" class="btn btn-link"><i class="fas fa-eye"></i> Ver</a>` : 'Sem comprovante'}</td>
        `;
        tbody.appendChild(row);
    });
})()

async function excluirTodosPedidos() {
    if (confirm("Tem certeza que deseja excluir todos os pedidos?")) {
        const response = await fetch(`${BASE_ROUTE}/pedidos`, { method: 'DELETE' });
        const result = await response.json();
        alert(result.message);
        carregarPedidos();
    }
}

(async function showTotalRecebido() {
    try {
        const response = await fetch(`${BASE_ROUTE}/${BASE_URI}/exibir_total_recebido`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar total recebido");

        const data = await response.json();

        total_recebido.textContent = `Total Recebido: ${data.total ?? 0}`;
        
    } catch (error) {
        console.error("Erro ao obter total recebido:", error);
        total_recebido.textContent = "Erro ao obter total";
    }
})()

// INIT - FORMULÁRIO DE PEDIDOS - INIT

// Exibe o nome do arquivo quando um arquivo é escolhido
document.getElementById('comprovante').addEventListener('change', function () {
    const file = this.files[0];
    const filePreview = document.getElementById('filePreview');
    if (file) {
        filePreview.textContent = `Arquivo escolhido: ${file.name}`;
    } else {
        filePreview.textContent = '';
    }
});

// Envio do formulário
document.getElementById('pedidoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch(`${BASE_ROUTE}/${BASE_URI}`, {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('successMessage').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
        e.target.reset();
    } else {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
    }
});


// INIT - FORM EVENTS - INIT
document.addEventListener('contextmenu', function (e) {
e.preventDefault();
alert("O clique direito está desativado.");
});

// INIT - GENERAL EVENTS - INIT
document.addEventListener('copy', function(e) {
    e.preventDefault();
    alert('Copiar está desativado.');
});

document.addEventListener('paste', function(e) {
    e.preventDefault();
    alert('Colar está desativado.');
});