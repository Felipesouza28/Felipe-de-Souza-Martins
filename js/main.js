(() => {
  "use strict";

  const body = document.body;
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  const closeMenu = () => {
    body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Abrir menu");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (body.classList.contains("menu-open") && !event.target.closest(".site-header")) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 736) closeMenu();
    });
  }

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
