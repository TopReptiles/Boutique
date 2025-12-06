// Ce code se lance quand la page est chargée
document.addEventListener("DOMContentLoaded", function () {
  // 1) SI on est sur la page d'accueil => on charge les produits
  const productList = document.getElementById("product-list");
  if (productList) {
    fetch("products.json?" + new Date().getTime()) // pour éviter le cache
      .then((response) => response.json())
      .then((products) => {
        productList.innerHTML = products
          .map(
            (p) => `
          <div class="product">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p>${p.price}€</p>
            <button onclick="addToCart(${p.id})">Ajouter au panier</button>
            <button onclick="viewProduct(${p.id})">Voir +</button>
          </div>
        `
          )
          .join("");
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des produits:", error)
      );
  }

  // 2) SI on est sur la page panier => on affiche le panier
  if (document.getElementById("cart")) {
    renderCart();
  }

  // 3) SI on est sur la page fiche produit => on affiche le détail
  if (document.getElementById("product-detail")) {
    loadProductPage();
  }

  // 4) DIAPORAMA DU HERO
  const hero = document.getElementById("hero");
  if (hero) {
    const heroImgs = [
      "images/hero1.png", // adapte bien aux vraies extensions
      "images/hero2.jpg",
      "images/hero3.jpg",
      "images/hero4.jpg"
    ];

    let current = 0;

    function changeHero() {
      hero.style.backgroundImage = `url('${heroImgs[current]}')`;
      current = (current + 1) % heroImgs.length;
    }

    changeHero();                 // première image
    setInterval(changeHero, 5000); // change toutes les 5 sec
  }
});

// ----------------------
// AJOUTER AU PANIER
// ----------------------
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produit ajouté au panier !");
}

// ----------------------
// AFFICHER LE PANIER
// ----------------------
function renderCart() {
  fetch("products.json?" + new Date().getTime())
    .then((res) => res.json())
    .then((products) => {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const container = document.getElementById("cart");
      if (!container) return;

      let total = 0;

      container.innerHTML = cart
        .map((id, index) => {
          const product = products.find((p) => p.id === id);
          if (!product) return "";
          total += product.price;
          return `
            <div class="item">
              <span>${product.name} - ${product.price}€</span>
              <button onclick="removeItem(${index})">Supprimer</button>
            </div>
          `;
        })
        .join("");

      const totalElem = document.getElementById("total");
      if (totalElem) totalElem.innerText = "Total : " + total + "€";
    })
    .catch((err) =>
      console.error("Erreur lors du chargement du panier:", err)
    );
}

// ----------------------
// SUPPRIMER UN ARTICLE
// ----------------------
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ----------------------
// BOUTON PAIEMENT
// ----------------------
function checkout() {
  alert("Ici on branchera PayPal ensuite 😄");
}

// ----------------------
// OUVRIR LA FICHE PRODUIT
// ----------------------
function viewProduct(id) {
  // redirige vers product.html en passant l'id dans l'URL
  window.location.href = "product.html?id=" + id;
}

// ----------------------
// CHARGER UNE FICHE PRODUIT
// ----------------------
function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  if (!id) {
    document.getElementById("product-detail").innerHTML =
      "<p>Produit introuvable.</p>";
    return;
  }

  fetch("products.json?" + new Date().getTime())
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === id);
      const container = document.getElementById("product-detail");

      if (!product) {
        container.innerHTML = "<p>Produit introuvable.</p>";
        return;
      }

      container.innerHTML = `
        <div class="product-detail-card">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-detail-info">
            <h1>${product.name}</h1>
            <p class="price">${product.price}€</p>
            <p class="desc">${product.description}</p>
            <button onclick="addToCart(${product.id})">Ajouter au panier</button>
            <a href="index.html" class="back-link">← Retour à la boutique</a>
          </div>
        </div>
      `;
    })
    .catch((err) =>
      console.error("Erreur lors du chargement de la fiche produit:", err)
    );
}
