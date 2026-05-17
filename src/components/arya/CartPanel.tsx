import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag, Send, Sparkles, Check, ShieldCheck, Zap, ArrowRight, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { usePriceFormat } from "@/hooks/usePriceFormat";

function PaymentIcons() {
  // Inline SVG brand marks — no emoji, no external deps. Themed via tokens.
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* GPay */}
      <div className="h-9 w-12 rounded-xl bg-white border border-border shadow-sm grid place-items-center">
        <svg viewBox="0 0 48 20" className="h-3.5" aria-label="Google Pay">
          <text x="0" y="15" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13">
            <tspan fill="#4285F4">G</tspan>
            <tspan fill="#EA4335">o</tspan>
            <tspan fill="#FBBC05">o</tspan>
            <tspan fill="#4285F4">g</tspan>
            <tspan fill="#34A853">l</tspan>
            <tspan fill="#EA4335">e</tspan>
            <tspan fill="#5F6368" dx="2">Pay</tspan>
          </text>
        </svg>
      </div>
      {/* Mastercard */}
      <div className="h-9 w-12 rounded-xl bg-white border border-border shadow-sm grid place-items-center">
        <svg viewBox="0 0 32 20" className="h-4" aria-label="Mastercard">
          <circle cx="12" cy="10" r="7" fill="#EB001B" />
          <circle cx="20" cy="10" r="7" fill="#F79E1B" />
          <path d="M16 5a7 7 0 010 10 7 7 0 010-10z" fill="#FF5F00" />
        </svg>
      </div>
      {/* Visa */}
      <div className="h-9 w-12 rounded-xl bg-white border border-border shadow-sm grid place-items-center">
        <svg viewBox="0 0 48 16" className="h-3" aria-label="Visa">
          <text x="0" y="13" fontFamily="Arial,sans-serif" fontStyle="italic" fontWeight="900" fontSize="14" fill="#1A1F71">VISA</text>
        </svg>
      </div>
      {/* UPI */}
      <div className="h-9 w-12 rounded-xl bg-white border border-border shadow-sm grid place-items-center">
        <svg viewBox="0 0 32 16" className="h-3" aria-label="UPI">
          <text x="0" y="13" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="12">
            <tspan fill="#097939">U</tspan>
            <tspan fill="#ED752E">P</tspan>
            <tspan fill="#00BAF2">I</tspan>
          </text>
        </svg>
      </div>
      {/* Crypto */}
      <div className="h-9 w-12 rounded-xl bg-white border border-border shadow-sm grid place-items-center">
        <span className="text-[15px] font-extrabold text-[#F7931A] leading-none">₿</span>
      </div>
    </div>
  );
}

