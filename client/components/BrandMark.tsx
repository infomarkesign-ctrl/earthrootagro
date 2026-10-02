import { Link } from "react-router-dom";

export default function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className={`flex items-center gap-3 ${inverse ? "text-white" : "text-forest-950"}`} aria-label="Earth Root Agro home">
    <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-sand-300 text-forest-950">
      <svg viewBox="0 0 44 44" className="h-9 w-9" fill="none" aria-hidden="true">
        <path d="M9 29c7-1 12-5 14-13 7 2 11 7 11 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M22 16v18M17 34c2-4 4-6 5-6M27 34c-2-4-4-6-5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M22 16c-1-5 2-9 7-11 2 5-1 9-7 11Z" fill="currentColor" opacity=".88" />
      </svg>
    </span>
    <span><span className="block text-[17px] font-extrabold leading-none tracking-[0.12em]">EARTH ROOT</span><span className="mt-1 block text-[10px] font-medium tracking-[0.42em] text-sand-300">AGRO</span></span>
  </Link>;
}
