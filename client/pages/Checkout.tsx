import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Banknote, Building2, Check, ChevronDown, PackageCheck, ShoppingBag, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { MIN_ORDER_AMOUNT, fallbackProductImage, products } from "@/data/siteData";
import { CartItem, clearCart, getCart } from "@/lib/cart";
import BrandMark from "@/components/BrandMark";

type PaymentMethod = "cod" | "upi" | "netbanking";

const paymentLabels: Record<PaymentMethod, string> = { cod: "Cash on Delivery", upi: "UPI", netbanking: "Net Banking" };

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [delivery, setDelivery] = useState("Mumbai / Maharashtra");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { setCart(getCart()); }, []);

  const lines = cart.map((entry) => ({ entry, product: products.find((item) => item.slug === entry.slug) })).filter((line) => line.product);
  const subtotal = lines.reduce((sum, line) => sum + line.product!.price * line.entry.qty, 0);
  const total = subtotal;
  const belowMinOrder = subtotal < MIN_ORDER_AMOUNT;

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (belowMinOrder) return;
    setSubmitted(true);
    clearCart();
  };

  if (submitted) return <div className="min-h-screen bg-cream text-forest-950"><CheckoutHeader /><main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 text-center lg:px-8"><div className="w-full rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(21,43,52,0.08)] sm:p-14"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-700 text-sand-300"><Check size={30} /></span><p className="eyebrow mt-8">Order received</p><h1 className="section-title mt-4">We’re on it.</h1><p className="mx-auto mt-6 max-w-lg leading-7 text-forest-950/60">Thank you for your order (₹{total.toLocaleString("en-IN")} indicative, via {paymentLabels[payment]}). Our sourcing team will confirm the final quote and {payment === "cod" ? "your order will be paid for in cash on delivery" : payment === "upi" ? "share a UPI payment request" : "share net banking payment instructions"} shortly.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/products" className="rounded-full bg-forest-700 px-6 py-4 text-sm font-bold text-white">Browse more products</Link><Link to="/" className="rounded-full border border-forest-950/15 px-6 py-4 text-sm font-bold">Back to home</Link></div></div></main></div>;

  if (lines.length === 0) return <div className="min-h-screen bg-cream text-forest-950"><CheckoutHeader /><main className="mx-auto flex min-h-[60vh] max-w-2xl items-center px-5 py-16 text-center lg:px-8"><div className="w-full rounded-[32px] bg-white p-14"><ShoppingBag className="mx-auto text-forest-950/30" size={40} /><p className="mt-5 text-forest-950/60">Your cart is empty.</p><Link to="/products" className="mt-6 inline-flex rounded-full bg-forest-700 px-6 py-3.5 text-sm font-bold text-white">Browse products</Link></div></main></div>;

  return <div className="min-h-screen bg-cream text-forest-950"><CheckoutHeader /><main className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20"><div className="mb-12 max-w-2xl"><p className="eyebrow">Bulk order checkout</p><h1 className="section-title mt-5">Confirm your<br /><span>requirement.</span></h1><p className="mt-5 leading-7 text-forest-950/60">Share your details and choose how you'd like to pay. Our team confirms the final commercial quote before any payment is collected.</p></div>
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={submitOrder} className="rounded-[28px] bg-white p-7 shadow-[0_15px_50px_rgba(21,43,52,0.06)] sm:p-10">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-sand-200 text-forest-700"><ShoppingBag size={18} /></span><div><p className="font-semibold">Your buying details</p><p className="text-xs text-forest-950/45">Required fields marked with *</p></div></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" placeholder="Your name" required />
          <Field label="Work email *" placeholder="you@company.com" type="email" required />
          <Field label="Phone number *" placeholder="+91 00000 00000" required />
          <Field label="Company name" placeholder="Business name" />
          <label className="text-sm sm:col-span-2"><span className="mb-2 block font-semibold">Delivery location *</span><select value={delivery} onChange={(event) => setDelivery(event.target.value)} className="w-full appearance-none rounded-xl border border-forest-950/15 bg-white px-4 py-3.5 outline-none focus:border-forest-700"><option>Mumbai / Maharashtra</option><option>Other location in India</option><option>International delivery</option></select><ChevronDown className="pointer-events-none relative float-right -mt-9 mr-4" size={16} /></label>
          <label className="text-sm sm:col-span-2"><span className="mb-2 block font-semibold">Additional requirements</span><textarea placeholder="Grade, packaging, target date or other notes" rows={4} className="w-full rounded-xl border border-forest-950/15 px-4 py-3.5 outline-none focus:border-forest-700" /></label>
        </div>

        <div className="mt-9 border-t border-forest-950/10 pt-8">
          <p className="font-semibold">Payment method</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button type="button" onClick={() => setPayment("cod")} className={`flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition ${payment === "cod" ? "border-forest-700 bg-sand-200" : "border-forest-950/15"}`}><span className="grid h-9 w-9 place-items-center rounded-full bg-forest-700 text-white"><Banknote size={16} /></span><span><span className="block text-sm font-bold">Cash on Delivery</span><span className="block text-xs text-forest-950/50">Pay when your order arrives</span></span></button>
            <button type="button" disabled title="Currently unavailable" className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-forest-950/10 px-4 py-4 text-left opacity-45"><span className="grid h-9 w-9 place-items-center rounded-full bg-forest-950/30 text-white"><Smartphone size={16} /></span><span><span className="block text-sm font-bold">UPI</span><span className="block text-xs text-forest-950/50">Currently unavailable</span></span></button>
            <button type="button" disabled title="Currently unavailable" className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-forest-950/10 px-4 py-4 text-left opacity-45"><span className="grid h-9 w-9 place-items-center rounded-full bg-forest-950/30 text-white"><Building2 size={16} /></span><span><span className="block text-sm font-bold">Net Banking</span><span className="block text-xs text-forest-950/50">Currently unavailable</span></span></button>
          </div>

          <p className="mt-5 text-sm text-forest-950/50">Pay in cash to our delivery team when your order arrives. Our sourcing team will confirm the final quote before dispatch.</p>
        </div>

        {belowMinOrder && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">Minimum order amount is ₹{MIN_ORDER_AMOUNT.toLocaleString("en-IN")}. Add ₹{(MIN_ORDER_AMOUNT - subtotal).toLocaleString("en-IN")} more to your cart to continue.</p>}
        <button type="submit" disabled={belowMinOrder} className="mt-8 flex w-full items-center justify-center rounded-full bg-forest-700 px-6 py-4 text-sm font-bold text-white transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-forest-700">Confirm order & continue <ArrowRight className="ml-2" size={16} /></button>
      </form>

      <aside className="h-fit rounded-[28px] bg-forest-950 p-7 text-white sm:p-10">
        <p className="eyebrow text-sand-300">Order summary</p>
        <div className="mt-7 space-y-5">
          {lines.map(({ entry, product }) => <div key={entry.slug} className="flex gap-4 border-b border-white/15 pb-5"><img src={product!.image} alt={product!.name} onError={(event) => { event.currentTarget.src = fallbackProductImage; }} className="h-16 w-16 rounded-2xl object-cover" /><div className="flex-1"><p className="font-semibold">{product!.name}</p><p className="mt-1 text-xs text-white/50">{entry.qty} kg × ₹{product!.price.toLocaleString("en-IN")}</p></div><p className="font-display text-xl">₹{(product!.price * entry.qty).toLocaleString("en-IN")}</p></div>)}
        </div>
        <div className="mt-2 space-y-3 border-t border-white/15 pt-6 text-sm">
          <div className="flex justify-between text-white/60"><span>Product subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
          <div className="flex justify-between border-t border-white/15 pt-4"><span className="font-semibold">Indicative total</span><strong className="font-display text-3xl text-sand-300">₹{total.toLocaleString("en-IN")}</strong></div>
        </div>
        <div className="mt-7 space-y-3 text-xs text-white/55"><p className="flex gap-2"><PackageCheck size={15} className="shrink-0 text-sand-300" /> Final price confirmed by our team before payment.</p><p className="flex gap-2"><Check size={15} className="shrink-0 text-sand-300" /> Paying via {paymentLabels[payment]} — no card details stored.</p></div>
      </aside>
    </div>
  </main></div>;
}

function Field({ label, placeholder, type = "text", required = false }: { label: string; placeholder: string; type?: string; required?: boolean }) { return <label className="text-sm"><span className="mb-2 block font-semibold">{label}</span><input required={required} type={type} placeholder={placeholder} className="w-full rounded-xl border border-forest-950/15 px-4 py-3.5 outline-none focus:border-forest-700" /></label>; }
function CheckoutHeader() { return <header className="border-b border-forest-950/10 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><BrandMark /><Link to="/products" className="text-sm font-semibold text-forest-700">Back to products</Link></div></header>; }
