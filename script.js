/* SANCY & CO — interactions */
(function () {
  "use strict";

  /* Clé d'accès Web3Forms, partagée par tous les formulaires du site.
     Créez-la gratuitement sur https://web3forms.com et collez-la ici. */
  var WEB3FORMS_ACCESS_KEY = "VOTRE_CLE_WEB3FORMS";

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

  /* "Choisir ce pack" : pré-remplit le service dans le formulaire de contact */
  var contactService = document.getElementById("c-service");
  document.querySelectorAll("[data-pack]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (contactService) contactService.value = link.getAttribute("data-pack");
    });
  });

  /* Formulaires — envoi via Web3Forms (sans backend) */
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

      var data = new FormData(form);
      data.append("access_key", WEB3FORMS_ACCESS_KEY);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      })
        .then(function (res) {
          return res.json().then(function (json) {
            return { ok: res.ok, data: json };
          });
        })
        .then(function (r) {
          if (r.ok && r.data && r.data.success) {
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
