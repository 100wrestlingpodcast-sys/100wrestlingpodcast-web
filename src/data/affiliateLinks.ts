export interface AffiliateLink {
  id: string;
  name: string;
  description_es: string;
  description_en: string;
  url: string;
  buttonText_es: string;
  buttonText_en: string;
  isAffiliate: boolean;
  code?: string;
  discount_es?: string;
  discount_en?: string;
  logo_url?: string;
}

export interface AffiliateCategory {
  id: string;
  title_es: string;
  title_en: string;
  links: AffiliateLink[];
}

export const affiliateCategories: AffiliateCategory[] = [
  {
    id: "sponsors",
    title_es: "Nuestros auspiciadores",
    title_en: "Our Sponsors",
    links: [
      {
        id: "nordvpn",
        name: "NordVPN",
        description_es: "Protege tu conexión y navega con total seguridad mientras ves tus eventos de wrestling preferidos desde cualquier parte del mundo.",
        description_en: "Protect your connection and browse safely while watching your favorite wrestling events from anywhere in the world.",
        url: "https://nordvpn.sjv.io/100wrestling",
        buttonText_es: "Conoce NordVPN",
        buttonText_en: "Learn about NordVPN",
        isAffiliate: true,
        logo_url: "nordvpn_logo.png"
      }
    ]
  },
  {
    id: "collectibles",
    title_es: "Coleccionables",
    title_en: "Collectibles",
    links: [
      {
        id: "wwe-topps",
        name: "WWE Topps",
        description_es: "Consigue las tarjetas coleccionables oficiales de tus superestrellas favoritas de WWE. Ediciones exclusivas y sets especiales.",
        description_en: "Get official collectible trading cards of your favorite WWE Superstars. Exclusive editions and special sets.",
        url: "https://thetoppscompany.sjv.io/YRNk4j",
        buttonText_es: "Comprar WWE Topps",
        buttonText_en: "Shop WWE Topps",
        isAffiliate: true,
        logo_url: "topps_logo.png"
      },
      {
        id: "ringside-collectibles",
        name: "Ringside Collectibles",
        description_es: "La tienda líder en figuras de acción de wrestling y coleccionables. Consigue tus luchadores favoritos de WWE y AEW.",
        description_en: "The leading store for wrestling action figures and collectibles. Get your favorite WWE and AEW wrestlers.",
        url: "https://www.wrestlingfigures.com",
        buttonText_es: "Visitar Ringside Collectibles",
        buttonText_en: "Visit Ringside Collectibles",
        isAffiliate: true,
        code: "100WRESTLING",
        discount_es: "10% de descuento",
        discount_en: "10% Off",
        logo_url: "ringside_logo.png"
      }
    ]
  },
  {
    id: "official-shops",
    title_es: "Tiendas oficiales",
    title_en: "Official Shops",
    links: [
      {
        id: "fanatics-wwe-shop",
        name: "Fanatics WWE Shop",
        description_es: "Tienda oficial de productos de la WWE. Camisetas, campeonatos, gorras y accesorios originales de tus estrellas preferidas.",
        description_en: "Official WWE product store. T-shirts, championships, hats and original accessories from your favorite stars.",
        url: "https://wwe-shop.sjv.io/100wrestlingpodcast",
        buttonText_es: "Comprar en WWE Shop",
        buttonText_en: "Shop WWE Shop",
        isAffiliate: true,
        logo_url: "fanatics_logo.png"
      }
    ]
  }
];
