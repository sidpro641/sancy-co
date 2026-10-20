# Sancy & Co

Site vitrine de Sancy & Co — digitalisation d'entreprise.
*Prenez une longueur d'avance.*

Site statique (HTML / CSS / JS), aucune installation : ouvrez `index.html` dans un navigateur.

- `index.html` — accueil (formulaire de devis, services, tarifs, approche, réalisations, blog, FAQ, contact)
- `blog/` — liste des articles et un fichier HTML par article
- `styles.css` — thème noir & or
- `script.js` — animations, menu mobile, envoi des formulaires
- `assets/` — logo et carte de visite

## Recevoir les demandes par e-mail

Les formulaires passent par [Web3Forms](https://web3forms.com) (gratuit, sans serveur).
Créez une clé d'accès avec l'adresse qui doit recevoir les demandes, puis collez-la dans
`script.js` à la place de `VOTRE_CLE_WEB3FORMS`. Elle sert à tous les formulaires du site.

## Ajouter un article de blog

Dupliquez un fichier de `blog/`, changez le titre, la date et le texte, puis ajoutez sa carte
dans `blog/index.html` (et dans la section Blog de `index.html` pour l'afficher sur l'accueil).
