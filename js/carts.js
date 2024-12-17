let CartProducts = localStorage.getItem("productsCount");
let allProducts = document.querySelector(".products");

if (CartProducts) {
  let items = JSON.parse(CartProducts);
  drawCartProducts(items);
}

function drawCartProducts(CartProducts) {
  calcTotalPrice();

  let cart = CartProducts.map(
    (item) =>
      `
              <div class="product-cart-item col-4" >
                <div class="row p-3">
                  <img src=${item.imageUrl} class="col-5"/>
                  <div class="col-7 align-content-center">
                    <p>Product : ${item.title}</p>
                    <p>Price : ${item.price} EGP</p>
                    <p>Category : ${item.category}</p>
                    <div class="product-interact d-flex gap-5 ">
                      <div class=" align-content-center">
                        <span class="pe-2 fs-5">
                          ${item.count}
                        </span>
                        <i class="fas fa-plus pe-1" style="color:green; cursor:pointer" onclick="addToCart(${item.id})"></i>
                        <i class="fas fa-minus" style="color:red; cursor:pointer" onclick="removeFromCart(${item.id})"></i>
                      </div>
                    <button class="btn btn-danger" onClick="remove(${item.id})">Remove</button>
                    
                    </div>
                  </div>
                </div>
              </div>
          `
  );

  allProducts.innerHTML = cart.join("");
}

function updateCartUI() {
  // Get cart data from localStorage
  const updatedCart = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
  const uniqueItems = [];

  if (updatedCart.length > 0) {
    // Use a map (object) to group items by ID

    updatedCart.forEach((item) => {
      // Find if the item already exists in uniqueItems
      const existingItem = uniqueItems.find((unique) => unique.id === item.id);
      if (existingItem) {
        existingItem.count++;
      } else {
        uniqueItems.push({ ...item, count: 1 });
      }
      localStorage.setItem("productsCount", JSON.stringify(uniqueItems));
      drawCartProducts(uniqueItems);
    });
  } else {
    localStorage.setItem("productsCount", JSON.stringify([]));
    drawCartProducts(uniqueItems);
    allProducts.innerHTML = `<p class="text-center">Your cart is empty!</p>`;
  }
}

updateCartUI();

let addedItem = localStorage.getItem("ProductsInCart")
  ? JSON.parse(localStorage.getItem("ProductsInCart"))
  : [];

function addToCart(productId) {
  if (localStorage.getItem("logged-in") === "false") {
    setTimeout(() => {
      window.location = "login.html";
    }, 1000);
    return;
  }

  let selectedItem = products.find((item) => item.id === productId);
  addedItem = [...addedItem, selectedItem];
  localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
  updateCartUI();
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
  }

  localStorage.setItem("ProductsInCart", JSON.stringify(cart));
  addedItem = cart;
  updateCartUI();
}

function calcTotalPrice() {
  const totalPrice = document.querySelector(".total-price");
  let cart = JSON.parse(localStorage.getItem("ProductsInCart"));
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }
  if (total == 0) {
    totalPrice.innerHTML = "";
  } else {
    totalPrice.innerHTML = `Total Price = ${total} EGP`;
  }
}

function remove(productId) {
  let cart = JSON.parse(localStorage.getItem("ProductsInCart"));

  const filteredCart = cart.filter((item) => item.id !== productId);

  localStorage.setItem("ProductsInCart", JSON.stringify(filteredCart));
  updateCartUI();
}

const allFavorites = document.querySelector(".glide__slides");
const empty = document.querySelector(".empty");
let favoriteItems = localStorage.getItem("favorites");

let fav = favoriteItems ? JSON.parse(favoriteItems) : [];

fav = fav.map(
  (item) =>
    `
      <li class="glide__slide mb-4">
          <div class="favorite-product card w-75 container rounded rounded-4" >
            <img src=${item.imageUrl} />
            <div class="card-body ">
              <p class="card-text">Product : ${item.title}</p>
              <p class="card-text">Category : ${item.category} <i class="fas fa-heart fs-4 float-end" style="color:red"></i></p>
            </div>

          </div>
      </li>
    `
);

allFavorites.innerHTML = fav.join("");

if (fav.length > 3) {
  new Glide(".glide", {
    type: "carousel",
    perView: 3, // Show 3 slides at a time
    gap: 10, // Space between slides
  }).mount();
} else {
  new Glide(".glide", {
    type: "slider",
    perView: 3, // Show 3 slides at a time
    gap: 10, // Space between slides
  }).mount();

  fav.length == 0
    ? (empty.innerHTML = `<p class="text-center">No Favourite products !</p>`)
    : null;
}
