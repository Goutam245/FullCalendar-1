import { CalendarEvent, CATEGORY_ICONS } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CustomDayViewProps {
  date: Date;
  events: CalendarEvent[];
  onTimeSlotClick: (start: Date, end: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CustomDayView({ date, events, onTimeSlotClick, onEventClick }: CustomDayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventHour = event.start.getHours();
      const eventMinutes = event.start.getMinutes();
      const eventStartInMinutes = eventHour * 60 + eventMinutes;
      const slotStartInMinutes = hour * 60;
      const slotEndInMinutes = (hour + 1) * 60;
      
      return eventStartInMinutes >= slotStartInMinutes && eventStartInMinutes < slotEndInMinutes;
    });
  };

  const formatTime = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  const getDuration = (event: CalendarEvent) => {
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    return Math.max(duration, 30);
  };

  const getCategoryIcon = (categoryValue?: string) => {
    const category = CATEGORY_ICONS.find(c => c.value === categoryValue);
    return category?.icon || null;
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        {hours.map((hour) => {
          const slotEvents = getEventsForHour(hour);
          
          return (
            <div key={hour} className="flex border-b hover:bg-accent/50 transition-colors">
              <div className="w-24 flex-shrink-0 p-3 text-sm text-muted-foreground border-r">
                {formatTime(hour)}
              </div>
              <div className="flex-1 relative min-h-[60px]">
                {/* 30-minute slots */}
                <div className="grid grid-rows-2 h-full">
                  <button
                    onClick={() => {
                      const start = new Date(date);
                      start.setHours(hour, 0, 0, 0);
                      const end = new Date(start);
                      end.setMinutes(30);
                      onTimeSlotClick(start, end);
                    }}
                    className="w-full h-full hover:bg-accent/30 border-b border-border/50 transition-colors"
                  />
                  <button
                    onClick={() => {
                      const start = new Date(date);
                      start.setHours(hour, 30, 0, 0);
                      const end = new Date(start);
                      end.setMinutes(30);
                      onTimeSlotClick(start, end);
                    }}
                    className="w-full h-full hover:bg-accent/30 transition-colors"
                  />
                </div>

                {/* Events */}
                {slotEvents.map((event, idx) => {
                  const minutes = event.start.getMinutes();
                  const topOffset = (minutes / 60) * 100;
                  const duration = getDuration(event);
                  const height = (duration / 60) * 100;
                  const categoryIcon = getCategoryIcon(event.category);

                  return (
                    <button
                      key={event.id || idx}
                      onClick={() => onEventClick(event)}
                      className="absolute left-0 right-0 mx-2 px-2 py-1 flex items-start gap-2 hover:opacity-80 transition-opacity"
                      style={{
                        top: `${topOffset}%`,
                        height: `${height}%`,
                      }}
                    >
                      {/* Vertical color bar */}
                      <div
                        className="w-1 h-full rounded flex-shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      
                      {/* Category icon (Day View only) */}
                      {categoryIcon && (
                        <span className="text-lg flex-shrink-0">{categoryIcon}</span>
                      )}
                      
                      {/* Event text */}
                      <span className="text-sm text-left font-medium text-foreground truncate">
                        {event.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
