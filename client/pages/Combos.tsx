import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Zap, Phone } from "lucide-react";
import { combos, products as allProducts } from "@/data/siteData";
import { addToCart, cartCount } from "@/lib/cart";
import { toast } from "sonner";

export default function Combos() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const handleAddCombo = (combo: typeof combos[0]) => {
    let addedCount = 0;
    combo.products.forEach((slug) => {
      if (!addToCart(slug, 1)) {
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} items from ${combo.name} to cart!`);
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const getProductName = (slug: string) => {
    const product = allProducts.find((p) => p.slug === slug);
    return product?.name || slug;
  };

  const getProductPrice = (slug: string) => {
    const product = allProducts.find((p) => p.slug === slug);
    return product?.price || 0;
  };

  const calculateComboTotal = (productSlugs: string[]) => {
    return productSlugs.reduce((sum, slug) => sum + getProductPrice(slug), 0);
  };

  const getProductImage = (slug: string) => {
    const product = allProducts.find((p) => p.slug === slug);
    return product?.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85";
  };


  return (
    <div className="min-h-screen bg-cream text-forest-950">
      {/* Fixed Header */}
      <div className="fixed left-0 right-0 top-0 z-40 bg-forest-950">
        <div className="bg-forest-950 text-white/70 text-[11px] tracking-[0.16em] uppercase">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
            <span>Trusted agricultural commodities from India</span>
            <div className="hidden items-center gap-5 sm:flex">
              <span>Mumbai · Maharashtra</span>
              <span className="text-sand-300">●</span>
              <span>Est. 2025</span>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="flex items-center justify-between border-b border-white/20 py-5">
            <Link to="/" className="text-sm font-extrabold tracking-[0.12em] text-white">
              EARTH ROOT <span className="text-sand-300">AGRO</span>
            </Link>
            <div className="flex items-center gap-5 text-sm font-semibold">
              <Link to="/products" className="hidden sm:block text-white/85 hover:text-sand-300">
                Products
              </Link>
              <Link to="/cart" className="relative flex items-center gap-2 text-forest-700">
                <ShoppingCart size={16} /> Cart
                {count > 0 && (
                  <span className="absolute -right-3 -top-2 grid h-4 w-4 place-items-center rounded-full bg-forest-700 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="bg-forest-950 px-5 py-20 text-white lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="eyebrow text-sand-300">Smart Savings</p>
              <h1 className="section-title mt-5 text-white">
                Curated Combos<br />
                <em className="text-sand-300">at great prices.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/70">
                Get the best of our products bundled together and save more. See exact breakdown of what's included.
              </p>
            </div>
          </div>
        </section>

        {/* Combos Grid */}
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {combos.map((combo) => {
              const total = calculateComboTotal(combo.products);
              const savings = total - combo.price;
              return (
                <div
                  key={combo.id}
                  className="group overflow-hidden rounded-2xl border border-forest-950/10 bg-white transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(24,61,42,0.09)]"
                >
                  {/* Product Images Grid */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-b from-sand-300/20 to-sand-300/10">
                    <div className={`grid h-full w-full ${combo.products.length === 2 ? 'grid-cols-2' : combo.products.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {combo.products.map((slug, idx) => (
                        <div key={idx} className="relative overflow-hidden border border-white/20">
                          <img
                            src={getProductImage(slug)}
                            alt={getProductName(slug)}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85";
                            }}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-transparent pointer-events-none" />

                    {/* Savings Badge */}
                    <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 flex items-center gap-1">
                      <Zap size={14} className="text-white" />
                      <span className="text-xs font-bold text-white">Save ₹{savings}</span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-3 left-4">
                      <p className="text-3xl font-bold text-sand-300">₹{combo.price}</p>
                      <p className="text-xs text-white/70 line-through">₹{total}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display text-xl">{combo.name}</h3>
                    <p className="mt-2 text-sm text-forest-950/60">{combo.description}</p>

                    {/* Products List with Prices */}
                    <div className="mt-4 space-y-2 border-t border-forest-950/10 pt-4">
                      {combo.products.map((slug) => (
                        <div key={slug} className="flex items-center justify-between text-xs">
                          <span className="text-forest-950/70">✓ {getProductName(slug)}</span>
                          <span className="font-bold text-forest-700">₹{getProductPrice(slug)}</span>
                        </div>
                      ))}
                      <div className="border-t border-forest-950/10 pt-2 mt-2 flex items-center justify-between text-sm font-bold">
                        <span>Total Value</span>
                        <span className="text-forest-700">₹{total}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-bold text-green-600">
                        <span>Combo Price</span>
                        <span>₹{combo.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <div className="border-t border-forest-950/10 p-5">
                    <button
                      onClick={() => handleAddCombo(combo)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-forest-900"
                    >
                      <ShoppingCart size={15} /> Add Combo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-sand-200 px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="font-display text-2xl text-forest-700">Transparent Pricing</p>
                <p className="mt-1 text-sm text-forest-950/60">See individual product prices & total</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest-700">Verified Savings</p>
                <p className="mt-1 text-sm text-forest-950/60">Real savings calculated on actual prices</p>
              </div>
              <div>
                <p className="font-display text-2xl text-forest-700">Smart Bundles</p>
                <p className="mt-1 text-sm text-forest-950/60">Combos priced by total value</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-forest-950/10 px-5 py-7 text-center text-xs text-forest-950/45">
        © 2025 Earth Root Agro · Mumbai, Maharashtra ·
        <Link to="/contact" className="text-forest-700"> Contact our team</Link>
      </footer>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919619631768"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"
      >
        💬
      </a>
    </div>
  );
}
