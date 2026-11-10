/* ==========================================================================
   Portafolio retro — interacciones
   ========================================================================== */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Año dinámico ---------- */

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Toast ---------- */

  const toastEl = $(".toast");
  let toastTimer = null;

  function toast(message, duration = 2800) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("show");
    }, duration);
  }

  /* ---------- Menú móvil ---------- */

  const menuToggle = $(".menu-toggle");
  const nav = $("#menu");

  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    $$("a", nav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });
  }

  /* ---------- Enlaces activos del HUD ---------- */

  const navLinks = $$(".nav a");
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  setActiveLink("inicio");

  /* ---------- Aparición de bloques ---------- */

  const revealEls = $$(".reveal");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Filtros de proyectos ---------- */

  const filters = $$(".filter");
  const games = $$(".game[data-cat]");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter || "all";

      filters.forEach((other) => {
        const isActive = other === filter;
        other.classList.toggle("active", isActive);
        other.setAttribute("aria-pressed", String(isActive));
      });

      games.forEach((game) => {
        const show = category === "all" || game.dataset.cat === category;
        game.classList.toggle("is-hidden", !show);
      });
    });
  });

  filters.forEach((filter) => {
    filter.setAttribute("aria-pressed", String(filter.classList.contains("active")));
  });

  /* ---------- Enlaces provisionales ---------- */

  $$('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      toast("ENLACE PENDIENTE · agrégalo cuando tengamos el proyecto real");
    });
  });

  /* ---------- Código Konami ---------- */

  const konami = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

    if (key === konami[konamiIndex]) {
      konamiIndex += 1;

      if (konamiIndex === konami.length) {
        konamiIndex = 0;
        toast("EASTER EGG · CÓDIGO KONAMI ACTIVADO");
      }
    } else {
      konamiIndex = key === konami[0] ? 1 : 0;
    }
  });
})();
