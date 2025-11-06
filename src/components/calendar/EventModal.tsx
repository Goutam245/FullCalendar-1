import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEvent, DEFAULT_COLORS, CATEGORY_ICONS } from '@/types/calendar';
import { HexagonalColorPicker } from './HexagonalColorPicker';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: () => void;
  event?: CalendarEvent;
  defaultStart?: Date;
  defaultEnd?: Date;
}

export function EventModal({
  open,
  onClose,
  onSave,
  onDelete,
  event,
  defaultStart,
  defaultEnd,
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStart(formatDateTimeLocal(event.start));
      setEnd(formatDateTimeLocal(event.end));
      setColor(event.color);
      setCategory(event.category || '');
      setImageUrl(event.imageUrl || '');
    } else if (defaultStart && defaultEnd) {
      setTitle('');
      setStart(formatDateTimeLocal(defaultStart));
      setEnd(formatDateTimeLocal(defaultEnd));
      setColor(DEFAULT_COLORS[0]);
      setCategory('');
      setImageUrl('');
    }
  }, [event, defaultStart, defaultEnd]);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSave = () => {
    const newEvent: CalendarEvent = {
      id: event?.id,
      title,
      start: new Date(start),
      end: new Date(end),
      color,
      category: category || undefined,
      imageUrl: imageUrl || undefined,
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'New Event'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {CATEGORY_ICONS.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <Label>Event Color</Label>
            <Tabs defaultValue="default" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="default">Default Colors</TabsTrigger>
                <TabsTrigger value="picker">Color Picker</TabsTrigger>
              </TabsList>

              <TabsContent value="default" className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className="w-10 h-10 rounded border-2 hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: c,
                        borderColor: color === c ? '#000' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="picker">
                <HexagonalColorPicker onColorSelect={setColor} selectedColor={color} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {event && onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={!title || !start || !end}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
