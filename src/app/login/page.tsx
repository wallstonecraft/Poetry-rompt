"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { signIn, signUp, type AuthFormState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/forms/Button";

const initialState: AuthFormState = { error: null, success: false };

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const isSignup = mode === "signup";
  const [state, formAction] = useFormState(isSignup ? signUp : signIn, initialState);

  useEffect(() => {
    if (state.success) router.push("/home");
  }, [state.success, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        maxWidth: 420,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px 28px",
        gap: 22,
        boxSizing: "border-box",
      }}
    >
      <div>
        <div style={{ font: "600 22px var(--font-sans)", color: "var(--green-700)", marginBottom: 8 }}>Poetry Prompt</div>
        <div style={{ font: "var(--text-body)", color: "var(--text-secondary)" }}>
          {isSignup ? "Create an account to publish and follow poets." : "Welcome back."}
        </div>
      </div>
      {state.needsConfirmation ? (
        <div style={{ font: "var(--text-body)", color: "var(--text-secondary)" }}>
          Check your email for a confirmation link, then log in.
        </div>
      ) : (
        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {isSignup && <Input name="name" label="Name" placeholder="Your name" required />}
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Password" placeholder="••••••••" required minLength={6} />
          {state.error && <div style={{ font: "var(--text-caption)", color: "var(--state-error)" }}>{state.error}</div>}
          <Button type="submit">{isSignup ? "Create account" : "Log in"}</Button>
        </form>
      )}
      <div style={{ textAlign: "center", font: "var(--text-caption)", color: "var(--text-secondary)" }}>
        {isSignup ? "Already writing here? " : "New to Poetry Prompt? "}
        <span
          onClick={() => setMode(isSignup ? "login" : "signup")}
          style={{ color: "var(--green-700)", fontWeight: 600, cursor: "pointer" }}
        >
          {isSignup ? "Log in" : "Sign up"}
        </span>
      </div>
    </div>
  );
}
