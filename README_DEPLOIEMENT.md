# Questionnaire PSV — Français international

Contenu du paquet : `index.html`, `presentation.png`, `privacy.html` et `_redirects`.

## Déploiement

Téléverser uniquement ces fichiers dans le site Netlify du questionnaire français. Le domaine prévu est `https://assessment.psv-global.com/fr/`.

Le sélecteur accepte les marchés `ca`, `fr`, `be`, `ch` et `international`. Exemple : `?market=fr&formule=essentiel`.

## Vérifications après publication

- Le badge supérieur reste « Français international ».
- Le pays choisi apparaît dans l’adresse.
- Les réponses arrivent dans Netlify Forms sous `psv-questionnaire`.
- GA4 utilise `G-K4HXVY6SDR` et demeure refusé jusqu’au consentement facultatif.
- Le lien vers le site principal et l’avis de confidentialité fonctionnent.

## Important avant une diffusion à grande échelle

La clé de correction est encore présente dans le code public du navigateur, comme dans la version d’origine. Pour protéger l’intégrité du questionnaire, déplacer la correction et le calcul des résultats vers une fonction serveur avant une diffusion à grande échelle.

Faire valider l’avis de confidentialité et y ajouter les coordonnées officielles du responsable de la protection des renseignements.
