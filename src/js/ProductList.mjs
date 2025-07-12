// ProductList.mjs
function productCardTemplate(product) {
    return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.id}">
      <img
        src="${product.images.image2}"
        alt="Image of ${product.name}"
      />
      <h3 class="card__name">${product.name}</h3>
      <h4 class="product-card__brand">${product.brand.name}</h4>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}


// ProductList.mjs

import { renderListWithTemplate } from "./utils.mjs";

// ... (existing productCardTemplate function)

export default class ProductList {
    // ... (existing constructor and init method)

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}