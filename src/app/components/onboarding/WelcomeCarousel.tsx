/**
 * ============================================================================
 * WELCOME CAROUSEL — Cinematic · ambient stardust + swipe on text
 * ============================================================================
 *
 * Ambient violet particles drift lazily across the full viewport, twinkling.
 * Text entering/exiting creates a gravitational wind that displaces nearby
 * particles proportionally — like objects with mass pushing through a field.
 * Particles are never killed by collisions; they're shoved and drift back.
 *
 * Swipe is captured directly on the text zone for natural mobile UX.
 * Very long display time for peaceful reading.
 *
 * Architecture: "sw" mode — duplicated in Mobile + Desktop, never unified.
 * ============================================================================
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../language-provider";

/* ─── Selling points ─── */
interface SellingPoint {
    id: string;
    titleKey: string;
    bodyKey: string;
}

const SELLING_POINTS: SellingPoint[] = [
    { id: "sp-hero", titleKey: "carousel.sp1.title", bodyKey: "carousel.sp1.body" },
    { id: "sp-streaming", titleKey: "carousel.sp2.title", bodyKey: "carousel.sp2.body" },
    { id: "sp-social", titleKey: "carousel.sp3.title", bodyKey: "carousel.sp3.body" },
    { id: "sp-radio", titleKey: "carousel.sp4.title", bodyKey: "carousel.sp4.body" },
    { id: "sp-career", titleKey: "carousel.sp5.title", bodyKey: "carousel.sp5.body" },
    { id: "sp-cta", titleKey: "carousel.sp6.title", bodyKey: "carousel.sp6.body" },
];

/* ─── Easing ─── */
const SMOKE_IN: [number, number, number, number] = [0.16, 1, 0.3, 1];
const SMOKE_OUT: [number, number, number, number] = [0.7, 0, 0.84, 0];

/* ─── Timing — snappy transitions, leisurely reading ─── */
const ENTER_DURATION = 0.7;
const DISPLAY_DURATION = 8500; // 8.5s — comfortable reading
const EXIT_DURATION = 0.5;
const USER_PAUSE_DURATION = 14000;
const SWIPE_THRESHOLD = 35;

/* ═══════════════════════════════════════════════════════════════════════════
 * AMBIENT STARDUST — Canvas particle system with gravitational wind
 * ═══════════════════════════════════════════════════════════════════════════ */

const PARTICLE_COUNT = 75;
const VIOLET_RGBS: [number, number, number][] = [
    [139, 92, 246],
    [124, 58, 237],
    [167, 139, 250],
    [196, 181, 253],
    [109, 40, 217],
    [221, 214, 254],
    [157, 118, 249],
];

interface DustParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseOpacity: number;
    opacity: number;
    twinkleSpeed: number;
    twinklePhase: number;
    twinkleDepth: number;
    life: number;
    maxLife: number;
    age: number;
    r: number;
    g: number;
    b: number;
}

/**
 * Wind field created by text motion.
 * Instead of killing particles, applies a force that falls off with distance.
 */
interface WindField {
    /** horizontal direction: -1 left, +1 right */
    dirX: number;
    /** vertical center of the text band (fraction 0..1 of canvas H) */
    bandY: number;
    /** influence radius in px — particles within this range are affected */
    radius: number;
    /** strength multiplier */
    strength: number;
    /** time remaining (seconds) */
    ttl: number;
    /** max ttl for fade calculation */
    maxTtl: number;
}

/**
 * Pointer state for mouse / touch interaction with particles.
 * Particles near the pointer are repelled; pointer velocity adds a wake.
 */
interface PointerState {
    /** position in CSS px relative to canvas top-left */
    x: number;
    y: number;
    /** velocity in px/s (smoothed) */
    vx: number;
    vy: number;
    /** is there an active pointer on the surface? */
    active: boolean;
}

const POINTER_RADIUS = 75;       // repulsion range (px)
const POINTER_STRENGTH = 320;    // base repulsion force
const POINTER_WAKE = 0.45;       // how much pointer velocity adds to push

/** Scatter state — triggered on exit, read by canvas loop */
interface ScatterState {
    active: boolean;
    /** seconds elapsed since scatter started (tracked inside tick) */
    elapsed: number;
}

const SCATTER_DURATION = 1.3;    // total scatter animation (seconds)
const SCATTER_IMPULSE = 420;     // radial velocity impulse

