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

## Assistant (chatbot)

`chatbot.js` affiche l'assistant en bas à droite de chaque page. Il ne s'agit pas d'une IA :
toutes les réponses sont écrites dans l'objet `TREE`, en haut du fichier.
Le schéma complet de la conversation se trouve dans [CHATBOT.md](CHATBOT.md).

Après une modification de l'arbre, lancez :

```
node outils/arbre-chatbot.js
```

L'outil signale les impasses, les étapes jamais atteintes et les liens cassés, puis régénère `CHATBOT.md`.
Les demandes de devis envoyées depuis l'assistant utilisent la même clé Web3Forms que les formulaires.

## Ajouter un article de blog

Dupliquez un fichier de `blog/`, changez le titre, la date et le texte, puis ajoutez sa carte
dans `blog/index.html` (et dans la section Blog de `index.html` pour l'afficher sur l'accueil).
