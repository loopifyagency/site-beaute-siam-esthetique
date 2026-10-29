# Beauté Siam Esthétique

Site vitrine de l'institut de beauté **Beauté Siam Esthétique** (11 rue de Siam, 29200 Brest).
Site statique : HTML, CSS et JavaScript, sans étape de compilation.

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Structure

| Chemin | Rôle |
| --- | --- |
| `index.html` | Toute la page : contenu, tarifs, avis, horaires, données structurées `BeautySalon` |
| `assets/css/style.css` | Système visuel (tokens en haut du fichier) |
| `assets/js/main.js` | Mouvement (GSAP, ScrollTrigger, Lenis), onglets, avis, statut ouvert / fermé |
| `assets/vendor/` | GSAP 3.13.0, ScrollTrigger 3.13.0, Lenis 1.3.11 (copiés en local, pas de CDN) |
| `assets/fonts/` | Chonburi et Figtree, auto-hébergées |
| `assets/img/` | Photos de l'institut + favicon |
| `PRODUCT.md`, `DESIGN.md` | Contexte produit et système visuel (guide pour la suite) |

## Modifier le contenu

- **Tarifs** : dans `index.html`, deux endroits : les étiquettes de la section « Sur l'étagère » (`.label`) et les onglets de « Tous les tarifs » (`.panel`).
- **Horaires** : le tableau (`.hours`), les données structurées (`<script type="application/ld+json">`) **et** l'objet `SCHEDULE` en tête de `assets/js/main.js` (il pilote le statut « Ouvert maintenant »).
- **Avis** : section `.reviews`. Ils sont repris mot pour mot ; ne pas les reformuler.
- **Photos** : remplacer les fichiers de `assets/img/` par des versions haute définition (les originaux fournis font 600 × 357 px) en gardant les mêmes noms, ou mettre à jour les attributs `width` / `height`.
- **Réservation** : le lien Planity apparaît dans `index.html` ; le téléphone est en `tel:+33298441818`.

## Accessibilité et performance

- Respecte `prefers-reduced-motion` (sans préchargeur, sans lissage de défilement, sans épinglage).
- Navigation clavier complète, lien d'évitement, contrastes WCAG AA, textes alternatifs sur toutes les images.
- Images chargées en différé (sauf le hero), polices préchargées, aucune dépendance externe hors la carte Google Maps.

## Déploiement

Le site est publié sur GitHub Pages par le workflow `.github/workflows/pages.yml` : à chaque push sur `main`, seuls `index.html` et `assets/` sont envoyés (les fichiers de travail comme `PRODUCT.md`, `DESIGN.md`, `.claude/`, `.agents/` ne sont pas publiés).

Activation (une seule fois) : **Settings → Pages → Build and deployment → Source : GitHub Actions**.

Tous les chemins sont relatifs : le site fonctionne aussi bien sous `https://<compte>.github.io/site-beaute-siam-esthetique/` que sur un domaine personnalisé (à régler dans Settings → Pages).
