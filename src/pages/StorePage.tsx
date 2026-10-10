import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Check, 
  Shirt, 
  Coffee 
} from 'lucide-react';
import { fetchShopifyProducts, getProductUrl, SHOPIFY_STORE_URL } from '../services/shopifyService';
import type { ShopifyProduct } from '../types/shopify';

type CategoryFilter = 'all' | 'camisetas' | 'hoodies' | 'tazas' | 'vaso';

export const StorePage: React.FC = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setLoading(true);
      const items = await fetchShopifyProducts();
      if (isMounted) {
        setProducts(items);
        setLoading(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const getCategory = (product: ShopifyProduct): CategoryFilter => {
    const type = (product.product_type || '').toLowerCase();
    const handle = (product.handle || '').toLowerCase();
    const title = (product.title || '').toLowerCase();

    if (type.includes('mug') || title.includes('taza')) {
      return 'tazas';
    }
    if (type.includes('drinkware') || handle.includes('tumbler') || title.includes('vaso')) {
      return 'vaso';
    }
    if (type.includes('hoodie') || title.includes('hoodie')) {
      return 'hoodies';
    }
    if (type.includes('camiseta') || title.includes('camisa') || title.includes('camiseta') || handle.includes('shirt')) {
      return 'camisetas';
    }
    return 'all';
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return getCategory(p) === selectedCategory;
  });

  const categories = [
    { id: 'all' as CategoryFilter, label: 'Todo el Catálogo', count: products.length },
    { 
      id: 'camisetas' as CategoryFilter, 
      label: 'Camisetas', 
      count: products.filter(p => getCategory(p) === 'camisetas').length,
      icon: Shirt 
    },
    { 
      id: 'hoodies' as CategoryFilter, 
      label: 'Hoodies', 
      count: products.filter(p => getCategory(p) === 'hoodies').length,
      icon: Layers 
    },
    { 
      id: 'tazas' as CategoryFilter, 
      label: 'Tazas', 
      count: products.filter(p => getCategory(p) === 'tazas').length,
      icon: Coffee 
    },
    { 
      id: 'vaso' as CategoryFilter, 
      label: 'Vaso Térmico', 
      count: products.filter(p => getCategory(p) === 'vaso').length,
      icon: Sparkles 
    },
  ];

  const getProductCategoryLabel = (category: CategoryFilter): string => {
    switch (category) {
      case 'camisetas': return 'Camiseta';
      case 'hoodies': return 'Hoodie';
      case 'tazas': return 'Taza';
      case 'vaso': return 'Vaso Térmico';
      default: return 'Oficial';
    }
  };

  return (
    <div className="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* 1. HERO BANNER DE LA TIENDA */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0A0A0A] p-6 sm:p-10 md:p-12 border border-white/10 shadow-2xl text-white">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#FFD400]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col items-start gap-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <ShoppingBag className="w-3 h-3" />
                Shopify Oficial
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                100% Original
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight m-0 leading-tight">
              Tienda oficial de 100% Wrestling Podcast
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed m-0">
              Lleva tu pasión por el podcast a otro nivel. Apoya directamente al proyecto vistiendo nuestra mercancía oficial: camisetas y hoodies de alta resistencia, tazas conmemorativas y el vaso térmico exclusivo de 20 oz.
            </p>

            {/* Aviso transparente de envío sin promesas falsas */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-2">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Truck className="w-4 h-4 text-brand-red shrink-0" />
                <span>El envío se calcula al finalizar la compra en Shopify.</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-[#FFD400] shrink-0" />
                <span>Pago 100% seguro a través de Shopify Checkout.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={SHOPIFY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-red to-[#B30000] hover:brightness-110 text-white font-display font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-[0_4px_16px_rgba(225,6,0,0.4)] cursor-pointer"
              >
                <span>Ver toda la tienda</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Badge / Resumen visual de apoyo */}
          <div className="w-full md:w-72 bg-black/60 border border-white/10 rounded-xl p-5 flex flex-col gap-3 text-left shrink-0">
            <span className="text-[11px] font-display font-black uppercase tracking-wider text-brand-red">
              ¿Por qué comprar aquí?
            </span>
            <ul className="text-xs text-white/75 space-y-2 m-0 p-0 list-none">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Apoyo 100% directo a los creadores de contenido.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Estampados duraderos y materiales cómodos de primera calidad.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Variedad de tallas desde S hasta 3XL y 5XL en hoodies.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS (Filtros por categoría solicitados) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-red" />
            <h2 className="text-base sm:text-lg font-display font-black uppercase text-white tracking-wider m-0">
              Colecciones Disponibles
            </h2>
          </div>
          {!loading ? (
            <span className="text-xs font-mono text-white/60">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </span>
          ) : (
            <span className="text-xs font-mono text-white/30 animate-pulse">
              Cargando catálogo...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-brand-red text-white shadow-[0_2px_10px_rgba(225,6,0,0.35)]'
                    : 'bg-[#0A0A0A] text-white/75 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-[#0A0A0A] rounded-2xl p-5 border border-white/10 animate-pulse flex flex-col gap-4">
                <div className="h-56 bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-10 bg-white/10 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#0A0A0A] rounded-2xl p-12 border border-white/10 text-center text-white flex flex-col items-center gap-4">
            <ShoppingBag className="w-12 h-12 text-white/40" />
            <p className="text-base text-white/70 m-0">No se encontraron productos en esta categoría.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-brand-red text-white text-xs font-display font-bold uppercase rounded-lg hover:brightness-110 cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const category = getCategory(product);
              const firstVariant = product.variants?.[0];
              const price = firstVariant?.price ? `$${parseFloat(firstVariant.price).toFixed(2)} USD` : 'Ver precio';
              const imageUrl = product.images?.[0]?.src || '';
              const productUrl = getProductUrl(product.handle);
              const sizeOption = product.options?.find(o => o.name.toLowerCase() === 'size');

              return (
                <article
                  key={product.id}
                  className="bg-[#0A0A0A] rounded-2xl p-5 flex flex-col justify-between border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/25 transition-all duration-300 group relative text-white"
                >
                  <div className="flex flex-col gap-3">
                    {/* Badge de Categoría y Disponibilidad */}
                    <div className="flex items-center justify-between text-[10px] font-display font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10">
                        {getProductCategoryLabel(category)}
                      </span>
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Disponible
                      </span>
                    </div>

                    {/* Imagen del producto */}
                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-56 w-full rounded-xl bg-black/60 flex items-center justify-center border border-white/10 overflow-hidden relative p-4 group-hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-brand-red/5 group-hover:bg-brand-red/10 transition-colors" />
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          loading="lazy"
                          className="h-48 w-auto max-w-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag className="w-12 h-12 text-white/30 relative z-10" />
                      )}
                    </a>

                    {/* Título */}
                    <h3 className="text-base font-display font-black text-white uppercase tracking-tight m-0 line-clamp-2 leading-snug group-hover:text-brand-red transition-colors">
                      <a href={productUrl} target="_blank" rel="noopener noreferrer">
                        {product.title}
                      </a>
                    </h3>

                    {/* Precios e Indicador de Envío */}
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-lg font-mono font-black text-white">
                        {price}
                      </span>
                      <span className="text-[10px] text-white/50 tracking-wider">
                        + Envío al checkout
                      </span>
                    </div>

                    {/* Tallas / Opciones disponibles */}
                    {sizeOption && sizeOption.values && sizeOption.values.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-white/40 uppercase mr-1">Tallas:</span>
                        {sizeOption.values.slice(0, 6).map((val) => (
                          <span
                            key={val}
                            className="px-1.5 py-0.5 text-[9px] font-mono bg-white/5 border border-white/10 rounded text-white/70"
                          >
                            {val}
                          </span>
                        ))}
                        {sizeOption.values.length > 6 && (
                          <span className="text-[9px] text-white/40 font-mono">
                            +{sizeOption.values.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botón CTA "Ver y comprar" */}
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-5 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-red to-[#B30000] hover:brightness-110 text-white text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_2px_10px_rgba(225,6,0,0.3)] active:scale-95"
                  >
                    <span>Ver y comprar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. FOOTER BANNER DESTACADO PARA VISITAR TODA LA TIENDA */}
      <section className="bg-gradient-to-r from-[#140000] via-[#0A0A0A] to-[#140000] p-6 sm:p-8 rounded-2xl border border-brand-red/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-white text-left">
        <div className="flex flex-col items-start gap-2 max-w-xl">
          <span className="text-[10px] font-display font-black uppercase tracking-wider text-brand-red">
            Catálogo Completo
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white m-0">
            ¿Buscas más opciones, colores o tallas especiales?
          </h3>
          <p className="text-xs sm:text-sm text-white/70 m-0">
            Visita directamente nuestra plataforma en Shopify donde podrás seleccionar variantes, calcular los costos de envío para tu dirección y realizar tu pedido con total seguridad.
          </p>
        </div>

        <a
          href={SHOPIFY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white font-display font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-2 shadow-[0_4px_16px_rgba(225,6,0,0.4)] whitespace-nowrap cursor-pointer shrink-0"
        >
          <span>Ver toda la tienda</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>

    </div>
  );
};
