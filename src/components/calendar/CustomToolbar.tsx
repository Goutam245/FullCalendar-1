import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CustomToolbarProps {
  currentDate: Date;
  view: ViewType;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewType) => void;
}

export function CustomToolbar({
  currentDate,
  view,
  onPrev,
  onNext,
  onToday,
  onViewChange,
}: CustomToolbarProps) {
  const getDateDisplay = () => {
    switch (view) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      case 'week': {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${startStr} – ${endStr}`;
      }
      case 'month':
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  const views: { value: ViewType; label: string; icon: string }[] = [
    { value: 'day', label: 'Day', icon: '📅' },
    { value: 'week', label: 'Week', icon: '📆' },
    { value: 'month', label: 'Month', icon: '🗓️' },
    { value: 'year', label: 'Year', icon: '📊' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Custom Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border rounded-lg">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onToday}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Today
          </Button>
        </div>

        <h2 className="text-xl font-bold text-green-600">{getDateDisplay()}</h2>

        <div className="flex gap-1">
          {views.map((v) => (
            <Button
              key={v.value}
              size="sm"
              variant={view === v.value ? 'default' : 'ghost'}
              onClick={() => onViewChange(v.value)}
              className={cn(view === v.value && 'bg-primary text-primary-foreground')}
            >
              <span className="mr-1">{v.icon}</span>
              {v.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
