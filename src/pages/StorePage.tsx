import React from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Truck,
  ShieldCheck,
  Sparkles,
  Shirt,
  Coffee,
  Layers
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { siteConfig } from '../data/siteConfig';
import { logoWhite } from '../utils/assets';

export const StorePage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const storeUrl = siteConfig.merchandise.storeUrl || 'https://100-wrestling-podcast.myspreadshop.com';

  const highlights = [
    {
      icon: Shirt,
      title: isEn ? 'T-Shirts & Apparel' : 'Camisetas y Ropa',
      desc: isEn
        ? 'Official 100% Wrestling Podcast designs in multiple colors, cuts and sizes.'
        : 'Diseños oficiales de 100% Wrestling Podcast en múltiples colores, estilos y tallas.'
    },
    {
      icon: Layers,
      title: isEn ? 'Hoodies & Sweatshirts' : 'Hoodies y Sudaderas',
      desc: isEn
        ? 'Heavyweight hoodies and sweatshirts built for every RAW, Dynamite, SmackDown and PLE night.'
        : 'Hoodies y sudaderas de alta calidad ideales para cada noche de RAW, Dynamite, SmackDown y PLE.'
    },
    {
      icon: Coffee,
      title: isEn ? 'Mugs & Accessories' : 'Tazas y Accesorios',
      desc: isEn
        ? 'Official mugs, hats, stickers and collectibles to represent the community anywhere.'
        : 'Tazas oficiales, gorras, stickers y accesorios para representar a la comunidad en cualquier lugar.'
    }
  ];

  return (
    <div className="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      {/* 1. HERO BANNER DE LA TIENDA OFICIAL */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-6 sm:p-10 md:p-12 border border-white/10 shadow-2xl text-white">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col items-start gap-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3" />
                {isEn ? 'Official Spreadshop Store' : 'Tienda Oficial Spreadshop'}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                100% Original
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight m-0 leading-tight">
              {isEn ? 'Official ' : 'Tienda Oficial '}
              <span className="text-brand-red">100% Wrestling</span>
              {isEn ? ' Merch' : ''}
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed m-0">
              {isEn
                ? 'Support the podcast directly by wearing our official designs. Browse the full catalog, pick your size and color, and check out securely on our official Spreadshop store.'
                : 'Apoya directamente al podcast vistiendo nuestros diseños oficiales. Explora el catálogo completo, elige tu talla y color, y compra con total seguridad en nuestra tienda oficial de Spreadshop.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_20px_rgba(215,25,32,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isEn ? 'Visit Official Store' : 'Entrar a la Tienda Oficial'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="w-full lg:w-64 shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/60 border border-white/10 gap-3">
            <img
              src={logoWhite}
              alt="100% Wrestling Podcast Merch"
              className="w-28 h-28 object-contain drop-shadow-[0_0_20px_rgba(225,6,0,0.35)]"
            />
            <span className="text-[11px] font-display font-black uppercase tracking-widest text-[#FFD400]">
              {isEn ? 'New Official Merch' : 'Nueva Mercancía Oficial'}
            </span>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#17171C] rounded-2xl p-6 border border-white/10 hover:border-brand-red/50 transition-all shadow-xl flex flex-col justify-between gap-4 group cursor-pointer"
            >
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-red/15 border border-brand-red/30 text-brand-red flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-display font-black uppercase text-white m-0 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed m-0">
                  {item.desc}
                </p>
              </div>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-red flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                {isEn ? 'Browse in store' : 'Ver en la tienda'}
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          );
        })}
      </section>

      {/* 3. TRUST BADGES */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 flex items-center gap-3.5">
          <Truck className="w-6 h-6 text-brand-red shrink-0" />
          <div>
            <h3 className="text-xs font-display font-black uppercase text-white m-0">
              {isEn ? 'Direct Shipping' : 'Envíos Directos'}
            </h3>
            <p className="text-[11px] text-white/65 m-0 mt-0.5">
              {isEn ? 'Printed on demand and shipped straight to your door.' : 'Impresión bajo demanda con envío directo a tu puerta.'}
            </p>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 flex items-center gap-3.5">
          <ShieldCheck className="w-6 h-6 text-[#FFD400] shrink-0" />
          <div>
            <h3 className="text-xs font-display font-black uppercase text-white m-0">
              {isEn ? 'Secure Checkout' : 'Pago 100% Seguro'}
            </h3>
            <p className="text-[11px] text-white/65 m-0 mt-0.5">
              {isEn ? 'Protected checkout processed directly by Spreadshop.' : 'Pagos protegidos y procesados directamente por Spreadshop.'}
            </p>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 flex items-center gap-3.5">
          <Sparkles className="w-6 h-6 text-brand-red shrink-0" />
          <div>
            <h3 className="text-xs font-display font-black uppercase text-white m-0">
              {isEn ? 'Support the Podcast' : 'Apoya al Podcast'}
            </h3>
            <p className="text-[11px] text-white/65 m-0 mt-0.5">
              {isEn ? 'Every purchase directly supports new live shows and coverage.' : 'Cada compra apoya directamente nuevas transmisiones y coberturas.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
