let cart = [];

const cartButtons = document.querySelectorAll(".add-to-cart");
const cartDisplay = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const productCards = document.querySelectorAll(".product-item");
const categoryCards = document.querySelectorAll(".category-filter");
const showAllButton = document.getElementById("show-all-products");
const searchMessage = document.getElementById("search-message");

let activeCategory = "all";

function updateCart() {
    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="col-12">
                <p class="cart-empty text-center">Your cart is empty.</p>
            </div>
        `;
    } else {
        cart.forEach(function (product, index) {
            total += product.price;

            const item = document.createElement("div");
            item.className = "col-md-6 col-lg-4 cart-item";
            item.innerHTML = `
                <div class="card p-3 h-100">
                    <h5>${product.name}</h5>
                    <p class="mb-3">Price: ₦${product.price.toLocaleString()}</p>
                    <button class="btn btn-outline-danger remove-btn" type="button">Remove</button>
                </div>
            `;

            const removeButton = item.querySelector(".remove-btn");
            removeButton.addEventListener("click", function () {
                cart.splice(index, 1);
                updateCart();
            });

            cartItems.appendChild(item);
        });
    }

    if (cartDisplay) {
        cartDisplay.textContent = cart.length;
    }

    if (cartTotal) {
        cartTotal.textContent = total.toLocaleString();
    }
}

cartButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const productName = button.getAttribute("data-name");
        const productPrice = Number(button.getAttribute("data-price"));

        if (!productName || Number.isNaN(productPrice)) {
            return;
        }

        cart.push({
            name: productName,
            price: productPrice
        });

        updateCart();
    });
});

function applyProductFilter(filter, searchTerm = "") {
    let visibleCount = 0;

    productCards.forEach(function (product) {
        const productText = product.textContent.toLowerCase();
        const productCategory = product.getAttribute("data-category");
        const matchesCategory = filter === "all" || productCategory === filter;
        const matchesSearch = searchTerm === "" || productText.includes(searchTerm);

        const shouldShow = matchesCategory && matchesSearch;
        product.style.display = shouldShow ? "" : "none";

        if (shouldShow) {
            visibleCount++;
        }
    });

    if (searchMessage) {
        if (visibleCount === 0) {
            searchMessage.textContent = "No products found. Try another search.";
        } else if (filter === "all" && searchTerm === "") {
            searchMessage.textContent = "Showing all products.";
        } else {
            searchMessage.textContent = visibleCount + " product(s) found.";
        }
    }
}

if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const searchTerm = searchInput.value.trim().toLowerCase();
        applyProductFilter(activeCategory, searchTerm);

        if (document.getElementById("products")) {
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        }
    });
}

categoryCards.forEach(function (categoryCard) {
    categoryCard.addEventListener("click", function () {
        const selectedCategory = categoryCard.getAttribute("data-category");
        activeCategory = selectedCategory;

        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        applyProductFilter(selectedCategory, searchTerm);

        if (document.getElementById("products")) {
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        }
    });
});

if (showAllButton) {
    showAllButton.addEventListener("click", function () {
        activeCategory = "all";

        if (searchInput) {
            searchInput.value = "";
        }

        applyProductFilter("all", "");
    });
}

updateCart();
applyProductFilter("all", "");
