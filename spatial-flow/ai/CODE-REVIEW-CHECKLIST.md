# Spatial Flow -- AI Code Review Checklist
## Automated Audit Protocol for Spatial Flow Compliance

> Use this checklist to audit any codebase for Spatial Flow compliance.
> Score each section: PASS / WARN / FAIL.

---

## SECTION 1: INFRASTRUCTURE (Critical)

```
[ ] viewport-lock.css is imported in global styles
    GREP: overflow: hidden (on html/body/#root)
    FAIL if: Missing entirely
    
[ ] Meta viewport is locked
    GREP: user-scalable=no
    FAIL if: Missing or user-scalable=yes
    
[ ] No 100vw usage
    GREP: 100vw
    WARN if: Found anywhere except max-width declarations
    
[ ] Motion imported correctly
    GREP: from "motion/react"
    FAIL if: from "framer-motion" (deprecated import path)
```

## SECTION 2: SOUL CONSTANTS (Critical)

```
[ ] No hardcoded spring values
    GREP: stiffness:\s*\d+ (not imported from soul-constants)
    WARN if: Any spring values not referencing named constants
    
[ ] No hardcoded transition durations in motion components
    GREP: transition=\{\{ duration: 
    WARN if: Found without scaleTransition() wrapper or named constant
    
[ ] Soul constants file exists and is imported
    GREP: import.*soul-constants
    FAIL if: No imports found in animation files
```

## SECTION 3: PROHIBITIONS (Critical)

```
[ ] No display: none for animated elements
    GREP: display.*none|display:\s*"none"
    WARN if: Found near animated/motion elements
    
[ ] No linear easing
    GREP: ease.*linear|easing.*linear
    FAIL if: Found (exception: infinite rotation loops)
    
[ ] No teleportation (opacity-only entrance)
    GREP: initial=\{\{.*opacity:\s*0\s*\}\}
    WARN if: opacity is the ONLY initial property (no x, y, scale)
    
[ ] Stagger is capped
    GREP: delay.*index\s*\*
    WARN if: No Math.min cap found nearby
    
[ ] No layout thrashing
    GREP: useEffect.*offsetHeight|useEffect.*getBoundingClientRect
    FAIL if: Layout reads inside useEffect (should be useLayoutEffect)
```

## SECTION 4: SPEED CONTROL (If applicable)

```
[ ] Tween transitions use scaleTransition()
    GREP: transition=\{\{.*duration.*\}\} (without scaleTransition wrapper)
    WARN if: Found in JSX props without scaleTransition()
    
[ ] setTimeout uses getFlowDuration()
    GREP: setTimeout.*\d+\s*\*\s*1000 (hardcoded timing)
    WARN if: Timing constants not using getFlowDuration()
    
[ ] Infinite loops excluded from scaling
    GREP: repeat:\s*Infinity.*scaleTransition
    FAIL if: scaleTransition() wraps an infinite loop
    
[ ] No double-scaling
    GREP: scaleTransition.*getFlowDuration (nested scaling)
    FAIL if: A pre-scaled value is scaled again
```

## SECTION 5: PROTOCOL COMPLIANCE

### SSC Compliance
```
[ ] Content arrives in waves (staggerChildren present)
[ ] Stagger value between 0.03 and 0.15
[ ] DelayChildren used for major sections
[ ] No reverse cascade (bottom-to-top stagger)
```

### Lateral Glide Compliance
```
[ ] Even/Odd alternating x-offset direction
[ ] Motion blur present (filter: blur)
[ ] x-offset between 15-30px (not more)
[ ] Delay uses index multiplication
```

### Chrysalis Shift Compliance
```
[ ] Container never conditionally renders (no ternary on outer container)
[ ] maxHeight used for breathing (not height: auto)
[ ] Easing is SF_EASE [0.4, 0, 0.2, 1]
[ ] Phase overlap exists (not sequential)
[ ] isClosing state propagated to content elements
```

### TAF Compliance
```
[ ] No duplicate layoutId rendered simultaneously
[ ] Namespace strategy for responsive layouts
[ ] LPS applied when parent filter/transform changes
```

### Follow Flow Compliance
```
[ ] Direction is calculated from tab index difference
[ ] AnimatePresence wraps transitioning content
[ ] Custom prop passes direction to variants
[ ] Entry/exit use opposite x positions
```

## SECTION 6: ACCESSIBILITY

```
[ ] Animations respect prefers-reduced-motion
    GREP: prefers-reduced-motion
    WARN if: No media query or Motion's useReducedMotion found
    
[ ] Interactive elements are clickable during cascade
    GREP: pointer-events.*none (during animation)
    WARN if: Found on interactive elements during SSC

[ ] Focus management after transitions
    WARN if: No focus management after Chrysalis Shift or TAF transitions
```

---

## SCORING

| Score | Meaning |
|:------|:--------|
| **ALL PASS** | Production-ready Spatial Flow implementation |
| **WARN present** | Functional but not optimal. Review warnings. |
| **ANY FAIL** | Critical violation. Must fix before deployment. |

---

## AUTOMATED GREP COMMANDS

Run these in your project root to quickly scan:

```bash
# Find hardcoded springs
grep -rn "stiffness:" --include="*.tsx" --include="*.ts" | grep -v "soul-constants" | grep -v "node_modules"

# Find display:none near motion
grep -rn "display.*none" --include="*.tsx" | grep -v "node_modules"

# Find linear easing
grep -rn "ease.*linear\|linear.*ease" --include="*.tsx" --include="*.ts" | grep -v "node_modules" | grep -v "repeat.*Infinity"

# Find unscaled timeouts
grep -rn "setTimeout" --include="*.tsx" --include="*.ts" | grep -v "getFlowDuration" | grep -v "node_modules"

# Find 100vw usage
grep -rn "100vw" --include="*.tsx" --include="*.ts" --include="*.css" | grep -v "max-width" | grep -v "node_modules"

# Find framer-motion imports
grep -rn "from.*framer-motion" --include="*.tsx" --include="*.ts" | grep -v "node_modules"
```
