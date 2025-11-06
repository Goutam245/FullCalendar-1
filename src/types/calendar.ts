export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  category?: string;
  imageUrl?: string;
  allDay?: boolean;
}

export interface CalendarSettings {
  loggedIn: boolean;
  uid: number;
  weekNumbers: boolean;
  weekdayInitials: boolean;
  dayNavigator: boolean;
  weekNavigator: boolean;
  monthNavigator: boolean;
  yearNavigator: boolean;
}

export interface FruitImage {
  id: number;
  name: string;
  image: string;
  description?: string;
  url?: string;
}

export type ViewType = 'day' | 'week' | 'month' | 'year';

export const DEFAULT_COLORS = [
  '#0066ff', // blue
  '#00ccff', // light blue
  '#008080', // teal
  '#00cc00', // green
  '#ffff00', // yellow
  '#ff9900', // orange
  '#ff66cc', // pink
  '#ff0000', // red
  '#800000', // maroon
  '#9900cc', // purple
];

export const CATEGORY_ICONS = [
  { value: 'meeting', label: 'Meeting', icon: '👥' },
  { value: 'phone', label: 'Phone Call', icon: '📞' },
  { value: 'appointment', label: 'Appointment', icon: '📅' },
  { value: 'alarm', label: 'Alarm', icon: '⏰' },
];
