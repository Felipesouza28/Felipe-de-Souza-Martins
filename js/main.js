(() => {
  "use strict";

  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".site-nav a");
  const projects = document.querySelectorAll(".project[data-accent]");
  const defaultAccent = "#376f7d";

  const closeMenu = () => {
    body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Abrir menu");
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });
  }

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (body.classList.contains("menu-open") &&
        !event.target.closest(".site-header")) {
      closeMenu();
    }
  });

  const setAccent = (value) => {
    document.documentElement.style.setProperty("--accent", value || defaultAccent);
  };

  projects.forEach((project) => {
    const activate = () => setAccent(project.dataset.accent);
    const reset = () => setAccent(defaultAccent);
    project.addEventListener("pointerenter", activate);
    project.addEventListener("pointerleave", reset);
    project.addEventListener("focusin", activate);
    project.addEventListener("focusout", (event) => {
      if (!project.contains(event.relatedTarget)) reset();
    });
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
