// Charger les produits sur la page d'accueil
document.addEventListener("DOMContentLoaded", function() {
  if(document.getElementById('product-list')) {
    fetch('products.json?' + new Date().getTime())
      .then(res => res.json())
      .then(products => {
        const list = document.getElementById('product-list');
        list.innerHTML = products.map(p => `
          <div class="product">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p>${p.price}€</p>
            <button onclick="addToCart(${p.id})">Ajouter au panier</button>
          </div>
        `).join('');
      })
      .catch(err => console.error('Erreur de chargement des produits:', err));
  }
});

// Ajouter au panier
window.addToCart = function(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(id);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produit ajouté au panier !');
}

// Afficher le panier
function renderCart() {
  fetch('products.json?' + new Date().getTime())
    .then(res => res.json())
    .then(products => {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const container = document.getElementById('cart');
      if(!container) return;
      let total = 0;
      container.innerHTML = cart.map((id,index) => {
        const product = products.find(p => p.id === id);
        total += product.price;
        return `<div class="item">
                  <span>${product.name} - ${product.price}€</span>
                  <button onclick='removeItem(${index})'>Supprimer</button>
                </div>`;
      }).join('');
      const totalElem = document.getElementById('total');
      if(totalElem) totalElem.innerText = 'Total : ' + total + '€';
    });
}

// Supprimer un article du panier
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index,1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// Simuler le paiement PayPal
function checkout() {
  alert('Bouton PayPal à configurer ici !');
}

// Charger le panier automatiquement sur cart.html
if(document.getElementById('cart')) {
  document.addEventListener('DOMContentLoaded', renderCart);
}
