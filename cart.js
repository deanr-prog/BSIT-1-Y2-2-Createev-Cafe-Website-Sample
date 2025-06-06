// Initialize the cart array
let cart = [];
try {
  // Try to load the cart from localStorage
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  // Check if storedCart is a valid array
  if (Array.isArray(storedCart)) {
    cart = storedCart;
  } else {
    cart = [];
  }
} catch (error) {
  // If JSON parsing fails, fallback to empty cart
  cart = [];
}

// Function to update the cart display in the UI
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count'); // Display total items
  const cartTotal = document.getElementById('cart-total'); // Display total price

  if (!cartCount || !cartTotal) return; // If elements don't exist, stop

  // Calculate total number of items in cart
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  cartCount.textContent = totalItems; // Update cart icon count

  // Calculate total price of items
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  cartTotal.textContent = `₱${total.toFixed(2)}`; // Show formatted total price
}

// Function to add a new item to the cart
function addToCart(newItem) {
  // Check if the item already exists in the cart (same name and price)
  const existingItem = cart.find(item => item.name === newItem.name && parseFloat(item.price) === parseFloat(newItem.price));

  if (existingItem) {
    // If exists, increase its quantity
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // Else, add it with quantity = 1
    newItem.quantity = 1;
    cart.push(newItem);
  }

  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  // Refresh cart display
  updateCartDisplay();
}

// Attach event listeners to all Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name; // Get item name from data attribute
    const basePrice = button.dataset.price; // Get base price

    const menuItem = button.closest('.menu-item'); // Get parent menu item
    const select = menuItem ? menuItem.querySelector('.size-select') : null; // Get size dropdown

    let itemName = name;
    let price = parseFloat(basePrice);

    if (select) {
      const selectedOption = select.options[select.selectedIndex]; // Get selected option
      const size = selectedOption.dataset.size; // Get size label
      const sizePrice = parseFloat(selectedOption.value); // Get price of selected size

      if (!size || isNaN(sizePrice)) {
        alert("Please select a valid size.");
        return;
      }

      itemName = `${name} (${size})`; // Update item name with size
      price = sizePrice; // Use size price
    }

    if (!itemName || isNaN(price)) {
      alert("Missing item details. Please try again.");
      return;
    }

    // Add item to cart
    addToCart({ name: itemName, price });
  });
});

// Function to display cart items in cart.html
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items'); // UL or container for items
  const cartTotal = document.getElementById('cart-total'); // Element showing total price

  if (!cartItemsContainer || !cartTotal) return;

  cartItemsContainer.innerHTML = ''; // Clear current cart items

  // Loop through each item and create an <li>
  cart.forEach((item, index) => {
    const itemElement = document.createElement('li');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
      <span>${item.name}</span> - ₱${parseFloat(item.price).toFixed(2)} x ${item.quantity || 1}
      <div>
        <button class="decrease-qty" data-index="${index}">−</button>
        <button class="increase-qty" data-index="${index}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // Recalculate total price
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price * (item.quantity || 1));
  }, 0);

  cartTotal.textContent = `₱${total.toFixed(2)}`; // Show total price

  attachQtyListeners(); // Set up event listeners for + and − buttons
}

// Function to increase or decrease quantity
function attachQtyListeners() {
  const increaseButtons = document.querySelectorAll('.increase-qty');
  const decreaseButtons = document.querySelectorAll('.decrease-qty');

  // Add 1 to quantity when + is clicked
  increaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      cart[index].quantity = (cart[index].quantity || 1) + 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
      updateCartDisplay();
    });
  });

  // Subtract 1 or remove item if quantity is 0 when − is clicked
  decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      cart[index].quantity = (cart[index].quantity || 1) - 1;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Remove item from cart
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems();
      updateCartDisplay();
    });
  });
}

// Always update cart display when page loads
updateCartDisplay();

// If on cart.html page, render cart items on load
if (window.location.pathname.includes('cart.html')) {
  window.onload = function () {
    renderCartItems();
  };
}

// Cancel order button: clears the entire cart
const cancelBtn = document.getElementById('cancel-order');
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to cancel your entire order?")) {
      cart = [];
      localStorage.removeItem('cart'); // Clear from storage
      renderCartItems();
      updateCartDisplay();
    }
  });
}

// Order now button: confirms and submits the order
const orderBtn = document.getElementById('order-now');
if (orderBtn) {
  orderBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (confirm("Are you sure you want to place the order?")) {
      alert("Your order has been placed successfully!");
      cart = [];
      localStorage.removeItem('cart'); // Clear cart after order
      renderCartItems();
      updateCartDisplay();
    }
  });
}

// Add a click animation to the Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('clicked'); // Add animation class

    setTimeout(() => {
      button.classList.remove('clicked'); // Remove after 1 second
    }, 1000);
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const html = document.documentElement;
  
  // Toggle menu
  hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    html.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });
  
  // Close when clicking overlay or links
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.hamburger')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      html.style.overflow = '';
    }
  });
});