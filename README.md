# PIX_S1 · Cours MAI112

**cours: https://em0ani.github.io/PIX_S1/**

---

## Le projet

- Une présentation qui se lit en scrollant, une slide = un écran
- `index.html` est le point d'entrée ; il charge `styles.css`, `script.js` et les fragments HTML de `sections/`
- `sections/introduction.html` contient les parties communes ; chaque domaine Pix a son propre fichier
- Hébergée gratuitement avec **GitHub Pages** (branche `main`, dossier racine)
- Style calme inspiré de Medium.

### Structure

```text
index.html
styles.css
script.js
sections/
├── introduction.html
├── domaine-1-informations-donnees.html
├── domaine-2-communication-collaboration.html
├── domaine-3-creation-contenu.html
├── domaine-4-protection-securite.html
└── domaine-5-environnement-numerique.html
```

Les fragments sont chargés par `script.js` : pour tester le cours en local, ouvre-le depuis un serveur HTTP (et non directement en `file://`). GitHub Pages fournit déjà ce serveur.

## Plan du cours 01

| Ancre | Partie |
|---|---|
| `#garde` | Page de garde |
| `#intro` | Sommaire |
| `#p2` | 1. Cadrage et prérequis |
| `#p3` | 2. Découvrir Pix |
| `#p4` | 3. Domaine 1 · Informations et données |
| `#p5` | 4. Domaine 2 · Communication et collaboration |
| `#p6` | 5. Domaine 3 · Création de contenu |
| `#p7` | 6. Domaine 4 · Protection et sécurité |
| `#p8` | 7. Domaine 5 · Environnement numérique |
| `#fin` | Fin |

## Mettre à jour le site

```bash
git pull
# modifier le fichier concerné dans sections/, styles.css ou script.js
git add index.html styles.css script.js sections/
git commit -m "Description du changement"
git push
```

Le site se met à jour en 1 à 2 minutes. Si l'ancienne version s'affiche : **Ctrl + F5**.

## Aide-mémoire pour modifier

- **Contenu commun :** `sections/introduction.html`
- **Contenu d'un domaine :** le fichier `sections/domaine-N-...html` correspondant
- **Couleurs :** classes `blue`, `pink`, `violet`, `green`, `orange`, `sky`, `red` sur une carte ou une slide
- **Encadré jaune :** `<p class="note">…</p>`
- **Carte douce :** `<div class="card blue"><h3>Titre</h3><p>Texte</p></div>`
- **Question de quiz :** `data-k` numérote les réponses à partir de 0, et `data-answer` = le `data-k` de la bonne réponse
- **Bulle de Numi :** `<div class="say"><span class="numi"></span><p class="bub">Texte</p></div>`
- **Partie affichée dans le menu :** liste `PARTS` dans `script.js`

## Raccourcis en classe

- **↑ ↓** ou **Espace** : changer de slide
- **F** : plein écran

---

Auteur : Emani Babe
