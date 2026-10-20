#!/usr/bin/env node
/* Vérifie l'arbre de conversation de chatbot.js et régénère CHATBOT.md.
   Usage : node outils/arbre-chatbot.js   (code de sortie 1 si l'arbre a une erreur) */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const { TREE } = require(path.join(ROOT, "chatbot.js"));
const ACTIONS = ["to", "lead", "href", "tel", "wa"];

/* ---------- Vérifications ---------- */
const errors = [];
for (const [id, node] of Object.entries(TREE)) {
  if (!Array.isArray(node.say) || !node.say.length) errors.push(`${id} : aucun message (say)`);
  if (!Array.isArray(node.choices) || !node.choices.length) errors.push(`${id} : aucun choix (impasse)`);
  (node.choices || []).forEach((c, i) => {
    const acts = ACTIONS.filter((a) => c[a] !== undefined);
    if (!c.label) errors.push(`${id} › choix ${i + 1} : pas de libellé`);
    if (acts.length !== 1) errors.push(`${id} › "${c.label}" : il faut exactement une action (${ACTIONS.join(", ")})`);
    if (c.to && !TREE[c.to]) errors.push(`${id} › "${c.label}" : le nœud "${c.to}" n'existe pas`);
    if (c.href && !fs.existsSync(path.join(ROOT, c.href.split("#")[0]))) errors.push(`${id} › "${c.label}" : la page "${c.href}" n'existe pas`);
  });
}
const reached = new Set(["start"]);
const queue = ["start"];
while (queue.length) {
  const id = queue.shift();
  for (const c of (TREE[id] && TREE[id].choices) || []) {
    if (c.to && TREE[c.to] && !reached.has(c.to)) { reached.add(c.to); queue.push(c.to); }
  }
}
for (const id of Object.keys(TREE)) if (!reached.has(id)) errors.push(`${id} : jamais atteint depuis le début`);

/* ---------- Schéma Mermaid ---------- */
const esc = (s) => s.replace(/"/g, "#quot;").replace(/\n/g, " ");
const short = (s, n = 46) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const lines = ["flowchart LR"];
const ends = new Map();
const endId = (key, label, shape) => {
  if (!ends.has(key)) { const id = "end" + ends.size; ends.set(key, id); lines.push(`  ${id}${shape[0]}"${esc(label)}"${shape[1]}`); }
  return ends.get(key);
};
for (const [id, node] of Object.entries(TREE)) lines.push(`  ${id}["<b>${id}</b><br/>${esc(short(node.say[0]))}"]`);
for (const [id, node] of Object.entries(TREE)) {
  for (const c of node.choices) {
    let target;
    if (c.to) target = c.to;
    else if (c.lead) target = endId("lead:" + c.lead, "Demande envoyée : " + c.lead, ["([", "])"]);
    else if (c.href) target = endId("href:" + c.href, "Page : " + c.href, ["[/", "/]"]);
    else if (c.tel) target = endId("tel:" + c.tel, "Appel " + c.tel, ["((", "))"]);
    else if (c.wa) target = endId("wa", "WhatsApp", ["((", "))"]);
    lines.push(`  ${id} -->|"${esc(short(c.label, 34))}"| ${target}`);
  }
}
lines.push("  classDef endpoint fill:#D9BE82,stroke:#8A6A2F,color:#0A0A0A;");
lines.push(`  class ${[...ends.values()].join(",")} endpoint;`);

/* ---------- Arbre texte ---------- */
const outline = [];
const seen = new Set();
(function walk(id, depth) {
  const pad = "  ".repeat(depth);
  if (seen.has(id)) { outline.push(`${pad}- ↺ *${id} (déjà détaillé plus haut)*`); return; }
  seen.add(id);
  const node = TREE[id];
  outline.push(`${pad}- **${id}** — ${node.say.join(" / ").replace(/\n/g, " ")}`);
  for (const c of node.choices) {
    const p2 = "  ".repeat(depth + 1);
    if (c.to) { outline.push(`${p2}- « ${c.label} » →`); walk(c.to, depth + 2); }
    else if (c.lead) outline.push(`${p2}- « ${c.label} » → ✉ nom + téléphone, demande envoyée (service : ${c.lead})`);
    else if (c.href) outline.push(`${p2}- « ${c.label} » → page \`${c.href}\``);
    else if (c.tel) outline.push(`${p2}- « ${c.label} » → appel ${c.tel}`);
    else if (c.wa) outline.push(`${p2}- « ${c.label} » → WhatsApp (avec le résumé de la conversation)`);
  }
})("start", 0);

const nodes = Object.keys(TREE).length;
const choices = Object.values(TREE).reduce((n, x) => n + x.choices.length, 0);
const leads = new Set(Object.values(TREE).flatMap((x) => x.choices.filter((c) => c.lead).map((c) => c.lead)));

const md = `# Assistant du site — arbre de conversation

> Fichier généré par \`node outils/arbre-chatbot.js\` à partir de \`chatbot.js\`. Ne pas modifier à la main.

**${nodes} étapes · ${choices} choix · ${leads.size} types de demandes de devis.**
Ajoutés automatiquement : « Menu principal » sur chaque étape, et « ← Retour » dès la deuxième étape.
Une demande de devis passe par : nom → téléphone (vérifié) → récapitulatif → envoi par Web3Forms
(même clé que les formulaires, dans \`script.js\`). En cas d'échec : WhatsApp ou appel.

## Schéma

\`\`\`mermaid
${lines.join("\n")}
\`\`\`

## Arbre détaillé

${outline.join("\n")}

## Modifier l'assistant

Tout est dans l'objet \`TREE\`, en haut de \`chatbot.js\`. Après une modification, lancez
\`node outils/arbre-chatbot.js\` : il signale les impasses, les étapes orphelines ou les liens
cassés, puis met ce fichier à jour.
`;

fs.writeFileSync(path.join(ROOT, "CHATBOT.md"), md);
console.log(`${nodes} étapes, ${choices} choix, ${leads.size} services de devis, ${ends.size} sorties.`);
if (errors.length) {
  console.error("\nERREURS :\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Arbre valide : aucune impasse, aucune étape orpheline, tous les liens existent. CHATBOT.md mis à jour.");
