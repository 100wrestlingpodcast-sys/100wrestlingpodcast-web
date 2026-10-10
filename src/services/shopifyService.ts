import type { ShopifyProduct } from '../types/shopify';
import staticCatalog from '../data/shopifyCatalog.json';

export const SHOPIFY_STORE_URL = 'https://100wrestlingpodcast.myshopify.com';

export function getProductUrl(handle: string): string {
  return `${SHOPIFY_STORE_URL}/products/${handle}`;
}

export async function fetchShopifyProducts(): Promise<ShopifyProduct[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(`${SHOPIFY_STORE_URL}/products.json?limit=250`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Shopify API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      return data.products as ShopifyProduct[];
    }
  } catch (error) {
    console.warn('Could not fetch dynamic products from Shopify, using verified cache:', error);
  }

  // Fallback to verified real products catalog
  return staticCatalog as unknown as ShopifyProduct[];
}
