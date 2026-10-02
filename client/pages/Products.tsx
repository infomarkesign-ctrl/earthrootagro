import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { BULK_ORDER_CONTACT_EMAIL, fallbackProductImage, products } from "@/data/siteData";
import { addToCart, cartCount, decrementQty, getQty } from "@/lib/cart";

const notifyQtyLimit = (maxQty: number) => toast(`Maximum ${maxQty} kg per order online.`, {
  description: `For larger quantities, please contact ${BULK_ORDER_CONTACT_EMAIL}.`,
});

function useCartQty(slug: string) {
  const [qty, setQty] = useState(() => getQty(slug));
  useEffect(() => {
    const update = () => setQty(getQty(slug));
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cart-updated", update); window.removeEventListener("storage", update); };
  }, [slug]);
  return qty;
}

function AddToCartControl({ slug, maxQty }: { slug: string; maxQty: number }) {
  const qty = useCartQty(slug);
  const add = () => { if (addToCart(slug, 1)) notifyQtyLimit(maxQty); };
  const remove = () => decrementQty(slug);
  if (qty === 0) return <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-forest-900"><ShoppingCart size={15} /> Add to cart</button>;
  return <div className="flex w-full items-center justify-between rounded-full border border-forest-700 bg-white px-2 py-1.5"><button type="button" onClick={remove} className="grid h-8 w-8 place-items-center rounded-full bg-cream text-forest-700"><Minus size={15} /></button><span className="text-sm font-bold text-forest-950">{qty} kg</span><button type="button" onClick={add} className="grid h-8 w-8 place-items-center rounded-full bg-cream text-forest-700"><Plus size={15} /></button></div>;
}

const categories = ["All", "Millet Products", "Natural Oils"];

export function Products() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const filtered = useMemo(() => products.filter((product) => (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())), [category, query]);
  return <div className="min-h-screen bg-cream text-forest-950"><CatalogHeader /><main><section className="bg-forest-950 px-5 pb-20 pt-20 text-white lg:px-8 lg:pb-24"><div className="mx-auto max-w-7xl"><p className="eyebrow text-sand-300">Our product catalogue</p><h1 className="section-title mt-5 max-w-2xl text-white">India's harvest,<br /><em className="text-sand-300">sourced with care.</em></h1><p className="mt-6 max-w-xl text-white/60">44 commodities. One dependable source for your bulk agricultural requirements.</p></div></section><section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="relative max-w-md flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-950/40" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full rounded-full border border-forest-950/15 bg-white py-3.5 pl-11 pr-5 text-sm outline-none focus:border-forest-700" /></div><div className="flex items-center gap-2 overflow-x-auto pb-1"><SlidersHorizontal size={16} className="mr-1 shrink-0 text-forest-700" />{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${category === item ? "bg-forest-700 text-white" : "bg-white text-forest-950/60"}`}>{item}</button>)}</div></div><p className="mt-10 text-sm text-forest-950/45">Showing <strong className="text-forest-950">{filtered.length}</strong> products</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((product, index) => <div key={product.slug} className="group overflow-hidden rounded-2xl border border-forest-950/10 bg-white transition hover:-translate-y-1 hover:border-forest-700 hover:shadow-[0_15px_35px_rgba(24,61,42,0.09)]"><Link to={`/products/${product.slug}`} className="block"><div className="relative h-36 overflow-hidden"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackProductImage; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-transparent" /><span className="absolute bottom-3 left-4 text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span><div className="absolute bottom-3 right-4"><div className="text-right"><p className="text-2xl font-bold text-sand-300">₹{product.sizes?.[0]?.price?.toLocaleString("en-IN") || product.price.toLocaleString("en-IN")}</p><p className="text-xs text-white/80">{product.sizes?.[0]?.quantity || "per unit"}</p></div></div></div><div className="p-5 pb-0"><span className="rounded-full bg-cream px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-forest-700">{product.category}</span><h2 className="mt-4 font-display text-2xl">{product.name}</h2><p className="mt-2 text-sm leading-6 text-forest-950/55">{product.short}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-forest-700">View product <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div></Link><div className="p-5 pt-4"><AddToCartControl slug={product.slug} maxQty={product.maxQty} /></div></div>)}</div></section></main><SimpleFooter /></div>;
}

