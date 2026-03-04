// ---------------------------------------------------------
// SCRIPT POUR LE PLUGIN FIGMA "SCRIPTER"
// ---------------------------------------------------------
// Instructions :
// 1. Installez le plugin "Scripter" de Rasmus Andersson dans Figma.
// 2. Ouvrez Scripter.
// 3. Créez un nouveau script.
// 4. Copiez-collez tout le code ci-dessous.
// 5. Cliquez sur "Run".
// ---------------------------------------------------------

// Définition COMPLÈTE des tokens DataVibe (Synchronisé avec theme.css)
const tokens = {
  // --- BRAND ---
  "DataVibe/Brand/Primary": "#4F39F6",
  "DataVibe/Brand/PrimaryForeground": "#FFFFFF",
  "DataVibe/Brand/Secondary": "#EEF2FF",
  "DataVibe/Brand/SecondaryForeground": "#1E1B4B",
  "DataVibe/Brand/Accent": "#F5F3FF",
  "DataVibe/Brand/AccentForeground": "#1E1B4B",
  "DataVibe/Brand/Destructive": "#EF4444",
  "DataVibe/Brand/DestructiveForeground": "#FFFFFF",

  // --- SURFACE ---
  "DataVibe/Surface/Background": "#FDFBFF",
  "DataVibe/Surface/Foreground": "#0F0E17",
  "DataVibe/Surface/Card": "#FFFFFF",
  "DataVibe/Surface/CardForeground": "#0F0E17",
  "DataVibe/Surface/Popover": "#FFFFFF",
  "DataVibe/Surface/PopoverForeground": "#0F0E17",
  "DataVibe/Surface/Muted": "#F1F5F9",
  "DataVibe/Surface/MutedForeground": "#475569",

  // --- UI ---
  "DataVibe/UI/Border": "#E2E8F0",
  "DataVibe/UI/Input": "#E2E8F0",
  "DataVibe/UI/Ring": "#4F39F6",

  // --- CHARTS ---
  "DataVibe/Charts/1": "#4F39F6",
  "DataVibe/Charts/2": "#8B5CF6",
  "DataVibe/Charts/3": "#10B981",
  "DataVibe/Charts/4": "#F43F5E",
  "DataVibe/Charts/5": "#6366F1",

  // --- SIDEBAR ---
  "DataVibe/Sidebar/Background": "#FDFBFF",
  "DataVibe/Sidebar/Foreground": "#0F0E17",
  "DataVibe/Sidebar/Primary": "#4F39F6",
  "DataVibe/Sidebar/PrimaryForeground": "#FFFFFF",
  "DataVibe/Sidebar/Accent": "#EEF2FF",
  "DataVibe/Sidebar/AccentForeground": "#1E1B4B",
  "DataVibe/Sidebar/Border": "#E2E8F0",
  "DataVibe/Sidebar/Ring": "#4F39F6",

  // --- CUSTOM DATAVIBE ---
  "DataVibe/Custom/Primary": "#4F39F6",
  "DataVibe/Custom/Orange": "#F97316",
  "DataVibe/Custom/Green": "#10B981",
  "DataVibe/Custom/Pink": "#F43F5E",
  "DataVibe/Custom/Red": "#EF4444",
  "DataVibe/Custom/Purple": "#8B5CF6"
};

// Fonction utilitaire pour convertir Hex en RGB (0-1)
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : null;
}

// Fonction principale
async function main() {
  console.clear();
  console.log("🚀 DataVibe: Démarrage de la synchro des couleurs...");

  let created = 0;
  let updated = 0;

  // Récupérer tous les styles locaux existants
  const localStyles = figma.getLocalPaintStyles();

  for (const [name, hex] of Object.entries(tokens)) {
    const rgb = hexToRgb(hex);
    if (!rgb) {
      console.warn(`⚠️ Hex invalide pour ${name}: ${hex}`);
      continue;
    }

    const solidPaint = {
      type: "SOLID",
      color: rgb
    };

    // Chercher si le style existe déjà par son nom
    let style = localStyles.find(s => s.name === name);

    if (style) {
      // Mettre à jour
      style.paints = [solidPaint];
      updated++;
    } else {
      // Créer nouveau
      style = figma.createPaintStyle();
      style.name = name;
      style.paints = [solidPaint];
      created++;
    }
  }

  // Feedback utilisateur
  const msg = `✅ Terminé ! ${created} styles créés, ${updated} mis à jour.`;
  figma.notify(msg);
  console.log(msg);
}

// Exécuter
main();
