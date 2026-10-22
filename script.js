/* SANCY & CO — interactions */
(function () {
  "use strict";

  /* Clé d'accès Web3Forms, partagée par tous les formulaires du site.
     Créez-la gratuitement sur https://web3forms.com et collez-la ici. */
  var WEB3FORMS_ACCESS_KEY = "VOTRE_CLE_WEB3FORMS";

  /* Thème clair / sombre — le choix est mémorisé (le <head> l'applique avant l'affichage) */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    themeToggle.setAttribute("aria-label", theme === "light" ? "Passer en mode sombre" : "Passer en mode clair");
  }
  if (themeToggle) {
    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      try { localStorage.setItem("sancy-theme", next); } catch (e) {}
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !calm) {
        document.startViewTransition(function () { applyTheme(next); });
      } else {
        applyTheme(next);
      }
    });
  }

  /* Titre : le mot en or change toutes les 2,4 s (sortie par le haut, entrée par le bas).
     Mouvement réduit demandé par le système : simple fondu, géré en CSS. */
  document.querySelectorAll("[data-rotator]").forEach(function (rotator) {
    var words = rotator.children;
    if (words.length < 2) return;
    var current = 0;
    setInterval(function () {
      if (document.hidden) return;
      var out = words[current];
      current = (current + 1) % words.length;
      var next = words[current];
      out.classList.remove("is-in");
      out.classList.add("is-out");
      next.classList.remove("is-out");
      next.classList.add("is-in");
      setTimeout(function () { out.classList.remove("is-out"); }, 600);
    }, 2400);
  });

  /* Navbar background on scroll */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.getElementById("burger");
  var navMobile = document.getElementById("navMobile");
  burger.addEventListener("click", function () {
    var open = navMobile.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navMobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navMobile.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add("in"); }, (el.dataset.delay || 0));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(function (el, i) {
      // slight stagger inside grids
      var siblings = el.parentElement ? el.parentElement.children : [];
      var idx = Array.prototype.indexOf.call(siblings, el);
      el.dataset.delay = (idx % 4) * 90;
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Animated stat counters */
  var counters = document.querySelectorAll(".stat__num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var dur = 1600, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* Cartes de services animées : .is-on au survol (souris), au focus clavier,
     et sur écran tactile quand la carte traverse le centre de l'écran */
  var offers = document.querySelectorAll(".offer");
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  offers.forEach(function (card) {
    card.addEventListener("focusin", function () { card.classList.add("is-on"); });
    card.addEventListener("focusout", function (e) {
      if (!card.contains(e.relatedTarget) && !card.matches(":hover")) card.classList.remove("is-on");
    });
    if (canHover) {
      card.addEventListener("mouseenter", function () { card.classList.add("is-on"); });
      card.addEventListener("mouseleave", function () {
        if (!card.contains(document.activeElement)) card.classList.remove("is-on");
      });
    }
  });
  if (!canHover && "IntersectionObserver" in window) {
    var offerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle("is-on", entry.isIntersecting); });
    }, { rootMargin: "-30% 0px -30% 0px" });
    offers.forEach(function (card) { offerIO.observe(card); });
  }

  /* "Choisir ce pack" : pré-remplit le service dans le formulaire de contact */
  var contactService = document.getElementById("c-service");
  document.querySelectorAll("[data-pack]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (contactService) contactService.value = link.getAttribute("data-pack");
    });
  });

  /* Envoi d'une demande via Web3Forms (sans backend).
     Résout true si la demande est bien partie, false si Web3Forms la refuse ;
     rejette si le réseau est injoignable. Partagé avec l'assistant (chatbot.js). */
  function sendLead(data) {
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    }).then(function (res) {
      return res.json().then(function (json) {
        return res.ok && !!json && json.success === true;
      });
    });
  }
  window.sancySendLead = sendLead;

  /* Formulaires de la page */
  document.querySelectorAll("form.js-lead").forEach(function (form) {
    var note = form.querySelector(".form__note");
    var submitBtn = form.querySelector('[type="submit"]');
    var btnLabel = submitBtn.querySelector(".btn__label");
    var defaultLabel = btnLabel ? btnLabel.textContent : "Envoyer";
    var noteTimer = null;

    function setNote(msg, type) {
      if (noteTimer) { clearTimeout(noteTimer); noteTimer = null; }
      note.classList.remove("form__note--success", "form__note--error");
      if (type) note.classList.add("form__note--" + type);
      note.textContent = msg || "";
      note.hidden = !msg;
    }

    function setLoading(loading) {
      submitBtn.disabled = loading;
      submitBtn.classList.toggle("is-loading", loading);
      if (btnLabel) btnLabel.textContent = loading ? "Envoi en cours…" : defaultLabel;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      setNote("", null);
      setLoading(true);

      sendLead(new FormData(form))
        .then(function (sent) {
          if (sent) {
            form.reset();
            setNote("Merci — votre demande a bien été envoyée. Nous vous recontactons très vite.", "success");
            noteTimer = setTimeout(function () { setNote("", null); }, 9000);
          } else {
            setNote("Une erreur est survenue lors de l'envoi. Réessayez, ou contactez-nous par téléphone ou WhatsApp.", "error");
          }
        })
        .catch(function () {
          setNote("Connexion impossible. Vérifiez votre réseau, ou contactez-nous par téléphone ou WhatsApp.", "error");
        })
        .then(function () {
          setLoading(false);
        });
    });
  });

  /* Year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