export function CartPanel() {
  const {
    cartOpen, setCartOpen, cart, removeFromCart, navigate,
    goToCheckout, t, stories, addToCart,
  } = useApp();
  const fmt = usePriceFormat();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (cartOpen) {
      setMounted(true);
      // lock body scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [cartOpen]);

  const subtotal = cart.reduce((a, b) => a + b.price, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  // Suggestions for empty cart — top items the user hasn't already added
  const suggestions = useMemo(() => {
    const inCart = new Set(cart.map((c) => c.id));
    return stories.filter((s) => !inCart.has(s.id)).slice(0, 4);
  }, [stories, cart]);

  if (!cartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    goToCheckout();
  };

  const openDetail = (id: string) => {
    setCartOpen(false);
    navigate({ name: "detail", storyId: id });
  };

  const applyPromo = () => {
    if (!promo.trim()) return;
    setPromoApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background animate-cart-sheet-up flex flex-col">
      {/* Header */}
      <header className="h-14 px-4 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-md shrink-0">
        <button
          onClick={() => setCartOpen(false)}
          aria-label="Close cart"
          className="h-10 w-10 -ml-2 grid place-items-center rounded-full active:bg-muted transition"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="font-display font-bold text-[17px] tracking-tight text-foreground">
          {cart.length === 0 ? t("cart.title") : `${t("cart.title")} (${cart.length})`}
        </h1>
        <div className="h-10 w-10" />
      </header>

      {/* Scrollable body */}
      <main className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-6">
          {cart.length === 0 ? (
            <EmptyState
              suggestions={suggestions}
              onPickStory={openDetail}
              onAdd={(s) => addToCart(s)}
              fmt={fmt}
            />
          ) : (
            <>
              {/* Items */}
              <ul className="space-y-3">
                {cart.map((s, i) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-border/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] animate-cart-item-in"
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
                  >
                    <button
                      onClick={() => openDetail(s.id)}
                      className="h-14 w-14 rounded-2xl overflow-hidden bg-muted shrink-0 active:scale-95 transition"
                      aria-label={s.title}
                    >
                      {s.poster ? (
                        <img
                          src={s.poster}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : null}
                    </button>

                    <button
                      onClick={() => openDetail(s.id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <div className="text-[14px] font-semibold text-foreground truncate leading-tight">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {[s.platform, s.genre].filter(Boolean).join(" · ")}
                      </div>
                      <div className="text-[14px] font-bold text-foreground tabular-nums mt-1">
                        {fmt(s.price)}
                      </div>
                    </button>

                    {/* Digital qty — fixed at 01, presented like reference */}
                    <div className="flex items-center gap-2">
                      <div className="h-7 px-2.5 rounded-full bg-muted text-foreground text-[12px] font-semibold tabular-nums grid place-items-center">
                        01
                      </div>
                      <button
                        onClick={() => removeFromCart(s.id)}
                        aria-label="Remove"
                        className="h-9 w-9 grid place-items-center rounded-full bg-muted hover:bg-red-500/10 hover:text-red-500 transition active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo code — unified pill (Apply lives inside the field) */}
              <div className="mt-5">
                <div
                  className={cn(
                    "h-14 rounded-2xl bg-surface border flex items-center pl-4 pr-1.5 gap-2 transition-colors",
                    promoApplied
                      ? "border-emerald-500/60 bg-emerald-500/5"
                      : "border-border focus-within:border-foreground/40"
                  )}
                >
                  <Tag className={cn(
                    "h-4 w-4 shrink-0",
                    promoApplied ? "text-emerald-600" : "text-muted-foreground"
                  )} />
                  <input
                    value={promo}
                    onChange={(e) => { setPromo(e.target.value); setPromoApplied(false); }}
                    placeholder={t("cart.promoPlaceholder") || "Promo Code"}
                    className="flex-1 bg-transparent outline-none text-[14px] text-foreground placeholder:text-muted-foreground/70 tracking-wide"
                  />
                  {promoApplied ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mr-2">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      −10%
                    </span>
                  ) : (
                    <button
                      onClick={applyPromo}
                      disabled={!promo.trim()}
                      className="h-11 px-5 rounded-xl bg-foreground text-background text-[13px] font-bold tracking-tight active:scale-95 transition disabled:opacity-30 disabled:active:scale-100"
                    >
                      {t("cart.apply") || "Apply"}
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery details — digital, no address */}
              <section className="mt-5 rounded-2xl bg-surface border border-border/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("cart.deliveryDetails") || "Delivery Details"}
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <Zap className="h-3 w-3" /> Instant
                  </span>
                </div>

                <div className="px-4 pb-4">
                  {/* Telegram bot pill */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="h-10 w-10 rounded-full grid place-items-center shrink-0"
                         style={{ background: "linear-gradient(135deg,#2AABEE 0%,#229ED9 100%)" }}>
                      <Send className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-foreground leading-tight">
                        Delivered via Telegram bot
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                        @AryaPremiumBot · in-chat, no shipping
                      </div>
                    </div>
                  </div>

                  {/* 3-step micro-timeline */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { n: "1", label: "Pay" },
                      { n: "2", label: "Verify" },
                      { n: "3", label: "Receive" },
                    ].map((s) => (
                      <div key={s.n} className="rounded-xl bg-muted/40 border border-border/40 px-2 py-2 flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-foreground text-background text-[10px] font-bold grid place-items-center">
                          {s.n}
                        </span>
                        <span className="text-[11px] font-semibold text-foreground">{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Payment methods preview */}
              <section className="mt-5 rounded-2xl bg-surface border border-border/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {t("cart.paymentMethods") || "Payment Methods"}
                  </h3>
                  <span className="text-[10px] text-muted-foreground font-medium">Choose at checkout</span>
                </div>
                <PaymentIcons />
              </section>

              {/* Bill */}
              <section className="mt-5 rounded-2xl bg-surface border border-border/60 p-4 space-y-2">
                <BillRow label={`${t("cart.subtotal") || "Order Amount"} (${cart.length} ${cart.length === 1 ? "item" : "items"})`} value={fmt(subtotal)} />
                {promoApplied && (
                  <BillRow label={`${t("cart.discount") || "Discount"} (10%)`} value={`− ${fmt(discount)}`} accent />
                )}
                <BillRow label={t("cart.tax") || "Tax"} value={fmt(0)} muted />
                <div className="border-t border-dashed border-border my-2" />
                <BillRow label={t("cart.total") || "Total Payment"} value={fmt(total)} bold large />
              </section>

              {/* Trust strip */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Secure SSL checkout · No card stored</span>
              </div>
            </>
          )}
        </div>
      </main>
      {/* Sticky checkout footer (only when items present) */}
      {cart.length > 0 && (
        <footer
          className="border-t border-border bg-background/95 backdrop-blur-md px-4 pt-3 shrink-0"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
        >
          <button
            onClick={handleCheckout}
            className="w-full h-[58px] rounded-full bg-foreground text-background font-bold tracking-tight active:scale-[0.98] transition flex items-center justify-between pl-5 pr-2 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)]"
          >
            <span className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-background/60">
                {t("cart.total") || "Total"}
              </span>
              <span className="text-[17px] font-extrabold tabular-nums mt-1">{fmt(total)}</span>
            </span>
            <span className="flex items-center gap-2 h-[44px] pl-4 pr-3 rounded-full bg-background/15">
              <span className="text-[14px] font-bold">
                {t("cart.checkout") || "Proceed To Checkout"}
              </span>
              <span className="h-7 w-7 rounded-full bg-background text-foreground grid place-items-center">
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>
            </span>
          </button>
        </footer>
      )}
    </div>
  );
}

function BillRow({
  label, value, muted, bold, large, accent,
}: { label: string; value: string; muted?: boolean; bold?: boolean; large?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn(
        "text-[13px]",
        muted ? "text-muted-foreground" : "text-foreground",
        bold && "font-bold"
      )}>
        {label}
      </span>
      <span className={cn(
        "tabular-nums",
        large ? "text-[18px]" : "text-[13px]",
        bold ? "font-extrabold text-foreground" : "font-semibold text-foreground",
        accent && "text-emerald-600"
      )}>
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  suggestions, onPickStory, onAdd, fmt,
}: {
  suggestions: any[];
  onPickStory: (id: string) => void;
  onAdd: (s: any) => void;
  fmt: (n: number) => string;
}) {
  const { t } = useApp();
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center text-center pt-8 pb-6">
        <div className="relative h-24 w-24 rounded-full bg-muted grid place-items-center mb-5">
          <div className="absolute inset-0 rounded-full bg-foreground/5 animate-splash-ring" />
          <ShoppingBag className="h-10 w-10 text-foreground/70" strokeWidth={1.6} />
        </div>
        <h2 className="font-display font-bold text-[20px] text-foreground tracking-tight">
          {t("cart.emptyTitle") || "Your cart is empty"}
        </h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground max-w-[260px] leading-relaxed">
          {t("cart.emptySubtitle") ||
            "Discover stories you'll love and add them to your cart."}
        </p>
      </div>

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {t("cart.suggested") || "Suggested for you"}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface border border-border/60 animate-cart-item-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
              >
                <button
                  onClick={() => onPickStory(s.id)}
                  className="h-14 w-14 rounded-2xl overflow-hidden bg-muted shrink-0"
                  aria-label={s.title}
                >
                  {s.poster ? (
                    <img src={s.poster} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </button>
                <button
                  onClick={() => onPickStory(s.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="text-[14px] font-semibold text-foreground truncate">{s.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {[s.platform, s.genre].filter(Boolean).join(" · ")}
                  </div>
                  <div className="text-[13px] font-bold text-foreground tabular-nums mt-0.5">
                    {fmt(s.price)}
                  </div>
                </button>
                <button
                  onClick={() => onAdd(s)}
                  aria-label="Add to cart"
                  className="h-10 w-10 grid place-items-center rounded-full bg-foreground text-background active:scale-90 transition"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.6} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
