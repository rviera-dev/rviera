const menuContainer = document.getElementById("menu-items");
const cartModal = document.getElementById("cart-modal");
const cartOverlay = document.getElementById("cart-overlay");
const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const categoryLinks = document.querySelectorAll('.nav a');

let cart = [];

// ========== RENDERIZA MENU ==========
function renderMenu(items) {
  menuContainer.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p><strong>R$ ${item.price.toFixed(2)}</strong></p>
      <button onclick="addToCart(${item.id})">Adicionar</button>
    `;
    menuContainer.appendChild(div);
  });
}

// ========== CARRINHO ==========
function addToCart(id) {
  const item = window.menuItems.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCart();
  showToast(`${item.name} adicionado ao carrinho`);
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((p, i) => {
    total += p.price * p.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div>
        <p>${p.name}</p>
        <small>R$ ${p.price.toFixed(2)}</small>
      </div>
      <div>
        <button onclick="changeQty(${i}, -1)">➖</button>
        ${p.qty}
        <button onclick="changeQty(${i}, 1)">➕</button>
      </div>
    `;
    cartItems.appendChild(div);
  });
  cartCount.textContent = cart.length;
  cartTotal.textContent = "R$ " + total.toFixed(2);
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

// ========== MODAL CARRINHO ==========
function openCartModal() {
  cartModal.classList.add("visible");
  cartOverlay.classList.add("visible");
}

function closeCartModal() {
  cartModal.classList.remove("visible");
  cartOverlay.classList.remove("visible");
}

openCart.addEventListener("click", openCartModal);
closeCart.addEventListener("click", closeCartModal);
cartOverlay.addEventListener("click", closeCartModal);

// ========== CHECKOUT WHATSAPP ==========
document.getElementById("checkout-btn").addEventListener("click", () => {
  const nomeCliente = document.getElementById("client-name").value.trim();

  if (cart.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  if (!nomeCliente) {
    alert("Por favor, insira seu nome antes de finalizar o pedido.");
    return;
  }

  let mensagem = `Olá, meu nome é *${nomeCliente}* 👋\nQuero fazer o seguinte pedido:\n\n`;
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    mensagem += `• ${item.name} x${item.qty} — R$ ${subtotal.toFixed(2)}\n`;
  });

  mensagem += `\n*Total:* R$ ${total.toFixed(2)}\n\nAguardando confirmação!`;
  const numeroWhatsApp = "5511921372409";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");

  cart = [];
  updateCart();
  document.getElementById("client-name").value = "";
  closeCartModal();
});

// ========== TOAST ==========
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ========== PESQUISA MODERNA ==========
function closeSuggestions() {
  suggestions.innerHTML = "";
  suggestions.classList.add("hidden");
}

function filterMenu(value) {
  const lower = value.toLowerCase();
  return window.menuItems.filter(item => item.name.toLowerCase().includes(lower));
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.trim();
  closeSuggestions();

  if (!value) {
    const activeCategory = document.querySelector('.nav a.active')?.dataset.category;
    if (activeCategory === 'destaques') renderMenu(window.menuItems.filter(i => i.destaque));
    else if (activeCategory) renderMenu(window.menuItems.filter(i => i.category === activeCategory));
    else renderMenu(window.menuItems);
    return;
  }

  const results = filterMenu(value);
  if (results.length === 0) return;

  results.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name;
    li.addEventListener("click", () => {
      searchInput.value = r.name;
      renderMenu([r]);
      closeSuggestions();
    });
    suggestions.appendChild(li);
  });

  suggestions.classList.remove("hidden");
});

// Fecha sugestões ao clicar fora
document.addEventListener("click", e => {
  if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) closeSuggestions();
});

// ========== FILTRO POR CATEGORIA ==========
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    categoryLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    searchInput.value = "";
    closeSuggestions();

    const category = link.dataset.category;
    if (category === 'destaques') renderMenu(window.menuItems.filter(i => i.destaque));
    else if (category) renderMenu(window.menuItems.filter(i => i.category === category));
    else renderMenu(window.menuItems);
  });
});

// ========== INICIALIZA ==========
renderMenu(window.menuItems);
