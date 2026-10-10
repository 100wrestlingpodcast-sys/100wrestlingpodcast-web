import type { CalendarEvent, ProgramType, EventType, EventStatus } from '../types/calendar';
import { parseEventDateTime } from '../utils/dates';

const CACHE_KEY = 'wrestling_calendar_verified_v2';
const CACHE_TIME_KEY = 'wrestling_calendar_verified_v2_time';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Gets the date string of the Sunday of the current week in Chicago timezone.
 * E.g., if today is Sunday, Aug 9, 2026, it returns "2026-08-09".
 */
export function getChicagoSundayStr(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    if (year && month && day) {
      const chicagoDate = new Date(`${year}-${month}-${day}T12:00:00`);
      const dayOfWeek = chicagoDate.getDay(); // 0 is Sunday
      chicagoDate.setDate(chicagoDate.getDate() - dayOfWeek);
      const y = chicagoDate.getFullYear();
      const m = String(chicagoDate.getMonth() + 1).padStart(2, '0');
      const d = String(chicagoDate.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  } catch (e) {}
  
  // Fallback to local system time
  const today = new Date();
  const day = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);
  return `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
}

/**
 * Standard State-Machine CSV Parser
 */
function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(cell.trim());
      if (row.length > 0 && row.some(c => c !== '')) {
        lines.push(row);
      }
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell.trim());
    lines.push(row);
  }

  return lines;
}

/**
 * Maps CSV Rows to CalendarEvent interface
 */
function mapRowsToEvents(rows: string[][]): CalendarEvent[] {
  if (rows.length < 2) return [];
  
  const headers = rows[0].map(h => h.toLowerCase().trim());
  const events: CalendarEvent[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < headers.length) continue;

    const getVal = (colName: string): string => {
      const idx = headers.indexOf(colName.toLowerCase());
      return idx !== -1 && row[idx] !== undefined ? row[idx] : '';
    };

    const getBool = (colName: string): boolean => {
      const val = getVal(colName).toUpperCase();
      return val === 'TRUE' || val === '1' || val === 'YES';
    };

    const getNum = (colName: string): number => {
      const val = parseFloat(getVal(colName));
      return isNaN(val) ? 0 : val;
    };

    events.push({
      id: getVal('id') || `event-${i}`,
      title: getVal('title') || 'Programa sin título',
      title_es: getVal('title_es'),
      title_en: getVal('title_en'),
      description_es: getVal('description_es'),
      description_en: getVal('description_en'),
      program_type: (getVal('program_type').toLowerCase() || 'special') as ProgramType,
      event_type: (getVal('event_type').toLowerCase() || 'special') as EventType,
      date: getVal('date'),
      start_time: getVal('start_time') || '20:00',
      timezone: getVal('timezone') || 'America/Chicago',
      description: getVal('description'),
      logo_url: getVal('logo_url'),
      banner_url: getVal('banner_url'),
      youtube_url: getVal('youtube_url') && !getVal('youtube_url').includes('mock') 
        ? getVal('youtube_url') 
        : 'https://www.youtube.com/@100wrestlingpodcast',
      patreon_url: getVal('patreon_url'),
      status: (getVal('status').toLowerCase() || 'upcoming') as EventStatus,
      featured: getBool('featured'),
      visible: getBool('visible'),
      display_order: getNum('display_order')
    });
  }

  return events;
}

/**
 * Fetches, filters and caches calendar events from Google Sheets CSV URL.
 * Never invent broadcasts when the configured source is unavailable.
 */
export async function fetchCalendarEvents(forceRefresh = false): Promise<CalendarEvent[]> {
  const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_CALENDAR_URL;

  // 1. Check cache first
  if (!forceRefresh) {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    const cachedTime = sessionStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cachedData && cachedTime && now - parseInt(cachedTime) < CACHE_DURATION_MS) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        // Cache parse error, proceed to fetch
      }
    }
  }

  // Helper to parse and process CSV text
  const processCSV = (csvText: string): CalendarEvent[] => {
    const rows = parseCSV(csvText);
    const allEvents = mapRowsToEvents(rows);
    const sundayStr = getChicagoSundayStr();

    return allEvents
      .filter(event => event.visible && event.date >= sundayStr)
      .map(event => {
        let updatedEvent = { ...event };
        
        // Generate bilingual descriptions for weekly shows dynamically
        if (updatedEvent.event_type === 'weekly') {
          const baseDescEs = "Episodio de 100% Wrestling Podcast con un review directo y sin filtros. Analizamos lo bueno y lo malo como solamente 100% Wrestling sabe hacerlo.";
          const baseDescEn = "An episode of 100% Wrestling Podcast with a direct and unfiltered review. We analyze the good and the bad just like only 100% Wrestling knows how to do.";
          
          if (!updatedEvent.title_es && !updatedEvent.title) {
            if (updatedEvent.program_type === 'raw') {
              updatedEvent.title_es = "WWE RAW Review";
              updatedEvent.title_en = "WWE RAW Review";
            } else if (updatedEvent.program_type === 'smackdown') {
              updatedEvent.title_es = "WWE SmackDown Review";
              updatedEvent.title_en = "WWE SmackDown Review";
            } else if (updatedEvent.program_type === 'dynamite') {
              updatedEvent.title_es = "AEW Dynamite Review";
              updatedEvent.title_en = "AEW Dynamite Review";
            }
          }

          if (!updatedEvent.description_es && !updatedEvent.description) {
            if (updatedEvent.program_type === 'raw') {
              updatedEvent.description_es = `${baseDescEs} Con DrLuchaLibre, El Wiseman y JB Open Mic.`;
              updatedEvent.description_en = `${baseDescEn} Featuring DrLuchaLibre, El Wiseman and JB Open Mic.`;
            } else if (updatedEvent.program_type === 'smackdown') {
              updatedEvent.description_es = `${baseDescEs} Con Mr. Tokens, Barbudo y El Wiseman.`;
              updatedEvent.description_en = `${baseDescEn} Featuring Mr. Tokens, Barbudo and El Wiseman.`;
            } else if (updatedEvent.program_type === 'dynamite') {
              updatedEvent.description_es = `${baseDescEs} Con DrLuchaLibre y El Wiseman.`;
              updatedEvent.description_en = `${baseDescEn} Featuring DrLuchaLibre and El Wiseman.`;
            } else {
              updatedEvent.description_es = baseDescEs;
              updatedEvent.description_en = baseDescEn;
            }
          }
          
          // Set dynamic title and description fallback
          if (!updatedEvent.title_es) updatedEvent.title_es = updatedEvent.title;
          if (!updatedEvent.title_en) updatedEvent.title_en = updatedEvent.title;
          if (!updatedEvent.description_es) updatedEvent.description_es = updatedEvent.description;
          if (!updatedEvent.description_en) updatedEvent.description_en = updatedEvent.description;
        }
        
        const dateObj = new Date(updatedEvent.date + 'T12:00:00');
        const dayOfWeek = dateObj.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isSpecial = updatedEvent.event_type === 'ple' || updatedEvent.event_type === 'special' || updatedEvent.program_type === 'special';
        if (!isWeekend && !isSpecial) {
          updatedEvent.patreon_url = "";
        }

        return updatedEvent;
      })
      .sort((a, b) => {
        const dateA = parseEventDateTime(a.date, a.start_time, a.timezone);
        const dateB = parseEventDateTime(b.date, b.start_time, b.timezone);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // 2. Fetch from Google Sheets URL if configured
  if (sheetUrl && sheetUrl.trim() !== '') {
    try {
      const response = await fetch(sheetUrl);
      if (response.ok) {
        const csvText = await response.text();
        const visibleEvents = processCSV(csvText);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(visibleEvents));
        sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        return visibleEvents;
      }
    } catch {
      // Fall through to fallback
    }
  }

  // 3. Fallback to /calendar_events.csv if Google Sheet is unconfigured or offline
  try {
    const fallbackRes = await fetch('/calendar_events.csv');
    if (fallbackRes.ok) {
      const csvText = await fallbackRes.text();
      const visibleEvents = processCSV(csvText);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(visibleEvents));
      sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      return visibleEvents;
    }
  } catch (error) {
    throw new Error('Calendar source is unavailable', { cause: error });
  }

  throw new Error('Calendar source is unavailable');
}
