const links = document.querySelector("#links");
const userInfo = document.querySelector("#user_info");
const userName = document.querySelector("#user");
const welcome = document.querySelector("#welcome");
const logOutBtn = document.querySelector(".logout");
const dropdownButton = document.getElementById("dropdown");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const badge = document.querySelector(".badge");

if (localStorage.getItem("logged-in") === "true") {
  links.style.display = "none";
  userInfo.style.display = "flex";
  logOutBtn.style.display = "block";

  welcome.innerHTML = `${localStorage.getItem(
    "fisrtName"
  )} <i class="fas fa-user"></i>`;
}

logOutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.setItem("logged-in", "false");
  setTimeout(() => {
    window.location = "login.html";
  }, 1000);
  setTimeout(() => {
    links.style.display = "flex";
    userInfo.style.display = "none";
  }, 2000);
});

// Products
let allProducts = document.querySelector(".products");

function drawItems(products) {
  let productItems = products.map(
    (item) =>
      `
          <div class="product-item card col-4 p-1" style="width: 18rem">
            <img src=${item.imageUrl} class="pt-3"/>
            <hr>
            <div class="card-body">
              <p class="card-text">Product : ${item.title}</p>
              <p class="card-text">Price : ${item.price} EGP</p>
              <p class="card-text">Category : ${item.category}</p>
              <div class="product-interact d-flex justify-content-between">
                <button class="btn btn-primary w-75" onClick="toggleCart(${item.id}, event)">Add To Cart &nbsp;<i class="fas fa-cart-plus"></i></button>
                <i
                  class="far fa-heart fs-4 pt-1"
                  id="heart-icon-${item.id}"
                  style="cursor: pointer"
                  onClick="toggleFavorite(${item.id})"
                ></i>
              </div>
            </div>
          </div>
      `
  );
  allProducts.innerHTML = productItems.join("");
  products.length === 0 ? (allProducts.innerHTML = "Not Found") : null;

  loadFavoriteIcons();
}

drawItems(products);

// Cart Handling
const cartsProduct = document.querySelector(".carts_products div");
const shoppingCartIcon = document.querySelector(".shopping_cart i");
const cart = document.querySelector(".carts_products");

shoppingCartIcon.addEventListener("click", () =>
  cartsProduct.innerHTML !== "" ? cart.classList.toggle("d-block") : null
);

let addedItem = localStorage.getItem("ProductsInCart")
  ? JSON.parse(localStorage.getItem("ProductsInCart"))
  : [];

function updateCartUI() {
  cartsProduct.innerHTML = "";

  // Get cart data from localStorage
  const updatedCart = JSON.parse(localStorage.getItem("ProductsInCart")) || [];

  if (updatedCart.length > 0) {
    // Use a map (object) to group items by ID
    const uniqueItems = [];

    updatedCart.forEach((item) => {
      // Find if the item already exists in uniqueItems
      const existingItem = uniqueItems.find((unique) => unique.id === item.id);
      if (existingItem) {
        existingItem.count++;
      } else {
        uniqueItems.push({ ...item, count: 1 });
      }
    });

    localStorage.setItem("productsCount", JSON.stringify(uniqueItems));

    // Render items to the cart UI
    uniqueItems.forEach(
      (item) =>
        (cartsProduct.innerHTML += `
      <div class="bg-light-subtle p-2 mb-2 rounded text-primary d-flex justify-content-between">
        <img src=${item.imageUrl} class="" width="50" height="50"/>
        <p class="align-content-center">${item.title}</p> 
        <div class="align-content-center">
            <span class="pe-3">${item.count}</span>
            <i class="fas fa-plus pe-1" style="color:green" onclick="addToCart(${item.id})"></i>
            <i class="fas fa-minus" style="color:red" onclick="removeFromCart(${item.id})"></i>
        </div>
      </div>
      `)
    );
    cartsProduct.innerHTML += `<p class="total-price text-center p-2"></p>`;

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

    // Update the badge
    badge.style.display = "block";
    badge.innerHTML = updatedCart.length;
  } else {
    // Handle empty cart
    badge.style.display = "none";
    cartsProduct.innerHTML = "<p class='text-muted'>Cart is empty</p>";
  }
}

updateCartUI();

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

function toggleCart(productId, event) {
  const button = event.target;

  if (localStorage.getItem("logged-in") === "true") {
    if (
      button.innerHTML === `Add To Cart &nbsp;<i class="fas fa-cart-plus"></i>`
    ) {
      addToCart(productId);
      button.textContent = "Remove from Cart";
      button.style.backgroundColor = "#DC3545";
      button.style.border = "none";
    } else {
      removeFromCart(productId);
      button.innerHTML = `Add To Cart &nbsp;<i class="fas fa-cart-plus"></i>`;
      button.style.backgroundColor = "#0D6EFD";
    }
  } else {
    setTimeout(() => {
      window.location = "login.html";
    }, 1000);
    return;
  }
}

function toggleFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Find the product in the products array
  const product = products.find((item) => item.id === productId);

  // Check if the product is already in favorites
  const existingProduct = favorites.find((fav) => fav.id === productId);

  if (localStorage.getItem("logged-in") === "true") {
    if (existingProduct) {
      // Remove the product from favorites
      favorites = favorites.filter((fav) => fav.id !== productId);
    } else {
      favorites.push(product);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

    updateFavoriteIcon(productId);
  } else {
    setTimeout(() => {
      window.location = "login.html";
    }, 1000);
    return;
  }
}

function updateFavoriteIcon(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const heartIcon = document.getElementById(`heart-icon-${productId}`);

  // Check if the product exists in favorites
  const isFavorited = favorites.some((fav) => fav.id === productId);

  if (heartIcon == null) {
    return;
  } else {
    if (isFavorited) {
      heartIcon.classList.remove("far");
      heartIcon.classList.add("fas");
      heartIcon.style.color = "red";
    } else {
      heartIcon.classList.remove("fas");
      heartIcon.classList.add("far");
      heartIcon.style.color = "black";
    }
  }
}

function loadFavoriteIcons() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [{}];
  if (localStorage.getItem("logged-in") === "true") {
    favorites.forEach((fav) => {
      updateFavoriteIcon(fav.id);
    });
  }
}

const searchInput = document.querySelector(".form-control");

let searchType = "name";
dropdownItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedValue = event.target.getAttribute("data-value");
    searchType = selectedValue.includes("Name") ? "name" : "category";
    dropdownButton.textContent = selectedValue;
  });
});

searchInput.addEventListener("input", (e) => {
  let searchProducts = products.filter((item) =>
    searchType === "name"
      ? item.title.toLowerCase().startsWith(e.target.value.toLowerCase())
      : item.category.toLowerCase().startsWith(e.target.value.toLowerCase())
  );
  drawItems(searchProducts);
});
