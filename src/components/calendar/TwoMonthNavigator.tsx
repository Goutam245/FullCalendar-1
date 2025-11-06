import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwoMonthNavigatorProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (increment: number) => void;
  showWeekNumbers?: boolean;
  showWeekdayInitials?: boolean;
}

export function TwoMonthNavigator({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  showWeekNumbers = false,
  showWeekdayInitials = true,
}: TwoMonthNavigatorProps) {
  const month1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const month2 = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

  const renderMonth = (monthDate: Date, isFirst: boolean) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(startDay).fill(null);

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

    const getWeekNumber = (weekIndex: number) => {
      const firstDayOfWeek = new Date(year, month, (weekIndex * 7) - startDay + 1);
      const startOfYear = new Date(firstDayOfWeek.getFullYear(), 0, 1);
      const days = Math.floor((firstDayOfWeek.getTime() - startOfYear.getTime()) / 86400000);
      return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    };

    return (
      <div className="flex-1">
        <div className="relative mb-3">
          {isFirst && (
            <button
              onClick={() => onMonthChange(-1)}
              className="absolute -left-1 top-0 p-1 hover:bg-accent rounded"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <h3 className="text-sm font-medium text-center">{monthName}</h3>
          {!isFirst && (
            <button
              onClick={() => onMonthChange(1)}
              className="absolute -right-1 top-0 p-1 hover:bg-accent rounded"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {showWeekdayInitials && (
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekdays.map((day, i) => (
              <div key={i} className="text-xs text-center text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>
        )}

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1 mb-1">
            {showWeekNumbers && (
              <div className="text-xs text-muted-foreground w-5 flex items-center justify-center">
                {getWeekNumber(weekIndex)}
              </div>
            )}
            <div className="grid grid-cols-7 gap-1 flex-1">
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <div key={dayIndex} className="w-7 h-7" />;
                }

                const date = new Date(year, month, day);
                const isSelected =
                  date.toDateString() === selectedDate.toDateString();

                return (
                  <button
                    key={dayIndex}
                    onClick={() => onDateSelect(date)}
                    className={cn(
                      'w-7 h-7 text-xs flex items-center justify-center rounded hover:bg-accent transition-colors',
                      isSelected && 'bg-blue-200 text-blue-900 font-semibold'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-card border rounded-lg">
      <div className="flex gap-6">
        {renderMonth(month1, true)}
        {renderMonth(month2, false)}
      </div>
    </div>
  );
}
