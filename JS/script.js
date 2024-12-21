document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('productList');
    const cart = document.getElementById('cart');
    const cartButton = document.getElementById('cartButton');
    const cartItems = document.getElementById('cartItems');
    const totalPriceEl = document.getElementById('totalPrice');
  
    let cartData = JSON.parse(localStorage.getItem('cart')) || [];
  
    // API 
    async function fetchProducts() {
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=4'); // API pública
        const products = await response.json();
        renderProducts(products);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    }
  
    function renderProducts(products) {
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <h3>${product.title}</h3>
          <img src="${product.image}" alt="${product.title}" style="width:100px; height:auto;">
          <p>Precio: $${product.price}</p>
          <button data-id="${product.id}" data-name="${product.title}" data-price="${product.price}">Comprar</button>
        `;
        productList.appendChild(card);
      });
    }
  
    function updateCart() {
      cartItems.innerHTML = '';
      let totalPrice = 0;
  
      cartData.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <span>${item.name} x${item.quantity}</span>
          <span>$${item.price * item.quantity}</span>
          <button class="remove-item" data-index="${index}">X</button>
        `;
        cartItems.appendChild(cartItem);
      });
  
      totalPriceEl.textContent = totalPrice.toFixed(2);
      localStorage.setItem('cart', JSON.stringify(cartData));
    }

    productList.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const productId = e.target.getAttribute('data-id');
        const productName = e.target.getAttribute('data-name');
        const productPrice = parseFloat(e.target.getAttribute('data-price'));
  
        const existingItem = cartData.find(item => item.id === productId);
  
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartData.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
  
        updateCart();
      }
    });
  
    cart.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const index = e.target.getAttribute('data-index');
        cartData.splice(index, 1);
        updateCart();
      }
    });
  
    cartButton.addEventListener('click', () => {
      cart.classList.toggle('active');
    });
  
    // Inicialización
    fetchProducts();
    updateCart();
});
