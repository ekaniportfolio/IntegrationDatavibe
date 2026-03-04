/**
 * 2-semantics.js
 * Maps primitives to semantic tokens, mirroring src/styles/theme.css.
 * Complete sync — covers ALL CSS custom properties defined in :root and .dark.
 */
import { PRIMITIVES } from "./1-primitives.js";

export const SEMANTICS = {
    // ═══════════════════════════════════════════
    // CORE SURFACES & TEXT
    // ═══════════════════════════════════════════
    Background: {
        Light: PRIMITIVES.Neutral[50],
        Dark: PRIMITIVES.Neutral[950]
    },
    Foreground: {
        Light: PRIMITIVES.Neutral[900],
        Dark: PRIMITIVES.Neutral[0]
    },
    Card: {
        Light: PRIMITIVES.Neutral[0],
        Dark: PRIMITIVES.Neutral[1000] // #141414 approx (06020D)
    },
    Muted: {
        Bg: {
            Light: PRIMITIVES.Neutral[100],
            Dark: PRIMITIVES.Neutral[900] // #1f1f1f
        },
        Fg: {
            Light: PRIMITIVES.Neutral[600],
            Dark: PRIMITIVES.Neutral[400]
        }
    },
    Border: {
        Light: PRIMITIVES.Neutral[200],
        Dark: PRIMITIVES.Neutral[700] // #27272a
    },

    // ═══════════════════════════════════════════
    // BRAND & ACTIONS
    // ═══════════════════════════════════════════
    Primary: {
        Light: PRIMITIVES.Brand[600], // #4F39F6
        Dark: PRIMITIVES.Brand[700]   // #344BFD
    },
    PrimaryForeground: {
        Light: PRIMITIVES.Neutral[0],
        Dark: PRIMITIVES.Neutral[0]
    },
    Secondary: {
        Light: PRIMITIVES.Brand[100], // #EEF2FF
        Dark: PRIMITIVES.Neutral[900] // #1f1f1f
    },
    SecondaryForeground: {
        Light: PRIMITIVES.Brand.DeepIndigo, // #1E1B4B
        Dark: PRIMITIVES.Neutral[0]
    },
    Accent: {
        Light: "#F5F3FF",             // Violet Mist
        Dark: PRIMITIVES.Neutral[900]
    },
    AccentForeground: {
        Light: PRIMITIVES.Brand.DeepIndigo,
        Dark: PRIMITIVES.Neutral[0]
    },
    Destructive: {
        Light: PRIMITIVES.Red[500],
        Dark: PRIMITIVES.Red.DarkAlert // #FF2222
    },
    Ring: {
        Light: PRIMITIVES.Brand[600],
        Dark: PRIMITIVES.Brand[700]
    },

    // ═══════════════════════════════════════════
    // HEADER
    // ═══════════════════════════════════════════
    Header: {
        Background: {
            Light: "rgba(253, 251, 255, 0.5)",
            Dark: "rgba(0, 0, 0, 0.2)"
        },
        Border: {
            Light: PRIMITIVES.Neutral[200],
            Dark: PRIMITIVES.Neutral[700]
        }
    },

    // ═══════════════════════════════════════════
    // SIDEBAR
    // ═══════════════════════════════════════════
    Sidebar: {
        Bg:              { Light: PRIMITIVES.Neutral[50],  Dark: PRIMITIVES.Neutral[950] },
        Fg:              { Light: PRIMITIVES.Neutral[900], Dark: PRIMITIVES.Neutral[0] },
        Primary:         { Light: PRIMITIVES.Brand[600],   Dark: PRIMITIVES.Brand[700] },
        PrimaryFg:       { Light: PRIMITIVES.Neutral[0],   Dark: PRIMITIVES.Neutral[0] },
        Accent:          { Light: PRIMITIVES.Brand[100],   Dark: PRIMITIVES.Neutral[900] },
        AccentFg:        { Light: PRIMITIVES.Brand.DeepIndigo, Dark: PRIMITIVES.Neutral[0] },
        Border:          { Light: PRIMITIVES.Neutral[200], Dark: PRIMITIVES.Neutral[700] },
        Ring:            { Light: PRIMITIVES.Brand[600],   Dark: PRIMITIVES.Brand[700] }
    },

    // ═══════════════════════════════════════════
    // LOGO SPECIFIC
    // ═══════════════════════════════════════════
    Logo: {
        Primary: {
            Light: PRIMITIVES.Neutral[900],
            Dark: PRIMITIVES.Neutral[0]
        },
        Accent: {
            Light: PRIMITIVES.Brand[500], // #6366f1
            Dark: PRIMITIVES.Brand[500]
        }
    },

    // ═══════════════════════════════════════════
    // STATUS
    // ═══════════════════════════════════════════
    Status: {
        Success: { Light: PRIMITIVES.Emerald[500], Dark: PRIMITIVES.Emerald[500] },
        Error:   { Light: PRIMITIVES.Red[500],     Dark: PRIMITIVES.Red[500] }
    },

    // ═══════════════════════════════════════════
    // CHARTS
    // ═══════════════════════════════════════════
    Chart: {
        1: { Light: PRIMITIVES.Brand[600],    Dark: PRIMITIVES.Brand[700] },    // Primary
        2: { Light: PRIMITIVES.Purple.Violet,  Dark: PRIMITIVES.Chart.Dark2 },   // Violet / Orange
        3: { Light: PRIMITIVES.Emerald[500],   Dark: PRIMITIVES.Chart.Dark3 },   // Emerald
        4: { Light: PRIMITIVES.Red.Rose,       Dark: PRIMITIVES.Chart.Dark4 },   // Rose / Peach
        5: { Light: PRIMITIVES.Brand[500],     Dark: PRIMITIVES.Chart.Dark5 }    // Indigo
    },

    // ═══════════════════════════════════════════
    // BRANDS
    // ═══════════════════════════════════════════
    Brands: {
        Spotify: { Light: PRIMITIVES.Green.Spotify, Dark: PRIMITIVES.Green.Spotify },
        TikTok:  { Light: PRIMITIVES.Emerald[500],  Dark: PRIMITIVES.Green.TikTok }
    },

    // ═══════════════════════════════════════════
    // DATAVIBE CUSTOM TOKENS
    // ═══════════════════════════════════════════
    DataVibe: {
        Primary: { Light: PRIMITIVES.Brand[600],    Dark: PRIMITIVES.Brand[600] },
        Orange:  { Light: PRIMITIVES.Amber.Orange500, Dark: PRIMITIVES.Amber.Orange500 },
        Green:   { Light: PRIMITIVES.Emerald[500],  Dark: PRIMITIVES.Emerald[500] },
        Pink:    { Light: PRIMITIVES.Red.Rose,       Dark: PRIMITIVES.Red.Rose },
        Red:     { Light: PRIMITIVES.Red[500],       Dark: PRIMITIVES.Red[500] },
        Purple:  { Light: PRIMITIVES.Purple.Violet,  Dark: PRIMITIVES.Purple.Violet }
    },

    // ═══════════════════════════════════════════
    // EFFECT GLOWS
    // ═══════════════════════════════════════════
    EffectGlow: {
        Primary:       { Light: "rgba(79, 57, 246, 0.5)",  Dark: "rgba(79, 57, 246, 0.5)" },
        PrimaryStrong: { Light: "rgba(79, 57, 246, 0.6)",  Dark: "rgba(79, 57, 246, 0.6)" }
    },

    // ═══════════════════════════════════════════
    // DASHBOARD: MAIN NAMESPACE COLORS
    // ═══════════════════════════════════════════
    Dashboard: {
        Streaming: { Light: PRIMITIVES.Amber.Dashboard, Dark: PRIMITIVES.Amber.Dashboard },
        Social:    { Light: PRIMITIVES.Emerald.Social,  Dark: PRIMITIVES.Emerald.Social },
        Radio:     { Light: PRIMITIVES.Blue.Radio,      Dark: PRIMITIVES.Blue.Radio },
        
        WelcomeText: {
            Light: PRIMITIVES.Brand[600],
            Dark: PRIMITIVES.Purple.Mist // #E9D5FF
        },
        WelcomeTextRadio: {
            Light: PRIMITIVES.Purple[600], // #9333EA
            Dark: PRIMITIVES.Purple.Mist
        },
        
        // Cards & Overlays
        CardBg: {
            Light: "rgba(255, 255, 255, 0.8)",
            Dark: "rgba(6, 2, 13, 0.5)"
        },
        StatCardBg: {
            Light: "rgba(255, 255, 255, 0.8)",
            Dark: "rgba(6, 2, 13, 0.5)"
        },
        OverlayBg: {
            Light: "rgba(241, 245, 249, 0.9)",
            Dark: PRIMITIVES.Neutral[800]
        },
        OverlayBorder: {
            Light: PRIMITIVES.Brand[600],
            Dark: PRIMITIVES.Purple[500]
        },

        // Stats
        StatYoutube:   { Light: PRIMITIVES.Blue[600],      Dark: PRIMITIVES.Blue.Accent },
        StatPlaylists: { Light: PRIMITIVES.Pink[700],       Dark: PRIMITIVES.Pink[500] },
        StatIconBg:    { Light: "rgba(255, 82, 34, 0.2)",  Dark: "rgba(255, 82, 34, 0.2)" },
        StatPositive:  { Light: PRIMITIVES.Emerald.Social,  Dark: PRIMITIVES.Emerald.Social },
        StatNeutral:   { Light: PRIMITIVES.Blue.Accent,     Dark: PRIMITIVES.Blue.Accent },
        StatLabel:     { Light: PRIMITIVES.Neutral[500],    Dark: PRIMITIVES.Neutral[400] },
        StatValue:     { Light: PRIMITIVES.Neutral[900],    Dark: PRIMITIVES.Neutral[0] },

        // Tabs (Default — Orange/Streaming)
        TabActive: {
            Bg:   { Light: PRIMITIVES.Amber.Dashboard, Dark: PRIMITIVES.Amber.Dashboard },
            Text: { Light: PRIMITIVES.Neutral[0],      Dark: PRIMITIVES.Neutral[0] }
        },
        TabInactive: {
            Bg:   { Light: PRIMITIVES.Neutral[100],    Dark: "rgba(255, 82, 34, 0.1)" },
            Text: { Light: PRIMITIVES.Neutral[500],    Dark: PRIMITIVES.Neutral[400] }
        },
        TabBorder: { Light: PRIMITIVES.Amber.Dashboard, Dark: PRIMITIVES.Amber.Dashboard },

        // Tabs (Social — Green)
        TabSocialActive: {
            Bg:   { Light: PRIMITIVES.Emerald.Social, Dark: PRIMITIVES.Emerald.Social },
            Text: { Light: PRIMITIVES.Neutral[0],     Dark: PRIMITIVES.Neutral[0] }
        },
        TabSocialInactive: {
            Bg:   { Light: "rgba(28, 180, 91, 0.1)", Dark: "rgba(28, 180, 91, 0.1)" },
            Text: { Light: PRIMITIVES.Neutral[0],    Dark: PRIMITIVES.Neutral[0] }
        },
        TabSocialBorder: { Light: PRIMITIVES.Emerald.Social, Dark: PRIMITIVES.Emerald.Social },

        // Tabs (Radio — Blue)
        TabRadioInactiveBg: { Light: "rgba(18, 134, 243, 0.1)", Dark: "rgba(18, 134, 243, 0.1)" },

        // Gradient Cards
        GradCardStart: { Light: PRIMITIVES.Blue[500],      Dark: PRIMITIVES.Blue[500] },
        GradCardEnd:   { Light: PRIMITIVES.Blue.Cyan,       Dark: PRIMITIVES.Blue.Cyan },
        GradCardText:  { Light: PRIMITIVES.Blue[600],       Dark: PRIMITIVES.Blue.LightBlue },

        // Trends
        TrendDownBg:   { Light: PRIMITIVES.Red[100],       Dark: "rgba(244, 67, 54, 0.2)" },
        TrendDownText: { Light: PRIMITIVES.Red[700],       Dark: PRIMITIVES.Red[400] },

        // Social Cards
        SocialCardBg:     { Light: "rgba(255, 255, 255, 0.8)", Dark: "rgba(6, 2, 13, 0.5)" },
        SocialCardBorder: { Light: PRIMITIVES.Neutral[200],    Dark: "rgba(255, 255, 255, 0.05)" },
        SocialCardText:   { Light: PRIMITIVES.Neutral[900],    Dark: PRIMITIVES.Neutral[0] },

        // Social generic
        IconBgSocial: { Light: "rgba(28, 180, 91, 0.2)", Dark: "rgba(28, 180, 91, 0.2)" },

        // Back Button
        BackBtnBg:   { Light: "rgba(0, 0, 0, 0.1)",      Dark: "rgba(255, 255, 255, 0.2)" },
        BackBtnIcon: { Light: PRIMITIVES.Neutral[900],    Dark: PRIMITIVES.Neutral[0] },

        // Blocks
        BlockEmerald: {
            BgStart: { Light: "rgba(16, 185, 129, 0.2)", Dark: "rgba(16, 185, 129, 0.15)" },
            BgEnd:   { Light: "rgba(20, 184, 166, 0.2)", Dark: "rgba(20, 184, 166, 0.15)" },
            Border:  { Light: "rgba(16, 185, 129, 0.3)", Dark: "rgba(16, 185, 129, 0.2)" },
            Title:   { Light: PRIMITIVES.Amber.ContextOrange, Dark: PRIMITIVES.Amber.ContextOrange }
        },
        BlockAmber: {
            BgStart: { Light: "rgba(185, 120, 16, 0.2)", Dark: "rgba(185, 120, 16, 0.2)" },
            BgEnd:   { Light: "rgba(184, 94, 20, 0.2)",  Dark: "rgba(184, 94, 20, 0.2)" },
            Border:  { Light: "rgba(184, 94, 20, 0.3)",  Dark: "rgba(184, 94, 20, 0.3)" }
        },
        BlockStreaming: {
            Bg:     { Light: "rgba(242, 142, 66, 0.1)", Dark: "rgba(242, 142, 66, 0.1)" },
            Border: { Light: "rgba(242, 142, 66, 0.6)", Dark: "rgba(242, 142, 66, 0.6)" }
        },

        // Action Buttons
        ActionStreaming: {
            Bg: { 
                Light: "linear-gradient(96.7657deg, rgba(255, 82, 34, 0.9) 1.5047%, rgba(242, 142, 66, 0.8) 98.378%)", 
                Dark: "linear-gradient(96.7657deg, rgba(255, 82, 34, 0.9) 1.5047%, rgba(242, 142, 66, 0.8) 98.378%)" 
            },
            Border: { Light: PRIMITIVES.Amber.StreamingSoft, Dark: PRIMITIVES.Amber.StreamingSoft }
        },
        ActionSocial: {
            Bg:     { Light: "rgba(28, 180, 91, 0.1)", Dark: "rgba(28, 180, 91, 0.1)" },
            Border: { Light: PRIMITIVES.Emerald[500],   Dark: PRIMITIVES.Emerald[500] }
        },
        ActionRadio: {
            Border: { Light: PRIMITIVES.Blue.Accent, Dark: PRIMITIVES.Blue.Accent }
        },

        // Actions (Soft)
        ActionSoft: {
            Bg:   { Light: "rgba(0, 0, 0, 0.05)",     Dark: "rgba(16, 185, 129, 0.2)" },
            Text: { Light: PRIMITIVES.Neutral[900],    Dark: PRIMITIVES.Neutral[0] }
        },

        // Reflex Action
        ReflexAction: {
            BgStart: { Light: "rgba(16, 185, 129, 0.2)", Dark: "rgba(16, 185, 129, 0.2)" },
            BgEnd:   { Light: "rgba(20, 184, 166, 0.2)", Dark: "rgba(20, 184, 166, 0.2)" },
            Border:  { Light: "rgba(16, 185, 129, 0.3)", Dark: "rgba(16, 185, 129, 0.3)" },
            Text:    { Light: "#065F46",                  Dark: PRIMITIVES.Emerald[400] }
        },

        // Opportunity
        Opportunity: {
            Bg:             { Light: "rgba(255, 255, 255, 0.9)", Dark: "rgba(0, 0, 0, 0.5)" },
            Border:         { Light: PRIMITIVES.Amber[200],      Dark: PRIMITIVES.Amber.ContextOrange },
            Shadow:         { Light: "rgba(239, 68, 68, 0.2)",   Dark: "rgba(255, 78, 80, 0.3)" },
            Title:          { Light: PRIMITIVES.Red[600],        Dark: PRIMITIVES.Red.DarkOpportunity },
            Text:           { Light: PRIMITIVES.Neutral[700],    Dark: PRIMITIVES.Neutral[0] },
            GradientStart:  { Light: PRIMITIVES.Red[500],        Dark: PRIMITIVES.Red.DarkOpportunity },
            GradientEnd:    { Light: PRIMITIVES.Yellow[500],     Dark: "#F9D423" },
            ButtonBg:       { Light: "rgba(255, 247, 237, 0.4)", Dark: "rgba(234, 88, 12, 0.1)" },
            ButtonText:     { Light: PRIMITIVES.Amber[700],      Dark: PRIMITIVES.Amber.ContextOrange },
            ButtonBorder:   { Light: PRIMITIVES.Amber[200],      Dark: "rgba(234, 88, 12, 0.3)" },
            BadgeBg:        { Light: "rgba(255, 255, 255, 0.5)", Dark: "rgba(255, 255, 255, 0.2)" },
            NumberBg:       { Light: "rgba(16, 185, 129, 0.2)",  Dark: "rgba(16, 185, 129, 0.2)" },
            NumberBorder:   { Light: "rgba(16, 185, 129, 0.4)",  Dark: "rgba(16, 185, 129, 0.4)" },
            NumberText:     { Light: PRIMITIVES.Emerald[700],    Dark: PRIMITIVES.Emerald[400] },
            RmBlur:         "4px",
            RmShadow:       "0px 4px 20px -10px rgba(255, 78, 80, 0.3)"
        },

        // Social Cards (generic)
        SocialGenericBg:     { Light: "rgba(255, 255, 255, 0.6)", Dark: "rgba(6, 2, 13, 0.5)" },
        SocialGenericBorder: { Light: "rgba(0, 0, 0, 0.05)",      Dark: "rgba(255, 255, 255, 0.05)" },
        SocialTextPrimary:   { Light: PRIMITIVES.Neutral[900],    Dark: PRIMITIVES.Neutral[0] }
    },

    // ═══════════════════════════════════════════
    // APP GRADIENTS
    // ═══════════════════════════════════════════
    AppGradient: {
        Start:  { Light: PRIMITIVES.Neutral[100], Dark: "#161313" },
        Middle: { Light: PRIMITIVES.Brand[100],   Dark: PRIMITIVES.Brand[900] },
        End:    { Light: PRIMITIVES.Brand[200],   Dark: PRIMITIVES.Brand[950] }
    },

    // ═══════════════════════════════════════════
    // NIVEAU (LEVEL SYSTEM)
    // ═══════════════════════════════════════════
    Niveau: {
        BadgeStar: {
            Bg:     { Light: "rgba(76, 175, 80, 0.2)",  Dark: "rgba(76, 175, 80, 0.2)" },
            Border: { Light: PRIMITIVES.Green[500],      Dark: PRIMITIVES.Green[500] },
            Text:   { Light: PRIMITIVES.Green[500],      Dark: PRIMITIVES.Green[500] }
        },
        BadgeConfirmed: {
            Bg:     { Light: "rgba(139, 92, 246, 0.2)", Dark: "rgba(139, 92, 246, 0.2)" },
            Border: { Light: PRIMITIVES.Purple.Violet,   Dark: PRIMITIVES.Purple.Violet },
            Text:   { Light: PRIMITIVES.Purple.Violet,   Dark: PRIMITIVES.Purple.Violet }
        },
        BadgeDev: {
            Bg:     { Light: "rgba(255, 82, 34, 0.2)",  Dark: "rgba(255, 82, 34, 0.2)" },
            Border: { Light: PRIMITIVES.Amber.Dashboard, Dark: PRIMITIVES.Amber.Dashboard },
            Text:   { Light: PRIMITIVES.Amber.Dashboard, Dark: PRIMITIVES.Amber.Dashboard }
        },
        MetricCard: {
            Bg:     { Light: "rgba(255, 255, 255, 0.8)", Dark: "rgba(13, 8, 2, 0.5)" },
            Border: { Light: "rgba(0, 0, 0, 0.05)",     Dark: "rgba(6, 2, 13, 0.5)" }
        },
        // Streaming Universe
        HeaderStreaming: {
            Gradient: {
                Light: "linear-gradient(92.782deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)",
                Dark:  "linear-gradient(92.782deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)"
            },
            Border: { Light: "rgba(183, 107, 53, 0.8)", Dark: "rgba(183, 107, 53, 0.8)" }
        },
        IconBgStreaming: { Light: "rgba(242, 142, 66, 0.2)", Dark: "rgba(242, 142, 66, 0.2)" },

        // Social Universe
        MetricCardSocial: {
            Bg:     { Light: "rgba(255, 255, 255, 0.8)", Dark: "rgba(2, 13, 6, 0.5)" },
            Border: { Light: "rgba(0, 0, 0, 0.05)",     Dark: "rgba(2, 13, 6, 0.5)" }
        },
        HeaderSocial: {
            Gradient: {
                Light: "linear-gradient(91.1316deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)",
                Dark:  "linear-gradient(91.1316deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)"
            },
            Border: { Light: "rgba(28, 180, 91, 0.6)", Dark: "rgba(28, 180, 91, 0.6)" },
            IconGradient: {
                Light: "linear-gradient(90.8419deg, rgba(28, 180, 91, 0.9) 1.8236%, rgba(16, 185, 129, 0.8) 98.176%)",
                Dark:  "linear-gradient(90.8419deg, rgba(28, 180, 91, 0.9) 1.8236%, rgba(16, 185, 129, 0.8) 98.176%)"
            }
        },
        OverlaySocialBg: { Light: "rgba(28, 180, 91, 0.1)", Dark: "rgba(28, 180, 91, 0.1)" },
        IconBgSocial: { Light: "rgba(28, 180, 91, 0.2)", Dark: "rgba(28, 180, 91, 0.2)" },

        // Media/Radio Universe
        MetricCardRadio: {
            Bg:     { Light: "rgba(255, 255, 255, 0.8)", Dark: "rgba(2, 8, 13, 0.5)" },
            Border: { Light: "rgba(0, 0, 0, 0.05)",     Dark: "rgba(2, 8, 13, 0.5)" }
        },
        HeaderRadio: {
            Gradient: {
                Light: "linear-gradient(92.7487deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)",
                Dark:  "linear-gradient(92.7487deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)"
            },
            Border: { Light: "rgba(15, 101, 186, 0.8)", Dark: "rgba(15, 101, 186, 0.8)" },
            IconGradient: {
                Light: "linear-gradient(90.8263deg, rgba(18, 134, 243, 0.9) 0.92512%, rgba(74, 143, 255, 0.8) 99.075%)",
                Dark:  "linear-gradient(90.8263deg, rgba(18, 134, 243, 0.9) 0.92512%, rgba(74, 143, 255, 0.8) 99.075%)"
            }
        },
        IconBgRadio: { Light: "rgba(18, 134, 243, 0.2)", Dark: "rgba(18, 134, 243, 0.2)" },
        OverlayRadioBg: { Light: "rgba(18, 134, 243, 0.1)", Dark: "rgba(18, 134, 243, 0.1)" }
    }
};
