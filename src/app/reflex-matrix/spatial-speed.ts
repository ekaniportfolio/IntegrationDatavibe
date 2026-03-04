/**
 * SPATIAL SPEED MODULE
 * Source unique de verite pour la velocite globale du Spatial Flow.
 * Importe par NewPlatform.tsx et ReflexOpportunity.tsx.
 */

export type SpeedPreset = 'zen' | 'normal' | 'rapide' | 'ultra';

export const SPEED_FACTORS: Record<SpeedPreset, number> = {
    zen: 2.0,
    normal: 1.0,
    rapide: 0.5,
    ultra: 0.1
};

// --- Mutable module-level state ---
let GLOBAL_SPEED_FACTOR = 1.0;
let SPATIAL_FLOW_SPEED = 2.0 / GLOBAL_SPEED_FACTOR;

// --- Listeners for React re-render triggers ---
type SpeedListener = (preset: SpeedPreset) => void;
const listeners: Set<SpeedListener> = new Set();

export const subscribeSpeed = (fn: SpeedListener) => {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
};

// --- Getters ---
export const getSpatialFlowSpeed = () => SPATIAL_FLOW_SPEED;
export const getSpeedScale = () => 2.0 / SPATIAL_FLOW_SPEED;
export const getFlowDuration = (baseDuration: number) => baseDuration / SPATIAL_FLOW_SPEED;

// --- Mutator (called from SlideMenu via component handler) ---
let _onRebuild: (() => void) | null = null;
export const setRebuildCallback = (cb: () => void) => { _onRebuild = cb; };

export const updateSpatialFlowSpeed = (preset: SpeedPreset) => {
    GLOBAL_SPEED_FACTOR = SPEED_FACTORS[preset];
    SPATIAL_FLOW_SPEED = 2.0 / GLOBAL_SPEED_FACTOR;
    // Notify rebuild callback (for containerVariants/childSlideVariants in NewPlatform)
    _onRebuild?.();
    // Notify React listeners
    listeners.forEach(fn => fn(preset));
};

/**
 * scaleTransition: Scales a Motion transition object by the current speed factor.
 * 
 * - duration/delay/staggerChildren/delayChildren are multiplied by speedScale
 *   (smaller = faster for ultra, larger = slower for zen)
 * - Spring stiffness is divided by speedScale (higher = faster settle)
 * - Spring mass is multiplied by speedScale (lower = faster settle)
 * - Recursively processes nested per-property transitions (x, y, opacity, filter, gap, scale)
 */
export const scaleTransition = (transition: Record<string, any>): Record<string, any> => {
    const s = getSpeedScale();
    if (s === 1.0) return transition; // No-op at default speed
    
    const result: Record<string, any> = { ...transition };
    
    // Scale timing properties
    if (typeof result.duration === 'number') result.duration *= s;
    if (typeof result.delay === 'number') result.delay *= s;
    if (typeof result.staggerChildren === 'number') result.staggerChildren *= s;
    if (typeof result.delayChildren === 'number') result.delayChildren *= s;
    
    // Scale spring properties
    if (typeof result.stiffness === 'number') result.stiffness /= s;
    if (typeof result.mass === 'number') result.mass *= s;
    
    // Recurse into per-property transition objects
    for (const key of ['x', 'y', 'opacity', 'filter', 'gap', 'scale', 'width', 'height']) {
        if (result[key] && typeof result[key] === 'object') {
            result[key] = scaleTransition(result[key]);
        }
    }
    
    // Handle times array (don't scale these, they're normalized 0-1)
    // Handle ease (don't scale, it's a curve name or array)
    
    return result;
};

/**
 * scaledSpring: Creates a spring config scaled by current speed.
 * Higher speed = stiffer spring, lower mass.
 */
export const scaledSpring = (stiffness: number, damping: number, mass = 1) => {
    const s = getSpeedScale();
    return {
        type: "spring" as const,
        stiffness: stiffness / s,
        damping,
        mass: mass * s
    };
};
