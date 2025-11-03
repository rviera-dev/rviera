const form = document.getElementById("product-form");
const tableBody = document.querySelector("#product-table tbody");

// Pega produtos do localStorage ou inicia vazio
let produtos = JSON.parse(localStorage.getItem("menuItems")) || [];

// === FUNÇÃO PARA SALVAR NO LOCALSTORAGE ===
function salvarProdutos() {
  localStorage.setItem("menuItems", JSON.stringify(produtos));
}

// === RENDERIZA TABELA ===
function renderTable() {
  tableBody.innerHTML = "";
  produtos.forEach((p, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.img}" width="60" style="border-radius:6px;"></td>
      <td>${p.name}</td>
      <td>R$${p.price.toFixed(2)}</td>
      <td>${p.category}</td>
      <td>
        <button class="action" onclick="editItem(${index})">✏️</button>
        <button class="action delete" onclick="deleteItem(${index})">🗑️</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
  salvarProdutos(); // Sempre atualiza o localStorage
}

// === ADICIONA OU EDITA ===
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newItem = {
    name: form.name.value,
    desc: form.desc.value,
    price: parseFloat(form.price.value),
    img: form.img.value,
    category: form.category.value,
    destaque: form.destaque.checked,
  };

  const index = form["edit-index"].value;
  if (index) {
    produtos[index] = newItem;
  } else {
    produtos.push(newItem);
  }

  form.reset();
  form["edit-index"].value = "";
  renderTable();
});

// === EDITAR ===
function editItem(index) {
  const p = produtos[index];
  form["edit-index"].value = index;
  form.name.value = p.name;
  form.desc.value = p.desc;
  form.price.value = p.price;
  form.img.value = p.img;
  form.category.value = p.category;
  form.destaque.checked = p.destaque;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// === DELETAR ===
function deleteItem(index) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    produtos.splice(index, 1);
    renderTable();
  }
}

// === LOGOUT FAKE ===
document.getElementById("logout-btn").addEventListener("click", () => {
  if (confirm("Sair do painel?")) window.location.href = "index.html";
});

// === INICIALIZA ===
renderTable();
