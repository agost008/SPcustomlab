/* Global helpers + navbar + cart badge (LocalStorage) */

(function () {
  const CART_KEY = "spc_cart_v1";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(product, qty = 1) {
    const cart = readCart();
    const found = cart.find((x) => x.id === product.id);
    if (found) found.qty += qty;
    else cart.push({ ...product, qty });
    writeCart(cart);
  }

  function removeFromCart(id) {
    const cart = readCart().filter((x) => x.id !== id);
    writeCart(cart);
  }

  function setQty(id, qty) {
    const cart = readCart();
    const item = cart.find((x) => x.id === id);
    if (!item) return;
    item.qty = Math.max(1, Number(qty) || 1);
    writeCart(cart);
  }

  function cartCount() {
    return readCart().reduce((sum, x) => sum + (x.qty || 0), 0);
  }

  function cartTotal() {
    return readCart().reduce((sum, x) => sum + (x.price || 0) * (x.qty || 0), 0);
  }

  function money(n) {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
  }

  function updateCartBadge() {
    const el = document.querySelector("[data-cart-badge]");
    if (!el) return;
    el.textContent = String(cartCount());
  }

  function setActiveNav() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navlinks a, .drawer a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === page) a.classList.add("active");
    });
  }

  function setupMobileMenu() {
    const btn = document.querySelector("[data-hamburger]");
    const drawer = document.querySelector("[data-drawer]");
    if (!btn || !drawer) return;

    btn.addEventListener("click", () => {
      drawer.classList.toggle("open");
      drawer.style.display = drawer.classList.contains("open") ? "block" : "none";
    });

    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        drawer.classList.remove("open");
        drawer.style.display = "none";
      });
    });
  }

  // Expose a tiny API for other files
  window.SPC = {
    readCart,
    writeCart,
    addToCart,
    removeFromCart,
    setQty,
    cartCount,
    cartTotal,
    money
  };

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    setupMobileMenu();
    updateCartBadge();
  });
})();
