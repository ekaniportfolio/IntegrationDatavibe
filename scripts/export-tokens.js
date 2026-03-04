import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Structure directe pour compatibilité Figma (Tokens Studio)
const tokens = {
  colors: {
    primary: { value: "#4F39F6", type: "color" },
    secondary: { value: "#EEF2FF", type: "color" },
    background: { value: "#FDFBFF", type: "color" },
    foreground: { value: "#0F0E17", type: "color" },
    accent: { value: "#F5F3FF", type: "color" },
    muted: { value: "#F1F5F9", type: "color" },
    border: { value: "#E2E8F0", type: "color" }
  },
  chart: {
    "1": { value: "#4F39F6", type: "color" },
    "2": { value: "#8B5CF6", type: "color" },
    "3": { value: "#10B981", type: "color" },
    "4": { value: "#F43F5E", type: "color" },
    "5": { value: "#6366F1", type: "color" }
  }
};

const outputPath = path.join(__dirname, '../figma-tokens.json');

fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

console.log(`✅ Figma tokens updated at ${outputPath}`);
