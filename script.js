// --- Ajouter au panier ---
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Ajouté au panier !");
}

// --- Afficher le panier ---
function renderCart() {
  fetch("products.json?" + new Date().getTime()) // cache-buster
    .then(res => res.json())
    .then(products => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const container = document.getElementById("cart");
      let total = 0;

      container.innerHTML = cart.map((id, index) => {
        const product = products.find(p => p.id === id);
        total += product.price;
        return `
          <div class="item">
            <span>${product.name} - ${product.price}€</span>
            <button onclick="removeItem(${index})">Supprimer</button>
          </div>
        `;
      }).join("");

      document.getElementById("total").innerText = "Total : " + total + "€";
    });
}

// --- Supprimer un article ---
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1); // supprime l'article
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart(); // ré-affiche le panier
}

// --- Paiement (PayPal ou autre) ---
function checkout() {
  alert("Bouton PayPal à configurer ici !");
}

// --- Si on est sur la page panier ---
if (document.getElementById("cart")) {
  renderCart();
}
