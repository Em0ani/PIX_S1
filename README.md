# PIX_S1 · Cours MAI112

Mes notes pour le site du cours **MAI112 · Préparation à la certification PIX I** (SupNum · L1 · S1).

**Site en ligne : https://em0ani.github.io/PIX_S1/**

---

## Le projet

- Une présentation qui se lit en scrollant, une slide = un écran
- Tout est dans **un seul fichier** : `index.html` (HTML, CSS et JavaScript ensemble)
- Hébergée gratuitement avec **GitHub Pages** (branche `main`, dossier racine)
- Style calme inspiré de Medium, avec Numi, la mascotte du cours

## Plan du cours 01

| Ancre | Partie |
|---|---|
| `#garde` | Page de garde |
| `#intro` | Sommaire |
| `#p1` | Échauffement (quiz) |
| `#p2` | La culture numérique |
| `#p3` | Pix : quoi, pourquoi, comment |
| `#p4` | Les 5 domaines |
| `#p5` | Compétences et niveaux |
| `#p6` | Mode d'emploi du cours |
| `#fin` | Fin |

## Mettre à jour le site

```bash
git pull
# modifier index.html
git add index.html
git commit -m "Description du changement"
git push
```

Le site se met à jour en 1 à 2 minutes. Si l'ancienne version s'affiche : **Ctrl + F5**.

## Aide-mémoire pour modifier

- **Trouver une slide :** chaque slide commence par un commentaire `<!-- ===== ... ===== -->`
- **Couleurs :** classes `blue`, `pink`, `violet`, `green`, `orange`, `sky`, `red` sur une carte ou une slide
- **Encadré jaune :** `<p class="note">…</p>`
- **Carte douce :** `<div class="card blue"><h3>Titre</h3><p>Texte</p></div>`
- **Question de quiz :** `data-k` numérote les réponses à partir de 0, et `data-answer` = le `data-k` de la bonne réponse
- **Bulle de Numi :** `<div class="say"><span class="numi"></span><p class="bub">Texte</p></div>`
- **Partie affichée dans le menu :** liste `PARTS` dans le script en bas du fichier

## Raccourcis en classe

- **↑ ↓** ou **Espace** : changer de slide
- **F** : plein écran

---

Auteur : Emani Babe
