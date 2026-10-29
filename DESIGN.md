---
name: Beauté Siam Esthétique
description: Un institut de beauté lu comme une étagère éclairée en violet : étiquettes blanches, niches en arc, filet de LED orchidée.
colors:
  violet: "#561B73"
  orchid: "#DF75FF"
  white: "#FFFFFF"
  night: "#25093A"
  violet-deep: "#3A1150"
  violet-lift: "#6B2B8C"
  orchid-pale: "#F3D2FF"
  blush: "#FAF0FD"
  ink: "#2B0C3D"
  ink-soft: "#5E3F73"
typography:
  display:
    fontFamily: "Chonburi, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(4.4rem, 12.6vw, 13rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Chonburi, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Chonburi, 'Bodoni 72', Georgia, serif"
    fontSize: "clamp(1.9rem, 2.6vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
rounded:
  label: "6px"
  card: "14px"
  pill: "999px"
  arch: "999px 999px 0 0"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  section: "clamp(5rem, 10vw, 9rem)"
  header: "76px"
components:
  button-primary:
    backgroundColor: "{colors.orchid}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.9em 1.9em"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.violet}"
  button-on-orchid:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "1em 2.6em"
    height: "76px"
  etiquette:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.label}"
    padding: "34px 30px 30px"
  etiquette-tag:
    backgroundColor: "{colors.blush}"
    textColor: "{colors.violet}"
    rounded: "{rounded.pill}"
    padding: "0.18em 0.7em"
  tab-active:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.white}"
---

# Design System: Beauté Siam Esthétique

## Overview

**Creative North Star: « Le meuble à étiquettes »**

L'institut se lit comme l'étagère éclairée en violet de la photo d'accueil : chaque soin est un flacon, chaque prix une étiquette, chaque ingrédient (bambou, aloe, orange sanguine, tiaré, miel, mangue) un nom à lire. Le site est chaleureux et concret : on y voit de vrais produits, de vrais prix, une vraie personne qui reçoit.

La page est un aplat violet dominant (`violet`), coupé par des bandes d'`orchid`, de `night` et de `white` qui jouent les étagères et les étiquettes. La lumière vient d'un seul endroit : le filet de LED orchidée posé sous chaque étagère. Les photos vivent dans des niches en arc.

**Key Characteristics:**
- Violet saturé en grande surface, blanc réservé au « papier » des étiquettes et aux sections de lecture.
- Un titre à fort caractère (Chonburi) contre un texte rond et lisible (Figtree).
- Un filet de LED, une niche en arc, une étiquette à coins en cartouche : trois signes qui reviennent partout.
- Aucun décor générique de spa : pas de beige zen, pas de cartes à icônes.

## Colors

Les trois couleurs imposées par le client (`violet`, `orchid`, `white`) portent tout ; les autres en sont des nuances.

