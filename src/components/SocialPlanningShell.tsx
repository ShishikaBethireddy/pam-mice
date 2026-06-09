import { type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronRight,
  MapPin,
  Menu,
  Phone,
  User as UserIcon,
  Users,
  Wallet,
} from "lucide-react";
import nobuLogo from "@/assets/logo-nobu-white.png";
import { currency } from "@/data/mockData";
import { SOCIAL_STEPS, useSocialCtx, type SocialStepKey } from "@/lib/socialPlanning";
import { cn } from "@/lib/utils";

interface Props {
  activeStep: SocialStepKey;
  /** Overview renders full-bleed (hero + floating content) and skips the header. */
  fullBleed?: boolean;
  children: ReactNode;
}

/* Shared Social Events marketing header — sunset ribbon + Nobu wordmark. */
function SocialNav() {
  const navigate = useNavigate();
  return (
    <header className="relative z-30 bg-grey-900 text-white">
      <div className="w-full bg-sunset-gradient py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-white">
        Social Events · Nobu Hotels
      </div>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link to="/" className="flex h-[34px] shrink-0 items-center" aria-label="Nobu Hotel Los Cabos">
          <img src={nobuLogo} alt="Nobu Hotel Los Cabos" className="h-[26px] w-auto object-contain md:h-[30px]" />
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <a
            href="tel:+15555550199"
            className="hidden h-9 items-center gap-2 rounded-pill border border-white/40 px-4 text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10 sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.6} />
            Speak to an Event Specialist
          </a>
          <button
            onClick={() => navigate("/login")}
            className="hidden items-center gap-1.5 px-2.5 py-2 text-sm text-white transition-colors hover:text-brand-300 md:flex"
          >
            <UserIcon className="h-5 w-5" strokeWidth={1.5} />
            <span>Sign in</span>
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-brand-300"
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" strokeWidth={1.25} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function SocialPlanningShell({ activeStep, fullBleed, children }: Props) {
  const ctx = useSocialCtx();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const active = SOCIAL_STEPS.find((s) => s.key === activeStep) ?? SOCIAL_STEPS[0];

  return (
    <div className="social-portal flex min-h-screen flex-col bg-grey-50 font-sans text-grey-900">
      <SocialNav />

      <div className="flex min-h-0 flex-1">
        {/* Left rail — planning tracker */}
        <aside className="hidden w-[340px] flex-none flex-col border-r border-grey-200 bg-white md:flex">
          <div className="flex flex-col justify-center border-b border-grey-200 bg-grey-50 px-7 py-5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
              Planning · {ctx.theme.occasion}
            </div>
            <div className="mt-1 font-serif text-2xl text-grey-900">{ctx.eventName}</div>
            <div className="mt-1 text-xs text-grey-600">{ctx.venue}</div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-6 pt-4" aria-label="Planning steps">
            <div className="space-y-1">
              {SOCIAL_STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = s.key === activeStep;
                return (
                  <Link
                    key={s.key}
                    to={`/servicing/${ctx.id}/${s.key}`}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "block rounded-sm px-3 py-3 transition-colors",
                      isActive ? "bg-brand-100" : "hover:bg-grey-50",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full",
                          isActive ? "bg-brand-500 text-white" : "border border-grey-300 text-grey-500",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm text-grey-900">
                          <span className="font-medium">{s.label}</span>
                          <ChevronRight className={cn("h-3.5 w-3.5", isActive ? "text-brand-500" : "text-grey-400")} />
                        </div>
                        <div className="mt-1 text-xs leading-relaxed text-grey-600">{s.blurb}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-grey-200 px-7 py-4">
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-grey-500 hover:text-grey-900"
            >
              <ArrowLeft className="h-3 w-3" /> Back to account
            </Link>
          </div>
        </aside>

        {/* Right pane */}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {/* Mobile step nav — left rail collapses into a top dropdown */}
          <div className="sticky top-0 z-20 border-b border-grey-200 bg-white md:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
              aria-expanded={mobileOpen}
            >
              <div className="border-l-2 border-accent pl-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-grey-500">
                  Social Event Portal
                </div>
                <div className="mt-1 font-serif text-2xl text-grey-900">{active.label}</div>
              </div>
              <ChevronDown className={cn("h-5 w-5 flex-none text-grey-500 transition-transform", mobileOpen && "rotate-180")} />
            </button>
            {mobileOpen && (
              <ul className="border-t border-grey-200">
                {SOCIAL_STEPS.map((s) => {
                  const isActive = s.key === activeStep;
                  return (
                    <li key={s.key} className="border-b border-grey-100 last:border-0">
                      <button
                        type="button"
                        onClick={() => {
                          navigate(`/servicing/${ctx.id}/${s.key}`);
                          setMobileOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-6 py-4 text-left transition-colors",
                          isActive ? "border-l-2 border-accent bg-brand-100/50" : "border-l-2 border-transparent hover:bg-grey-50",
                        )}
                      >
                        <span className={cn("text-base", isActive ? "font-medium text-grey-900" : "text-grey-700")}>
                          {s.label}
                        </span>
                        <ChevronRight className={cn("h-4 w-4", isActive ? "text-accent" : "text-grey-400")} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {fullBleed ? (
            <div className="w-full">{children}</div>
          ) : (
            <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-10">
              {/* Event header */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-grey-500">
                    Your celebration · Nobu Los Cabos
                  </div>
                  <h1 className="mt-1 font-serif text-4xl text-grey-900">{ctx.eventName}</h1>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-grey-600">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {ctx.dates}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4" /> {ctx.headcount} {ctx.theme.noun.plural}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {ctx.venue}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Wallet className="h-4 w-4" /> {currency(ctx.subtotal)} est.
                    </span>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]",
                    ctx.paid ? "bg-emerald-50 text-emerald-700" : "bg-brand-500/10 text-brand-500",
                  )}
                >
                  {ctx.paid ? "Date secured" : "Hold pending"}
                </span>
              </div>

              <div className="mt-8">{children}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
