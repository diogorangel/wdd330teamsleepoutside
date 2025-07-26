// js/cart.js

import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

// Carrega o cabeçalho e rodapé em todas as páginas
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart"); // Obtém os itens do localStorage

  const productListElement = document.querySelector(".product-list");
  const listFooterElement = document.querySelector(".list-footer");
  const listTotalElement = document.querySelector(".list-total");

  // Verifica se o carrinho está vazio
  if (!cartItems || cartItems.length === 0) {
    // Se o carrinho estiver vazio:
    // 1. Exibe uma mensagem amigável na lista de produtos
    productListElement.innerHTML = '<li class="cart-empty-message">Your cart is empty.</li>';

    // 2. Garante que o rodapé do carrinho esteja oculto
    if (listFooterElement) {
      listFooterElement.classList.add('hide');
    }
    // 3. Define o total como $0.00
    if (listTotalElement) {
        listTotalElement.textContent = 'Total: $0.00';
    }
    return; // Sai da função, pois não há itens para renderizar ou total para calcular
  }

  // Se houver itens no carrinho:
  // 1. Gera o HTML para cada item do carrinho
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  // 2. Insere o HTML dos itens na lista de produtos
  productListElement.innerHTML = htmlItems.join("");

  // 3. Calcula o total dos itens no carrinho
  let total = 0;
  cartItems.forEach(item => {
    // Assumindo que 'FinalPrice' é a propriedade correta do preço do seu produto.
    // Se você tiver uma propriedade 'quantity' em seus itens, use:
    // total += item.quantity * item.FinalPrice;
    total += item.FinalPrice;
  });

  // 4. Atualiza o texto do elemento de total com o valor calculado, formatado para duas casas decimais
  if (listTotalElement) {
    listTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  }

  // 5. Remove a classe 'hide' do rodapé para torná-lo visível, já que há itens no carrinho
  if (listFooterElement) {
    listFooterElement.classList.remove('hide');
  }
}

function cartItemTemplate(item) {
  // Garante que 'Colors' e 'Colors[0]' existam antes de tentar acessá-los
  const colorName = item.Colors && item.Colors.length > 0 ? item.Colors[0].ColorName : 'N/A';

  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${item.Image}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${colorName}</p>
    <p class="cart-card__quantity">qty: 1</p> <!-- Assumindo quantidade 1 por padrão -->
    <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
    <span class="cart-card__remove" data-id="${item.Id}">X</span> <!-- Botão de remover item -->
  </li>`;

  return newItem;
}

// Chama a função para renderizar o carrinho quando o script é carregado
renderCartContents();

// --- Lógica para remover itens do carrinho (opcional, mas recomendado para um carrinho funcional) ---
document.addEventListener('click', (event) => {
    // Verifica se o clique foi no botão de remover item
    if (event.target.classList.contains('cart-card__remove')) {
        const itemIdToRemove = event.target.dataset.id;
        removeItemFromCart(itemIdToRemove);
    }
});

function removeItemFromCart(id) {
    let cartItems = getLocalStorage('so-cart');
    // Filtra o array para remover o item com o ID correspondente
    cartItems = cartItems.filter(item => item.Id !== id);
    // Salva o carrinho atualizado de volta no localStorage
    localStorage.setItem('so-cart', JSON.stringify(cartItems));
    // Renderiza o carrinho novamente para refletir as mudanças
    renderCartContents();
}
