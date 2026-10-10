import React, { useState } from 'react';
import { Home, Headphones, Calendar, Users, ShoppingBag, MoreHorizontal, Link as LinkIcon, Mail, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainNavItems = [
    { id: 'inicio', label: t('navigation.inicio'), icon: Home },
    { id: 'ver-y-escuchar', label: t('navigation.verYEscuchar'), icon: Headphones },
    { id: 'calendario', label: t('navigation.calendario'), icon: Calendar },
    { id: 'comunidad', label: t('navigation.comunidad'), icon: Users },
    { id: 'tienda', label: t('navigation.tienda'), icon: ShoppingBag },
  ];

  const moreNavItems = [
    { id: 'links', label: t('navigation.links'), icon: LinkIcon },
    { id: 'contacto', label: t('navigation.contacto'), icon: Mail },
  ];

  const isMoreSelected = moreNavItems.some(item => item.id === activeTab);

  return (
    <>
      {/* Mobile Drawer for More Items */}
      {isMoreSheetOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreSheetOpen(false)}
        >
          <div 
            className="bg-[#17171C] border-t border-white/10 rounded-t-2xl p-6 flex flex-col gap-4 text-left shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-display font-black text-sm uppercase text-white tracking-wider">
                {t('navigation.mas')}
              </span>
              <button 
                onClick={() => setIsMoreSheetOpen(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white bg-white/5 cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {moreNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreSheetOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-brand-red text-white border-brand-red' 
                        : 'bg-black/40 text-white/80 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-display font-bold text-xs uppercase tracking-wider">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0D]/95 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md pb-safe"
        aria-label="Navegación Móvil"
      >
        <div className="flex justify-around items-center h-16 px-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 px-1 cursor-pointer transition-all duration-200 active:scale-90"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div 
                  className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-brand-red/20 text-brand-red scale-105 shadow-[0_0_10px_rgba(215,25,32,0.3)]' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span 
                  className={`text-[9px] font-display font-bold tracking-tight uppercase transition-all duration-200 mt-0.5 truncate max-w-[56px] ${
                    isActive ? 'text-brand-red font-black' : 'text-white/50'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More trigger button */}
          <button
            onClick={() => setIsMoreSheetOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 cursor-pointer transition-all duration-200 active:scale-90"
            aria-label={t('navigation.mas')}
            aria-expanded={isMoreSheetOpen}
          >
            <div 
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                isMoreSelected 
                  ? 'bg-brand-red/20 text-brand-red scale-105' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span 
              className={`text-[9px] font-display font-bold tracking-tight uppercase transition-all duration-200 mt-0.5 ${
                isMoreSelected ? 'text-brand-red font-black' : 'text-white/50'
              }`}
            >
              {t('navigation.mas')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
