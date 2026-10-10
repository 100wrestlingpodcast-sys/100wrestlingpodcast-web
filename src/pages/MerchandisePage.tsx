import React, { useEffect } from 'react';

/**
 * Legacy MerchandisePage redirector.
 * Per project instructions, all merchandising is unified under the official Shopify store (/tienda).
 * Pro Wrestling Tees has been discontinued.
 */
export const MerchandisePage: React.FC = () => {
  useEffect(() => {
    window.location.replace('/tienda');
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-white p-8">
      <p className="text-sm font-display uppercase tracking-wider text-white/70">
        Redirigiendo a la Tienda Oficial de 100% Wrestling Podcast...
      </p>
    </div>
  );
};
