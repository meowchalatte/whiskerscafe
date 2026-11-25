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

function renderProducts(category="All"){
  const shown = category==="All" ? products : products.filter(p=>p.category===category);
  productGrid.innerHTML = shown.map(p=>`
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span></div>
      <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" aria-label="Add ${p.name} to cart" onclick="addToCart(${p.id})">+</button></div>
      </div>
    </article>`).join("") || '<p class="no-products">No items in this category yet.</p>';
}
function saveCart(){localStorage.setItem("whiskersCart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();}
function changeQty(id,delta){const item=cart.find(i=>i.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();}
function cartTotal(){return cart.reduce((sum,i)=>sum+products.find(p=>p.id===i.id).price*i.qty,0);}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);document.getElementById("cartCount").textContent=count;
  document.getElementById("cartSubtotal").textContent=money(cartTotal());
  document.getElementById("checkoutTotal").textContent=money(cartTotal());
  const target=document.getElementById("cartItems");
  if(!cart.length){target.innerHTML='<div class="empty-cart">Your bag is waiting for something lovely. ♡</div>';return;}
  target.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="quantity-controls"><button onclick="changeQty(${p.id},-1)" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Increase quantity">+</button></div></div><span class="cart-line-price">${money(p.price*i.qty)}</span></div>`;}).join("");
}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("drawerBackdrop").classList.add("show");document.getElementById("cartDrawer").setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("drawerBackdrop").classList.remove("show");document.getElementById("cartDrawer").setAttribute("aria-hidden","true");}
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",()=>{if(!cart.length){alert("Your bag is empty. Add a little treat first!");return;}closeCart();document.getElementById("checkoutBackdrop").classList.add("show");});
document.getElementById("closeCheckout").addEventListener("click",()=>document.getElementById("checkoutBackdrop").classList.remove("show"));
document.getElementById("checkoutBackdrop").addEventListener("click",e=>{if(e.target.id==="checkoutBackdrop")e.currentTarget.classList.remove("show");});
document.querySelectorAll("#categoryTabs button").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("#categoryTabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");renderProducts(btn.dataset.category);}));
document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();if(!cart.length)return;
  const form=new FormData(e.currentTarget);
  const order={id:"WC"+Date.now().toString().slice(-7),createdAt:new Date().toISOString(),customer:form.get("customer"),contact:form.get("contact"),orderType:form.get("orderType"),payment:form.get("payment"),notes:form.get("notes"),items:cart.map(i=>({name:products.find(p=>p.id===i.id).name,qty:i.qty,unitPrice:products.find(p=>p.id===i.id).price})),total:cartTotal(),status:"Pending"};
  // Demo only: stores the order in this browser. A later step will send it to Google Apps Script.
  const orders=JSON.parse(localStorage.getItem("whiskersDemoOrders")||"[]");orders.push(order);localStorage.setItem("whiskersDemoOrders",JSON.stringify(orders));
  document.getElementById("successMessage").hidden=false;
  document.getElementById("successMessage").innerHTML=`<strong>Thank you, ${escapeHTML(order.customer)}! ♡</strong><br>Your demo order <b>${order.id}</b> has been saved in this browser.<br><br><b>Total: ${money(order.total)}</b><br><small>This is a prototype only. No order has been sent to the cafe yet.</small>`;
  e.currentTarget.hidden=true;cart=[];saveCart();
});
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
