// 3a️⃣ SCRIPT: TYPOGRAPHY VARIABLES (Sizes, Families, Weights, Leading)
(function() {
    
    console.clear();
    console.log("Generating Typography Variables...");

    var TYPO_COLL_NAME = "Typography";

    // 1. DÉFINITION DES VARIABLES
    
    // A. Tailles (Float) - Responsive [Desktop, Tablet, Mobile]
    var SIZE_SCALE = {
        "Display/2XL": { size: [72, 60, 48] },
        "Display/XL":  { size: [60, 48, 40] },
        "Heading/H1":  { size: [48, 40, 32] },
        "Heading/H2":  { size: [36, 32, 28] },
        "Heading/H3":  { size: [30, 28, 24] },
        "Heading/H4":  { size: [24, 22, 20] },
        "Body/Large":  { size: [18, 18, 16] },
        "Body/Default":{ size: [16, 16, 14] },
        "Body/Small":  { size: [14, 14, 12] },
        "Label/Default":{ size: [14, 14, 13] },
        "Logo/Default": { size: [48, 36, 28] }, // Matches Guidelines
        "Logo/Splash":  { size: [80, 64, 48] }  // Matches Guidelines
    };

    // B. Poids (Float) - Fixe
    var WEIGHT_SCALE = {
        "font/weight/regular": 400,
        "font/weight/medium": 500,
        "font/weight/semibold": 600,
        "font/weight/bold": 700,
        "font/weight/extrabold": 800
    };

    // C. Leading / Interlignage (Float) - Fixe (%)
    var LEADING_SCALE = {
        "font/leading/none": 100,
        "font/leading/tight": 110,
        "font/leading/snug": 120,
        "font/leading/normal": 130,
        "font/leading/relaxed": 150
    };

    // D. Familles (String) - Fixe
    var FAMILY_SCALE = {
        "font/family/branding": "Datavibe",
        "font/family/product":  "Manrope",
        "font/family/reading":  "Roboto",
        "font/family/secondary": "Inter",
        "font/family/poppins": "Poppins"
    };

    // 2. GESTION COLLECTION & MODES
    var localCollections = figma.variables.getLocalVariableCollections();
    var typoCollection = null;

    for (var k = 0; k < localCollections.length; k++) {
        if (localCollections[k].name === TYPO_COLL_NAME) {
            typoCollection = localCollections[k];
            break;
        }
    }

    if (!typoCollection) {
        typoCollection = figma.variables.createVariableCollection(TYPO_COLL_NAME);
    }

    var typoModes = typoCollection.modes;
    var tModeDesktop = typoModes[0].modeId;
    typoCollection.renameMode(tModeDesktop, "Desktop");

    var tModeTablet = null;
    var tModeMobile = null;

    for (var m = 0; m < typoModes.length; m++) {
        if (typoModes[m].name === "Tablet") tModeTablet = typoModes[m].modeId;
        if (typoModes[m].name === "Mobile") tModeMobile = typoModes[m].modeId;
    }

    if (!tModeTablet) tModeTablet = typoCollection.addMode("Tablet");
    if (!tModeMobile) tModeMobile = typoCollection.addMode("Mobile");

    var tModeIds = [tModeDesktop, tModeTablet, tModeMobile];

    // 3. CRÉATION VARIABLES
    var tCount = 0;
    
    function updateVariable(name, type, values) {
        var allVars = figma.variables.getLocalVariables(type);
        var targetVar = null;
        
        for (var v = 0; v < allVars.length; v++) {
            if (allVars[v].name === name && allVars[v].variableCollectionId === typoCollection.id) {
                targetVar = allVars[v];
                break;
            }
        }
        
        if (!targetVar) {
            targetVar = figma.variables.createVariable(name, typoCollection.id, type);
        }

        if (targetVar) {
            for (var i = 0; i < tModeIds.length; i++) {
                if (tModeIds[i]) {
                    var val = Array.isArray(values) ? values[i] : values;
                    targetVar.setValueForMode(tModeIds[i], val);
                }
            }
            tCount++;
        }
    }

    // Execution
    for (var key in SIZE_SCALE) updateVariable("font/size/" + key, "FLOAT", SIZE_SCALE[key].size);
    for (var key in WEIGHT_SCALE) updateVariable(key, "FLOAT", WEIGHT_SCALE[key]);
    for (var key in LEADING_SCALE) updateVariable(key, "FLOAT", LEADING_SCALE[key]);
    for (var key in FAMILY_SCALE) updateVariable(key, "STRING", FAMILY_SCALE[key]);

    figma.notify("✅ 3a Succès: " + tCount + " Variables Typographiques mises à jour");

})();
