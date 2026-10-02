import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { legalPages, combos, products as allProducts } from "@/data/siteData";
import HomeAdditions from "@/components/HomeAdditions";
import BrandMark from "@/components/BrandMark";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Globe2,
  Leaf,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

const products = [
  { name: "Millet Products", items: "Flour · Noodles · Pasta · Dosa Mix · Pongal Mix · Roasted · Flavoured · Instant · Snacks", image: "/millet flour.jpeg" },
  { name: "Natural Oils", items: "Groundnut · Sesame · Mustard · Coconut · Sunflower · Rice-Bran · Soybean", image: "/groundnutoil.jpeg" },
];

const faqs = [
  ["What products does Earth Root Agro supply?", "We source and supply a wide range of grains, pulses, spices, oil seeds, organic produce and animal feed ingredients for domestic and export buyers."],
  ["Can you support recurring bulk orders?", "Yes. Our procurement and logistics teams create dependable supply programs for food manufacturers, retailers, hotels and international buyers."],
  ["Where do you deliver?", "We are based in Mumbai and serve buyers across India, with export-ready documentation and dispatch support for global destinations."],
];

function Header() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    setIsLoggedIn(false);
    setUserEmail("");
    setOpen(false);
    window.location.href = "/";
  };

  return <>
    <div className="bg-forest-950 text-white/70 text-[11px] tracking-[0.16em] uppercase">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
        <span>Trusted agricultural commodities from India</span>
        <div className="hidden items-center gap-5 sm:flex"><span>Mumbai · Maharashtra</span><span className="text-sand-300">●</span><span>Est. 2025</span></div>
      </div>
    </div>
    <header className="fixed left-0 right-0 top-0 z-40 bg-forest-950">
      <div className="bg-forest-950 text-white/70 text-[11px] tracking-[0.16em] uppercase">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 lg:px-8">
          <span>Trusted agricultural commodities from India</span>
          <div className="hidden items-center gap-5 sm:flex"><span>Mumbai · Maharashtra</span><span className="text-sand-300">●</span><span>Est. 2025</span></div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <nav className="flex items-center justify-between border-b border-white/20 py-5">
          {/* Logo */}
          <BrandMark inverse />

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-10 text-sm font-medium text-white/85 lg:flex">
            <Link className="transition hover:text-sand-300" to="/">Home</Link>
            <Link className="transition hover:text-sand-300" to="/about">About us</Link>
            <Link className="transition hover:text-sand-300" to="/products">
              Products <ChevronDown className="ml-1 inline" size={13} />
            </Link>
            <Link className="transition hover:text-sand-300" to="/services">Services</Link>
            <Link className="transition hover:text-sand-300" to="/contact">Contact</Link>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-6 lg:flex">
            <a href="tel:+919619631768" className="flex items-center gap-2 text-sm text-white/85 hover:text-sand-300 transition">
              <Phone size={16} className="text-sand-300" /> +91 96196 31768
            </a>

            {isLoggedIn ? (
              <>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-sand-300 text-forest-950 hover:bg-white transition text-lg"
                    title={userEmail}
                  >
                    👤
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-72 bg-forest-950 border border-white/20 rounded-lg shadow-xl">
                      <div className="px-5 py-4 border-b border-white/20">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sand-300 mb-2">Account</p>
                        <p className="text-sm text-white break-all">{userEmail}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-white/10 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-white/85 transition hover:text-sand-300">
                  Log in
                </Link>
                <Link to="/signup" className="rounded-full bg-sand-300 px-5 py-2 text-xs font-bold uppercase tracking-[0.13em] text-forest-950 transition hover:bg-white">
                  Sign up
                </Link>
              </>
            )}

            <Link to="/contact" className="rounded-full border border-sand-300 px-5 py-2 text-xs font-bold uppercase tracking-[0.13em] text-sand-300 transition hover:bg-sand-300 hover:text-forest-950">
              Request a quote <ArrowRight className="ml-2 inline" size={14} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="text-white lg:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {open && (
          <div className="border-b border-white/20 bg-forest-950/95 px-4 py-5 lg:hidden">
            <div className="flex flex-col gap-4 text-sm text-white">
              <Link to="/" onClick={() => setOpen(false)} className="hover:text-sand-300">Home</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="hover:text-sand-300">About us</Link>
              <Link to="/products" onClick={() => setOpen(false)} className="hover:text-sand-300">Products</Link>
              <Link to="/services" onClick={() => setOpen(false)} className="hover:text-sand-300">Services</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-sand-300">Contact</Link>

              <div className="border-t border-white/20 pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <p className="text-white/75 truncate">👤 {userEmail}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-full bg-red-600 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-white/85 hover:text-sand-300">
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="block rounded-full bg-sand-300 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.13em] text-forest-950 hover:bg-white transition">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="bg-forest-950 text-white"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8"><div><div className="mb-6"><BrandMark inverse /></div><p className="max-w-xs text-sm leading-7 text-white/55">Rooted in trust. Growing together. Reliable agricultural sourcing for a better-fed world.</p></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-sand-300">Explore</p><div className="flex flex-col gap-3 text-sm text-white/65"><Link to="/about">About our company</Link><Link to="/products">Our products</Link><Link to="/services">Trade & logistics</Link><Link to="/contact">Talk to our team</Link></div></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-sand-300">Legal</p><div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-white/55">{legalPages.map(([label, slug]) => <Link key={slug} to={`/legal/${slug}`} className="hover:text-sand-300">{label}</Link>)}</div></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-sand-300">Contact</p><p className="text-sm leading-7 text-white/65">20/1-1, Shitladevi Temple Road,<br />Mahim West, Mumbai 400016<br /><a href="mailto:support@earthrootagro.shop" className="text-white">support@earthrootagro.shop</a><br /><a href="mailto:dispute@earthrootagro.shop" className="text-white/75 text-xs">dispute@earthrootagro.shop</a><br /><a href="tel:+919619631768">+91 96196 31768</a></p></div></div><div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8"><span>© 2025 Earth Root Agro. All rights reserved.</span><span>Privacy · Terms · Supplier policy</span></div></div></footer>;
}

