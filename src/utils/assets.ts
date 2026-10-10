// Asset Loader and Resolver Utility

import logoClassic from '../assets/podcast_logo.png';
import logoWhite from '../assets/logo_white.png';
import patreonLogo from '../assets/patreon_logo.png';
import aewLogo from '../assets/aew_review.png';
import rawLogo from '../assets/raw_review.png';
import ringsideBanner from '../assets/ringside_banner.png';
import smackLogo from '../assets/smack_review.png';
import summerslamLogo from '../assets/summerslam_review.png';
import aaaLogo from '../assets/aaa_review.webp';
import snmeLogo from '../assets/snme_review.webp';
import snmeSundayLogo from '../assets/snme_sunday_review.png';
import triplemaniaLogo from '../assets/triplemania_review.webp';
import worldsCollideLogo from '../assets/worlds_collide_review.webp';
import mitbLogo from '../assets/mitb_review.webp';
import survivorLogo from '../assets/survivor_review.webp';
import wrestlepaloozaLogo from '../assets/wrestlepalooza_review.png';
import wrestledreamBanner from '../assets/wrestledream_banner.png';
import fullGearBanner from '../assets/full_gear_banner.png';
import worldsEndBanner from '../assets/worlds_end_banner.png';
import holidayBashBanner from '../assets/holiday_bash_banner.png';
import guerraDeTitanesBanner from '../assets/guerra_de_titanes_banner.png';
import nordvpnLogo from '../assets/nordvpn_logo.png';
import toppsLogo from '../assets/topps_logo.png';
import ringsideLogo from '../assets/ringside_logo.png';
import fanaticsLogo from '../assets/fanatics_logo.png';
import kingTokensPromo from '../assets/king_tokens_promo.jpg';
import patreonPromoBanner from '../assets/patreon_promo_banner.png';

// Fallback images if something goes wrong
const fallbackLogo = logoClassic;

/**
 * Resolves a filename or URL string to the corresponding compiled local asset.
 */
export function resolveAsset(pathOrName: string): string {
  if (!pathOrName) return fallbackLogo;
  
  // Clean path to extract filename
  const cleanName = pathOrName.split('/').pop()?.toLowerCase() || '';

  if (cleanName.includes('white') || cleanName.includes('blanco')) {
    return logoWhite;
  }
  if (cleanName.includes('patreon_promo') || cleanName.includes('patreon-promo') || cleanName.includes('promo_banner')) {
    return patreonPromoBanner;
  }
  if (cleanName.includes('patreon')) {
    return patreonLogo;
  }
  if (cleanName.includes('raw')) {
    return rawLogo;
  }
  if (cleanName.includes('smack') || cleanName.includes('smackdown')) {
    return smackLogo;
  }
  if (cleanName.includes('aew') || cleanName.includes('dynamite')) {
    return aewLogo;
  }
  if (cleanName.includes('nordvpn') || cleanName.includes('nord')) {
    return nordvpnLogo;
  }
  if (cleanName.includes('topps')) {
    return toppsLogo;
  }
  if (cleanName.includes('ringside_logo') || cleanName.includes('ringside-logo')) {
    return ringsideLogo;
  }
  if (cleanName.includes('fanatics')) {
    return fanaticsLogo;
  }
  if (cleanName.includes('king_tokens') || cleanName.includes('tokens_promo') || cleanName.includes('king-tokens')) {
    return kingTokensPromo;
  }
  if (cleanName.includes('ringside')) {
    return ringsideBanner;
  }
  if (cleanName.includes('summerslam')) {
    return summerslamLogo;
  }
  if (cleanName.includes('triplemania')) {
    return triplemaniaLogo;
  }
  if (cleanName.includes('aaa')) {
    return aaaLogo;
  }
  if (cleanName.includes('snme_sunday') || cleanName.includes('sunday_nights') || cleanName.includes('sunday_night')) {
    return snmeSundayLogo;
  }
  if (cleanName.includes('snme') || cleanName.includes('sunday') || cleanName.includes('main_event')) {
    return snmeLogo;
  }
  if (cleanName.includes('mitb') || cleanName.includes('money')) {
    return mitbLogo;
  }
  if (cleanName.includes('survivor') || cleanName.includes('wargames')) {
    return survivorLogo;
  }
  if (cleanName.includes('wrestlepalooza') || cleanName.includes('palooza')) {
    return wrestlepaloozaLogo;
  }
  if (cleanName.includes('wrestledream')) {
    return wrestledreamBanner;
  }
  if (cleanName.includes('full_gear') || cleanName.includes('full-gear') || cleanName.includes('fullgear')) {
    return fullGearBanner;
  }
  if (cleanName.includes('worlds_end') || cleanName.includes('worlds-end') || cleanName.includes('worldsend')) {
    return worldsEndBanner;
  }
  if (cleanName.includes('holiday_bash') || cleanName.includes('holiday-bash') || cleanName.includes('holidaybash')) {
    return holidayBashBanner;
  }
  if (cleanName.includes('guerra_de_titanes') || cleanName.includes('guerra-de-titanes') || cleanName.includes('guerradetitanes')) {
    return guerraDeTitanesBanner;
  }
  if (cleanName.includes('collide') || cleanName.includes('worlds')) {
    return worldsCollideLogo;
  }
  if (cleanName.includes('classic') || cleanName.includes('logo')) {
    return logoClassic;
  }

  // If it's already an absolute URL (e.g. from Google Sheets), return it
  if (pathOrName.startsWith('http://') || pathOrName.startsWith('https://')) {
    return pathOrName;
  }

  return fallbackLogo;
}

export {
  logoClassic,
  logoWhite,
  patreonLogo,
  aewLogo,
  rawLogo,
  ringsideBanner,
  smackLogo,
  summerslamLogo,
  aaaLogo,
  snmeLogo,
  snmeSundayLogo,
  triplemaniaLogo,
  mitbLogo,
  survivorLogo,
  wrestlepaloozaLogo,
  wrestledreamBanner,
  fullGearBanner,
  worldsEndBanner,
  holidayBashBanner,
  guerraDeTitanesBanner,
  worldsCollideLogo,
  nordvpnLogo,
  toppsLogo,
  ringsideLogo,
  fanaticsLogo,
  kingTokensPromo,
  patreonPromoBanner
};
