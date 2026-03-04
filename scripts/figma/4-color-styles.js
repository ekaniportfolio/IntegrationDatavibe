// 4️⃣ SCRIPT: COLOR SYSTEM (Primitives + Semantics + Styles)
(async function() {
    console.clear();
    console.log("🎨 Generating Complete Color System (Primitives -> Tokens -> Styles)...");

    // --- 1. DATA DEFINITIONS (Synced from theme.css) ---
    
    const PRIMITIVES = {
        "Neutral/0": "#FFFFFF",
        "Neutral/50": "#FDFBFF",
        "Neutral/100": "#F1F5F9",
        "Neutral/200": "#E2E8F0",
        "Neutral/300": "#CBD5E1",
        "Neutral/400": "#94A3B8",
        "Neutral/500": "#64748B",
        "Neutral/600": "#475569",
        "Neutral/700": "#334155",
        "Neutral/800": "#1E293B",
        "Neutral/900": "#0F0E17",
        "Neutral/950": "#0a0a0a",
        "Neutral/1000": "#06020D",

        "Brand/100": "#E0E7FF",
        "Brand/200": "#C7D2FE",
        "Brand/400": "#818CF8",
        "Brand/500": "#6366F1",
        "Brand/600": "#4F39F6",
        "Brand/700": "#344BFD",
        "Brand/900": "#2B1A4B",
        "Brand/950": "#140432",
        "Brand/DeepIndigo": "#1E1B4B",

        "Emerald/400": "#34D399",
        "Emerald/500": "#10B981",
        "Emerald/600": "#059669",
        "Emerald/700": "#047857",
        "Emerald/Social": "#1cb45b",

        "Amber/200": "#FED7AA",
        "Amber/500": "#F59E0B",
        "Amber/600": "#D97706",
        "Amber/700": "#C2410C",
        "Amber/Dashboard": "#FF5222",
        "Amber/StreamingSoft": "#F28E42",
        "Amber/ContextOrange": "#EA580C",
        "Amber/Orange500": "#F97316",

        "Red/100": "#FEE2E2",
        "Red/400": "#F44336",
        "Red/500": "#EF4444",
        "Red/600": "#DC2626",
        "Red/700": "#B91C1C",
        "Red/Rose": "#F43F5E",
        "Red/DarkAlert": "#FF2222",
        "Red/DarkOpportunity": "#FF4E50",

        "Blue/500": "#3B82F6",
        "Blue/600": "#2563EB",
        "Blue/Radio": "#1286f3",
        "Blue/Cyan": "#06B6D4",
        "Blue/Accent": "#4A8FFF",
        "Blue/LightBlue": "#93C5FD",
        
        "Pink/500": "#EC4899",
        "Pink/700": "#DB2777",
        
        "Purple/500": "#A855F7",
        "Purple/600": "#9333EA",
        "Purple/Violet": "#8B5CF6",
        "Purple/Mist": "#E9D5FF",

        "Green/500": "#4CAF50",
        "Green/400": "#66BB6A",
        "Green/TikTok": "#07DF00",
        "Green/Spotify": "#1DB954",

        "Chart/Dark2": "#F68D2B",
        "Chart/Dark3": "#30B77C",
        "Chart/Dark4": "#F4A79D",
        "Chart/Dark5": "#6670FF",

        "Yellow/500": "#EAB308"
    };

    const SEMANTICS = {
        "Background": { Light: "Neutral/50", Dark: "Neutral/950" },
        "Foreground": { Light: "Neutral/900", Dark: "Neutral/0" },
        "Card":       { Light: "Neutral/0",   Dark: "Neutral/1000" },
        
        "Primary":    { Light: "Brand/600",   Dark: "Brand/700" },
        "Secondary":  { Light: "Brand/100",   Dark: "Neutral/900" },
        "Border":     { Light: "Neutral/200", Dark: "Neutral/700" },
        "Destructive":{ Light: "Red/500",     Dark: "Red/DarkAlert" },

        "Logo/Primary": { Light: "Neutral/900", Dark: "Neutral/0" },
        "Logo/Accent":  { Light: "Brand/500",   Dark: "Brand/500" },

        "Status/Success": { Light: "Emerald/500", Dark: "Emerald/500" },
        "Status/Error":   { Light: "Red/500",     Dark: "Red/500" },

        "Chart/1": { Light: "Brand/600",     Dark: "Brand/700" },
        "Chart/2": { Light: "Purple/Violet", Dark: "Chart/Dark2" },
        "Chart/3": { Light: "Emerald/500",   Dark: "Chart/Dark3" },
        "Chart/4": { Light: "Red/Rose",      Dark: "Chart/Dark4" },
        "Chart/5": { Light: "Brand/500",     Dark: "Chart/Dark5" },

        "Dashboard/Streaming": { Light: "Amber/Dashboard", Dark: "Amber/Dashboard" },
        "Dashboard/Social":    { Light: "Emerald/Social",  Dark: "Emerald/Social" },
        "Dashboard/Radio":     { Light: "Blue/Radio",      Dark: "Blue/Radio" },
        "Dashboard/Welcome":   { Light: "Brand/600",       Dark: "Purple/Mist" },

        "Dashboard/StatYoutube":   { Light: "Blue/600",       Dark: "Blue/Accent" },
        "Dashboard/StatPlaylists": { Light: "Pink/700",        Dark: "Pink/500" },
        "Dashboard/StatPositive":  { Light: "Emerald/Social",  Dark: "Emerald/Social" },
        "Dashboard/StatNeutral":   { Light: "Blue/Accent",     Dark: "Blue/Accent" },
        "Dashboard/StatLabel":     { Light: "Neutral/500",     Dark: "Neutral/400" },
        "Dashboard/StatValue":     { Light: "Neutral/900",     Dark: "Neutral/0" },

        "Dashboard/GradStart":  { Light: "Blue/500",      Dark: "Blue/500" },
        "Dashboard/GradEnd":    { Light: "Blue/Cyan",      Dark: "Blue/Cyan" },
        "Dashboard/GradText":   { Light: "Blue/600",       Dark: "Blue/LightBlue" },

        "Dashboard/TrendDownBg":   { Light: "Red/100",   Dark: "Red/400" },
        "Dashboard/TrendDownText": { Light: "Red/700",   Dark: "Red/400" },

        "Dashboard/BackBtnIcon": { Light: "Neutral/900", Dark: "Neutral/0" },

        "Brand/Spotify": { Light: "Green/Spotify", Dark: "Green/Spotify" },
        "Brand/TikTok":  { Light: "Emerald/500",  Dark: "Green/TikTok" },

        "Niveau/BadgeStarBorder":      { Light: "Green/500",       Dark: "Green/500" },
        "Niveau/BadgeConfirmedBorder": { Light: "Purple/Violet",   Dark: "Purple/Violet" },
        "Niveau/BadgeDevBorder":       { Light: "Amber/Dashboard", Dark: "Amber/Dashboard" }
    };

    // --- 2. HELPERS ---
    
    async function getCollection(name) {
        const local = await figma.variables.getLocalVariableCollectionsAsync();
        let coll = local.find(c => c.name === name);
        if (!coll) coll = figma.variables.createVariableCollection(name);
        return coll;
    }

    async function createOrUpdateVar(collection, name, type, values, modeIds, isAlias = false) {
        const vars = await figma.variables.getLocalVariablesAsync(type);
        let v = vars.find(x => x.name === name && x.variableCollectionId === collection.id);
        if (!v) v = figma.variables.createVariable(name, collection.id, type);

        for (let i = 0; i < modeIds.length; i++) {
            const val = Array.isArray(values) ? values[i] : values;
            
            if (isAlias) {
                // val is the name of the referenced variable (e.g. "Neutral/900")
                // We need to find its ID.
                // Assuming referenced vars are in PRIMITIVES collection (created first).
                // This is complex in a single pass. 
                // Simplified: We return the variable so we can set values later? 
                // Or we do 2 passes.
            } else {
                v.setValueForMode(modeIds[i], val);
            }
        }
        return v;
    }

    function hexToRgb(hex) {
        // Expand shorthand
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }

    // --- 3. EXECUTION: PRIMITIVES ---
    
    const primColl = await getCollection("Primitives");
    const primModeId = primColl.modes[0].modeId;
    primColl.renameMode(primModeId, "Value");

    const primVarsMap = {}; // Name -> Variable

    for (const [name, hex] of Object.entries(PRIMITIVES)) {
        const rgb = hexToRgb(hex);
        const v = await createOrUpdateVar(primColl, name, "COLOR", rgb, [primModeId]);
        primVarsMap[name] = v;
    }
    
    console.log(`✅ Primitives Created: ${Object.keys(primVarsMap).length}`);

    // --- 4. EXECUTION: SEMANTICS (TOKENS) ---
    
    const semColl = await getCollection("Tokens");
    let modeLight = semColl.modes[0].modeId;
    semColl.renameMode(modeLight, "Light");
    
    let modeDark = semColl.modes.find(m => m.name === "Dark")?.modeId;
    if (!modeDark) modeDark = semColl.addMode("Dark");

    const tokenVarsMap = {};

    for (const [name, mapping] of Object.entries(SEMANTICS)) {
        // Find Primitives
        const vLight = primVarsMap[mapping.Light];
        const vDark = primVarsMap[mapping.Dark];

        if (!vLight || !vDark) {
            console.warn(`⚠️ Missing primitive for ${name}`);
            continue;
        }

        // Create Token Variable
        const tokenVar = figma.variables.createVariable(name, semColl.id, "COLOR");
        tokenVar.setValueForMode(modeLight, figma.variables.createVariableAlias(vLight));
        tokenVar.setValueForMode(modeDark, figma.variables.createVariableAlias(vDark));
        
        tokenVarsMap[name] = tokenVar;
    }
    
    console.log(`✅ Semantics Created: ${Object.keys(tokenVarsMap).length}`);

    // --- 5. EXECUTION: STYLES ---
    
    const existingStyles = await figma.getLocalPaintStylesAsync();
    
    for (const [name, tokenVar] of Object.entries(tokenVarsMap)) {
        // Create Solid Style bound to the Token
        // Name: "Background", "Primary", etc.
        // We might want to prefix? "Semantics/Background"? 
        // theme.css uses --background.
        
        let style = existingStyles.find(s => s.name === name);
        if (!style) {
            style = figma.createPaintStyle();
            style.name = name;
        }
        
        // Create a paint bound to the variable
        const paint = {
            type: "SOLID",
            color: { r: 1, g: 1, b: 1 }, // Dummy color, will be overridden by var
            opacity: 1
        };
        
        const boundPaint = figma.variables.setBoundVariableForPaint(paint, 'color', tokenVar);
        style.paints = [boundPaint];
    }
    
    figma.notify("✅ System Updated: Primitives, Tokens & Styles!");

})();