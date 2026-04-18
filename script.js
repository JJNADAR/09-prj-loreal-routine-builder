const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateBtn = document.getElementById("generateRoutine");

let allProducts = [];
let selectedProducts = [];

/* my placeholder */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* loads the products */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  allProducts = data.products;
  return allProducts;
}

/* renders products */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product, index) => `
    <div class="product-card ${isSelected(product) ? "selected" : ""}" 
         onclick="toggleProduct(${index})">
      
      <img src="${product.image}" alt="${product.name}">
      
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        <small>${product.category}</small>
      </div>

    </div>
  `
    )
    .join("");
}

/* checks if it selected */
function isSelected(product) {
  return selectedProducts.some(p => p.name === product.name);
}

/* selects / unselect product */
function toggleProduct(index) {
  const product = allProducts[index];

  const exists = selectedProducts.find(p => p.name === product.name);

  if (exists) {
    selectedProducts = selectedProducts.filter(p => p.name !== product.name);
  } else {
    selectedProducts.push(product);
  }

  updateSelectedUI();
  displayProducts(allProducts.filter(p => p.category === categoryFilter.value));
}

/* updates selected ui */
function updateSelectedUI() {
  selectedProductsList.innerHTML = "";

  selectedProducts.forEach((product) => {
    const item = document.createElement("div");
    item.className = "selected-item";

    item.innerHTML = `
      <span>${product.name}</span>
      <button onclick="removeProduct('${product.name}')">Remove</button>
    `;

    selectedProductsList.appendChild(item);
  });

  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
}

/* removes the product */
function removeProduct(name) {
  selectedProducts = selectedProducts.filter(p => p.name !== name);
  updateSelectedUI();
  displayProducts(allProducts.filter(p => p.category === categoryFilter.value));
}

/* category filter */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* generates routine */
generateBtn.addEventListener("click", () => {
  if (selectedProducts.length === 0) {
    chatWindow.innerHTML += `<p><strong>AI:</strong> Please select products first.</p>`;
    return;
  }

  let routine = "Here is your personalized L'Oréal routine:<br><br>";

  selectedProducts.forEach((p, i) => {
    routine += `${i + 1}. ${p.name} (${p.category})<br>`;
  });

  chatWindow.innerHTML += `<p><strong>AI:</strong><br>${routine}</p>`;
});

/* Chat follup uppppp */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = chatForm.userInput.value;

  chatWindow.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
  chatWindow.innerHTML += `<p><strong>AI:</strong> I can help refine your routine based on your selected L'Oréal products.</p>`;

  chatForm.reset();
});

/* loads da saved products */
function loadSaved() {
  const saved = localStorage.getItem("selectedProducts");
  if (saved) {
    selectedProducts = JSON.parse(saved);
    updateSelectedUI();
  }
}

/* initialize */
loadProducts();
loadSaved();