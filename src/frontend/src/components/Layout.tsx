import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  ClipboardList,
  Heart,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";

const LOGO_SRC = "/assets/generated/lumi-arc-logo-transparent.dim_400x400.png";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assessment", label: "Assessment", icon: ClipboardList },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/mindful-kitchen", label: "Mindful Kitchen", icon: UtensilsCrossed },
  { to: "/link-guardian", label: "Link Guardian", icon: Link2 },
];

const guardianNav = [
  { to: "/guardian-dashboard", label: "Student Tracker", icon: Users },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/mindful-kitchen", label: "Mindful Kitchen", icon: UtensilsCrossed },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity, clear } = useInternetIdentity();
  const { userRole } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!identity;
  const navItems =
    userRole === "teacher" || userRole === "parent" ? guardianNav : studentNav;

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src={LOGO_SRC}
                alt="Lumi Arc Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Lumi<span className="text-teal-600"> Arc</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-ocid="nav.link"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-primary/10 text-teal-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex gap-2 rounded-full border-border/60"
                    data-ocid="nav.dropdown_menu"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {shortPrincipal}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => clear()}
                    className="text-destructive cursor-pointer"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}

            {/* Mobile menu toggle */}
            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                data-ocid="nav.toggle"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {isLoggedIn && mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-sm px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid="nav.link"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-teal-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border/60 mt-2">
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full"
                data-ocid="nav.logout_button"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30 py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <img
              src={LOGO_SRC}
              alt="Lumi Arc"
              className="w-5 h-5 object-contain"
            />
            <span className="font-display font-medium text-foreground">
              Lumi Arc
            </span>
            <span>— Your mental wellness companion</span>
          </div>
          <span>
            © {new Date().getFullYear()}. Built with{" "}
            <Heart className="inline w-3 h-3 text-red-500 fill-red-500" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