function createParticle(w: number, h: number, forceEdge: boolean): DustParticle {
    const rgb = VIOLET_RGBS[Math.floor(Math.random() * VIOLET_RGBS.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 8;
    return {
        x: forceEdge ? (Math.random() > 0.5 ? -10 : w + 10) : Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.5 + Math.random() * 1.3,
        baseOpacity: 0.15 + Math.random() * 0.45,
        opacity: 0,
        twinkleSpeed: 0.4 + Math.random() * 1.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleDepth: 0.15 + Math.random() * 0.55,
        life: 0,
        maxLife: 14 + Math.random() * 22,
        age: 0,
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    };
}

/* ─── Canvas animation loop ─── */
function startDustLoop(
    canvas: HTMLCanvasElement,
    windsRef: React.MutableRefObject<WindField[]>,
    pointerRef: React.MutableRefObject<PointerState>,
    scatterRef: React.MutableRefObject<ScatterState>
): () => void {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    let particles: DustParticle[] = [];
    let raf = 0;
    let lastTime = 0;
    let W = 0;
    let H = 0;
    let scatterApplied = false; // one-shot impulse flag

    const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed initial particles spread across viewport
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle(W, H, false);
        // Stagger births widely so they die at very different times
        p.age = Math.random() * p.maxLife * 0.7;
        particles.push(p);
    }

    const tick = (time: number) => {
        const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0.016;
        lastTime = time;

        const winds = windsRef.current;
        const ptr = pointerRef.current;
        const scatter = scatterRef.current;

        // Track scatter elapsed time
        if (scatter.active) {
            scatter.elapsed += dt;

            // One-shot: apply radial impulse to every particle
            if (!scatterApplied) {
                scatterApplied = true;
                const cx = W / 2;
                const cy = H / 2;
                for (const p of particles) {
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    // Randomize impulse slightly per particle for organic feel
                    const impulse = SCATTER_IMPULSE * (0.7 + Math.random() * 0.6);
                    p.vx += (dx / dist) * impulse;
                    p.vy += (dy / dist) * impulse;
                }
            }
        }

        // Global opacity fade during scatter
        const globalAlpha = scatter.active
            ? Math.max(0, 1 - scatter.elapsed / SCATTER_DURATION)
            : 1;

        ctx.clearRect(0, 0, W, H);

        // Stop animation once scatter fade is complete
        if (scatter.active && globalAlpha <= 0) {
            raf = requestAnimationFrame(tick); // keep alive for cleanup
            return;
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.age += dt;

            // Life: fade in over 2.5s, sustain, fade out last 2.5s
            const fadeIn = Math.min(1, p.age / 2.5);
            const fadeOut = Math.max(0, 1 - Math.max(0, p.age - (p.maxLife - 2.5)) / 2.5);
            p.life = fadeIn * fadeOut;

            if (p.life <= 0 && p.age > 1) {
                particles.splice(i, 1);
                continue;
            }

            // Gentle harmonic wobble
            const wobX = Math.sin(p.age * 0.28 + p.twinklePhase) * 0.12;
            const wobY = Math.cos(p.age * 0.22 + p.twinklePhase * 1.3) * 0.1;
            p.vx += wobX * dt * 6;
            p.vy += wobY * dt * 5;

            // Gravitational wind from text motion
            for (const wind of winds) {
                const bandCenterPx = wind.bandY * H;
                const dy = p.y - bandCenterPx;
                const dist = Math.abs(dy);

                if (dist < wind.radius) {
                    // Force falls off quadratically with distance
                    const proximity = 1 - dist / wind.radius;
                    const fadeFactor = Math.min(1, wind.ttl / (wind.maxTtl * 0.3));
                    const force = wind.strength * proximity * proximity * fadeFactor;

                    // Horizontal push in text direction
                    p.vx += wind.dirX * force * dt;

                    // Vertical scatter — pushed away from band center
                    const vertPush = dy === 0 ? (Math.random() - 0.5) * 2 : Math.sign(dy);
                    p.vy += vertPush * force * 0.35 * dt;
                }
            }

            // Pointer repulsion (mouse / touch)
            if (ptr.active) {
                const pdx = p.x - ptr.x;
                const pdy = p.y - ptr.y;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

                if (pDist < POINTER_RADIUS && pDist > 0.5) {
                    const proximity = 1 - pDist / POINTER_RADIUS;
                    const force = POINTER_STRENGTH * proximity * proximity;

                    // Repulsion direction: pointer → particle
                    const nx = pdx / pDist;
                    const ny = pdy / pDist;

                    p.vx += nx * force * dt;
                    p.vy += ny * force * dt;

                    // Wake effect: pointer velocity drags nearby particles
                    p.vx += ptr.vx * POINTER_WAKE * proximity * dt;
                    p.vy += ptr.vy * POINTER_WAKE * proximity * dt;
                }
            }

            // Friction / drag — particles slowly return to gentle drift
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > 12) {
                const drag = 1 - dt * 1.2;
                p.vx *= drag;
                p.vy *= drag;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;

            // Soft wrap — disabled during scatter so particles fly off
            if (!scatter.active) {
                if (p.x < -30) p.x = W + 20;
                if (p.x > W + 30) p.x = -20;
                if (p.y < -30) p.y = H + 20;
                if (p.y > H + 30) p.y = -20;
            }

            // Twinkle
            const twinkle =
                1 -
                p.twinkleDepth *
                    (0.5 +
                        0.5 *
                            Math.sin(
                                p.age * p.twinkleSpeed * Math.PI * 2 + p.twinklePhase
                            ));
            p.opacity = p.baseOpacity * p.life * twinkle;

            if (p.opacity < 0.005) continue;

            // Apply global scatter fade
            const finalOpacity = p.opacity * globalAlpha;
            if (finalOpacity < 0.003) continue;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${finalOpacity})`;
            ctx.fill();

            // Soft glow halo on brighter particles
            if (finalOpacity > 0.2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${finalOpacity * 0.1})`;
                ctx.fill();
            }
        }

        // Replenish — but NOT during scatter
        if (!scatter.active) {
            while (particles.length < PARTICLE_COUNT) {
                const spawnAtEdge = Math.random() < 0.35;
                const p = createParticle(W, H, spawnAtEdge);
                if (!spawnAtEdge) {
                    // Interior spawn starts with a tiny age so it fades in quickly
                    p.age = 0.5 + Math.random() * 1.5;
                }
                particles.push(p);
            }
        }

        raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
    };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * CAROUSEL COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

