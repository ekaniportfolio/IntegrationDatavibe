# Figma Automation Scripts (Generic)

Utilisez ces scripts dans le plugin **Scripter** de Figma pour générer une architecture de tokens robuste.

## 1. Générateur de Primitives
Ce script crée la collection "Primitives" avec des palettes de base.

```javascript
(function() {
    var PRIMITIVES = {
        colors: {
            Neutral: { "0": "#FFFFFF", "900": "#000000" },
            Brand: { "500": "#3B82F6" },
            Status: { Success: "#10B981", Error: "#EF4444" }
        },
        radius: { md: 8, lg: 16, full: 999 }
    };

    var coll = figma.variables.getLocalVariableCollections().find(c => c.name === "Primitives") 
               || figma.variables.createVariableCollection("Primitives");
    
    // Logic for creating variables...
    // (Voir implémentation complète dans le projet DataVibe pour référence)
})();
```

## 2. Mappage Sémantique
Mappe les intentions sur les primitives.

```javascript
(function() {
    var SEMANTICS = {
        "Background": "Primitives/Color/Neutral/0",
        "Foreground": "Primitives/Color/Neutral/900",
        "Primary": "Primitives/Color/Brand/500"
    };
    // ... logic to link variables ...
})();
```

## 3. Typographie Responsive
Définit les échelles de texte pour Mobile et Desktop via les modes de collection.

```javascript
(function() {
    var TYPO = {
        "Size/H1": { Mobile: 32, Desktop: 48 },
        "Size/Body": { Mobile: 14, Desktop: 16 }
    };
    // ... logic to create modes and variables ...
})();
```
