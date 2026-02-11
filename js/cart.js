/* Cart page logic */

(function () {
  const listEl = document.querySelector("#cartList");
  const totalEl = document.querySelector("#cartTotal");
  const emptyEl = document.querySelector("#cartEmpty");

  function rowHTML(item) {
    return `
      <div class="panel" style="display:flex; gap:14px; align-items:center; justify-content:space-between;">
        <div style="display:flex; gap:14px; align-items:center;">
          <img src="${item.img}" alt="${item.name}" style="width:78px;height:78px;object-fit:cover;border-radius:14px;border:1px solid rgba(255,255,255,.12)">
          <div>
            <div style="text-transform:uppercase; letter-spacing:.18em; font-weight:800; font-size:.9rem">${item.name}</div>
            <div style="color:rgba(255,255,255,.75); margin-top:4px">${SPC.money(item.price)} cad.</div>
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
          <input type="number" min="1" value="${item.qty}" data-qty="${item.id}"
            style="width:84px; text-align:center; border-radius:12px; padding:10px;">

          <div style="min-width:120px; text-align:right; font-weight:800;">
            ${SPC.money(item.price * item.qty)}
          </div>

          <button class="btn ghost" data-remove="${item.id}" style="height:40px;">Rimuovi</button>
        </div>
      </div>
    `;
  }

  function render() {
    const cart = SPC.readCart();

    if (!cart.length) {
      emptyEl.style.display = "block";
      listEl.innerHTML = "";
      totalEl.textContent = SPC.money(0);
      return;
    }

    emptyEl.style.display = "none";
    listEl.innerHTML = cart.map(rowHTML).join("");
    totalEl.textContent = SPC.money(SPC.cartTotal());

    listEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        SPC.removeFromCart(btn.getAttribute("data-remove"));
        render();
      });
    });

    listEl.querySelectorAll("[data-qty]").forEach((inp) => {
      inp.addEventListener("change", () => {
        SPC.setQty(inp.getAttribute("data-qty"), inp.value);
        render();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
