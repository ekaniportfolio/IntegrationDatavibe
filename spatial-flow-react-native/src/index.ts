/**
 * SPATIAL FLOW -- React Native v3.1.0
 * ======================================
 * "The screen is not a canvas. It is a window into a continuous space."
 *
 * React Native port of @spatial-flow/core.
 * Uses react-native-reanimated as the animation engine.
 *
 * @example
 * import {
 *   SOUL_PHYSICS,
 *   STANDARD_SOUL,
 *   createProtocol,
 *   useSpatialTransition,
 *   useSpatialSpeed,
 *   useReducedMotion,
 *   initReducedMotion,
 *   KineticItem,
 *   CascadeList,
 *   CascadeItem,
 * } from "@spatial-flow/react-native";
 *
 * // In App.tsx:
 * useEffect(() => { initReducedMotion(); }, []);
 *
 * @author Michel EKANI
 */

// Core
export * from "./core/index";

// Hooks
export * from "./hooks/index";

// Components
export * from "./components/index";
