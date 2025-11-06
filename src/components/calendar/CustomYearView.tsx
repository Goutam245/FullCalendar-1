import { cn } from '@/lib/utils';

interface CustomYearViewProps {
  year: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CustomYearView({ year, selectedDate, onDateSelect }: CustomYearViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => i);

  const renderMonth = (monthIndex: number) => {
    const monthDate = new Date(year, monthIndex, 1);
    const firstDay = monthDate.getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
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

    return (
      <div className="p-3 bg-card rounded-lg">
        <h3 className="text-xs font-semibold text-center mb-2">{monthName}</h3>
        
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekdays.map((day, i) => (
            <div key={i} className="text-[10px] text-center text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-0.5 mb-0.5">
            {week.map((day, dayIndex) => {
              if (day === null) {
                return <div key={dayIndex} className="w-5 h-5" />;
              }

              const date = new Date(year, monthIndex, day);
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={dayIndex}
                  onClick={() => onDateSelect(date)}
                  className={cn(
                    'w-5 h-5 text-[10px] flex items-center justify-center rounded hover:bg-accent transition-colors',
                    isSelected && 'bg-blue-200 text-blue-900 font-semibold',
                    isToday && !isSelected && 'bg-accent font-semibold'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4 border rounded-lg bg-background">
      {months.map((monthIndex) => (
        <div key={monthIndex}>
          {renderMonth(monthIndex)}
        </div>
      ))}
    </div>
  );
}
