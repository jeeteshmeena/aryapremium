import { Home, Compass, Library, User, ShoppingBag } from "lucide-react";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";

type TabId = "home" | "explore" | "cart" | "mystories" | "profile";

const TABS: { id: TabId; labelKey: string; Icon: any }[] = [
  { id: "home",      labelKey: "nav.home",    Icon: Home },
  { id: "explore",   labelKey: "nav.explore", Icon: Compass },
  { id: "cart",      labelKey: "nav.cart",    Icon: ShoppingBag },
  { id: "mystories", labelKey: "nav.library", Icon: Library },
  { id: "profile",   labelKey: "nav.profile", Icon: User },
];

export function BottomNav() {
  const { view, navigate, cart, setCartOpen, t, cartOpen } = useApp();
  const current = view.name;

  // Hide entirely when cart is open (full-screen cart UX)
  if (cartOpen) return null;

  const onTap = (id: TabId) => {
    haptics.light();
    if (id === "cart") {
      setCartOpen(true);
      return;
    }
    if (id !== current) navigate({ name: id as any });
  };

  return (
    <nav
      className="fixed inset-x-0 z-40 flex justify-center pointer-events-none"
      style={{ bottom: "max(env(safe-area-inset-bottom), 10px)" }}
    >
      <div
        className="pointer-events-auto mx-4 px-2 py-2 rounded-[28px] flex items-end gap-1 bg-surface/90 backdrop-blur-xl border border-border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.22)]"
      >
        {TABS.map(({ id, labelKey, Icon }) => {
          const isCart = id === "cart";
          const active = !isCart && current === id;
          const label = t(labelKey);
          const count = cart.length;

          if (isCart) {
            return (
                id="arya-cart-target"
                <Icon className="h-6 w-6" strokeWidth={2.2} />
                {count > 0 && (
                  <span
                    key={count}
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center border-2 border-background animate-cart-badge-pop"
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => onTap(id)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative h-12 w-12 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors duration-200 active:scale-90",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-[20px] w-[20px]" strokeWidth={active ? 2.4 : 1.8} />
              <span className={cn("text-[9px] tracking-wide", active ? "font-bold" : "font-medium")}>
                {label}
              </span>
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
