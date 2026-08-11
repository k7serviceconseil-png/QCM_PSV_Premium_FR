/**
 * submission-created.js — Profil de Succès en Vente® (français)
 * -----------------------------------------------------------------------------
 * La correction s'effectue ICI, sur le serveur, et non dans le navigateur du
 * répondant.
 *
 * La clé de correction figurait auparavant dans le source de la page, lisible
 * par n'importe qui avec « Afficher le code source ». Elle n'atteint plus le
 * navigateur : ce fichier ne s'exécute que sur les serveurs de Netlify.
 *
 * Netlify déclenche cette fonction à chaque soumission de formulaire. Le nom du
 * fichier suffit — aucun câblage nécessaire.
 *
 * Variables d'environnement (Site settings → Environment variables) :
 *   RESEND_API_KEY      re_xxxxxxxx                       (obligatoire)
 *   PSV_NOTIFY_EMAIL    evaluation@psv-global.com         (obligatoire)
 *   PSV_FROM_EMAIL      PSV Global <notifications@send.psv-global.com>
 *
 * Renforcement possible : déplacer la clé dans une variable d'environnement
 * nommée PSV_ANSWER_KEY contenant le même JSON. Voir chargerCle() ci-dessous.
 * -----------------------------------------------------------------------------
 */

const NAVY = '#0f2044';
const GOLD = '#c8a96e';

const COMPETENCES = [
  'Approche et contact', 'Découverte des besoins', 'Présentation de la solution',
  'Gestion des objections', 'Négociation', 'Conclusion de la vente',
  'Suivi et fidélisation', 'Gestion du temps', 'Planification de territoire',
  'Prospection', 'Écoute active', 'Créativité et adaptabilité', 'Professionnalisme'
];

// Clé de référence. La version anglaise a été alignée sur celle-ci
// le 11 août 2026 (question 32).
const CLE_PAR_DEFAUT = {
  1:['B','D'],2:['A','B'],3:['B','D'],4:['B','D'],5:['B'],6:['B','C'],7:['A','B','C'],8:['A','D'],9:['B','D'],10:['A','B','D'],
  11:['B','D'],12:['B','C','D'],13:['A','B','C'],14:['A','B','C','D','E'],15:['A','D'],16:['B','D'],17:['A','B','D'],18:['A','B','C','D','E'],19:['A','B','D'],20:['B','D'],
  21:['B','C'],22:['A','B','D'],23:['B','C'],24:['A','B','C'],25:['A','B','D'],26:['A','B','C','D','E'],27:['B','D'],28:['A','B','D'],29:['B','C','D'],30:['A','B','C','D','E'],
  31:['A','B','D'],32:['A','B','C','D','E'],33:['A','B','D'],34:['A','B','C','D','E'],35:['A','C','D'],36:['A','B','C','D','E'],37:['A','B','C'],38:['A','B','C'],39:['A','B','D'],40:['A','B','C'],
  41:['A','B','C','D','E'],42:['B','C','D'],43:['A','B','C'],44:['A','B','C','D','E'],45:['A','B','C'],46:['A','B','C'],47:['B'],48:['A','B','C'],49:['A','B','C'],50:['A','B','C','D','E']
};

function chargerCle() {
  const env = process.env.PSV_ANSWER_KEY;
  if (env) {
    try { return JSON.parse(env); }
    catch (e) { console.error('PSV_ANSWER_KEY n\u2019est pas du JSON valide — clé intégrée utilisée.'); }
  }
  return CLE_PAR_DEFAUT;
}

// ---------------------------------------------------------------------------
// Correction — logique identique à la version qui tournait côté navigateur
// ---------------------------------------------------------------------------
function jaccard(attendues, choisies) {
  const bonnes = new Set(attendues || []);
  const cochees = new Set(choisies || []);
  let vp = 0;
  cochees.forEach(r => { if (bonnes.has(r)) vp++; });
  const fp = cochees.size - vp;
  let fn = 0;
  bonnes.forEach(r => { if (!cochees.has(r)) fn++; });
  const denominateur = vp + fp + fn;
  return denominateur === 0 ? 0 : vp / denominateur;
}

const competenceDeLaQuestion = q => ((q - 1) % COMPETENCES.length) + 1;

function corriger(reponses) {
  const CLE = chargerCle();
  const parQuestion = {};
  const paniers = {};

  for (let q = 1; q <= 50; q++) {
    const choisies = reponses['q' + q] || [];
    const score = jaccard(CLE[q], choisies);
    const c = competenceDeLaQuestion(q);
    parQuestion['q' + q] = { scorePct: Math.round(score * 100), choisies, competence: c };
    (paniers[c] = paniers[c] || []).push(score);
  }

  const parCompetence = {};
  COMPETENCES.forEach((nom, i) => {
    const panier = paniers[i + 1] || [];
    const moyenne = panier.length ? panier.reduce((s, v) => s + v, 0) / panier.length : 0;
    parCompetence[nom] = Math.round(moyenne * 100);
  });

  // Aucune note globale n'est produite. Une moyenne des 13 compétences serait
  // identique quel que soit le poste et ne dirait rien de l'adéquation au rôle.
  // Celle-ci se calcule à la rédaction du rapport, pondérée par la fiche.
  return { parCompetence, parQuestion };
}

// ---------------------------------------------------------------------------
// Courriel
// ---------------------------------------------------------------------------
const esc = v => String(v == null ? '' : v)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const section = t => `<tr><td colspan="2" style="padding:22px 0 8px;border-bottom:2px solid ${GOLD};">
  <span style="color:${NAVY};font:bold 12px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;">${esc(t)}</span></td></tr>`;

