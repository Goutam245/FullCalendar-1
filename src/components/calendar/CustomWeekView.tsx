import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CustomWeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CustomWeekView({ date, events, onDateClick, onEventClick }: CustomWeekViewProps) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === day.toDateString();
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHour}:${displayMinutes} ${ampm}`;
  };

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {weekDays.map((day, index) => {
        const dayEvents = getEventsForDay(day);
        const isToday = day.toDateString() === new Date().toDateString();

        return (
          <div key={index} className="flex border-b last:border-b-0">
            {/* Weekday label */}
            <div className="w-32 flex-shrink-0 p-4 border-r bg-muted/30">
              <div className="text-sm font-semibold text-foreground">
                {day.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div
                className={cn(
                  'text-2xl font-bold mt-1',
                  isToday ? 'text-blue-600' : 'text-foreground'
                )}
              >
                {day.getDate()}
              </div>
            </div>

            {/* Events for this day */}
            <button
              onClick={() => onDateClick(day)}
              className="flex-1 p-3 text-left hover:bg-accent/30 transition-colors min-h-[100px]"
            >
              <div className="space-y-2 max-h-[100px] overflow-y-auto">
                {dayEvents.map((event, idx) => (
                  <button
                    key={event.id || idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="flex items-start gap-2 w-full hover:bg-accent/50 p-1 rounded transition-colors"
                  >
                    {/* Color dot */}
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                      style={{ backgroundColor: event.color }}
                    />
                    
                    {/* Time and title */}
                    <div className="text-sm flex-1 text-left">
                      <span className="font-medium text-muted-foreground">
                        {formatTime(event.start)}
                      </span>
                      <span className="ml-2 text-foreground">{event.title}</span>
                    </div>
                  </button>
                ))}
                
                {dayEvents.length === 0 && (
                  <div className="text-sm text-muted-foreground italic">No events</div>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
