// 3b️⃣ SCRIPT: TYPOGRAPHY STYLES (Styles + Variable Binding)
(async function() {
    
    console.clear();
    console.log("Linking Styles, Fonts & Variables...");

    var TYPO_COLL_NAME = "Typography";
    
    // Valeurs par défaut
    var DEFAULT_FONT_FAMILY = "Manrope"; 
    var READING_FONT_FAMILY = "Roboto";
    var LOGO_FONT_FAMILY = "Datavibe";
    
    // Définition des styles cibles
    var STYLE_DEFINITIONS = {
        "Display/2XL": { 
            weight: "Bold", weightVar: "font/weight/bold",
            lineHeight: 110, leadingVar: "font/leading/tight",
            type: "product",
            desc: "Huge marketing titles" 
        },
        "Display/XL":  { 
            weight: "Bold", weightVar: "font/weight/bold",
            lineHeight: 110, leadingVar: "font/leading/tight",
            type: "product",
            desc: "Large hero titles"
        },
        "Heading/H1":  { 
            weight: "Bold", weightVar: "font/weight/bold",
            lineHeight: 120, leadingVar: "font/leading/snug",
            type: "product",
            desc: "Page main title"
        },
        "Heading/H2":  { 
            weight: "SemiBold", weightVar: "font/weight/semibold",
            lineHeight: 120, leadingVar: "font/leading/snug",
            type: "product",
            desc: "Section title"
        },
        "Heading/H3":  { 
            weight: "SemiBold", weightVar: "font/weight/semibold",
            lineHeight: 130, leadingVar: "font/leading/normal",
            type: "product",
            desc: "Subsection title"
        },
        "Heading/H4":  { 
            weight: "Medium", weightVar: "font/weight/medium",
            lineHeight: 130, leadingVar: "font/leading/normal",
            type: "product",
            desc: "Small component title"
        },
        "Body/Large":  { 
            weight: "Regular", weightVar: "font/weight/regular",
            lineHeight: 150, leadingVar: "font/leading/relaxed",
            type: "product",
            desc: "Featured body text"
        },
        "Body/Default":{ 
            weight: "Regular", weightVar: "font/weight/regular",
            lineHeight: 150, leadingVar: "font/leading/relaxed",
            type: "product",
            desc: "Standard body text"
        },
        "Body/Small":  { 
            weight: "Regular", weightVar: "font/weight/regular",
            lineHeight: 150, leadingVar: "font/leading/relaxed",
            type: "product", 
            desc: "Secondary text, captions"
        },
        "Label/Default":{ 
            weight: "Medium", weightVar: "font/weight/medium",
            lineHeight: 120, leadingVar: "font/leading/snug",
            type: "product",
            desc: "Form labels, buttons"
        },
        // Logo Variants
        "Logo/Default":{ 
            weight: "Bold", weightVar: "font/weight/bold",
            lineHeight: 120, leadingVar: "font/leading/snug",
            type: "branding",
            desc: "Main Brand Logo"
        },
        "Logo/Splash":{ 
            weight: "Bold", weightVar: "font/weight/bold",
            lineHeight: 110, leadingVar: "font/leading/tight",
            type: "branding",
            desc: "Huge Logo for Splash Screen"
        }
    };

    // 1. CHARGEMENT DES FONTS
    var styleVariations = {
        "Regular":  ["Regular", "Normal"],
        "Medium":   ["Medium", "500"],
        "SemiBold": ["SemiBold", "Semi Bold", "600"],
        "Bold":     ["Bold", "700"]
    };
    
    async function loadFontWithFallback(family, weight) {
        var candidates = styleVariations[weight];
        if (!candidates) return null;
        for (var c = 0; c < candidates.length; c++) {
            try {
                await figma.loadFontAsync({ family: family, style: candidates[c] });
                return candidates[c]; 
            } catch(e) {}
        }
        return null;
    }

    var loadedWeightsProduct = {}; 
    var weightsToLoad = ["Regular", "Medium", "SemiBold", "Bold"];
    for (var w = 0; w < weightsToLoad.length; w++) {
        var res = await loadFontWithFallback(DEFAULT_FONT_FAMILY, weightsToLoad[w]);
        if (res) loadedWeightsProduct[weightsToLoad[w]] = res;
    }

    var loadedWeightsReading = {};
    for (var w = 0; w < weightsToLoad.length; w++) {
        var res = await loadFontWithFallback(READING_FONT_FAMILY, weightsToLoad[w]);
        if (res) loadedWeightsReading[weightsToLoad[w]] = res;
    }

    var loadedWeightLogo = await loadFontWithFallback(LOGO_FONT_FAMILY, "Bold");
    
    // 2. RECUP VARIABLES
    var localCollections = figma.variables.getLocalVariableCollections();
    var targetCollection = localCollections.find(c => c.name === TYPO_COLL_NAME);
    
    if (!targetCollection) {
        figma.notify("❌ Erreur: Collection introuvable. Lancez le script 3a.");
        return;
    }

    var allFloatVars = figma.variables.getLocalVariables("FLOAT");
    var allStringVars = figma.variables.getLocalVariables("STRING");
    
    function findVar(name, type) {
        var list = (type === "STRING") ? allStringVars : allFloatVars;
        return list.find(v => v.name === name && v.variableCollectionId === targetCollection.id);
    }

    var varFamilyBranding = findVar("font/family/branding", "STRING");
    var varFamilyProduct = findVar("font/family/product", "STRING");
    var varFamilyReading = findVar("font/family/reading", "STRING");

    // 3. GENERATION STYLES
    var sCount = 0;
    var existingTextStyles = figma.getLocalTextStyles();

    for (var tokenName in STYLE_DEFINITIONS) {
        var config = STYLE_DEFINITIONS[tokenName];
        var styleName = "Typography/" + tokenName; 
        
        var textStyle = existingTextStyles.find(s => s.name === styleName);
        if (!textStyle) {
            textStyle = figma.createTextStyle();
            textStyle.name = styleName;
            existingTextStyles.push(textStyle); 
        }

        textStyle.description = config.desc || "";

        var targetFamily = DEFAULT_FONT_FAMILY;
        var targetStyle = "Regular";
        var familyVarToBind = varFamilyProduct;

        if (config.type === "branding") {
            targetFamily = LOGO_FONT_FAMILY;
            targetStyle = loadedWeightLogo || "Bold";
            familyVarToBind = varFamilyBranding;
        } else if (config.type === "reading") {
            targetFamily = READING_FONT_FAMILY;
            targetStyle = loadedWeightsReading[config.weight] || "Regular";
            familyVarToBind = varFamilyReading;
        } else {
            targetFamily = DEFAULT_FONT_FAMILY;
            targetStyle = loadedWeightsProduct[config.weight] || "Regular";
            familyVarToBind = varFamilyProduct;
        }

        textStyle.fontName = { family: targetFamily, style: targetStyle };
        textStyle.lineHeight = { value: config.lineHeight, unit: "PERCENT" };

        var sizeVar = findVar("font/size/" + tokenName, "FLOAT");
        if (sizeVar) textStyle.setBoundVariable('fontSize', sizeVar);

        if (familyVarToBind) textStyle.setBoundVariable('fontFamily', familyVarToBind);

        var weightVar = findVar(config.weightVar, "FLOAT");
        if (weightVar) textStyle.setBoundVariable('fontWeight', weightVar);

        var leadingVar = findVar(config.leadingVar, "FLOAT");
        if (leadingVar) textStyle.setBoundVariable('lineHeight', leadingVar);

        sCount++;
    }

    figma.notify("✅ 3b Succès: " + sCount + " Styles typographiques liés !");
})();
