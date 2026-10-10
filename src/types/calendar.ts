export type ProgramType = 'raw' | 'dynamite' | 'smackdown' | 'ple' | 'special';
export type EventType = 'weekly' | 'ple' | 'special';
export type EventStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface CalendarEvent {
  id: string;
  title: string;
  program_type: ProgramType;
  event_type: EventType;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  timezone: string; // e.g., 'America/Chicago' or 'America/New_York'
  description: string;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  logo_url: string;
  banner_url: string;
  youtube_url: string;
  patreon_url: string;
  status: EventStatus;
  featured: boolean;
  visible: boolean;
  display_order: number;
}
