// Charger les produits
if (document.getElementById("product-list")) {
  fetch("products.json?" + new Date().getTime())
    .then(res => res.json())
    .then(products => {
      const list = document.getElementById("product-list");
      list.innerHTML = products.map(p => `
        <div class="product">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <h2>${p.price}€</h2>
          <button onclick="addToCart(${p.id})">Ajouter au panier</button>
        </div>
      `).join("");
    });
}

// Panier
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Ajouté au panier !");
}

// Afficher le panier
if (document.getElementById("cart")) {
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let container = document.getElementById("cart");
      let total = 0;

      container.innerHTML = cart.map(id => {
        let p = products.find(x => x.id === id);
        total += p.price;
        return `<div class="item">${p.name} - ${p.price}€</div>`;
      }).join("");

      document.getElementById("total").innerText = "Total : " + total + "€";
    });
}

// Paiement (à activer plus tard)
function checkout() {
  alert("On va ajouter Stripe ensuite !");
}
