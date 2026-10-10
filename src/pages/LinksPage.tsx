import React, { useState } from 'react';
import { affiliateCategories } from '../data/affiliateLinks';
import { Copy, Check, ExternalLink, ShieldAlert, Tag } from 'lucide-react';
import { resolveAsset } from '../utils/assets';
import { useTranslation } from 'react-i18next';

export const LinksPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = async (linkId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('No se pudo copiar el código:', err);
    }
  };

  return (
    <div className="flex flex-col gap-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Page Header */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-display font-black uppercase text-gray-950 tracking-tight m-0">
          {t('links.title')}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {t('links.desc')}
        </p>
      </section>

      {/* Render Categories */}
      {affiliateCategories.map((category) => {
        const categoryTitle = i18n.language === 'en' ? category.title_en : category.title_es;

        return (
          <section key={category.id} className="flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <h3 className="text-sm font-display font-black uppercase text-brand-red tracking-wider m-0">
                {categoryTitle}
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.links.map((link) => {
                const description = i18n.language === 'en' ? link.description_en : link.description_es;
                const buttonText = i18n.language === 'en' ? link.buttonText_en : link.buttonText_es;
                const discount = i18n.language === 'en' ? link.discount_en : link.discount_es;

                return (
                  <div 
                    key={link.id}
                    className="bg-[#0A0A0A] rounded-xl p-5 flex flex-col justify-between border border-white/10 shadow-xl hover:border-white/20 transition-all relative group min-h-[380px] text-white"
                  >
                    <div>
                      {/* Logo Banner Container */}
                      {link.logo_url && (
                        <div className="h-32 w-full rounded-lg bg-black/60 flex items-center justify-center border border-white/10 mb-4 relative overflow-hidden p-4 group-hover:bg-black/80 transition-colors">
                          <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          <img 
                            src={resolveAsset(link.logo_url)} 
                            alt={link.name}
                            className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Header Row: Title & Badges */}
                      <div className="flex justify-between items-center gap-3 mb-3">
                        <span className="font-display font-black text-base uppercase text-white tracking-tight leading-none block">
                          {link.name}
                        </span>
                        <div className="flex gap-1.5 shrink-0">
                          {link.isAffiliate && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              {i18n.language === 'en' ? 'Affiliate link' : 'Enlace afiliado'}
                            </span>
                          )}
                          {discount && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-500/10 text-brand-red border border-red-500/30">
                              {discount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-white/70 leading-relaxed mb-4">
                        {description}
                      </p>
                    </div>

                    {/* Actions Area */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      {/* If has code (e.g. Ringside) */}
                      {link.code && (
                        <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded font-mono text-xs text-white sm:w-48">
                          <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="font-extrabold text-white">{link.code}</span>
                          <button
                            onClick={() => handleCopyCode(link.id, link.code!)}
                            className="p-1 rounded bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors cursor-pointer"
                            title={t('links.copyCode')}
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Direct Shop Link Button */}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded bg-brand-red hover:bg-brand-red-hover text-white text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-95 flex-1 cursor-pointer shadow-sm"
                      >
                        {buttonText}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Discreet Legal Disclaimer */}
      <section className="mt-8 p-5 rounded-xl bg-[#0A0A0A] border border-white/10 flex gap-3 items-start shadow-md text-white">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-left">
          <h4 className="text-xs font-display font-bold text-white uppercase m-0 leading-none">
            {i18n.language === 'en' ? 'Affiliate Disclosure' : 'Aviso de Transparencia Comercial'}
          </h4>
          <p className="text-[10px] text-white/60 leading-relaxed mt-2 max-w-4xl">
            {t('links.affiliateDisclosure')}
          </p>
        </div>
      </section>

    </div>
  );
};
