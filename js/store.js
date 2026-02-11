/* Store page logic: render products, filters, modal, add to cart */

const PRODUCTS = [
  {
    id: "spc-af1-rope",
    name: "Rope & Ice",
    price: 189,
    category: "sneakers",
    img: "assets/img/product-1.jpg",
    badge: "Limited",
    desc: "Custom con lacci rope + dettagli brillanti. Fatta a mano. Ogni paio è unico."
  },
  {
    id: "spc-af1-redsplash",
    name: "Red Splash",
    price: 199,
    category: "sneakers",
    img: "assets/img/product-2.jpg",
    badge: "Drop",
    desc: "Verniciatura a spruzzo + dettagli rosso brand. Look street forte."
  },
  {
    id: "spc-tee-paint",
    name: "Paint Tee",
    price: 69,
    category: "apparel",
    img: "assets/img/product-3.jpg",
    badge: "New",
    desc: "T-shirt custom dipinta a mano. Puoi richiedere colori e tema."
  },
  {
    id: "spc-hoodie-drip",
    name: "Drip Hoodie",
    price: 109,
    category: "apparel",
    img: "assets/img/product-4.jpg",
    badge: "Hot",
    desc: "Felpa con dettagli dripping. Mood graffiti, super clean."
  }
];

(function () {
  const grid = document.querySelector("#productGrid");
  const modal = document.querySelector("#modal");
  const modalImg = document.querySelector("#modalImg");
  const modalTitle = document.querySelector("#modalTitle");
  const modalDesc = document.querySelector("#modalDesc");
  const modalPrice = document.querySelector("#modalPrice");
  const modalAdd = document.querySelector("#modalAdd");
  const sortSelect = document.querySelector("#sortSelect");
  const filterButtons = document.querySelectorAll("[data-filter]");

  let activeFilter = "all";
  let activeSort = "featured";
  let currentModalProduct = null;

  function filtered() {
    let list = [...PRODUCTS];

    if (activeFilter !== "all") {
      list = list.filter((p) => p.category === activeFilter);
    }

    if (activeSort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (activeSort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (activeSort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function cardHTML(p) {
    return `
      <article class="card">
        <div class="photo" style="position:relative">
          ${p.badge ? `<div class="pill">${p.badge}</div>` : ""}
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="price">${SPC.money(p.price)}</div>
          <div class="actions">
            <button class="smallbtn" data-view="${p.id}">Dettagli</button>
            <button class="smallbtn" data-add="${p.id}">Aggiungi</button>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    if (!grid) return;
    const list = filtered();
    grid.innerHTML = list.map(cardHTML).join("");

    grid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        const p = PRODUCTS.find((x) => x.id === id);
        SPC.addToCart({ id: p.id, name: p.name, price: p.price, img: p.img }, 1);
        btn.textContent = "Aggiunto ✓";
        setTimeout(() => (btn.textContent = "Aggiungi"), 900);
      });
    });

    grid.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-view");
        const p = PRODUCTS.find((x) => x.id === id);
        openModal(p);
      });
    });
  }

  function openModal(p) {
    currentModalProduct = p;
    modalImg.src = p.img;
    modalTitle.textContent = p.name;
    modalDesc.textContent = p.desc;
    modalPrice.textContent = SPC.money(p.price);
    modal.classList.add("open");
  }

  function closeModal() {
    modal.classList.remove("open");
    currentModalProduct = null;
  }

  function setupModal() {
    if (!modal) return;

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));

    modalAdd.addEventListener("click", () => {
      if (!currentModalProduct) return;
      const p = currentModalProduct;
      SPC.addToCart({ id: p.id, name: p.name, price: p.price, img: p.img }, 1);
      modalAdd.textContent = "Aggiunto ✓";
      setTimeout(() => (modalAdd.textContent = "Aggiungi al carrello"), 900);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function setupControls() {
    filterButtons.forEach((b) => {
      b.addEventListener("click", () => {
        filterButtons.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        activeFilter = b.getAttribute("data-filter");
        render();
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        activeSort = sortSelect.value;
        render();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupControls();
    setupModal();
    render();
  });
})();
