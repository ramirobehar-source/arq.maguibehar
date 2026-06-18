(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[MB:" + name + "]", e); }
  }

  /* ---- Nav ---- */
  function initNav() {
    var nav = document.getElementById("nav");
    var burger = document.querySelector(".nav-burger");
    var mobile = document.getElementById("navMobile");
    var closeBtn = document.querySelector(".nm-close");
    if (!nav) return;

    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-solid", window.scrollY > 20);
    }, { passive: true });

    function openMenu() {
      mobile.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      mobile.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      mobile.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      mobile.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    if (burger) burger.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (mobile) {
      mobile.querySelectorAll(".nm-link").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });
    }
  }

  /* ---- Smooth scroll ---- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 80,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseFloat(entry.target.dataset.delay || 0) * 80;
        setTimeout(function () {
          entry.target.classList.add("is-visible");
        }, delay);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });

    items.forEach(function (el) { io.observe(el); });

    // 6s safety net
    setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---- GSAP parallax & stagger ---- */
  function initGSAP() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero title lines slide in
    gsap.from(".hero-line", {
      yPercent: 8,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.1,
    });

    // Project cards stagger on scroll
    gsap.from(".proj-card", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".proj-grid",
        start: "top 82%",
      }
    });

    // Contact items slide in
    gsap.from(".contacto-item", {
      opacity: 0,
      x: -16,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".contacto-links",
        start: "top 80%",
      }
    });
  }

  /* ---- Boot ---- */
  document.addEventListener("DOMContentLoaded", function () {
    safe(initNav,          "Nav");
    safe(initSmoothScroll, "Scroll");
    safe(initReveals,      "Reveals");
    safe(initGSAP,         "GSAP");
  });

})();
