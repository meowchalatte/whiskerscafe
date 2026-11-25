
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqMcRoZYDko01ZWfokn5z3fCrHDnPSgBn5IN3pmBJ_BevnLhQ7fLsn0J208Ol1VvcVqw/exec";

const products = [
  {id:1,name:"Classic Matcha Latte",category:"Matcha",price:130,description:"Smooth, earthy matcha with creamy milk.",tag:"BESTSELLER",image:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Strawberry Matcha",category:"Matcha",price:150,description:"A sweet strawberry layer meets bold matcha.",tag:"A LITTLE SWEET",image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Iced Spanish Latte",category:"Coffee",price:145,description:"Espresso with milk and a touch of sweetness.",tag:"COFFEE LOVE",image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Vanilla Cloud",category:"Non-coffee",price:135,description:"A soft, fragrant vanilla milk drink.",tag:"COZY PICK",image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Matcha Cream",category:"Matcha",price:155,description:"Extra creamy matcha for a slow afternoon.",tag:"FAN FAVORITE",image:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Chocolate Milk",category:"Non-coffee",price:120,description:"Rich chocolate, chilled and comforting.",tag:"NO COFFEE",image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Butter Cookies",category:"Treats",price:85,description:"A buttery little bite to go with your drink.",tag:"SWEET TREAT",image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Strawberry Shortcake",category:"Treats",price:165,description:"Soft cake, cream, and strawberry goodness.",tag:"SOMETHING LOVELY",image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80"}
];

let cart = JSON.parse(localStorage.getItem("whiskersCart") || "[]");

const money = n => "₱" + Number(n).toFixed(2);
const productGrid = document.getElementById("productGrid");

function renderProducts(category = "All") {
  const shown = category === "All"
    ? products
    : products.filter(p => p.category === category);

  productGrid.innerHTML = shown.map(p => `
    <article class="product-card">
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="product-tag">${p.tag}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="price">${money(p.price)}</span>
          <button class="add-button" aria-label="Add ${p.name} to cart" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </article>
  `).join("") || '<p class="no-products">No items in this category yet.</p>';
}

function saveCart() {
  localStorage.setItem("whiskersCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({id, qty: 1});
  }

  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
}

function cartTotal() {
  return cart.reduce((sum, i) => {
    const product = products.find(p => p.id === i.id);
    return sum + (product ? product.price * i.qty : 0);
  }, 0);
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtotal").textContent = money(cartTotal());
  document.getElementById("checkoutTotal").textContent = money(cartTotal());

  const target = document.getElementById("cartItems");

  if (!cart.length) {
    target.innerHTML = '<div class="empty-cart">Your bag is waiting for something lovely. ♡</div>';
    return;
  }

  target.innerHTML = cart.map(i => {
    const p = products.find(x => x.id === i.id);

    if (!p) return "";

    return `
      <div class="cart-row">
        <div>
          <h4>${p.name}</h4>
          <small>${money(p.price)} each</small>
          <div class="quantity-controls">
            <button onclick="changeQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <span class="cart-line-price">${money(p.price * i.qty)}</span>
      </div>
    `;
  }).join("");
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerBackdrop").classList.add("show");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerBackdrop").classList.remove("show");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerBackdrop").addEventListener("click", closeCart);

document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    alert("Your bag is empty. Add a little treat first!");
    return;
  }

  closeCart();

  document.getElementById("checkoutBackdrop").classList.add("show");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
  document.getElementById("checkoutBackdrop").classList.remove("show");
});

document.getElementById("checkoutBackdrop").addEventListener("click", e => {
  if (e.target.id === "checkoutBackdrop") {
    e.currentTarget.classList.remove("show");
  }
});

document.querySelectorAll("#categoryTabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#categoryTabs button").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});


// GOOGLE SHEETS CHECKOUT CONNECTION

document.getElementById("checkoutForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!cart.length) return;

  const form = new FormData(e.currentTarget);

  const order = {
    name: form.get("customer"),
    username: form.get("username"),
    recipient: form.get("recipient") || "",
    items: cart.map(i => {
      const product = products.find(p => p.id === i.id);

      return {
        name: product.name,
        quantity: i.qty
      };
    })
  };

  if (!order.name || !order.username) {
    alert("Please enter your name and username.");
    return;
  }

  const submitButton = e.currentTarget.querySelector('[type="submit"]');

  if (!submitButton) {
    alert("Checkout button not found. Please check your checkout form.");
    return;
  }

  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending order...";

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(order)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Unable to submit order.");
    }

    document.getElementById("successMessage").hidden = false;

    document.getElementById("successMessage").innerHTML = `
      <strong>Thank you, ${escapeHTML(order.name)}! ♡</strong><br>
      Your order <b>${escapeHTML(result.orderId)}</b> has been received!<br><br>
      <b>Total: ${money(result.total)}</b><br>
      <small>Your order is now pending confirmation.</small>
    `;

    e.currentTarget.hidden = true;

    cart = [];
    saveCart();

  } catch (error) {
    console.error("Order submission error:", error);

    alert("Sorry! We couldn't confirm your order. Please check your connection and try again. " + error.message);

    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});


function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach(a => {
  a.addEventListener("click", () => {
    document.getElementById("mainNav").classList.remove("open");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
