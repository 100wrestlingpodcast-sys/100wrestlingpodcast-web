import type { CalendarEvent } from '../types/calendar';

/**
 * Parses a date, time, and timezone string into a local JS Date object.
 * Correctly accounts for DST and named timezones in modern browsers.
 */
export function parseEventDateTime(dateStr: string, timeStr: string, tzStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  // Create a base date in UTC
  const dateUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tzStr,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(dateUtc);
    const partValues: Record<string, string> = {};
    parts.forEach(p => partValues[p.type] = p.value);
    
    const tzYear = parseInt(partValues.year);
    const tzMonth = parseInt(partValues.month);
    const tzDay = parseInt(partValues.day);
    const tzHour = parseInt(partValues.hour);
    const tzMin = parseInt(partValues.minute);
    
    const tzDateAsUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, tzHour, tzMin);
    const diff = dateUtc.getTime() - tzDateAsUtc;
    
    return new Date(dateUtc.getTime() + diff);
  } catch (e) {
    // Fallback if timezone string is invalid or not supported
    return new Date(year, month - 1, day, hours, minutes);
  }
}

/**
 * Formats a Date into a readable date string in the active language.
 * Example: "Lunes, 3 de agosto" (Spanish) or "Monday, August 3" (English)
 */
export function formatEventDate(date: Date, locale: string = 'es-ES'): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const formatted = new Intl.DateTimeFormat(locale, options).format(date);
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formats a Date into 12-hour AM/PM format.
 */
export function formatEventTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Formats the browser's local timezone into a friendly short abbreviation.
 */
export function formatLocalTimezoneAbbr(date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch (e) {
    return '';
  }
}

/**
 * Formats a timezone into a friendly suffix or name.
 */
export function formatTimezoneAbbr(date: Date, tzStr: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: tzStr,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : tzStr;
  } catch (e) {
    return tzStr;
  }
}

/**
 * Generates an .ics file from a CalendarEvent and triggers a download.
 */
export function generateIcsFile(event: CalendarEvent) {
  const eventDate = parseEventDateTime(event.date, event.start_time, event.timezone);
  
  // Assume event duration is 2 hours for reviews/shows
  const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
  
  const formatDateToIcs = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStr = formatDateToIcs(eventDate);
  const endStr = formatDateToIcs(endDate);
  
  const description = event.description.replace(/\n/g, '\\n') + 
    (event.youtube_url ? `\\n\\nVer en YouTube: ${event.youtube_url}` : '') +
    (event.patreon_url ? `\\n\\nVer en Patreon: ${event.patreon_url}` : '');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//100 Wrestling Podcast//NONSGML Calendar Event//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${startStr}`,
    `DTSTAMP:${formatDateToIcs(new Date())}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:100% Wrestling - ${event.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${event.youtube_url || 'YouTube / Patreon'}`,
    `URL:${event.youtube_url || event.patreon_url || 'https://patreon.com/100wrestlingpodcast'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `100wrestling-${event.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Returns a countdown calculation object for a target date.
 */
export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function getCountdown(targetDate: Date): CountdownTime {
  const totalMs = targetDate.getTime() - Date.now();
  
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, totalMs };
}
