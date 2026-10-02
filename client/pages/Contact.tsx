import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SUPPORT_EMAIL, DISPUTE_EMAIL } from "@/data/siteData";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate form submission
      console.log("Form submitted:", formData);
      toast.success("Message sent successfully! We'll get back to you within one business day.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-forest-950">
      {/* Header */}
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
              <Link to="/" className="hidden sm:block text-white/85 hover:text-sand-300">
                Home
              </Link>
              <Link to="/products" className="text-white/85 hover:text-sand-300">
                Products
              </Link>
              <Link to="/contact" className="rounded-full bg-sand-300 px-4 py-2.5 text-white">
                Contact
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
              <p className="eyebrow text-sand-300">Get in touch</p>
              <h1 className="section-title mt-5 text-white">
                Let's talk about<br />
                <em className="text-sand-300">your requirements.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/70">
                Whether you're sourcing for wholesale, manufacturing, export, or have questions about our products — our team is here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr]">
            {/* Contact Info */}
            <div>
              <p className="eyebrow">Contact Information</p>
              <h2 className="section-title mt-5">Multiple ways to reach us</h2>

              <div className="mt-12 space-y-8">
                {/* Email */}
                <div>
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 shrink-0 text-forest-700" size={24} />
                    <div>
                      <h3 className="font-display text-xl">General Inquiries</h3>
                      <p className="mt-2 text-sm text-forest-950/60">For sourcing, bulk orders, and product information</p>
                      <a
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
                      >
                        {SUPPORT_EMAIL} <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Dispute Email */}
                <div>
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 shrink-0 text-sand-300" size={24} />
                    <div>
                      <h3 className="font-display text-xl">Complaints & Disputes</h3>
                      <p className="mt-2 text-sm text-forest-950/60">For quality issues, refund requests, or complaints</p>
                      <a
                        href={`mailto:${DISPUTE_EMAIL}`}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
                      >
                        {DISPUTE_EMAIL} <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 shrink-0 text-forest-700" size={24} />
                    <div>
                      <h3 className="font-display text-xl">Phone</h3>
                      <p className="mt-2 text-sm text-forest-950/60">Available Monday–Friday, 9 AM–6 PM IST</p>
                      <a
                        href="tel:+919619631768"
                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
                      >
                        +91 96196 31768 <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 shrink-0 text-forest-700" size={24} />
                    <div>
                      <h3 className="font-display text-xl">Office Location</h3>
                      <p className="mt-3 text-sm leading-6 text-forest-950/60">
                        20/1-1, Shitladevi Temple Road<br />
                        Mahim West, Mumbai 400016<br />
                        Maharashtra, India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div>
                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 shrink-0 text-forest-700" size={24} />
                    <div>
                      <h3 className="font-display text-xl">Response Time</h3>
                      <p className="mt-2 text-sm text-forest-950/60">We get back to all inquiries within one business day.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="rounded-3xl bg-sand-200 p-8 lg:p-10">
                <h3 className="font-display text-2xl">Send us a message</h3>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50 mb-2">
                      Your name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-forest-950/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-700"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50 mb-2">
                      Email address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full rounded-lg border border-forest-950/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-700"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50 mb-2">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9999999999"
                      className="w-full rounded-lg border border-forest-950/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-700"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-forest-950/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-700"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="bulk-order">Bulk Order Inquiry</option>
                      <option value="wholesale">Wholesale Pricing</option>
                      <option value="export">Export Requirements</option>
                      <option value="quality-issue">Quality Issue / Complaint</option>
                      <option value="refund">Refund / Return Request</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.12em] text-forest-950/50 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirement, volume, timeline, or issue..."
                      rows={5}
                      className="w-full rounded-lg border border-forest-950/20 bg-white px-4 py-3 text-sm outline-none transition focus:border-forest-700 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-forest-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-forest-900 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>

                  <p className="text-xs text-forest-950/50">
                    We'll review your message and respond within one business day. Thank you for reaching out!
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-forest-950/10 px-5 py-7 text-center text-xs text-forest-950/45">
        © 2025 Earth Root Agro · Mumbai, Maharashtra · <Link to="/contact" className="text-forest-700">Contact our team</Link>
      </footer>
    </div>
  );
}
