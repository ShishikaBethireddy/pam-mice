import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NobuTopNav from "@/components/NobuTopNav";
import { setMockUser } from "@/lib/mockAuth";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({
    name: "Alex Morgan",
    email: "alex@acme.com",
    company: "Acme Corp",
    password: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMockUser({
      name: mode === "signup" ? form.name : "Alex Morgan",
      email: form.email,
      company: mode === "signup" ? form.company : "Acme Corp",
    });
    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-grey-50 text-grey-900 flex flex-col">
      <NobuTopNav activeTab={null} />

      <main className="flex-1 grid lg:grid-cols-2">
        <div className="hidden lg:block bg-grey-900 text-grey-50 p-12">
          <div className="max-w-md mt-12">
            <div className="text-[10px] uppercase tracking-[0.3em] text-grey-400 mb-6">
              Meetings · Incentives · Conferences · Events
            </div>
            <h1 className="font-serif text-4xl leading-tight mb-6">
              Your Nobu planning workspace.
            </h1>
            <p className="text-grey-300 leading-relaxed">
              Sign in to review proposals, track room blocks, and revisit every event your team has
              hosted across Nobu, Ava, UNICO, and Hard Rock properties.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 lg:p-16">
          <form onSubmit={submit} className="w-full max-w-sm">
            <h2 className="font-serif text-3xl mb-2">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-grey-600 mb-8">
              {mode === "login"
                ? "Sign in to access your account and event history."
                : "Get started planning your next event with Allie."}
            </p>

            {mode === "signup" && (
              <>
                <Field label="Full name">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-3 border border-grey-300 bg-white text-sm focus:outline-none focus:border-grey-900"
                  />
                </Field>
                <Field label="Company">
                  <input
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full h-11 px-3 border border-grey-300 bg-white text-sm focus:outline-none focus:border-grey-900"
                  />
                </Field>
              </>
            )}

            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 px-3 border border-grey-300 bg-white text-sm focus:outline-none focus:border-grey-900"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full h-11 px-3 border border-grey-300 bg-white text-sm focus:outline-none focus:border-grey-900"
              />
            </Field>

            <button
              type="submit"
              className="mt-2 w-full bg-grey-900 px-6 py-4 text-xs uppercase tracking-[0.2em] text-grey-50 hover:bg-grey-700 transition"
            >
              {mode === "login" ? "Log in" : "Create account"}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="mt-4 w-full text-xs uppercase tracking-[0.2em] text-grey-600 hover:text-grey-900"
            >
              {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
            </button>

            <p className="mt-6 text-xs text-grey-500 text-center">
              Demo prototype — no password required.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <div className="text-[11px] uppercase tracking-[0.2em] text-grey-600 mb-2">{label}</div>
      {children}
    </label>
  );
}