export function CatalogHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cart-updated", update); window.removeEventListener("storage", update); };
  }, []);
  return <header className="border-b border-forest-950/10 bg-cream"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><Link to="/" className="text-sm font-extrabold tracking-[0.12em] text-forest-950">EARTH ROOT <span className="text-forest-700">AGRO</span></Link><div className="flex items-center gap-5 text-sm font-semibold"><Link to="/about" className="hidden sm:block">About</Link><Link to="/cart" className="relative flex items-center gap-2 text-forest-700"><ShoppingCart size={16} /> Cart{count > 0 && <span className="absolute -right-3 -top-2 grid h-4 w-4 place-items-center rounded-full bg-forest-700 text-[9px] font-bold text-white">{count}</span>}</Link><Link to="/contact" className="rounded-full bg-forest-700 px-4 py-2.5 text-white">Request a quote</Link></div></div></header>;
}

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.slug === slug);
  const cartQty = useCartQty(slug ?? "");
  const [selectedSize, setSelectedSize] = useState(1);

  if (!product) return <Products />;

  const currentSize = product.sizes?.[selectedSize];
  const displayPrice = currentSize?.price || product.price;

  const buyNow = () => {
    if (cartQty === 0 && addToCart(product.slug, 1)) notifyQtyLimit(product.maxQty);
    navigate("/cart");
  };
  return <div className="min-h-screen bg-cream text-forest-950"><CatalogHeader /><main><section className="bg-forest-950 px-5 py-16 text-white lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]"><div><Link to="/products" className="text-xs font-bold uppercase tracking-[0.16em] text-sand-300">← All products</Link><p className="eyebrow mt-12 text-sand-300">{product.category}</p><h1 className="section-title mt-5 text-white">{product.name}<br /><em className="text-sand-300">for better business.</em></h1><p className="mt-7 max-w-xl text-lg leading-8 text-white/60">{product.description}</p></div><div className="overflow-hidden rounded-3xl"><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackProductImage; }} className="aspect-[1.15] h-full w-full object-cover" /></div></div></section><section className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24"><div><p className="eyebrow">Product information</p><div className="mt-8 grid gap-8 sm:grid-cols-2"><Info title="Uses & applications" body={product.uses} /><Info title="Why buyers choose it" body={product.benefits} /><Info title="Packaging" body={product.packaging} /><Info title="Availability" body="Available for domestic wholesale and export enquiries. Share your target volume and delivery location for a tailored quote." /></div></div><div className="h-fit rounded-3xl bg-sand-200 p-8 lg:p-10">
            <p className="eyebrow">Bulk order</p>
            <h2 className="mt-4 font-display text-4xl">{product.name}</h2>
            <p className="mt-4 text-sm text-forest-950/60">Indicative wholesale pricing</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50">Select Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(idx)}
                      className={`rounded-lg px-4 py-3 text-sm font-bold transition ${
                        selectedSize === idx
                          ? "bg-forest-700 text-white"
                          : "bg-white text-forest-950 hover:bg-forest-950/10"
                      }`}
                    >
                      <div>{size.quantity}</div>
                      <div className="text-xs font-semibold text-sand-300">₹{size.price.toLocaleString("en-IN")}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 font-display text-4xl text-forest-700">₹{displayPrice.toLocaleString("en-IN")} <span className="font-sans text-sm font-medium text-forest-950/50">{currentSize?.quantity || `/ kg`}</span></p>

            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50">Order Quantity · max {product.maxQty} online</label>
              <AddToCartControl slug={product.slug} maxQty={product.maxQty} />
              {cartQty > 0 && <p className="mt-3 text-sm text-forest-950/50">Line total: <strong className="text-forest-950">₹{(displayPrice * cartQty).toLocaleString("en-IN")}</strong></p>}
              <p className="mt-2 text-xs leading-5 text-forest-950/45">Need more than {product.maxQty}? Email <a href={`mailto:${BULK_ORDER_CONTACT_EMAIL}`} className="font-semibold text-forest-700 underline">{BULK_ORDER_CONTACT_EMAIL}</a> for bulk orders.</p>
            </div>

            <p className="mt-4 text-sm leading-7 text-forest-950/60">Final pricing is confirmed against grade, quantity, packaging and delivery location.</p>

            <div className="mt-8">
              <button onClick={buyNow} className="flex w-full items-center justify-center rounded-full bg-forest-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-forest-900">
                <ShoppingCart className="mr-2" size={17} /> Buy now
              </button>
            </div>
          </div></section></main><SimpleFooter /></div>;
}

function Info({ title, body }: { title: string; body: string }) { return <div><h2 className="font-display text-2xl">{title}</h2><p className="mt-3 text-sm leading-7 text-forest-950/60">{body}</p></div>; }
export function SimpleFooter() { return <footer className="border-t border-forest-950/10 px-5 py-7 text-center text-xs text-forest-950/45">© 2025 Earth Root Agro · Mumbai, Maharashtra · <Link to="/contact" className="text-forest-700">Contact our team</Link></footer>; }
