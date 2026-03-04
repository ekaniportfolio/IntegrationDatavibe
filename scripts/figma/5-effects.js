// 5️⃣ SCRIPT: EFFECTS (Shadows & Blurs)
(async function() {
    console.clear();
    console.log("🛠 5. Generating Effect Styles...");

    // Definition of Effects using Primitives or Semantics reference
    const EFFECTS = {
        "Shadow/Sm": {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.05 },
            offset: { x: 0, y: 1 },
            radius: 2,
            spread: 0
        },
        "Shadow/Md": {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 4 },
            radius: 6,
            spread: -1
        },
        "Shadow/Lg": {
            type: "DROP_SHADOW",
            color: { r: 0, g: 0, b: 0, a: 0.1 },
            offset: { x: 0, y: 10 },
            radius: 15,
            spread: -3
        },
        // DataVibe Glows
        "Glow/Primary": {
            type: "DROP_SHADOW",
            color: { r: 0.31, g: 0.22, b: 0.96, a: 0.5 }, // #4F39F6 @ 50%
            offset: { x: 0, y: 0 },
            radius: 20,
            spread: 0
        },
        "Glow/Primary/Strong": {
            type: "DROP_SHADOW",
            color: { r: 0.31, g: 0.22, b: 0.96, a: 0.6 }, // #4F39F6 @ 60%
            offset: { x: 0, y: 0 },
            radius: 25,
            spread: 0
        },
        "Glow/Social/Green": {
            type: "DROP_SHADOW",
            color: { r: 0.11, g: 0.71, b: 0.36, a: 0.5 }, // #1cb45b @ 50%
            offset: { x: 0, y: 0 },
            radius: 12,
            spread: 0
        },
        // Dashboard specific
        "Dashboard/Card/Shadow": {
            type: "DROP_SHADOW",
            color: { r: 0.12, g: 0.15, b: 0.53, a: 0.07 }, // rgba(31,38,135,0.07)
            offset: { x: 0, y: 8 },
            radius: 32,
            spread: 0
        },
        "Dashboard/Opportunity/Shadow/Light": {
            type: "DROP_SHADOW",
            color: { r: 0.93, g: 0.26, b: 0.26, a: 0.2 }, // #EF4444 @ 20%
            offset: { x: 0, y: 4 },
            radius: 12,
            spread: 0
        },
        "Dashboard/Opportunity/Shadow/Dark": {
            type: "DROP_SHADOW",
            color: { r: 1, g: 0.3, b: 0.31, a: 0.3 }, // #FF4E50 @ 30%
            offset: { x: 0, y: 4 },
            radius: 12,
            spread: 0
        },
        // Glassmorphism
        "Glass/Blur": {
            type: "LAYER_BLUR",
            color: { r: 1, g: 1, b: 1, a: 0 }, // Not applicable, but required
            offset: { x: 0, y: 0 },
            radius: 12,
            spread: 0
        },
        // Opportunity RM Shadow
        "Dashboard/Opportunity/RM/Shadow": {
            type: "DROP_SHADOW",
            color: { r: 1, g: 0.31, b: 0.31, a: 0.3 }, // rgba(255, 78, 80, 0.3)
            offset: { x: 0, y: 4 },
            radius: 20,
            spread: -10
        },
        // Glow Streaming/Orange
        "Glow/Streaming/Orange": {
            type: "DROP_SHADOW",
            color: { r: 0.95, g: 0.56, b: 0.26, a: 0.5 }, // #F28E42 @ 50%
            offset: { x: 0, y: 0 },
            radius: 12,
            spread: 0
        },
        // Glow Radio/Blue
        "Glow/Radio/Blue": {
            type: "DROP_SHADOW",
            color: { r: 0.07, g: 0.53, b: 0.95, a: 0.5 }, // #1286f3 @ 50%
            offset: { x: 0, y: 0 },
            radius: 12,
            spread: 0
        }
    };

    try {
        const localStyles = await figma.getLocalEffectStylesAsync();
        let count = 0;

        for (const name in EFFECTS) {
            const def = EFFECTS[name];
            let style = localStyles.find(s => s.name === name);
            
            if (!style) {
                style = figma.createEffectStyle();
                style.name = name;
            }

            const effect = {
                type: def.type,
                color: def.color,
                offset: def.offset,
                radius: def.radius,
                spread: def.spread,
                visible: true,
                blendMode: "NORMAL"
            };

            style.effects = [effect];
            count++;
        }

        figma.notify(`✅ 5. Effects Generated: ${count} Styles`);

    } catch (err) {
        console.error(err);
        figma.notify(`❌ Error: ${err.message}`);
    }
})();