import { products } from "@/data/siteData";

export type CartItem = { slug: string; qty: number };

const CART_KEY = "earth-root-cart";

export const getMaxQty = (slug: string) => products.find((product) => product.slug === slug)?.maxQty ?? 10;

const readCart = (): CartItem[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is CartItem => typeof item?.slug === "string" && typeof item?.qty === "number");
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
};

export const getCart = () => readCart();

export const cartCount = () => readCart().reduce((sum, item) => sum + item.qty, 0);

export const getQty = (slug: string) => readCart().find((item) => item.slug === slug)?.qty ?? 0;

/** Returns true if the requested quantity was capped at the product's max limit. */
export const addToCart = (slug: string, qty: number) => {
  const items = readCart();
  const existing = items.find((item) => item.slug === slug);
  const max = getMaxQty(slug);
  const desired = (existing?.qty ?? 0) + qty;
  const limited = desired > max;
  const finalQty = Math.min(desired, max);
  if (existing) existing.qty = finalQty;
  else items.push({ slug, qty: finalQty });
  writeCart(items);
  return limited;
};

/** Returns true if the requested quantity was capped at the product's max limit. */
export const setQty = (slug: string, qty: number) => {
  const items = readCart();
  const existing = items.find((item) => item.slug === slug);
  const max = getMaxQty(slug);
  const limited = qty > max;
  if (existing) existing.qty = Math.min(Math.max(1, qty), max);
  writeCart(items);
  return limited;
};

export const removeFromCart = (slug: string) => {
  writeCart(readCart().filter((item) => item.slug !== slug));
};

/** Decrements by 1kg; removes the line entirely once it reaches 0. */
export const decrementQty = (slug: string) => {
  const items = readCart();
  const existing = items.find((item) => item.slug === slug);
  if (!existing) return;
  if (existing.qty <= 1) writeCart(items.filter((item) => item.slug !== slug));
  else { existing.qty -= 1; writeCart(items); }
};

export const clearCart = () => writeCart([]);
