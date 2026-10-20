/* =====================================================
   SANCY & CO — Assistant du site
   Chatbot à arbre de décision : aucune IA, chaque réponse est écrite ici.
   ===================================================== */
(function () {
  "use strict";

  /* -----------------------------------------------------
     L'ARBRE DE CONVERSATION
     Chaque nœud : des messages de l'assistant (`say`) et des choix.
       { label, to: "nœud" }       → continuer vers un autre nœud
       { label, lead: "Service" }  → demander nom + téléphone, puis envoyer la demande
       { label, href: "page" }     → ouvrir une page du site (chemin depuis la racine)
       { label, tel: "0781051893" }→ appeler
       { label, wa: true }         → ouvrir WhatsApp avec le résumé de la conversation
     "Retour" et "Menu principal" sont ajoutés automatiquement.
     Après modification : `node outils/arbre-chatbot.js` vérifie l'arbre
     et régénère le schéma CHATBOT.md.
     ----------------------------------------------------- */
  var TREE = {
    start: {
      say: [
        "Bonjour et bienvenue chez Sancy & Co.",
        "Je suis l'assistant du studio. Dites-moi ce qui vous amène, je vous oriente en quelques clics."
      ],
      choices: [
        { label: "Créer un site internet", to: "site" },
        { label: "Une application mobile", to: "app" },
        { label: "Publicité & réseaux sociaux", to: "ads" },
        { label: "Logo & identité de marque", to: "brand" },
        { label: "Être visible sur Google", to: "seo" },
        { label: "Voir les tarifs", to: "prices" },
        { label: "J'ai une question", to: "faq" },
        { label: "Parler à un conseiller", to: "human" }
      ]
    },

    /* ---------- Sites web ---------- */
    site: {
      say: ["Avec plaisir. Quel est l'objectif principal de votre site ?"],
      choices: [
        { label: "Présenter mon activité", to: "site_present" },
        { label: "Vendre mes produits en ligne", to: "pack_ecommerce" },
        { label: "Montrer mes produits, sans paiement en ligne", to: "site_catalogue" },
        { label: "Je ne sais pas encore", to: "site_unsure" }
      ]
    },
    site_present: {
      say: [
        "Pour présenter votre activité, trois formules :",
        "• One Page — une page élégante, dès 35 000 DA\n• Vitrine — plusieurs pages, dès 60 000 DA\n• Entreprise — avec blog et multilingue, dès 100 000 DA",
        "Qu'est-ce qui vous correspond le mieux ?"
      ],
      choices: [
        { label: "Une seule page me suffit", to: "pack_onepage" },
        { label: "J'ai plusieurs services à présenter", to: "pack_vitrine" },
        { label: "Je veux un blog ou plusieurs langues", to: "pack_entreprise" }
      ]
    },
    site_unsure: {
      say: ["Pas de souci, on va trouver ensemble.", "Vous vendez plutôt des produits ou des services ?"],
      choices: [
        { label: "Des produits", to: "site_products" },
        { label: "Des services", to: "site_present" },
        { label: "Les deux", to: "pack_entreprise" }
      ]
    },
    site_products: {
      say: ["Vos clients doivent-ils pouvoir commander et payer directement sur le site ?"],
      choices: [
        { label: "Oui, je veux une vraie boutique", to: "pack_ecommerce" },
        { label: "Non, ils me contactent pour commander", to: "site_catalogue" }
      ]
    },
    site_catalogue: {
      say: [
        "Bonne approche : un site catalogue présente toute votre gamme (photos, descriptions, prix) et vos clients commandent par téléphone ou WhatsApp.",
        "C'est inclus dans notre pack Entreprise, dès 100 000 DA. Et il pourra évoluer en boutique en ligne plus tard."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Site entreprise" },
        { label: "Plutôt une vraie boutique en ligne", to: "pack_ecommerce" },
        { label: "Lire : vitrine ou e-commerce ?", href: "blog/vitrine-ou-e-commerce.html" }
      ]
    },
    pack_onepage: {
      say: [
        "Pack One Page — dès 35 000 DA",
        "Une page élégante et complète, un design sur-mesure adapté au mobile, un formulaire de contact, un bouton WhatsApp et la mise en ligne incluse.",
        "Délai habituel : une à deux semaines."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Site One Page" },
        { label: "Comparer avec le pack Vitrine", to: "pack_vitrine" }
      ]
    },
    pack_vitrine: {
      say: [
        "Pack Vitrine — dès 60 000 DA",
        "Pages illimitées, design sur-mesure adapté au mobile, espace d'administration pour modifier vos contenus, présentation de vos services et référencement de base.",
        "Délai habituel : une à deux semaines."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Site vitrine" },
        { label: "Voir le pack Entreprise", to: "pack_entreprise" }
      ]
    },
    pack_entreprise: {
      say: [
        "Pack Entreprise — dès 100 000 DA · le plus choisi",
        "Tout le pack Vitrine, plus un blog, un catalogue avec catégories, un site multilingue (FR / AR / EN) et une formation à l'administration."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Site entreprise" },
        { label: "Voir le pack E-commerce", to: "pack_ecommerce" }
      ]
    },
    pack_ecommerce: {
      say: [
        "Pack E-commerce — dès 180 000 DA",
        "Produits illimités, panier et gestion des commandes, espace client, paiement à la livraison et tableau de bord des ventes.",
        "Délai habituel : trois à six semaines, selon le nombre de produits."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Site e-commerce" },
        { label: "Le paiement à la livraison, comment ça marche ?", to: "faq_cod" },
        { label: "Lire : vitrine ou e-commerce ?", href: "blog/vitrine-ou-e-commerce.html" }
      ]
    },
    faq_cod: {
      say: [
        "Le client passe commande sur votre site, vous la retrouvez dans votre tableau de bord, et il paie à la réception du colis.",
        "C'est le mode de paiement le plus rassurant pour les acheteurs en Algérie. La livraison est assurée par le prestataire de votre choix."
      ],
      choices: [
        { label: "Recevoir un devis e-commerce", lead: "Site e-commerce" }
      ]
    },

    /* ---------- Applications ---------- */
    app: {
      say: ["Les applications mobiles sont réalisées sur devis, selon les fonctionnalités.", "Votre projet concerne plutôt :"],
      choices: [
        { label: "Une application pour mes clients", to: "app_clients" },
        { label: "Un outil pour mon équipe", to: "app_team" },
        { label: "Je ne sais pas encore", to: "app_unsure" }
      ]
    },
    app_clients: {
      say: [
        "Réservation, commande, fidélité, catalogue… Une application iOS et Android à votre image renforce le lien avec vos clients.",
        "Le plus simple : décrivez-nous votre idée, nous vous proposons un devis gratuit."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Application mobile" },
        { label: "En parler à un conseiller", to: "human" }
      ]
    },
    app_team: {
      say: [
        "Suivi des commandes, gestion des stocks, tournées, pointage… Un outil sur-mesure fait gagner un temps précieux à vos équipes.",
        "Décrivez-nous votre besoin, nous revenons vers vous avec une proposition."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Application mobile" },
        { label: "En parler à un conseiller", to: "human" }
      ]
    },
    app_unsure: {
      say: [
        "Aucun souci : la première étape est un échange gratuit pour clarifier votre idée.",
        "Un conseiller peut vous rappeler pour en discuter."
      ],
      choices: [
        { label: "Être rappelé", lead: "Application mobile" },
        { label: "Discuter sur WhatsApp", wa: true }
      ]
    },

    /* ---------- Publicité ---------- */
    ads: {
      say: ["Sur quelle plateforme souhaitez-vous communiquer ?"],
      choices: [
        { label: "Facebook & Instagram", to: "ads_meta" },
        { label: "Google", to: "ads_google" },
        { label: "Je ne sais pas encore", to: "ads_unsure" }
      ]
    },
    ads_meta: {
      say: [
        "Il vous suffit d'une page Facebook ou d'un compte Instagram professionnel.",
        "Ensemble, nous définissons l'objectif, le budget journalier et la cible (wilayas, âge, centres d'intérêt). Nous lançons la campagne, l'optimisons et vous transmettons un rapport des résultats."
      ],
      choices: [
        { label: "Lancer ma campagne", lead: "Publicité Meta / Google" },
        { label: "Lire notre guide", href: "blog/publicite-facebook-instagram-algerie.html" },
        { label: "Je n'ai pas encore de site", to: "site_for_ads" }
      ]
    },
    ads_google: {
      say: [
        "Avec Google Ads, vous apparaissez en tête des résultats quand un client recherche votre service, au moment précis où il en a besoin.",
        "Pour de bons résultats, la publicité doit renvoyer vers un site clair et rapide."
      ],
      choices: [
        { label: "Lancer ma campagne", lead: "Publicité Meta / Google" },
        { label: "Je n'ai pas encore de site", to: "site_for_ads" }
      ]
    },
    ads_unsure: {
      say: [
        "En règle générale : Facebook et Instagram pour vous faire connaître auprès d'une cible locale, Google pour capter les clients qui cherchent déjà votre service.",
        "Nous vous conseillons selon votre activité et votre budget."
      ],
      choices: [
        { label: "Être conseillé gratuitement", lead: "Publicité Meta / Google" },
        { label: "Lire notre guide", href: "blog/publicite-facebook-instagram-algerie.html" }
      ]
    },
    site_for_ads: {
      say: [
        "Bonne remarque : la publicité attire, le site convertit. Sans site, une partie de vos clics est perdue.",
        "Beaucoup de nos clients commencent par un One Page, dès 35 000 DA, puis lancent leurs campagnes."
      ],
      choices: [
        { label: "Voir le pack One Page", to: "pack_onepage" },
        { label: "Un devis site + publicité", lead: "Site + publicité" }
      ]
    },

    /* ---------- Identité de marque ---------- */
    brand: {
      say: ["Logo, charte graphique, cartes de visite, supports de communication… Où en êtes-vous ?"],
      choices: [
        { label: "Je pars de zéro", to: "brand_new" },
        { label: "J'ai un logo à moderniser", to: "brand_refresh" },
        { label: "J'ai besoin de supports (cartes, flyers…)", to: "brand_print" }
      ]
    },
    brand_new: {
      say: [
        "Nous créons votre identité de A à Z : logo, palette de couleurs, typographies et règles d'usage, pour une image cohérente partout.",
        "C'est sur devis, selon l'étendue du projet."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Identité de marque" }
      ]
    },
    brand_refresh: {
      say: [
        "Moderniser un logo sans perdre ce que vos clients reconnaissent : c'est tout l'art d'une refonte réussie.",
        "Envoyez-nous votre logo actuel, nous vous proposons une approche."
      ],
      choices: [
        { label: "Envoyer mon logo sur WhatsApp", wa: true },
        { label: "Recevoir un devis gratuit", lead: "Identité de marque" }
      ]
    },
    brand_print: {
      say: [
        "Cartes de visite, flyers, bannières, kakémonos, visuels pour les réseaux… Nous déclinons votre identité sur tous vos supports.",
        "Dites-nous ce dont vous avez besoin, nous vous envoyons un devis."
      ],
      choices: [
        { label: "Recevoir un devis gratuit", lead: "Identité de marque" }
      ]
    },

    /* ---------- Référencement ---------- */
    seo: {
      say: [
        "Le référencement (SEO) permet d'apparaître sur Google quand un client recherche votre métier dans votre ville.",
        "Avez-vous déjà un site internet ?"
      ],
      choices: [
        { label: "Oui, j'ai déjà un site", to: "seo_has" },
        { label: "Non, pas encore", to: "seo_none" }
      ]
    },
    seo_has: {
      say: [
        "Nous analysons votre site (vitesse, contenus, structure, mots-clés), puis nous l'optimisons pour gagner des positions durablement.",
        "Le SEO se construit sur plusieurs semaines ou mois : c'est un investissement qui dure."
      ],
      choices: [
        { label: "Demander un audit gratuit", lead: "Référencement SEO" }
      ]
    },
    seo_none: {
      say: [
        "Nos sites sont pensés pour Google dès le départ : pages rapides, structure claire, contenus optimisés.",
        "Le pack Vitrine inclut un référencement de base."
      ],
      choices: [
        { label: "Voir le pack Vitrine", to: "pack_vitrine" },
        { label: "Recevoir un devis gratuit", lead: "Référencement SEO" }
      ]
    },

    /* ---------- Tarifs ---------- */
    prices: {
      say: [
        "Voici nos formules de sites web :",
        "• One Page — dès 35 000 DA\n• Vitrine — dès 60 000 DA\n• Entreprise — dès 100 000 DA\n• E-commerce — dès 180 000 DA",
        "Applications, identité de marque, publicité et SEO : sur devis. Quel pack voulez-vous découvrir ?"
      ],
      choices: [
        { label: "One Page", to: "pack_onepage" },
        { label: "Vitrine", to: "pack_vitrine" },
        { label: "Entreprise", to: "pack_entreprise" },
        { label: "E-commerce", to: "pack_ecommerce" },
        { label: "Un devis personnalisé", lead: "Autre / je ne sais pas encore" },
        { label: "Voir la page des tarifs", href: "index.html#tarifs" }
      ]
    },

    /* ---------- Questions fréquentes ---------- */
    faq: {
      say: ["Bien sûr. Quelle est votre question ?"],
      choices: [
        { label: "Quels sont les délais ?", to: "faq_delay" },
        { label: "Pourrai-je modifier mon site moi-même ?", to: "faq_edit" },
        { label: "L'hébergement et le domaine sont-ils inclus ?", to: "faq_hosting" },
        { label: "Pourquoi un site plutôt qu'une page Facebook ?", to: "faq_why" },
        { label: "Comment se déroule un projet ?", to: "faq_process" },
        { label: "Une autre question", to: "human" }
      ]
    },
    faq_delay: {
      say: [
        "En général, une à deux semaines pour un site One Page ou vitrine, et trois à six semaines pour un site e-commerce.",
        "Le délai dépend surtout de la rapidité avec laquelle les contenus (textes, photos, produits) nous sont transmis."
      ],
      choices: [
        { label: "Une autre question", to: "faq" },
        { label: "Recevoir un devis gratuit", lead: "Autre / je ne sais pas encore" }
      ]
    },
    faq_edit: {
      say: [
        "Oui. À partir du pack Vitrine, votre site dispose d'un espace d'administration simple pour modifier vos textes, images, services ou produits.",
        "Nous vous formons à son utilisation lors de la livraison."
      ],
      choices: [
        { label: "Une autre question", to: "faq" },
        { label: "Voir le pack Vitrine", to: "pack_vitrine" }
      ]
    },
    faq_hosting: {
      say: [
        "Nous nous occupons de toute la mise en ligne : réservation du nom de domaine, hébergement et configuration.",
        "Les conditions exactes (durée, renouvellement) sont détaillées dans votre devis."
      ],
      choices: [
        { label: "Une autre question", to: "faq" },
        { label: "Recevoir un devis gratuit", lead: "Autre / je ne sais pas encore" }
      ]
    },
    faq_why: {
      say: [
        "Votre page Facebook appartient à la plateforme ; votre site vous appartient.",
        "Il rassure vos clients, apparaît sur Google, présente vos offres sans distraction et transforme les visiteurs en demandes de devis. La publicité attire, le site convertit."
      ],
      choices: [
        { label: "Une autre question", to: "faq" },
        { label: "Voir les formules de sites", to: "site_present" },
        { label: "Lire l'article complet", href: "blog/site-web-entreprise-algerie.html" }
      ]
    },
    faq_process: {
      say: [
        "Quatre étapes, toujours dans le même ordre :",
        "1. Écoute & stratégie — nous comprenons votre métier et vos objectifs.\n2. Conception & design — une direction visuelle validée ensemble.\n3. Développement — une réalisation soignée et rapide.\n4. Lancement & suivi — mise en ligne, formation et accompagnement."
      ],
      choices: [
        { label: "Une autre question", to: "faq" },
        { label: "Démarrer mon projet", lead: "Autre / je ne sais pas encore" }
      ]
    },

    /* ---------- Contact direct ---------- */
    human: {
      say: ["Notre équipe vous répond directement. Comment préférez-vous échanger ?"],
      choices: [
        { label: "Discuter sur WhatsApp", wa: true },
        { label: "Appeler le 07 81 05 18 93", tel: "0781051893" },
        { label: "Appeler le 05 58 26 53 52", tel: "0558265352" },
        { label: "Être rappelé", lead: "Autre / je ne sais pas encore" }
      ]
    }
  };

  /* Pour l'outil de vérification (Node) : exporter l'arbre et s'arrêter là. */
  if (typeof module === "object" && module.exports) { module.exports = { TREE: TREE }; return; }

  /* -----------------------------------------------------
     LE MOTEUR
     ----------------------------------------------------- */
  var WHATSAPP = "213781051893";
  var CALM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Chemin vers la racine du site ("" sur l'accueil, "../" dans blog/) */
  var self = document.currentScript;
  var BASE = self ? self.getAttribute("src").replace(/chatbot\.js.*$/, "") : "";

  var history = [];      // nœuds visités (pour "Retour")
  var path = [];         // choix de l'utilisateur, pour le résumé envoyé
  var lead = null;       // { service, name, phone } pendant la prise de contact
  var busy = false;

  /* ---------- Construction du widget ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var ICON_CHAT = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5h16v10.5H9.5L5 20v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_RESTART = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v3.7h3.7"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  var launcher = el("button", "chat-launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-label", "Ouvrir l'assistant Sancy & Co");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "chatPanel");
  launcher.innerHTML = '<span class="chat-launcher__open">' + ICON_CHAT + '</span><span class="chat-launcher__close">' + ICON_CLOSE + "</span>";

  var teaser = el("div", "chat-teaser");
  teaser.hidden = true;
  var teaserText = el("button", "chat-teaser__text", "Une question sur votre projet ? Je vous oriente en quelques clics.");
  teaserText.type = "button";
  var teaserClose = el("button", "chat-teaser__close");
  teaserClose.type = "button";
  teaserClose.setAttribute("aria-label", "Masquer");
  teaserClose.innerHTML = ICON_CLOSE;
  teaser.appendChild(teaserText);
  teaser.appendChild(teaserClose);

  var panel = el("section", "chat-panel");
  panel.id = "chatPanel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-labelledby", "chatTitle");

  var head = el("header", "chat-head");
  var headText = el("div", "chat-head__text");
  var title = el("p", "chat-head__title", "Sancy & Co");
  title.id = "chatTitle";
  var status = el("p", "chat-head__status", "Assistant · réponse immédiate");
  headText.appendChild(title);
  headText.appendChild(status);
  var restartBtn = el("button", "chat-icon-btn");
  restartBtn.type = "button";
  restartBtn.setAttribute("aria-label", "Recommencer la conversation");
  restartBtn.title = "Recommencer";
  restartBtn.innerHTML = ICON_RESTART;
  var closeBtn = el("button", "chat-icon-btn");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Fermer l'assistant");
  closeBtn.innerHTML = ICON_CLOSE;
  head.appendChild(headText);
  head.appendChild(restartBtn);
  head.appendChild(closeBtn);

  var log = el("div", "chat-log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  var compose = el("form", "chat-compose");
  compose.hidden = true;
  compose.noValidate = true;
  var input = el("input", "chat-compose__input");
  input.setAttribute("aria-label", "Votre réponse");
  var sendBtn = el("button", "chat-compose__send");
  sendBtn.type = "submit";
  sendBtn.setAttribute("aria-label", "Envoyer");
  sendBtn.innerHTML = ICON_SEND;
  compose.appendChild(input);
  compose.appendChild(sendBtn);

  var foot = el("p", "chat-foot");
  foot.innerHTML = 'Ou appelez-nous : <a href="tel:0781051893">07 81 05 18 93</a>';

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(compose);
  panel.appendChild(foot);

  document.body.appendChild(panel);
  document.body.appendChild(teaser);
  document.body.appendChild(launcher);

  /* ---------- Messages ---------- */
  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addBubble(text, who) {
    var b = el("div", "msg msg--" + who, text);
    log.appendChild(b);
    scrollDown();
    return b;
  }

  function typing(text) {
    if (CALM) return Promise.resolve();
    var t = el("div", "msg msg--bot msg--typing");
    t.setAttribute("aria-hidden", "true");
    t.innerHTML = "<span></span><span></span><span></span>";
    log.appendChild(t);
    scrollDown();
    var ms = Math.min(1100, 320 + text.length * 9);
    return new Promise(function (resolve) {
      setTimeout(function () { t.remove(); resolve(); }, ms);
    });
  }

  function botSays(lines) {
    busy = true;
    return lines.reduce(function (p, line) {
      return p.then(function () { return typing(line); }).then(function () { addBubble(line, "bot"); });
    }, Promise.resolve()).then(function () { busy = false; });
  }

  /* ---------- Résumé pour WhatsApp / e-mail ---------- */
  function summary() {
    var parts = ["Bonjour Sancy & Co, je vous contacte depuis votre site."];
    if (path.length) parts.push("Mon besoin : " + path.join(" › "));
    if (lead && lead.name) parts.push("Nom : " + lead.name);
    if (lead && lead.phone) parts.push("Téléphone : " + lead.phone);
    return parts.join("\n");
  }
  function waLink() {
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(summary());
  }

  /* ---------- Choix ---------- */
  function resolveHref(href) {
    var hash = href.indexOf("index.html#") === 0 ? href.slice("index.html".length) : null;
    if (hash && document.querySelector(hash)) return hash;       // déjà sur l'accueil
    return BASE + href;
  }

  function showChoices(choices) {
    var box = el("div", "chat-choices");
    choices.forEach(function (c) {
      var node;
      if (c.href || c.tel || c.wa) {
        node = el("a", "chip", c.label);
        if (c.href) node.href = resolveHref(c.href);
        if (c.tel) node.href = "tel:" + c.tel;
        if (c.wa) { node.href = waLink(); node.target = "_blank"; node.rel = "noopener"; }
        if (c.href && node.getAttribute("href").charAt(0) === "#") {
          node.addEventListener("click", function () { close(); });
        }
      } else {
        node = el("button", "chip", c.label);
        node.type = "button";
        node.addEventListener("click", function () { pick(c, box); });
      }
      if (c.lead || c.primary) node.classList.add("chip--primary");
      if (c.nav) node.classList.add("chip--nav");
      box.appendChild(node);
    });
    log.appendChild(box);
    scrollDown();
    var first = box.querySelector(".chip");
    if (first && panel.contains(document.activeElement)) first.focus({ preventScroll: true });
  }

  function navChoices(nodeId) {
    var extra = [];
    if (nodeId !== "start") {
      // "Retour" seulement s'il ne mène pas déjà au menu (sinon doublon avec "Menu principal")
      if (history.length > 2) extra.push({ label: "← Retour", back: true, nav: true });
      extra.push({ label: "Menu principal", to: "start", home: true, nav: true });
    }
    return extra;
  }

  function pick(choice, box) {
    if (busy) return;
    box.remove();
    addBubble(choice.label, "user");
    if (choice.back) {
      history.pop();
      path.pop();
      return render(history[history.length - 1], true);
    }
    if (choice.home) {
      history = [];
      path = [];
      return render("start");
    }
    if (choice.retry) return sendLeadNow();
    if (choice.edit) return startLead(lead.service);
    if (choice.confirm) return sendLeadNow();
    path.push(choice.label);
    if (choice.lead) return startLead(choice.lead);
    render(choice.to);
  }

  function render(nodeId, isBack) {
    var node = TREE[nodeId] || TREE.start;
    if (!isBack) history.push(nodeId);
    compose.hidden = true;
    botSays(node.say).then(function () {
      showChoices(node.choices.concat(navChoices(nodeId)));
    });
  }

  /* ---------- Prise de contact dans le chat ---------- */
  var awaiting = null;   // "name" | "phone"

  function ask(field) {
    awaiting = field;
    compose.hidden = false;
    input.value = "";
    if (field === "name") {
      input.type = "text";
      input.autocomplete = "name";
      input.placeholder = "Votre nom";
      input.inputMode = "text";
    } else {
      input.type = "tel";
      input.autocomplete = "tel";
      input.placeholder = "05 / 06 / 07 …";
      input.inputMode = "tel";
    }
    if (panel.contains(document.activeElement) || document.activeElement === document.body) input.focus({ preventScroll: true });
  }

  function startLead(service) {
    lead = { service: service };
    botSays(["Parfait. Pour vous recontacter, quel est votre nom ?"]).then(function () { ask("name"); });
  }

  compose.addEventListener("submit", function (e) {
    e.preventDefault();
    if (busy || !awaiting) return;
    var value = input.value.trim();
    if (awaiting === "name") {
      if (value.length < 2) { input.focus(); return; }
      lead.name = value;
      compose.hidden = true;
      addBubble(value, "user");
      botSays(["Merci " + value + ". À quel numéro pouvons-nous vous joindre ?"]).then(function () { ask("phone"); });
    } else if (awaiting === "phone") {
      var digits = value.replace(/\D/g, "");
      compose.hidden = true;
      addBubble(value, "user");
      if (digits.length < 9 || digits.length > 13) {
        botSays(["Ce numéro semble incomplet. Pouvez-vous le vérifier ?"]).then(function () { ask("phone"); });
        return;
      }
      lead.phone = value;
      awaiting = null;
      botSays(["Je récapitule :", "Service : " + lead.service + "\nNom : " + lead.name + "\nTéléphone : " + lead.phone]).then(function () {
        showChoices([
          { label: "Envoyer ma demande", confirm: true, primary: true },
          { label: "Corriger", edit: true, nav: true }
        ]);
      });
    }
  });

  function sendLeadNow() {
    busy = true;
    var waiting = addBubble("Envoi en cours…", "bot");
    waiting.classList.add("msg--muted");
    var data = new FormData();
    data.append("subject", "Demande via l'assistant — Site Sancy & Co");
    data.append("from_name", "Assistant du site Sancy & Co");
    data.append("name", lead.name);
    data.append("phone", lead.phone);
    data.append("service", lead.service);
    data.append("message", "Parcours dans l'assistant : " + (path.join(" › ") || "—") + "\nPage : " + location.pathname);
    var send = window.sancySendLead ? window.sancySendLead(data) : Promise.resolve(false);
    send.catch(function () { return false; }).then(function (sent) {
      waiting.remove();
      busy = false;
      if (sent) {
        var thanks = "C'est envoyé, merci " + lead.name + (/[.!?…]$/.test(lead.name) ? "" : ".");
        botSays([thanks, "Un conseiller vous rappelle très vite au " + lead.phone + "."]).then(function () {
          showChoices([
            { label: "Menu principal", to: "start", home: true, nav: true },
            { label: "Écrire aussi sur WhatsApp", wa: true }
          ]);
        });
      } else {
        botSays(["L'envoi n'a pas abouti. Écrivez-nous sur WhatsApp ou appelez-nous directement :"]).then(function () {
          showChoices([
            { label: "Discuter sur WhatsApp", wa: true, primary: true },
            { label: "Appeler le 07 81 05 18 93", tel: "0781051893" },
            { label: "Réessayer l'envoi", retry: true, nav: true }
          ]);
        });
      }
    });
  }

  /* ---------- Ouverture / fermeture ---------- */
  var started = false;
  function open() {
    hideTeaser(true);
    panel.hidden = false;
    document.documentElement.classList.add("chat-open");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Fermer l'assistant");
    if (!started) { started = true; render("start"); }
    setTimeout(function () {
      var target = compose.hidden ? log.querySelector(".chat-choices:last-child .chip") : input;
      (target || closeBtn).focus({ preventScroll: true });
    }, 50);
  }
  function close() {
    panel.hidden = true;
    document.documentElement.classList.remove("chat-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Ouvrir l'assistant Sancy & Co");
    launcher.focus({ preventScroll: true });
  }
  function restart() {
    if (busy) return;
    log.innerHTML = "";
    history = [];
    path = [];
    lead = null;
    awaiting = null;
    compose.hidden = true;
    render("start");
  }

  launcher.addEventListener("click", function () { panel.hidden ? open() : close(); });
  closeBtn.addEventListener("click", close);
  restartBtn.addEventListener("click", restart);
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  /* ---------- Petite bulle d'invitation (une fois par visite) ---------- */
  function hideTeaser(remember) {
    teaser.hidden = true;
    if (remember) { try { sessionStorage.setItem("sancy-chat-teaser", "1"); } catch (e) {} }
  }
  teaserText.addEventListener("click", open);
  teaserClose.addEventListener("click", function () { hideTeaser(true); });
  var seen = false;
  try { seen = sessionStorage.getItem("sancy-chat-teaser") === "1"; } catch (e) {}
  if (!seen) {
    setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, 7000);
  }
})();
