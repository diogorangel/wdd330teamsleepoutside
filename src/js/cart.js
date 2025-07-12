import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const listElement = document.querySelector(".product-list");

  // Check if the list of cart items exists AND if it is not empty.
  if (cartItems && cartItems.length > 0) {
    // Uses the template function to generate the HTML for each cart item.
    const htmlStrings = cartItems.map((item) => cartItemTemplate(item));
    // Inserts the generated HTML into the listElement.
    listElement.innerHTML = htmlStrings.join("");

  } else {
    // If the cart is empty, display a message.
    listElement.innerHTML = "<li><p>Your cart is empty!</p></li>";
  }
}

function cartItemTemplate(item) {
  // Converts the hard-coded HTML from your cart.html file into a dynamic template.
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.Primary}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Calls the main function when the page is loaded.
renderCartContents();