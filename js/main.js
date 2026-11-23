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
      const isOpen = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (body.classList.contains("menu-open") && !event.target.closest(".site-header")) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }


  // Background parallax: move decorative layers only, never the content.
  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let parallaxFrame = 0;

  const updateParallax = () => {
    parallaxFrame = 0;
    if (reduceMotion.matches) {
      parallaxItems.forEach((item) => { item.style.transform = "none"; });
      return;
    }

    const mobileFactor = window.innerWidth <= 768 ? 0.38 : 1;
    const viewportCenter = window.innerHeight / 2;

    parallaxItems.forEach((item) => {
      const scene = item.closest(".parallax-scene");
      if (!scene) return;
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;

      const sceneCenter = rect.top + rect.height / 2;
      const distance = sceneCenter - viewportCenter;
      const depth = Number(item.dataset.parallax) || 0.1;
      const offset = Math.max(-72, Math.min(72, -distance * depth * mobileFactor));
      item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  };

  const requestParallaxUpdate = () => {
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  if (parallaxItems.length && !reduceMotion.matches) {
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate, { passive: true });
    reduceMotion.addEventListener?.("change", requestParallaxUpdate);
    requestParallaxUpdate();
  }

    const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();