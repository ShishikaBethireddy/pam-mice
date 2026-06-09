import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserCircle2, Menu, BellRing } from "lucide-react";
import { useMockUser } from "@/lib/mockAuth";

type Tab = "Overview" | "Spaces" | "Plan My Event";

interface Props {
  activeTab?: Tab | null;
}

const TABS: { label: Tab; to?: string }[] = [
  { label: "Overview", to: "/book" },
  { label: "Spaces", to: "/book" },
  { label: "Plan My Event", to: "/plan" },
];

const NobuTopNav = ({ activeTab = "Overview" }: Props) => {
  const navigate = useNavigate();
  const user = useMockUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-grey-800/60 bg-grey-900 text-grey-50">
      {/* Category ribbon sibling tag to "WEDDINGS" */}
      <div className="bg-brand-300 py-1.5 text-center text-[10px] uppercase tracking-[0.4em] text-grey-900">
        Meetings &amp; Events
      </div>
      {/* Desktop layout */}
      <div className="mx-auto hidden md:grid max-w-[1400px] grid-cols-3 items-center gap-8 px-8 py-5">
        <nav className="flex items-center gap-10 text-xs uppercase tracking-[0.22em] text-grey-400">
          {TABS.map((t) => {
            const isActive = t.label === activeTab;
            return (
              <button
                key={t.label}
                onClick={() => t.to && navigate(t.to)}
                className={`border-b-2 py-2 transition ${
                  isActive
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent hover:text-grey-50"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
        <Link
          to="/book"
          className="justify-self-center text-center leading-tight"
        >
          <div className="font-serif italic text-2xl text-grey-50">Nobu Hotel</div>
          <div className="mt-1 text-[10px] tracking-[0.3em] text-grey-400">LOS CABOS</div>
        </Link>
        <div className="justify-self-end flex items-center gap-6">
          {user ? (
            <button
              onClick={() => navigate("/account")}
              className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-grey-300 hover:text-grey-50"
            >
              <span>{user.name}</span>
              <span className="w-8 h-8 bg-grey-50 text-grey-900 flex items-center justify-center font-serif text-xs normal-case tracking-normal">
                {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-grey-300 hover:text-grey-50"
            >
              <UserCircle2 className="w-4 h-4" />
              Account
            </button>
          )}
        </div>
      </div>

      {/* Mobile layout hamburger + logo + bell */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 items-center px-4 py-4">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
            className="justify-self-start h-9 w-9 grid place-items-center text-grey-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/book" className="justify-self-center text-center leading-tight">
            <div className="font-serif italic text-lg text-grey-50">Nobu Hotel</div>
            <div className="mt-0.5 text-[9px] tracking-[0.3em] text-grey-400">LOS CABOS</div>
          </Link>
          <button
            onClick={() => navigate(user ? "/account" : "/login")}
            aria-label="Account"
            className="justify-self-end h-9 w-9 grid place-items-center text-grey-50"
          >
            <BellRing className="w-5 h-5" />
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-grey-800/60 px-4 py-2">
            {TABS.map((t) => {
              const isActive = t.label === activeTab;
              return (
                <button
                  key={t.label}
                  onClick={() => {
                    setMenuOpen(false);
                    t.to && navigate(t.to);
                  }}
                  className={`block w-full text-left py-2.5 text-xs uppercase tracking-[0.22em] ${
                    isActive ? "text-brand-500" : "text-grey-300 hover:text-grey-50"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

export default NobuTopNav;