# Questionnaire PSV — version française

## Ce qui a changé

### 1. La clé de correction sort du navigateur

Elle figurait en clair dans le source de la page : un clic droit, « Afficher le
code source », et les bonnes réponses des 50 questions étaient lisibles. Le
`noindex` n'y changeait rien — voir le source ne passe pas par un moteur de
recherche.

Elle réside maintenant dans `netlify/functions/submission-created.js`, exécuté
sur les serveurs de Netlify et jamais transmis au répondant. Le questionnaire
n'envoie que les réponses brutes ; la fonction calcule les scores Jaccard par
question et par compétence, puis expédie le résultat par courriel.

⚠️ **Si le dépôt est public sur GitHub, la clé demeure dans l'historique Git**
même après ce correctif. Deux solutions : rendre le dépôt privé, ou déplacer la
clé dans une variable d'environnement Netlify nommée `PSV_ANSWER_KEY` contenant
le même JSON — la fonction l'utilisera de préférence à la version intégrée.

### 2. Plus de note globale

Le score d'ensemble n'est ni calculé ni transmis. Une moyenne des 13 compétences
est identique quel que soit le poste : elle ne dit rien sur l'adéquation au rôle.
Celle-ci se calcule à la rédaction du rapport, pondérée par la fiche de poste.

Les 13 notes par compétence sont conservées intégralement.

### 3. Aucun renseignement identifiant

Le questionnaire ne demande plus ni nom, ni prénom, ni courriel, ni téléphone,
ni poste, ni région, ni rémunération. Il recueille le code de participation
attribué par l'entreprise, le nom de l'entreprise, le marché et les années
d'expérience.

L'avis de collecte figure en tête de page, avec case de consentement non
précochée qui verrouille le chronomètre.

### 4. Indexation bloquée

`noindex, nofollow, noarchive, nosnippet` sur la page, plus un `robots.txt`.
La version en ligne n'avait aucune balise robots — contrairement à la version
anglaise.

## Variables d'environnement à définir dans Netlify

| Variable | Valeur | Requis |
|---|---|---|
| `RESEND_API_KEY` | `re_…` | oui |
| `PSV_NOTIFY_EMAIL` | `evaluation@psv-global.com` | oui |
| `PSV_FROM_EMAIL` | `PSV Global <notifications@send.psv-global.com>` | recommandé |
| `PSV_ANSWER_KEY` | le JSON de la clé | optionnel, recommandé si dépôt public |

Redéployer après les avoir ajoutées : Netlify ne les injecte qu'au déploiement
suivant.

## Sous-domaine

La balise canonique pointe vers `https://assessment.psv-global.com/fr/`.
Brancher le site Netlify sur ce sous-domaine, puis vérifier HTTPS et DNS.

## Harmonisation des clés — réglée

La **question 32** était corrigée différemment selon la langue. La clé française
fait foi : `A, B, C, D, E`. Demander directement la conclusion lors d'un appel à
froid est une erreur, ce qui est cohérent avec la question 22, qui enseigne de
vendre le rendez-vous plutôt que le produit.

La version anglaise a été corrigée le 11 août 2026. Les deux clés sont
maintenant identiques sur les 50 questions.