### Primary
- **Violet institut** (#561B73) : le fond dominant (hero, services, galerie), et l'encre des titres sur fond clair.
- **Orchidée** (#DF75FF) : la lumière. LED, boutons d'action, bandeaux (marquee, appel à l'action), tampons de prix. Sur `violet`, texte courant interdit en dessous de 1 rem gras (contraste 4,5:1).

### Neutral
- **Blanc papier** (#FFFFFF) : les étiquettes, la section des tarifs, le fond du bloc « Nous trouver ».
- **Nuit aubergine** (#25093A) : histoire, chiffres, pied de page ; la pièce quand on éteint le plafonnier.
- **Violet profond** (#3A1150) : le bois de l'étagère (planche sous la LED), les portes du préchargeur, le titre sur orchidée.
- **Violet clair** (#6B2B8C) : petits pétales décoratifs.
- **Orchidée pâle** (#F3D2FF) : texte secondaire sur fond violet (teinté, jamais gris).
- **Blush** (#FAF0FD) : fond des avis, pastilles d'ingrédients, ligne du jour dans les horaires.
- **Encre** (#2B0C3D) / **Encre douce** (#5E3F73) : texte sur fond clair et sur orchidée.

### Named Rules
**La règle de la LED.** L'orchidée sert de lumière et d'action. Elle n'est jamais un fond de texte courant sur blanc (contraste 2,6:1).

**La règle du papier.** Le blanc pur n'apparaît que comme papier : étiquette, liste de tarifs, bloc d'adresse.

## Typography

**Display Font:** Chonburi (Google Fonts, auto-hébergée, latin). Didone à terminaisons en goutte, dessinée à l'origine pour l'écriture thaïe : un clin d'œil à « Siam » et la même allure qu'une étiquette de flacon.
**Body Font:** Figtree (variable 300–900, auto-hébergée).

**Hierarchy:**
- **Display** (400, `clamp(4.4rem, 12.6vw, 13rem)`, 0.9) : « Beauté Siam » dans le hero, deux lignes décalées, couleur blanche puis orchidée pâle.
- **Headline** (400, `clamp(2.5rem, 6vw, 5.6rem)`, 1.02) : titres de section, révélés mot à mot.
- **Title** (400, 1.9–2.5 rem) : noms de catégorie sur les étiquettes, étapes de l'histoire.
- **Body** (400, 1–1.125 rem, 1.6) : 65 caractères maximum par ligne.
- **Label** (700, 0.74 rem) : pastilles d'ingrédients sur les étiquettes.

### Named Rules
**La règle du seul display.** Chonburi ne s'utilise qu'à partir de 1,05 rem (prix, titres, numéraux). Le texte courant est toujours en Figtree.

## Layout

Conteneur `max-width: 1360px`, gouttière `clamp(20px, 4vw, 56px)`. Rythme vertical par section : `clamp(5rem, 10vw, 9rem)`, plus d'espace au-dessus d'un titre qu'en dessous.

Deux sections sont épinglées et pilotées par le défilement sur écran ≥ 900 px de large et ≥ 620 px de haut : l'histoire (quatre temps) et les services (piste horizontale). En dessous, ou en `prefers-reduced-motion`, elles redeviennent une pile verticale et un défilement horizontal natif avec accroche (`scroll-snap`). Le hero passe en pile sous 1100 px : texte d'abord, trois niches posées sur l'étagère ensuite.

Séparateurs de section, un par transition : planche + LED (hero), festons orchidée suspendus (marquee → histoire), festons blancs montants (services → tarifs), diagonale (chiffres → galerie, avis → appel à l'action), festons violets (galerie → avis).

## Elevation & Depth

Le système est plat : la profondeur vient de la couleur (planche `violet-deep` sous la LED, étiquettes blanches sur violet), pas des ombres. Les seules lueurs sont celles de la LED, toujours décalées vers le bas (`0 9px 22px`) comme une lumière qui tombe sur la planche. Le bouton flottant mobile est la seule ombre portée classique.

## Shapes

- **Arc** (`999px 999px 0 0`) : photos du hero, de l'histoire, de la galerie et de la carte, avec un filet orchidée à 7–9 px (`outline`).
- **Étiquette** : papier blanc, rayon 6 px, coins en cartouche (quatre encoches circulaires de 12 px par `mask`), double filet violet à 40 % intérieur.
- **Pétale** (`0 100% 0 100%`) : pastilles décoratives, tampons, photo « pétale » de la galerie.
- **Pilule** : boutons et chips uniquement.

## Components

### Boutons
Orchidée sur violet, violet sur orchidée. Remplissage qui monte au survol (blanc ou encre) et déplacement magnétique vers le curseur sur pointeur fin.

### Étiquettes de soins
Papier blanc à coins en cartouche, nom de catégorie en Chonburi violet, pastilles d'ingrédients, lignes « nom ··· prix » à points de conduite, tampon orchidée « dès X € » en haut à droite. Inclinaison 3D et reflet qui suit la souris (pointeur fin).

### Onglets des tarifs
Liste verticale à filets, onglet actif rempli de violet avec un pétale orchidée ; en mobile, chips défilantes. Navigation clavier : flèches, Début, Fin.

### Compteurs à rouleaux
Chiffres Chonburi orchidée dont chaque colonne défile de 0 à 9 puis jusqu'au chiffre final.

### Avis
Un avis à la fois, balayage ou flèches, défilement automatique avec barre de progression par nom et bouton pause.

## Motion

Courbes `expo.out` / `power3` (jamais linéaires, sauf défilement continu). Entrées échelonnées. Transformations et opacité d'abord, `clip-path` pour les révélations par masque. `prefers-reduced-motion` supprime préchargeur, lissage de défilement, épinglages, parallaxe, marquee et compteurs.

## Do's and Don'ts

### Do
- **Do** garder la LED comme seule source de lumière décorative.
- **Do** nommer les soins par leurs ingrédients, avec leur durée et leur prix réels.
- **Do** poser chaque photo réelle dans une niche en arc avec son filet orchidée.
- **Do** laisser le téléphone et « Prendre rendez-vous » à portée de pouce sur mobile.

### Don't
- **Don't** ajouter d'icônes dans des cartes de même taille ; les étiquettes se distinguent par leur contenu.
- **Don't** mettre de texte courant orchidée sur blanc.
- **Don't** utiliser de dégradé de texte, de verre dépoli décoratif ni de grain généré.
- **Don't** inventer de chiffres, d'avis, de prix ou de claims : tout vient du brief du client (voir `PRODUCT.md`).
