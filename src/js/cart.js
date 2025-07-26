// js/cart.js

import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs"; // Added setLocalStorage

// Carrega o cabeçalho e rodapé em todas as páginas
loadHeaderFooter();

// Function to get current cart items (utility for this specific module)
function getCartItems() {
    return getLocalStorage("so-cart") || [];
}

// Function to save cart items (utility for this specific module)
function saveCartItems(items) {
    setLocalStorage("so-cart", items);
}

function renderCartContents() {
    const cartItems = getCartItems();
    const productListElement = document.querySelector(".product-list");
    const listFooterElement = document.querySelector(".list-footer");
    const overallCartTotalElement = document.querySelector(".overall-cart-total"); // Changed from .list-total to .overall-cart-total

    // Check if the cart is empty
    if (!cartItems || cartItems.length === 0) {
        productListElement.innerHTML = '<li class="cart-empty-message">Your cart is empty.</li>';
        if (listFooterElement) {
            listFooterElement.classList.add('hide');
        }
        if (overallCartTotalElement) {
            overallCartTotalElement.textContent = 'Total: $0.00';
        }
        return;
    }

    // Generate HTML for each cart item
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    productListElement.innerHTML = htmlItems.join("");

    // Calculate and update overall cart total
    updateCartTotals();

    // Remove 'hide' class from the footer to make it visible
    if (listFooterElement) {
        listFooterElement.classList.remove('hide');
    }

    // Attach event listeners for quantity changes AFTER rendering
    attachQuantityListeners();
    attachRemoveButtonListeners(); // Re-attach remove listeners as well
}

function cartItemTemplate(item) {
    // Ensure 'Colors' and 'Colors[0]' exist before trying to access them
    const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : 'N/A';
    
    // Ensure item.quantity exists, default to 1 if not
    const itemQuantity = item.quantity || 1;
    const itemTotalPrice = (item.FinalPrice * itemQuantity).toFixed(2);

    const newItem = `
    <li class="cart-card divider" data-id="${item.Id}">
        <a href="#" class="cart-card__image">
            <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <a href="#">
            <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${colorName}</p>
        <div class="quantity-controls">
            <label for="quantity-${item.Id}">Qty:</label>
            <input 
                type="number" 
                id="quantity-${item.Id}" 
                class="cart-card__quantity-input" 
                value="${itemQuantity}" 
                min="1"
            >
        </div>
        <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
        <p class="cart-card__item-total">Item Total: $${itemTotalPrice}</p>
        <span class="cart-card__remove" data-id="${item.Id}">X</span>
    </li>`;

    return newItem;
}

function updateCartItemQuantity(productId, newQuantity) {
    let cartItems = getCartItems();

    const itemIndex = cartItems.findIndex(item => item.Id === productId);

    if (itemIndex > -1) {
        // Ensure the quantity is a positive integer
        newQuantity = Math.max(1, parseInt(newQuantity, 10) || 1); // Default to 1 if invalid

        cartItems[itemIndex].quantity = newQuantity;

        // If quantity becomes 0, remove the item (though min="1" should prevent this)
        if (newQuantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        saveCartItems(cartItems);
        renderCartContents(); // Re-render the cart to reflect changes
    }
}

function handleQuantityChange(event) {
    const inputElement = event.target;
    const productId = inputElement.closest('.cart-card').dataset.id;
    const newQuantity = parseInt(inputElement.value, 10);

    // Basic validation: ensure it's a positive number
    if (isNaN(newQuantity) || newQuantity < 1) {
        // Optionally, reset to previous valid quantity or show an error
        console.warn('Invalid quantity entered:', inputElement.value);
        // You might want to revert the input value to its previous state
        // or show a small error message to the user.
        // For now, let updateCartItemQuantity handle the default to 1 if invalid
        updateCartItemQuantity(productId, newQuantity); // Still call to ensure state sync
        return;
    }

    updateCartItemQuantity(productId, newQuantity);
}

function attachQuantityListeners() {
    const quantityInputs = document.querySelectorAll('.cart-card__quantity-input');
    quantityInputs.forEach(input => {
        // Using 'change' event for when the user finishes modifying the input
        input.removeEventListener('change', handleQuantityChange); // Prevent duplicate listeners
        input.addEventListener('change', handleQuantityChange);
    });
}


function updateCartTotals() {
    const cartItems = getCartItems();
    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        // Ensure item.quantity exists, default to 1 if not
        const quantity = item.quantity || 1; 
        totalItems += quantity;
        totalPrice += item.FinalPrice * quantity;
    });

    const overallCartTotalElement = document.querySelector(".overall-cart-total");
    if (overallCartTotalElement) {
        overallCartTotalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }
    // You might also want to update a cart icon quantity here if you have one
    // e.g., const cartIconQuantity = document.querySelector('.cart-icon-quantity');
    // if (cartIconQuantity) cartIconQuantity.textContent = totalItems;
}


// --- Lógica para remover itens do carrinho ---
function attachRemoveButtonListeners() {
    // Remove existing listeners to prevent duplicates after re-rendering
    const existingRemoveButtons = document.querySelectorAll('.cart-card__remove');
    existingRemoveButtons.forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
    });

    // Attach new listeners
    const newRemoveButtons = document.querySelectorAll('.cart-card__remove');
    newRemoveButtons.forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

function handleRemoveItem(event) {
    const itemIdToRemove = event.target.dataset.id;
    removeItemFromCart(itemIdToRemove);
}

function removeItemFromCart(id) {
    let cartItems = getCartItems();
    // Filter the array to remove the item with the corresponding ID
    cartItems = cartItems.filter(item => item.Id !== id);
    // Save the updated cart back to localStorage
    saveCartItems(cartItems);
    // Render the cart again to reflect the changes
    renderCartContents();
}

// Initial call to render the cart when the script is loaded
document.addEventListener('DOMContentLoaded', renderCartContents);