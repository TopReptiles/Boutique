let allProducts = [];

// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]"); // [{id, qty}]
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = count;
}

// ===== HOME PAGE : PRODUCTS / FILTERS =====
function renderProducts(list) {
  const container = document.getElementById("product-list");
  if (!container) return;

  if (!list.length) {
    container.innerHTML = "<p>Aucun produit ne correspond à votre recherche.</p>";
    return;
  }

  container.innerHTML = list
    .map(
      (p) => `
    <div class="product">
      ${p.badge ? `<div class="badge">${p.badge}</div>` : ""}
      <img src="${p.image}" alt="${p.name}" data-zoom="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p class="price">${p.price}€</p>
      <div class="product-buttons">
        <button onclick="addToCart(${p.id})">Ajouter au panier</button>
        <button class="secondary" onclick="viewProduct(${p.id})">Voir +</button>
      </div>
    </div>
  `
    )
    .join("");
}

function applyFilters() {
  const qInput = document.getElementById("search-input");
  const cSelect = document.getElementById("category-filter");
  if (!qInput || !cSelect) return;

  const query = qInput.value.toLowerCase();
  const category = cSelect.value;

  const filtered = allProducts.filter((p) => {
    const matchesText =
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query);
    const matchesCat = category === "all" || p.category === category;
    return matchesText && matchesCat;
  });

  renderProducts(filtered);
}

function initHomePage() {
  const listEl = document.getElementById("product-list");
  if (!listEl) return;

  fetch("products.json?" + new Date().getTime())
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
      renderProducts(allProducts);

      const searchInput = document.getElementById("search-input");
      const categoryFilter = document.getElementById("category-filter");
      if (searchInput) searchInput.addEventListener("input", applyFilters);
      if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    })
    .catch((err) => console.error("Erreur chargement produits:", err));
}

// ===== HERO SLIDESHOW =====
function initHeroSlideshow() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const heroImgs = [
    "images/hero1.png",
    "images/hero2.jpg",
    "images/hero3.jpg",
    "images/hero4.jpg"
  ];

  let current = 0;

  function changeHero() {
    hero.style.backgroundImage = `url('${heroImgs[current]}')`;
    current = (current + 1) % heroImgs.length;
  }

  changeHero();
  setInterval(changeHero, 7000); // 7 secondes entre chaque
}

// ===== CART =====
function addToCart(id) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  alert("Produit ajouté au panier !");
}

function changeQty(index, delta) {
  let cart = getCart();
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCart(); // si on est sur la page panier
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart");
  if (!container) return;

  fetch("products.json?" + new Date().getTime())
    .then((res) => res.json())
    .then((products) => {
      const cart = getCart();
      if (!cart.length) {
        container.innerHTML = '<p class="empty">Votre panier est vide.</p>';
        const totalElem = document.getElementById("total");
        if (totalElem) totalElem.textContent = "";
        return;
      }

      let total = 0;

      container.innerHTML = cart
        .map((item, index) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return "";
          const lineTotal = product.price * item.qty;
          total += lineTotal;
          return `
            <div class="cart-item">
              <div class="cart-info">
                <div class="cart-name">${product.name}</div>
                <div class="cart-price-line">${product.price}€ x ${item.qty} = ${lineTotal.toFixed(2)}€</div>
              </div>
              <div class="cart-qty">
                <button onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
              </div>
              <button class="cart-remove" onclick="removeItem(${index})">✕</button>
            </div>
          `;
        })
        .join("");

      const totalElem = document.getElementById("total");
      if (totalElem) totalElem.textContent = "Total : " + total.toFixed(2) + "€";

      initPayPalButton(total);
    })
    .catch((err) => console.error("Erreur chargement panier:", err));
}

// ===== PAYPAL (SIMPLIFIÉ, À ACTIVER) =====
function initPayPalButton(total) {
  const container = document.getElementById("paypal-button-container");
  if (!container || !window.paypal) return;

  container.innerHTML = "";

  if (total <= 0) return;

  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: total.toFixed(2) }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert("Paiement réalisé par " + details.payer.name.given_name + " (simulation).");
        localStorage.removeItem("cart");
        updateCartCount();
        renderCart();
      });
    }
  }).render("#paypal-button-container");
}

// ===== PRODUCT PAGE =====
function viewProduct(id) {
  window.location.href = "product.html?id=" + id;
}

function loadProductPage() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);
  if (!id) {
    container.innerHTML = "<p>Produit introuvable.</p>";
    return;
  }

  fetch("products.json?" + new Date().getTime())
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === id);
      if (!product) {
        container.innerHTML = "<p>Produit introuvable.</p>";
        return;
      }

      container.innerHTML = `
        <div class="product-detail-card">
          <img src="${product.image}" alt="${product.name}" data-zoom="${product.image}">
          <div class="product-detail-info">
            ${product.badge ? `<div class="badge">${product.badge}</div>` : ""}
            <h1>${product.name}</h1>
            <p class="price">${product.price}€</p>
            <p class="desc">${product.description}</p>
            <button onclick="addToCart(${product.id})">Ajouter au panier</button>
            <a href="index.html" class="back-link">← Retour à la boutique</a>
          </div>
        </div>
      `;
    })
    .catch((err) => console.error("Erreur fiche produit:", err));
}

// ===== LIGHTBOX (zoom plein écran) =====
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (!lightbox || !img) return;

  document.body.addEventListener("click", (e) => {
    const target = e.target;
    if (target.matches("img[data-zoom]")) {
      img.src = target.getAttribute("data-zoom");
      lightbox.classList.add("show");
    } else if (target === lightbox || target === img.parentElement) {
      lightbox.classList.remove("show");
    }
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("show");
  });
}

// ===== DARK MODE =====
function initDarkMode() {
  const btn = document.getElementById("dark-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("dark-mode");
  if (saved === "on") document.body.classList.add("dark");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "dark-mode",
      document.body.classList.contains("dark") ? "on" : "off"
    );
  });
}

// ===== CONTACT (fake) =====
function handleContact(e) {
  e.preventDefault();
  const name = document.getElementById("contact-name")?.value || "";
  alert("Merci " + name + " ! Votre message a bien été enregistré (simulation).");
  e.target.reset();
}
window.handleContact = handleContact;

// ===== INIT GLOBAL =====
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  initHomePage();
  initHeroSlideshow();
  renderCart();
  loadProductPage();
  initLightbox();
  initDarkMode();
});
