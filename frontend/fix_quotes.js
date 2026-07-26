const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, 'app', '(public)', 'HomeClient.jsx');
let content = fs.readFileSync(target, 'utf8');

// We'll just replace the specific text strings that have unescaped quotes.
const replacements = [
  ["L'Excellence", "L&apos;Excellence"],
  ["D'expertise", "D&apos;expertise"],
  ["L'art de vivre", "L&apos;art de vivre"],
  ["à l'Algérienne", "à l&apos;Algérienne"],
  ["C'est le théâtre", "C&apos;est le théâtre"],
  ["redéfinit l'immobilier", "redéfinit l&apos;immobilier"],
  ["Découvrir l'agence", "Découvrir l&apos;agence"],
  ["Propriétés d'Exception", "Propriétés d&apos;Exception"],
  ["biens d'exception", "biens d&apos;exception"],
  ["jusqu'à la", "jusqu&apos;à la"],
  ["L'avis de", "L&apos;avis de"],
  ['"Une agence qui comprend véritablement les besoins de ses clients. La discrétion et le professionnalisme de l\'équipe ont rendu l\'achat de notre villa exceptionnellement fluide."', '&quot;Une agence qui comprend véritablement les besoins de ses clients. La discrétion et le professionnalisme de l&apos;équipe ont rendu l&apos;achat de notre villa exceptionnellement fluide.&quot;'],
  ['"Nous avons confié la vente de notre bien d\'exception à LA FORÊT. Leur réseau exclusif et leur approche sur-mesure ont permis de trouver un acquéreur en un temps record."', '&quot;Nous avons confié la vente de notre bien d&apos;exception à LA FORÊT. Leur réseau exclusif et leur approche sur-mesure ont permis de trouver un acquéreur en un temps record.&quot;'],
  ['"Le service de conciergerie est tout simplement parfait. LA FORÊT ne se contente pas de trouver un bien, ils s\'assurent que votre installation se passe dans les meilleures conditions."', '&quot;Le service de conciergerie est tout simplement parfait. LA FORÊT ne se contente pas de trouver un bien, ils s&apos;assurent que votre installation se passe dans les meilleures conditions.&quot;']
];

for (const [search, replace] of replacements) {
  content = content.replace(new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
}

fs.writeFileSync(target, content);
console.log('Fixed quotes in HomeClient.jsx');