const ligne = (label, valeur) => (valeur === undefined || valeur === null || valeur === '') ? '' :
  `<tr><td style="padding:8px 14px 8px 0;border-bottom:1px solid #e9eef6;color:#6b7280;font:13px Arial,sans-serif;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
   <td style="padding:8px 0;border-bottom:1px solid #e9eef6;color:#111;font:14px Arial,sans-serif;">${esc(valeur)}</td></tr>`;

function barre(nom, v) {
  const couleur = v >= 70 ? '#0a7a2a' : (v >= 50 ? GOLD : '#8a1f11');
  return `<tr>
    <td style="padding:7px 14px 7px 0;border-bottom:1px solid #e9eef6;color:#111;font:13px Arial,sans-serif;">${esc(nom)}</td>
    <td style="padding:7px 0;border-bottom:1px solid #e9eef6;">
      <table cellpadding="0" cellspacing="0" width="100%"><tr>
        <td width="78%"><div style="background:#e9eef6;height:9px;border-radius:5px;font-size:0;line-height:0;">
          <div style="background:${couleur};height:9px;border-radius:5px;width:${v}%;font-size:0;line-height:0;">&nbsp;</div></div></td>
        <td width="22%" style="text-align:right;color:#111;font:bold 13px Arial,sans-serif;">${v} %</td>
      </tr></table></td></tr>`;
}

function batirCourriel(champs, resultats, autoEval) {
  const triees = Object.entries(resultats.parCompetence).sort((a, b) => b[1] - a[1]);

  const contenu =
    section('Identification') +
    ligne('Code de participation', champs.code_participant) +
    ligne('Entreprise', champs.entreprise) +
    ligne('Référence de soumission', champs.reference) +
    ligne('Marché', champs.market) +
    ligne('Années d\u2019expérience', champs.experience) +
    ligne('Formule', champs.formule) +
    ligne('Consentement', champs.privacy_consent === 'true' ? 'Oui' : String(champs.privacy_consent || '')) +

    section('Passation') +
    ligne('Temps actif', champs.temps_actif_utilise) +
    ligne('Temps total écoulé', champs.temps_total_ecoule) +
    ligne('Pauses', `${champs.pauses_utilisees || 0} (${champs.temps_pause_total || '00:00'})`) +

    section('Scores par compétence — non pondérés') +
    triees.map(([n, v]) => barre(n, v)).join('') +

    (autoEval.length ? section('Auto-évaluation') + autoEval.map((v, i) => ligne(String(i + 1), v)).join('') : '');

  return {
    sujet: `Questionnaire reçu — ${champs.code_participant || 'sans code'} — ${champs.entreprise || ''}`,
    html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f5f7;">
<table cellpadding="0" cellspacing="0" width="100%" style="background:#f4f5f7;padding:24px 12px;"><tr><td align="center">
<table cellpadding="0" cellspacing="0" width="640" style="max-width:640px;background:#fff;border-radius:12px;overflow:hidden;">
<tr><td style="background:${NAVY};padding:24px 28px;">
  <div style="color:#fff;font:bold 19px Georgia,serif;">Questionnaire complété</div>
  <div style="color:#c3cbdb;font:13px Arial,sans-serif;margin-top:5px;">${esc(champs.entreprise || '')} · code ${esc(champs.code_participant || '—')}</div>
</td></tr>
<tr><td style="padding:6px 28px 26px;"><table cellpadding="0" cellspacing="0" width="100%">${contenu}</table></td></tr>
<tr><td style="background:#f8f9fb;padding:16px 28px;border-top:1px solid #e9eef6;color:#6b7280;font:12px Arial,sans-serif;line-height:1.6;">
  Correction effectuée côté serveur. Scores bruts, volontairement non pondérés et sans moyenne globale.<br>
  L\u2019adéquation au poste se calcule au moment de rédiger le rapport, en rapprochant ce résultat de la fiche portant le même code de participation.
</td></tr></table></td></tr></table></body></html>`
  };
}

async function envoyerCourriel({ sujet, html }) {
  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.PSV_NOTIFY_EMAIL;
  if (!cle || !destinataire) { console.error('Resend non configuré.'); return false; }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.PSV_FROM_EMAIL || 'PSV Global <notifications@psv-global.com>',
        to: destinataire.split(',').map(s => s.trim()).filter(Boolean),
        subject: sujet, html
      })
    });
    if (!res.ok) { console.error('Resend a refusé :', res.status, await res.text()); return false; }
    return true;
  } catch (e) { console.error('Resend — erreur :', e.message); return false; }
}

// ---------------------------------------------------------------------------
exports.handler = async function (event) {
  let payload;
  try { payload = JSON.parse(event.body).payload; }
  catch (e) { return { statusCode: 400, body: 'Corps invalide' }; }

  const champs = payload.data || {};

  try {
    const reponses = {};
    for (let q = 1; q <= 50; q++) {
      const brut = champs['q' + q];
      reponses['q' + q] = Array.isArray(brut)
        ? brut
        : String(brut || '').split(',').map(s => s.trim()).filter(Boolean);
    }

    const autoEval = [];
    for (let i = 1; i <= 15; i++) if (champs['ae' + i]) autoEval.push(champs['ae' + i]);

    const resultats = corriger(reponses);
    await envoyerCourriel(batirCourriel(champs, resultats, autoEval));
  } catch (e) {
    console.error('Traitement :', e.message);
  }

  return { statusCode: 200, body: 'OK' };
};
