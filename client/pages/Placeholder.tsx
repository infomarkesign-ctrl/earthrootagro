import { ArrowRight, Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageCopy: Record<string, { eyebrow: string; title: string; body: string }> = {
  "/about": { eyebrow: "Our products", title: "Premium Millets & Cold-Pressed Oils", body: "We offer 9 premium millet products and 7 cold-pressed oils sourced directly from India's finest farms. Each product is carefully selected for quality and nutrition. Browse our complete selection." },
  "/products": { eyebrow: "Our products", title: "India's harvest, sourced with care.", body: "Explore grains, pulses, spices, oil seeds, organic produce and export-ready commodities for your next requirement." },
  "/services": { eyebrow: "Shop smart", title: "Combo Deals & Bundle Offers", body: "Save big with our 7 curated combo bundles - from ₹400 to ₹2000. Each combo carefully selected to give you variety and value. Check out our smart bundles and save up to ₹260!" },
  "/contact": { eyebrow: "Start a conversation", title: "Tell us what you need.", body: "Share your requirement and our Mumbai-based team will help you find the right product, quantity and route to market." },
};

export default function Placeholder() {
  const location = useLocation();
  const copy = pageCopy[location.pathname] || { eyebrow: "Earth Root Agro", title: "Good things grow from here.", body: "This section is being prepared with the same care as every Earth Root Agro shipment." };
  return <div className="min-h-screen bg-cream text-forest-950"><header className="border-b border-forest-950/10 bg-cream"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8"><Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-forest-700 text-sand-300"><Leaf size={19} fill="currentColor" /></span><span className="text-sm font-extrabold tracking-[0.12em]">EARTH ROOT <span className="text-forest-700">AGRO</span></span></Link><Link to="/" className="text-sm font-semibold text-forest-700">Back to home</Link></div></header><main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 py-20 lg:px-8"><div className="max-w-3xl"><p className="eyebrow">{copy.eyebrow}</p><h1 className="section-title mt-6">{copy.title}</h1><p className="mt-7 max-w-xl text-lg leading-8 text-forest-950/60">{copy.body}</p><div className="mt-10 flex flex-wrap gap-3"><Link to="/contact" className="rounded-full bg-forest-700 px-6 py-4 text-sm font-bold text-white">Request a quote <ArrowRight className="ml-2 inline" size={16} /></Link><Link to="/" className="rounded-full border border-forest-950/20 px-6 py-4 text-sm font-bold">Explore home</Link></div></div></main><footer className="border-t border-forest-950/10 px-5 py-6 text-center text-xs text-forest-950/45">© 2025 Earth Root Agro · Mumbai, Maharashtra</footer></div>;
}