export default function Index() {
  const [activeFaq, setActiveFaq] = useState(0);
  return <div className="min-h-screen bg-cream text-forest-950"><Header /><main className="pt-32">
    <section className="relative flex min-h-[720px] items-end overflow-hidden bg-forest-950 pb-20 pt-44 lg:min-h-[780px] lg:pb-28"><img className="absolute inset-0 h-full w-full object-cover opacity-55" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=90" alt="Sunlit agricultural fields" /><div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/70 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/20" /><div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8"><div className="max-w-3xl"><div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-sand-300"><span className="h-px w-10 bg-sand-300" /> From India's finest farms</div><h1 className="max-w-3xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-7xl lg:text-[86px]">Trade that is<br /><em className="text-sand-300">rooted in trust.</em></h1><p className="mt-8 max-w-xl text-base leading-7 text-white/70 sm:text-lg">We connect the abundance of Indian agriculture with the world's finest food businesses — reliably, responsibly, and at scale.</p><div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link to="/products" className="rounded-full bg-sand-300 px-7 py-4 text-center text-sm font-bold text-forest-950 transition hover:bg-white">Explore our products <ArrowRight className="ml-2 inline" size={16} /></Link><Link to="/contact" className="rounded-full border border-white/35 px-7 py-4 text-center text-sm font-bold text-white transition hover:border-sand-300 hover:text-sand-300">Start a conversation</Link></div></div><div className="mt-20 flex flex-wrap gap-8 border-t border-white/20 pt-6 text-xs uppercase tracking-[0.15em] text-white/55"><span className="flex items-center gap-2"><BadgeCheck size={16} className="text-sand-300" /> Quality assured</span><span className="flex items-center gap-2"><Globe2 size={16} className="text-sand-300" /> India & worldwide</span><span className="flex items-center gap-2"><Truck size={16} className="text-sand-300" /> Built for bulk</span></div></div></section>
    <section className="bg-sand-300"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-7 sm:grid-cols-3 lg:px-8"><div><p className="font-display text-4xl text-forest-950">01</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-forest-950/60">Trusted sourcing</p></div><div><p className="font-display text-4xl text-forest-950">02</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-forest-950/60">Consistent quality</p></div><div><p className="font-display text-4xl text-forest-950">03</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-forest-950/60">Human partnerships</p></div></div></section>
    <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8 lg:py-32"><div><p className="eyebrow">The Earth Root difference</p><h2 className="section-title mt-5">Good business<br /><span>starts at the root.</span></h2></div><div><p className="max-w-2xl text-xl leading-9 text-forest-950/75">At Earth Root Agro, we believe a commodity is more than a transaction. It is a relationship between the grower, the buyer and the table.</p><p className="mt-6 max-w-2xl leading-7 text-forest-950/55">From careful procurement across India's agricultural heartlands to export-ready logistics from Mumbai, we make every link in the chain stronger. Our promise is simple: honest quality, dependable supply and partnerships that grow.</p><Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-forest-700">Our story <ArrowRight size={16} /></Link></div></section>
    <section className="bg-white py-24 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">What we trade</p><h2 className="section-title mt-5">The essentials,<br /><span>done exceptionally.</span></h2></div><Link to="/products" className="mb-1 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-forest-700">View all products <ArrowRight size={16} /></Link></div><div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product, i) => <Link to="/products" key={product.name} className="group overflow-hidden rounded-[22px] bg-cream"><div className="relative aspect-[0.9] overflow-hidden"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 to-transparent" /><span className="absolute bottom-5 left-5 text-2xl font-medium text-white">0{i + 1}</span></div><div className="p-5"><h3 className="font-display text-2xl">{product.name}</h3><p className="mt-2 text-sm text-forest-950/55">{product.items}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-forest-700">Explore <ArrowRight size={14} /></span></div></Link>)}</div></div></section>
    <section className="overflow-hidden bg-forest-900 text-white"><div className="mx-auto grid max-w-7xl lg:grid-cols-2"><div className="px-5 py-24 lg:px-8 lg:py-32"><p className="eyebrow text-sand-300">Built for better supply chains</p><h2 className="section-title mt-5 text-white">From farm gate<br />to <em className="text-sand-300">front door.</em></h2><p className="mt-7 max-w-md leading-7 text-white/60">Our connected approach gives buyers visibility, confidence and control — from first conversation to final delivery.</p><div className="mt-10 space-y-5">{[["01", "Source with intent", "Deep supplier relationships across India's key growing regions."], ["02", "Check every detail", "Practical inspection and quality checks before dispatch."], ["03", "Deliver as promised", "Coordinated logistics that keep your business moving."]].map(([num, title, text]) => <div className="flex gap-5 border-t border-white/15 pt-5" key={num}><span className="text-xs text-sand-300">{num}</span><div><h3 className="font-display text-xl">{title}</h3><p className="mt-1 text-sm text-white/50">{text}</p></div></div>)}</div></div><div className="relative min-h-[420px] lg:min-h-0"><img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85" alt="Hands holding grain" /><div className="absolute inset-0 bg-forest-900/25" /><div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-forest-950/50 p-5 backdrop-blur-md"><div className="flex items-center gap-3"><ShieldCheck className="text-sand-300" size={25} /><div><p className="text-sm font-bold">Quality you can count on</p><p className="mt-1 text-xs text-white/60">Every shipment, every season.</p></div></div></div></div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="eyebrow">Straight from our partners</p><h2 className="section-title mt-5">Trust is the<br /><span>real harvest.</span></h2></div><div className="grid gap-5 sm:grid-cols-2"><blockquote className="rounded-2xl bg-sand-200 p-7"><Sparkles className="mb-8 text-forest-700" size={20} /><p className="font-display text-2xl leading-8">"They make sourcing feel simple. The quality and communication are always consistent."</p><footer className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50">Procurement head · Food manufacturer</footer></blockquote><blockquote className="rounded-2xl bg-white p-7 shadow-[0_15px_50px_rgba(24,61,42,0.08)]"><BadgeCheck className="mb-8 text-forest-700" size={20} /><p className="font-display text-2xl leading-8">"A partner who understands the urgency and detail of international trade."</p><footer className="mt-8 text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50">Director · Global commodities</footer></blockquote></div></div></section>
    <section className="bg-sand-200 py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"><div><p className="eyebrow">Questions, answered</p><h2 className="section-title mt-5">Let's make it<br /><span>clear.</span></h2></div><div>{faqs.map(([q, a], i) => <div className="border-b border-forest-950/15 py-5" key={q}><button onClick={() => setActiveFaq(activeFaq === i ? -1 : i)} className="flex w-full items-center justify-between text-left text-lg font-semibold"><span>{q}</span><ChevronDown className={`shrink-0 transition ${activeFaq === i ? "rotate-180" : ""}`} size={19} /></button>{activeFaq === i && <p className="max-w-xl pt-4 text-sm leading-7 text-forest-950/60">{a}</p>}</div>)}</div></div></section>
    <HomeAdditions />
    {/* Featured Combos Section */}
    <section className="bg-gradient-to-b from-sand-300/20 to-white px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="eyebrow">Smart Savings</p>
          <h2 className="section-title mt-5">Curated Combos</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-forest-950/60">
            Handpicked product bundles at fixed prices. Get more value and save up to 15%.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {combos.slice(0, 6).map((combo) => (
            <div key={combo.id} className="group overflow-hidden rounded-2xl border border-forest-950/10 bg-white transition hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(24,61,42,0.12)]">
              <div className="relative h-36 overflow-hidden bg-gradient-to-b from-sand-300/20 to-sand-300/10">
                <div className={`grid h-full w-full ${combo.products.length === 2 ? 'grid-cols-2' : combo.products.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {combo.products.map((slug, idx) => {
                    const product = allProducts.find((p) => p.slug === slug);
                    return (
                      <div key={idx} className="relative overflow-hidden border border-white/20">
                        <img
                          src={product?.image || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85"}
                          alt={product?.name || slug}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85";
                          }}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    );
                  })}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 to-transparent pointer-events-none" />

                {/* Savings Badge */}
                <div className="absolute top-3 right-3 rounded-full bg-red-500 px-3 py-1 flex items-center gap-1">
                  <span className="text-xs font-bold text-white">Save ₹{combo.products.length > 3 ? '240+' : '90-220'}</span>
                </div>

                {/* Price */}
                <div className="absolute bottom-3 left-4">
                  <p className="text-3xl font-bold text-sand-300">₹{combo.price}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-xl">{combo.name}</h3>
                <p className="mt-2 text-sm text-forest-950/60">{combo.description}</p>

                {/* Products List with Prices */}
                <div className="mt-4 space-y-2 border-t border-forest-950/10 pt-4">
                  {combo.products.slice(0, 3).map((slug) => (
                    <div key={slug} className="flex items-center justify-between text-xs">
                      <span className="text-forest-950/70">✓ {slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}</span>
                      <span className="font-bold text-forest-700">in combo</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <div className="border-t border-forest-950/10 p-5">
                <Link to="/combos" className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-forest-900">
                  View Combo
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/combos" className="inline-flex items-center gap-2 rounded-full border border-forest-700 px-7 py-3 text-sm font-bold text-forest-700 transition hover:bg-forest-700 hover:text-white">
            View all combos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
    <section className="bg-forest-700 px-5 py-20 text-center text-white lg:px-8 lg:py-28"><p className="eyebrow text-sand-300">Let's grow together</p><h2 className="mx-auto mt-5 max-w-3xl font-display text-5xl leading-none tracking-[-0.03em] sm:text-7xl">Have a requirement?<br /><em className="text-sand-300">We have a way.</em></h2><p className="mx-auto mt-7 max-w-lg text-white/65">Tell us what you need, where you need it and when. Our team will get back to you within one business day.</p><Link to="/contact" className="mt-9 inline-flex rounded-full bg-sand-300 px-7 py-4 text-sm font-bold text-forest-950 transition hover:bg-white">Talk to our team <ArrowRight className="ml-2" size={16} /></Link></section>
  </main><Footer /><a href="https://wa.me/919619631768" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105"><Phone size={22} /></a></div>;
}
