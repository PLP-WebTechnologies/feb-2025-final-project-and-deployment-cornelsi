document.addEventListener("DOMContentLoaded", () => {
    // ============
    // NAVIGATION
    // ============
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector("nav ul");
    const navItems = navLinks.querySelectorAll("a");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });

    navItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");
        });

        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            if (targetId.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    });

    // ===============
    // CART FUNCTION
    // ===============
    const cartToggle = document.getElementById("cartToggle");
    const cartPanel = document.getElementById("cartPanel");
    const cartItemsList = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartButton = document.getElementById("clearCart");
    const checkoutBtn = document.getElementById("checkoutBtn");

    let cart = [];

    // Toggle cart panel
    if (cartToggle && cartPanel) {
        cartToggle.addEventListener("click", () => {
            cartPanel.classList.toggle("hidden");
        });
    }

    // Add item to cart
    document.querySelectorAll(".product").forEach(product => {
        product.addEventListener("click", () => {
            const title = product.querySelector("p").textContent;
            const priceMatch = title.match(/Ksh\s?([\d.]+)/);
            const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

            const existingItem = cart.find(item => item.name === title);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({ name: title, price, qty: 1 });
            }

            updateCartUI();
        });
    });

    // Remove item on click
    if (cartItemsList) {
        cartItemsList.addEventListener("click", (e) => {
            if (e.target.tagName === "LI") {
                const itemName = e.target.textContent.split(" x")[0].trim();
                const itemIndex = cart.findIndex(item => item.name === itemName);
                if (itemIndex > -1) {
                    cart[itemIndex].qty -= 1;
                    if (cart[itemIndex].qty <= 0) {
                        cart.splice(itemIndex, 1);
                    }
                    updateCartUI();
                }
            }
        });
    }

    // Clear entire cart
    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            cart = [];
            updateCartUI();
        });
    }

    // Proceed to checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }
            localStorage.setItem("farmConnectCart", JSON.stringify(cart));
            window.location.href = "checkout.html";
        });
    }

    // Update Cart UI
    function updateCartUI() {
        if (!cartItemsList || !cartCount || !cartTotal) return;

        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const li = document.createElement("li");
            li.innerHTML = `${item.name} x${item.qty} <strong>Ksh ${itemTotal}</strong>`;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = `Ksh ${total}`;
        cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    }
});