interface WelcomeCarouselProps {
    isExiting: boolean;
    onExitComplete?: () => void;
    startDelay?: number;
}

export function WelcomeCarousel({
    isExiting,
    onExitComplete,
    startDelay = 2.8,
}: WelcomeCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const { t } = useTranslation();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const exitCalledRef = useRef(false);
    const prevIndexRef = useRef(-1);

    // Wind fields (shared with canvas loop)
    const windsRef = useRef<WindField[]>([]);

    // Pointer state (shared with canvas loop)
    const pointerRef = useRef<PointerState>({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        active: false,
    });

    // Scatter state (shared with canvas loop)
    const scatterRef = useRef<ScatterState>({
        active: false,
        elapsed: 0,
    });

    // Canvas callback ref — starts animation when canvas mounts
    const dustCleanupRef = useRef<(() => void) | null>(null);
    const canvasCallbackRef = useCallback(
        (node: HTMLCanvasElement | null) => {
            if (dustCleanupRef.current) {
                dustCleanupRef.current();
                dustCleanupRef.current = null;
            }
            if (node) {
                dustCleanupRef.current = startDustLoop(node, windsRef, pointerRef, scatterRef);
            }
        },
        []
    );
    useEffect(() => {
        return () => {
            if (dustCleanupRef.current) dustCleanupRef.current();
        };
    }, []);

    // Swipe tracking
    const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
    // Ref to the outer container for coordinate conversion
    const containerRef = useRef<HTMLDivElement | null>(null);
    // Last pointer timestamp for velocity calc
    const lastPointerRef = useRef<{ x: number; y: number; t: number } | null>(null);

    /** Convert page coords to canvas-relative coords & update pointer state */
    const updatePointer = useCallback((pageX: number, pageY: number) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = pageX - rect.left;
        const y = pageY - rect.top;
        const now = performance.now();
        const last = lastPointerRef.current;

        let vx = 0;
        let vy = 0;
        if (last) {
            const dtMs = now - last.t;
            if (dtMs > 0 && dtMs < 200) {
                const dtS = dtMs / 1000;
                // Smooth velocity with exponential blend
                const raw_vx = (x - last.x) / dtS;
                const raw_vy = (y - last.y) / dtS;
                vx = pointerRef.current.vx * 0.6 + raw_vx * 0.4;
                vy = pointerRef.current.vy * 0.6 + raw_vy * 0.4;
            }
        }
        lastPointerRef.current = { x, y, t: now };
        pointerRef.current.x = x;
        pointerRef.current.y = y;
        pointerRef.current.vx = vx;
        pointerRef.current.vy = vy;
        pointerRef.current.active = true;
    }, []);

    const deactivatePointer = useCallback(() => {
        pointerRef.current.active = false;
        pointerRef.current.vx = 0;
        pointerRef.current.vy = 0;
        lastPointerRef.current = null;
    }, []);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);
    const clearPauseTimer = useCallback(() => {
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = null;
        }
    }, []);

    /* ── Mouse tracking for particle interaction ── */
    const onMouseMove = useCallback(
        (e: React.MouseEvent) => updatePointer(e.clientX, e.clientY),
        [updatePointer]
    );
    const onMouseLeave = useCallback(() => deactivatePointer(), [deactivatePointer]);

    /* ── Touch tracking for particle interaction (touchmove) ── */
    const onTouchMove = useCallback(
        (e: React.TouchEvent) => {
            const t = e.touches[0];
            if (t) updatePointer(t.clientX, t.clientY);
        },
        [updatePointer]
    );

    /* ── Navigate ── */
    const goTo = useCallback(
        (index: number, fromUser = false) => {
            if (index === currentIndex) return;
            const clamped =
                ((index % SELLING_POINTS.length) + SELLING_POINTS.length) %
                SELLING_POINTS.length;
            clearTimer();
            if (fromUser) {
                clearPauseTimer();
                setIsPaused(true);
                pauseTimerRef.current = setTimeout(
                    () => setIsPaused(false),
                    USER_PAUSE_DURATION
                );
            }
            setCurrentIndex(clamped);
        },
        [currentIndex, clearTimer, clearPauseTimer]
    );

    /* ── Create wind fields on slide change ── */
    useEffect(() => {
        if (!hasStarted || prevIndexRef.current === currentIndex) return;
        const titleFromLeft = currentIndex % 2 === 0;

        // Two wind bands: title (~45%) and body (~55%)
        // Each pushes particles in the direction the text travels
        windsRef.current.push(
            {
                dirX: titleFromLeft ? 1 : -1,
                bandY: 0.45,
                radius: 90,
                strength: 380,
                ttl: 1.2,
                maxTtl: 1.2,
            },
            {
                dirX: titleFromLeft ? -1 : 1,
                bandY: 0.56,
                radius: 80,
                strength: 320,
                ttl: 1.2,
                maxTtl: 1.2,
            }
        );
        prevIndexRef.current = currentIndex;
    }, [currentIndex, hasStarted]);

    /* ── Start delay ── */
    useEffect(() => {
        const t = setTimeout(() => setHasStarted(true), startDelay * 1000);
        return () => clearTimeout(t);
    }, [startDelay]);

    /* ── Auto-cycle ── */
    useEffect(() => {
        if (!hasStarted || isExiting || isPaused) return;
        clearTimer();
        timerRef.current = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % SELLING_POINTS.length);
        }, DISPLAY_DURATION);
        return clearTimer;
    }, [currentIndex, hasStarted, isExiting, isPaused, clearTimer]);

    useEffect(() => clearPauseTimer, [clearPauseTimer]);

    /* ── Exit ── */
    useEffect(() => {
        if (!isExiting || exitCalledRef.current) return;
        exitCalledRef.current = true;
        clearTimer();
        clearPauseTimer();
        scatterRef.current.active = true;
        scatterRef.current.elapsed = 0;
        const t = setTimeout(() => onExitComplete?.(), SCATTER_DURATION * 1000);
        return () => clearTimeout(t);
    }, [isExiting, onExitComplete, clearTimer, clearPauseTimer]);

    /* ── Swipe handlers (on text zone) ── */
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const t = e.touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
        // Also start pointer tracking for particle interaction
        updatePointer(t.clientX, t.clientY);
    }, [updatePointer]);

    const onTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            // Deactivate pointer
            deactivatePointer();

            if (!touchStartRef.current) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStartRef.current.x;
            const dy = t.clientY - touchStartRef.current.y;
            const elapsed = Date.now() - touchStartRef.current.t;
            touchStartRef.current = null;

            // Horizontal-dominant, within time limit
            if (
                Math.abs(dx) < SWIPE_THRESHOLD ||
                Math.abs(dy) > Math.abs(dx) * 1.2 ||
                elapsed > 900
            )
                return;

            if (dx < 0) {
                goTo(currentIndex + 1, true);
            } else {
                goTo(currentIndex - 1, true);
            }
        },
        [currentIndex, goTo, deactivatePointer]
    );

    const point = hasStarted ? SELLING_POINTS[currentIndex] : null;
    const titleFromLeft = currentIndex % 2 === 0;

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex flex-col relative"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {/* ── Ambient stardust canvas — always mounted ── */}
            <canvas
                ref={canvasCallbackRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
            />

            {/* ── Text zone — swipeable ── */}
            <div
                className="flex-1 w-full relative overflow-hidden"
                style={{ zIndex: 1, touchAction: "pan-y" }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <AnimatePresence mode="wait">
                    {hasStarted && !isExiting && point && (
                        <motion.div
                            key={point.id + "-" + currentIndex}
                            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 md:gap-3 px-6"
                            initial="enter"
                            animate="visible"
                            exit="exit"
                        >
                            {/* ── Title ── */}
                            <motion.h3
                                className="font-manrope font-bold text-[28px] md:text-[38px] text-foreground text-center leading-snug tracking-tight max-w-[520px]"
                                variants={{
                                    enter: {
                                        x: titleFromLeft ? "-110vw" : "110vw",
                                        opacity: 0,
                                        filter: "blur(24px)",
                                    },
                                    visible: {
                                        x: 0,
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        transition: {
                                            duration: ENTER_DURATION,
                                            ease: SMOKE_IN,
                                            opacity: {
                                                duration: ENTER_DURATION * 0.7,
                                                ease: SMOKE_IN,
                                            },
                                            filter: {
                                                duration: ENTER_DURATION * 1.15,
                                                ease: SMOKE_IN,
                                            },
                                        },
                                    },
                                    exit: {
                                        x: titleFromLeft ? "-40vw" : "40vw",
                                        opacity: 0,
                                        filter: "blur(20px)",
                                        transition: {
                                            duration: EXIT_DURATION,
                                            ease: SMOKE_OUT,
                                            opacity: { duration: EXIT_DURATION * 0.55 },
                                        },
                                    },
                                }}
                            >
                                {t(point.titleKey)}
                            </motion.h3>

                            {/* ── Body ── */}
                            <motion.p
                                className="font-manrope font-normal text-[17px] md:text-[21px] text-muted-foreground text-center leading-relaxed max-w-[480px]"
                                variants={{
                                    enter: {
                                        x: titleFromLeft ? "110vw" : "-110vw",
                                        opacity: 0,
                                        filter: "blur(24px)",
                                    },
                                    visible: {
                                        x: 0,
                                        opacity: 1,
                                        filter: "blur(0px)",
                                        transition: {
                                            duration: ENTER_DURATION,
                                            ease: SMOKE_IN,
                                            delay: 0.06,
                                            opacity: {
                                                duration: ENTER_DURATION * 0.7,
                                                delay: 0.06,
                                                ease: SMOKE_IN,
                                            },
                                            filter: {
                                                duration: ENTER_DURATION * 1.15,
                                                delay: 0.08,
                                                ease: SMOKE_IN,
                                            },
                                        },
                                    },
                                    exit: {
                                        x: titleFromLeft ? "40vw" : "-40vw",
                                        opacity: 0,
                                        filter: "blur(20px)",
                                        transition: {
                                            duration: EXIT_DURATION,
                                            ease: SMOKE_OUT,
                                            delay: 0.03,
                                            opacity: {
                                                duration: EXIT_DURATION * 0.55,
                                                delay: 0.03,
                                            },
                                        },
                                    },
                                }}
                            >
                                {t(point.bodyKey)}
                            </motion.p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Navigation dots ── */}
            {hasStarted && !isExiting && (
                <motion.div
                    className="shrink-0 flex items-center justify-center gap-3.5 pb-10 pt-1"
                    style={{ zIndex: 1 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    {SELLING_POINTS.map((_, i) => {
                        const isActive = i === currentIndex;
                        return (
                            <motion.button
                                key={i}
                                type="button"
                                aria-label={`Aller au message ${i + 1}`}
                                onClick={() => goTo(i, true)}
                                className="relative rounded-full cursor-pointer focus:outline-none"
                                style={{
                                    width: isActive ? 24 : 8,
                                    height: 8,
                                    backgroundColor: "var(--datavibe-primary)",
                                    opacity: isActive ? 1 : 0.25,
                                    padding: 0,
                                    border: "none",
                                }}
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 26,
                                }}
                                whileHover={{
                                    opacity: isActive ? 1 : 0.6,
                                    scale: 1.25,
                                }}
                                whileTap={{ scale: 0.9 }}
                            />
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}