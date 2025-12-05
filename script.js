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
