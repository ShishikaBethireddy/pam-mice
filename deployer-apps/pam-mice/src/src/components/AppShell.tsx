import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle2 } from "lucide-react";
import { useMockUser } from "@/lib/mockAuth";

const nav = [
  { to: "/inbox", label: "RFP Inbox", end: true },
  { to: "/integrations", label: "Integrations" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const user = useMockUser();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-grey-50 text-grey-900 overflow-hidden">
      <header className="shrink-0 border-b border-grey-800/60 bg-grey-900 text-grey-50">
        {/* Top brand row */}
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 items-center px-8 py-5">
          <nav className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.22em] text-grey-400">
            {nav.map((t) => {
              const isActive = t.end
                ? location.pathname === t.to
                : location.pathname.startsWith(t.to);
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={`border-b-2 py-2 transition ${
                    isActive
                      ? "border-brand-500 text-brand-500"
                      : "border-transparent hover:text-grey-50"
                  }`}
                >
                  {t.label}
                </NavLink>
              );
            })}
          </nav>
          <Link to="/" className="justify-self-center text-center leading-tight">
            <div className="font-serif italic text-2xl text-grey-50">Proposal Builder</div>
            <div className="mt-1 text-[10px] tracking-[0.3em] text-grey-400">
              BY PAM HOTELS
            </div>
          </Link>
          <div className="justify-self-end flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate("/account")}
                className="hidden sm:flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-grey-300 hover:text-grey-50"
              >
                <span className="hidden md:inline">{user.name}</span>
                <span className="w-8 h-8 bg-grey-50 text-grey-900 flex items-center justify-center font-serif text-xs normal-case tracking-normal">
                  {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-300 hover:text-grey-50"
              >
                <UserCircle2 className="w-4 h-4" />
                Account
              </button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="h-9 w-9 border border-grey-700 bg-grey-900 hover:bg-grey-800 grid place-items-center text-grey-50"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-grey-800/60 px-8 py-3 space-y-1 bg-grey-900">
            {nav.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 text-xs uppercase tracking-[0.22em] ${
                    isActive ? "text-brand-500" : "text-grey-300 hover:text-grey-50"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                navigate(user ? "/account" : "/login");
              }}
              className="block w-full text-left px-3 py-2.5 text-xs uppercase tracking-[0.22em] text-grey-300 hover:text-grey-50"
            >
              {user ? user.name : "Account"}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 min-h-0 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}