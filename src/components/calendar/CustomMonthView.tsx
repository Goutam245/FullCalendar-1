import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CustomMonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function CustomMonthView({ date, events, onDateClick, onEventClick }: CustomMonthViewProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = Array(startDay).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const getEventsForDate = (day: Date) => {
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

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekdays.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0" style={{ minHeight: '120px' }}>
          {week.map((day, dayIndex) => {
            if (!day) {
              return <div key={dayIndex} className="border-r last:border-r-0 bg-muted/10" />;
            }

            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === today.toDateString();

            return (
              <button
                key={dayIndex}
                onClick={() => onDateClick(day)}
                className="border-r last:border-r-0 p-2 hover:bg-accent/30 transition-colors text-left"
              >
                <div
                  className={cn(
                    'text-sm font-semibold mb-2',
                    isToday ? 'text-blue-600' : 'text-foreground'
                  )}
                >
                  {day.getDate()}
                </div>

                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {dayEvents.map((event, idx) => (
                    <button
                      key={event.id || idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="flex items-start gap-1 w-full hover:bg-accent/50 px-1 py-0.5 rounded text-xs transition-colors"
                    >
                      {/* Color dot */}
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: event.color }}
                      />
                      
                      {/* Time and title */}
                      <div className="flex-1 truncate text-left">
                        <span className="font-medium text-muted-foreground">
                          {formatTime(event.start)}
                        </span>
                        <span className="ml-1 text-foreground">{event.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
