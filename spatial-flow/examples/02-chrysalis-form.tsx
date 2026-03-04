/**
 * SPATIAL FLOW EXAMPLE -- Chrysalis Form
 * =========================================
 * Demonstrates: Chrysalis Shift [CS] Protocol
 *
 * A multi-step authentication card where the container persists
 * and only the inner content metamorphoses. The card never unmounts;
 * it "sheds its skin" between Sign In, Sign Up, and Forgot Password.
 *
 * Usage:
 *   import { ChrysalisFormDemo } from "./examples/02-chrysalis-form";
 *   <ChrysalisFormDemo />
 */

import React, { useState } from "react";
import { ChrysalisContainer, ChrysalisElement } from "../src/components/ChrysalisContainer";
import { useReducedMotion } from "../src/hooks/useReducedMotion";

// ─── View: Sign In ───────────────────────────────────────────────────────────

function SignInView({
  onForgot,
  onSignUp,
}: {
  onForgot: () => void;
  onSignUp: () => void;
}) {
  return (
    <div className="p-8 flex flex-col gap-4">
      <ChrysalisElement index={0} isClosing={false}>
        <h2 className="text-white text-2xl">Sign In</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Welcome back to your dashboard
        </p>
      </ChrysalisElement>

      <ChrysalisElement index={1} isClosing={false}>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-neutral-300 text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={2} isClosing={false}>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 text-sm">Password</label>
          <input
            type="password"
            placeholder="Your password"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={3} isClosing={false}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-2">
          Sign In
        </button>
      </ChrysalisElement>

      <ChrysalisElement index={4} isClosing={false}>
        <div className="flex items-center justify-between text-sm mt-2">
          <button
            onClick={onForgot}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Forgot password?
          </button>
          <button
            onClick={onSignUp}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Create account
          </button>
        </div>
      </ChrysalisElement>
    </div>
  );
}

// ─── View: Sign Up ───────────────────────────────────────────────────────────

function SignUpView({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-8 flex flex-col gap-4">
      <ChrysalisElement index={0} isClosing={false}>
        <h2 className="text-white text-2xl">Create Account</h2>
        <p className="text-neutral-400 text-sm mt-1">
          Join the Spatial Flow ecosystem
        </p>
      </ChrysalisElement>

      <ChrysalisElement index={1} isClosing={false}>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-neutral-300 text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Michel EKANI"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={2} isClosing={false}>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={3} isClosing={false}>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 text-sm">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={4} isClosing={false}>
        <div className="flex flex-col gap-2">
          <label className="text-neutral-300 text-sm">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={5} isClosing={false}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-2">
          Create Account
        </button>
      </ChrysalisElement>

      <ChrysalisElement index={6} isClosing={false}>
        <button
          onClick={onBack}
          className="text-neutral-400 hover:text-white text-sm text-center transition-colors"
        >
          Already have an account? Sign in
        </button>
      </ChrysalisElement>
    </div>
  );
}

// ─── View: Forgot Password ──────────────────────────────────────────────────

function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-8 flex flex-col gap-4">
      <ChrysalisElement index={0} isClosing={false}>
        <h2 className="text-white text-2xl">Reset Password</h2>
        <p className="text-neutral-400 text-sm mt-1">
          We'll send you a recovery link
        </p>
      </ChrysalisElement>

      <ChrysalisElement index={1} isClosing={false}>
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-neutral-300 text-sm">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </ChrysalisElement>

      <ChrysalisElement index={2} isClosing={false}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-2">
          Send Reset Link
        </button>
      </ChrysalisElement>

      <ChrysalisElement index={3} isClosing={false}>
        <button
          onClick={onBack}
          className="text-neutral-400 hover:text-white text-sm text-center transition-colors"
        >
          Back to sign in
        </button>
      </ChrysalisElement>
    </div>
  );
}

// ─── Main Demo ───────────────────────────────────────────────────────────────

type AuthView = "signin" | "signup" | "forgot";

const VIEW_HEIGHTS: Record<AuthView, number> = {
  signin: 480,
  signup: 620,
  forgot: 340,
};

export function ChrysalisFormDemo() {
  const [activeView, setActiveView] = useState<AuthView>("signin");
  const { prefersReduced } = useReducedMotion();

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Accessibility indicator */}
        {prefersReduced && (
          <div className="mb-4 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-lg text-blue-300 text-sm text-center">
            Reduced motion active
          </div>
        )}

        {/* The Chrysalis: one card, many realities */}
        <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl">
          <ChrysalisContainer
            activeView={activeView}
            views={{
              signin: (
                <SignInView
                  onForgot={() => setActiveView("forgot")}
                  onSignUp={() => setActiveView("signup")}
                />
              ),
              signup: <SignUpView onBack={() => setActiveView("signin")} />,
              forgot: <ForgotPasswordView onBack={() => setActiveView("signin")} />,
            }}
            viewHeights={VIEW_HEIGHTS}
            viewElementCounts={{ signin: 5, signup: 7, forgot: 4 }}
          />
        </div>

        {/* View Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {(["signin", "signup", "forgot"] as AuthView[]).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeView === view ? "bg-blue-500" : "bg-neutral-700"
              }`}
              aria-label={`Switch to ${view} view`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
