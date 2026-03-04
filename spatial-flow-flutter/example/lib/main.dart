/// SPATIAL FLOW -- Flutter -- Custom Protocol Demo
/// ==================================================
/// Shows how a developer creates NEW protocols from scratch
/// using SpatialProtocol + SpatialItem + SpatialTransitionBuilder.

import 'package:flutter/material.dart';
import 'package:spatial_flow/spatial_flow.dart';

// ═════════════════════════════════════════════════════════════════════════════
// PROTOCOL 1: VORTEX — items spiral in with rotation + scale
// ═════════════════════════════════════════════════════════════════════════════

final vortexProtocol = SpatialProtocol(
  name: 'vortex',
  soul: SoulConstants.standard,
  states: SFProtocolStates(
    initial: {'opacity': 0.0, 'rotate': -90.0, 'scale': 0.6},
    animate: {'opacity': 1.0, 'rotate': 0.0, 'scale': 1.0},
  ),
  staggerMs: 80,
  initialDelayMs: 200,
);

// ═════════════════════════════════════════════════════════════════════════════
// PROTOCOL 2: PULSE — items pulse in from center
// ═════════════════════════════════════════════════════════════════════════════

final pulseProtocol = SpatialProtocol(
  name: 'pulse',
  soul: SoulConstants.reflex,
  states: SFProtocolStates(
    initial: {'opacity': 0.0, 'scale': 0.85},
    animate: {'opacity': 1.0, 'scale': 1.0},
  ),
  staggerMs: 40,
);

// ═════════════════════════════════════════════════════════════════════════════
// PROTOCOL 3: CURTAIN — items slide down like a theatrical curtain
// ═════════════════════════════════════════════════════════════════════════════

final curtainProtocol = SpatialProtocol(
  name: 'curtain',
  tweenSoul: SFTweenConfig(durationMs: 600, easing: sfEase),
  states: SFProtocolStates(
    initial: {'opacity': 0.0, 'translateY': -40.0},
    animate: {'opacity': 1.0, 'translateY': 0.0},
  ),
  staggerMs: 100,
);

// ═════════════════════════════════════════════════════════════════════════════
// APP
// ═════════════════════════════════════════════════════════════════════════════

void main() => runApp(const SpatialFlowDemoApp());

class SpatialFlowDemoApp extends StatelessWidget {
  const SpatialFlowDemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Spatial Flow Demo',
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0F0F23),
      ),
      home: const DemoScreen(),
    );
  }
}

class DemoScreen extends StatelessWidget {
  const DemoScreen({super.key});

  static const _items = [
    'Quantum Mesh',
    'Neural Tide',
    'Prism Gate',
    'Echo Lattice',
    'Drift Core',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Spatial Flow — Custom Protocols'),
        backgroundColor: const Color(0xFF1A1A2E),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Hero Card (SpatialTransitionBuilder) ──────────────────
            const _SectionTitle('SpatialTransitionBuilder — One-off'),
            SpatialTransitionBuilder(
              soul: SoulConstants.dream,
              from: {'opacity': 0.0, 'translateY': 30.0},
              to: {'opacity': 1.0, 'translateY': 0.0},
              delayMs: 100,
              builder: (context, values) {
                return Opacity(
                  opacity: values['opacity']!.clamp(0.0, 1.0),
                  child: Transform.translate(
                    offset: Offset(0, values['translateY']!),
                    child: Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        gradient: const LinearGradient(
                          colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'SpatialTransitionBuilder',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'DREAM_SOUL physics. Speed: '
                            '${SpatialSpeed.instance.speedScale.toStringAsFixed(2)}x',
                            style: TextStyle(color: Colors.white70),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 32),

            // ── Vortex Protocol ──────────────────────────────────────
            const _SectionTitle('Vortex Protocol'),
            ..._items.asMap().entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: SpatialItem(
                    protocol: vortexProtocol,
                    index: e.key,
                    child: _DemoCard(title: e.value),
                  ),
                )),

            const SizedBox(height: 32),

            // ── Pulse Protocol ───────────────────────────────────────
            const _SectionTitle('Pulse Protocol'),
            ..._items.asMap().entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: SpatialItem(
                    protocol: pulseProtocol,
                    index: e.key,
                    child: _DemoCard(title: e.value),
                  ),
                )),

            const SizedBox(height: 32),

            // ── Curtain Protocol ─────────────────────────────────────
            const _SectionTitle('Curtain Protocol (tween-based)'),
            ..._items.asMap().entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: SpatialItem(
                    protocol: curtainProtocol,
                    index: e.key,
                    child: _DemoCard(title: e.value),
                  ),
                )),

            const SizedBox(height: 32),

            // ── Lateral Glide (KineticItem) ──────────────────────────
            const _SectionTitle('Lateral Glide (built-in)'),
            ..._items.asMap().entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: KineticItem(
                    index: e.key,
                    child: _DemoCard(title: e.value),
                  ),
                )),

            const SizedBox(height: 32),

            // ── Cascade (CascadeItem) ────────────────────────────────
            const _SectionTitle('Sequential Cascade (built-in)'),
            ..._items.asMap().entries.map((e) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: CascadeItem(
                    index: e.key,
                    child: _DemoCard(title: e.value),
                  ),
                )),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

// ── Shared Widgets ────────────────────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 18,
          color: Color(0xFFA78BFA),
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _DemoCard extends StatelessWidget {
  final String title;
  const _DemoCard({required this.title});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A2E),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF333333)),
      ),
      child: Text(
        title,
        style: const TextStyle(fontSize: 16, color: Color(0xFFE0E0E0)),
      ),
    );
  }
}
