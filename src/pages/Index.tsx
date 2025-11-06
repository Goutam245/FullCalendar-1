import { useState } from 'react';
import { CalendarEvent, ViewType, CalendarSettings } from '@/types/calendar';
import { CustomToolbar } from '@/components/calendar/CustomToolbar';
import { CustomDayView } from '@/components/calendar/CustomDayView';
import { CustomWeekView } from '@/components/calendar/CustomWeekView';
import { CustomMonthView } from '@/components/calendar/CustomMonthView';
import { CustomYearView } from '@/components/calendar/CustomYearView';
import { TwoMonthNavigator } from '@/components/calendar/TwoMonthNavigator';
import { FruitDisplay } from '@/components/calendar/FruitDisplay';
import { EventModal } from '@/components/calendar/EventModal';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getFruitForDate } from '@/utils/fruitImages';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('day');
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendar-events', []);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [newEventSlot, setNewEventSlot] = useState<{ start: Date; end: Date } | null>(null);

  const [settings] = useState<CalendarSettings>({
    loggedIn: false,
    uid: 1,
    weekNumbers: false,
    weekdayInitials: true,
    dayNavigator: true,
    weekNavigator: true,
    monthNavigator: true,
    yearNavigator: true,
  });

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    if (view === 'year') {
      setView('day');
    }
  };

  const handleTimeSlotClick = (start: Date, end: Date) => {
    setNewEventSlot({ start, end });
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setNewEventSlot(null);
    setModalOpen(true);
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    if (event.id) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
      toast({
        title: 'Event updated',
        description: 'Your event has been updated successfully.',
      });
    } else {
      const newEvent = { ...event, id: Date.now().toString() };
      setEvents([...events, newEvent]);
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
    }
    setModalOpen(false);
    setNewEventSlot(null);
    setSelectedEvent(undefined);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent?.id) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
      toast({
        title: 'Event deleted',
        description: 'Your event has been deleted successfully.',
        variant: 'destructive',
      });
      setModalOpen(false);
      setSelectedEvent(undefined);
    }
  };

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  // Get the first event with an image URL for the current date
  const getCurrentEventImage = () => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === currentDate.toDateString();
    }).sort((a, b) => a.start.getTime() - b.start.getTime());

    const eventWithImage = dayEvents.find((e) => e.imageUrl);
    return eventWithImage?.imageUrl;
  };

  const fruitData = getFruitForDate(currentDate, getCurrentEventImage());

  const showNavigator = 
    (view === 'day' && settings.dayNavigator) ||
    (view === 'week' && settings.weekNavigator) ||
    (view === 'month' && settings.monthNavigator) ||
    (view === 'year' && settings.yearNavigator);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <CustomToolbar
          currentDate={currentDate}
          view={view}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onViewChange={setView}
        />

        <div className="flex gap-6">
          {/* Calendar View (Left side - 50%) */}
          <div className="flex-1">
            {view === 'day' && (
              <CustomDayView
                date={currentDate}
                events={events}
                onTimeSlotClick={handleTimeSlotClick}
                onEventClick={handleEventClick}
              />
            )}
            
            {view === 'week' && (
              <CustomWeekView
                date={currentDate}
                events={events}
                onDateClick={handleDateSelect}
                onEventClick={handleEventClick}
              />
            )}
            
            {view === 'month' && (
              <CustomMonthView
                date={currentDate}
                events={events}
                onDateClick={handleDateSelect}
                onEventClick={handleEventClick}
              />
            )}
            
            {view === 'year' && (
              <CustomYearView
                year={currentDate.getFullYear()}
                selectedDate={currentDate}
                onDateSelect={handleDateSelect}
              />
            )}
          </div>

          {/* Right sidebar - Navigator and Fruit Image */}
          {showNavigator && (
            <div className="w-[400px] space-y-4">
              <FruitDisplay image={fruitData.image} description={fruitData.description} />
              
              <TwoMonthNavigator
                currentDate={currentDate}
                selectedDate={currentDate}
                onDateSelect={handleDateSelect}
                onMonthChange={handleMonthChange}
                showWeekNumbers={settings.weekNumbers}
                showWeekdayInitials={settings.weekdayInitials}
              />
            </div>
          )}
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(undefined);
          setNewEventSlot(null);
        }}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        defaultStart={newEventSlot?.start}
        defaultEnd={newEventSlot?.end}
      />
    </div>
  );
};

export default Index;
