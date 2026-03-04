/**
 * SPATIAL FLOW -- React Native -- Custom Protocol Demo
 * ======================================================
 * Shows how a developer creates NEW protocols from scratch
 * using createProtocol() and useSpatialTransition().
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated from "react-native-reanimated";

import {
  createProtocol,
  STANDARD_SOUL,
  REFLEX_SOUL,
  DREAM_SOUL,
  SF_EASE,
  useSpatialTransition,
  initReducedMotion,
} from "@spatial-flow/react-native";

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL 1: VORTEX — items spiral in with rotation + scale
// ═══════════════════════════════════════════════════════════════════════════════

const VortexProtocol = createProtocol({
  name: "vortex",
  soul: STANDARD_SOUL,
  states: {
    initial: { opacity: 0, rotate: -90, scale: 0.6 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
  },
  staggerMs: 80,
  initialDelayMs: 200,
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL 2: PULSE — items pulse in from center
// ═══════════════════════════════════════════════════════════════════════════════

const PulseProtocol = createProtocol({
  name: "pulse",
  soul: REFLEX_SOUL,
  states: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  staggerMs: 40,
});

// ═══════════════════════════════════════════════════════════════════════════════
// useSpatialTransition Demo — one-off animation
// ═══════════════════════════════════════════════════════════════════════════════

function HeroCard() {
  const sf = useSpatialTransition(DREAM_SOUL, {
    from: { opacity: 0, translateY: 30, scale: 0.95 },
    to: { opacity: 1, translateY: 0, scale: 1 },
    delayMs: 100,
  });

  useEffect(() => {
    sf.enter();
  }, []);

  return (
    <Animated.View style={[styles.heroCard, sf.animatedStyle]}>
      <Text style={styles.heroTitle}>useSpatialTransition()</Text>
      <Text style={styles.heroText}>
        This card uses DREAM_SOUL with per-property control.
        Speed: {sf.speedScale.toFixed(2)}x
        {sf.isReduced ? " (Reduced Motion)" : ""}
      </Text>
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Demo Screen
// ═══════════════════════════════════════════════════════════════════════════════

const DEMO_ITEMS = [
  { id: "1", title: "Quantum Mesh" },
  { id: "2", title: "Neural Tide" },
  { id: "3", title: "Prism Gate" },
  { id: "4", title: "Echo Lattice" },
  { id: "5", title: "Drift Core" },
];

export default function CustomProtocolDemo() {
  useEffect(() => {
    initReducedMotion();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Custom Protocol Demo</Text>

      <HeroCard />

      <Text style={styles.subheading}>Vortex Protocol</Text>
      {DEMO_ITEMS.map((item, i) => (
        <VortexProtocol.Item key={item.id} index={i}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </VortexProtocol.Item>
      ))}

      <Text style={styles.subheading}>Pulse Protocol</Text>
      {DEMO_ITEMS.map((item, i) => (
        <PulseProtocol.Item key={item.id} index={i}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        </PulseProtocol.Item>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f23", padding: 20 },
  heading: { fontSize: 24, color: "#fff", marginBottom: 20 },
  subheading: { fontSize: 18, color: "#a78bfa", marginTop: 24, marginBottom: 12 },
  heroCard: {
    backgroundColor: "#1e1e3f",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  heroTitle: { fontSize: 18, color: "#667eea", marginBottom: 8 },
  heroText: { fontSize: 14, color: "#aaa" },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: { fontSize: 16, color: "#e0e0e0" },
});
