import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BULK_ORDER_CONTACT_EMAIL, MIN_ORDER_AMOUNT, fallbackProductImage, products } from "@/data/siteData";
import { CartItem, getCart, removeFromCart, setQty } from "@/lib/cart";
import { CatalogHeader, SimpleFooter } from "./Products";

const notifyQtyLimit = (maxQty: number) => toast(`Maximum ${maxQty} kg per order online.`, {
  description: `For larger quantities, please contact ${BULK_ORDER_CONTACT_EMAIL}.`,
});

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => { setCart(getCart()); }, []);
  const refresh = () => setCart(getCart());
  const lines = cart.map((entry) => ({ entry, product: products.find((item) => item.slug === entry.slug) })).filter((line) => line.product);
  const updateQty = (slug: string, qty: number, maxQty: number) => {
    if (setQty(slug, qty)) notifyQtyLimit(maxQty);
    refresh();
  };
  const subtotal = lines.reduce((sum, line) => sum + line.product!.price * line.entry.qty, 0);
  const belowMinOrder = lines.length > 0 && subtotal < MIN_ORDER_AMOUNT;

  return <div className="min-h-screen bg-cream text-forest-950"><CatalogHeader /><main className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"><div className="mb-12 max-w-2xl"><p className="eyebrow">Your cart</p><h1 className="section-title mt-5">Review before<br /><span>you checkout.</span></h1></div>
    {lines.length === 0 ? <div className="rounded-3xl bg-white p-14 text-center"><ShoppingBag className="mx-auto text-forest-950/30" size={40} /><p className="mt-5 text-forest-950/60">Your cart is empty.</p><Link to="/products" className="mt-6 inline-flex rounded-full bg-forest-700 px-6 py-3.5 text-sm font-bold text-white">Browse products</Link></div> :
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {lines.map(({ entry, product }) => <div key={entry.slug} className="flex items-center gap-4 rounded-2xl bg-white p-5"><img src={product!.image} alt={product!.name} onError={(event) => { event.currentTarget.src = fallbackProductImage; }} className="h-20 w-20 shrink-0 rounded-xl object-cover" /><div className="flex-1"><Link to={`/products/${product!.slug}`} className="font-display text-xl">{product!.name}</Link><p className="mt-1 text-xs text-forest-950/45">₹{product!.price.toLocaleString("en-IN")} / kg · max {product!.maxQty} kg online</p><div className="mt-3 flex items-center gap-2 rounded-lg border border-forest-950/15 px-2 py-1 w-fit"><button onClick={() => updateQty(entry.slug, entry.qty - 1, product!.maxQty)} className="grid h-7 w-7 place-items-center rounded-full bg-cream text-forest-700"><Minus size={14} /></button><span className="w-14 text-center text-sm font-semibold">{entry.qty} kg</span><button onClick={() => updateQty(entry.slug, entry.qty + 1, product!.maxQty)} className="grid h-7 w-7 place-items-center rounded-full bg-cream text-forest-700"><Plus size={14} /></button></div></div><div className="text-right"><p className="font-display text-xl">₹{(product!.price * entry.qty).toLocaleString("en-IN")}</p><button onClick={() => { removeFromCart(entry.slug); refresh(); }} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600"><Trash2 size={13} /> Remove</button></div></div>)}
      </div>
      <aside className="h-fit rounded-3xl bg-forest-950 p-7 text-white sm:p-10"><p className="eyebrow text-sand-300">Order summary</p><div className="mt-7 space-y-3 text-sm"><div className="flex justify-between text-white/60"><span>Items</span><span>{lines.length}</span></div><div className="flex justify-between border-t border-white/15 pt-4"><span className="font-semibold">Indicative subtotal</span><strong className="font-display text-3xl text-sand-300">₹{subtotal.toLocaleString("en-IN")}</strong></div></div><p className="mt-4 text-xs leading-5 text-white/45">Final pricing confirmed against grade, quantity and delivery location.</p>{belowMinOrder && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold text-sand-300">Minimum order amount is ₹{MIN_ORDER_AMOUNT.toLocaleString("en-IN")}. Add ₹{(MIN_ORDER_AMOUNT - subtotal).toLocaleString("en-IN")} more to checkout.</p>}<button onClick={() => navigate("/checkout")} disabled={belowMinOrder} className="mt-8 flex w-full items-center justify-center rounded-full bg-forest-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-forest-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-forest-700 disabled:hover:text-white">Proceed to checkout <ArrowRight className="ml-2" size={16} /></button></aside>
    </div>}
  </main><SimpleFooter /></div>;
}
