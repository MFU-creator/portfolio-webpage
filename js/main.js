/**
 * Portfolio: year in footer and interface interactions.
 */
(function () {
  // Page loader — skip on fast loads (localhost)
  var loader = document.querySelector(".page-loader");
  if (loader) {
    if (document.readyState === "complete") {
      // Already loaded (cached/fast) — kill it immediately
      loader.classList.add("page-loader--done");
    } else {
      window.addEventListener("load", function () {
        // CSS animation handles the reveal; JS is just a safety net
        setTimeout(function () {
          loader.classList.add("page-loader--done");
        }, 1800);
      });
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Theme toggle
  var themeToggle = document.querySelector(".theme-toggle");
  function getPreferredTheme() {
    var stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
  applyTheme(getPreferredTheme());
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
      // Trigger spin animation
      themeToggle.classList.add("theme-toggle--spin");
      setTimeout(function () {
        themeToggle.classList.remove("theme-toggle--spin");
      }, 400);
    });
  }

  // Copy email to clipboard
  document.querySelectorAll(".copy-email").forEach(function (btn) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(btn.dataset.email).then(function () {
        btn.classList.add("copied");
        btn.dataset.tip = "Copied!";
        btn.setAttribute("aria-label", "Copied!");
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.dataset.tip = "Copy email";
          btn.setAttribute("aria-label", "Copy email address");
        }, 2000);
      });
    });
  });

  // Active nav highlighting via IntersectionObserver
  var sections = document.querySelectorAll("section[id]");
  var navLinksAll = document.querySelectorAll('.nav__list a[href^="#"]');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinksAll.forEach(function (link) {
            link.classList.remove("nav--active");
          });
          var active = document.querySelector(
            '.nav__list a[href="#' + entry.target.id + '"]',
          );
          if (active) active.classList.add("nav--active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  sections.forEach(function (s) {
    observer.observe(s);
  });

  // Mobile menu toggle
  var navToggle = document.querySelector(".nav__toggle");
  var navList = document.querySelector(".nav__list");
  var navBackdrop = document.querySelector(".nav__backdrop");

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("active");
    if (navBackdrop) navBackdrop.classList.remove("active");
  }

  function openMenu() {
    navToggle.setAttribute("aria-expanded", "true");
    navList.classList.add("active");
    if (navBackdrop) navBackdrop.classList.add("active");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      isExpanded ? closeMenu() : openMenu();
    });

    // Close menu when clicking on a link
    var navLinks = navList.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking backdrop or outside
    if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);
    document.addEventListener("click", function (event) {
      if (
        !navToggle.contains(event.target) &&
        !navList.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }
})();
