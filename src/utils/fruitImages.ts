import { FruitImage } from '@/types/calendar';

export const FRUIT_IMAGES: FruitImage[] = [
  { id: 1, name: 'Apple', image: '🍎', description: 'A crisp and delicious apple' },
  { id: 2, name: 'Apricot', image: '🍑', description: 'Sweet apricot fruit' },
  { id: 3, name: 'Banana', image: '🍌', description: 'A tropical favorite' },
  { id: 4, name: 'Cherry', image: '🍒', description: 'Red and juicy cherries' },
  { id: 5, name: 'Grapes', image: '🍇', description: 'Sweet purple grapes' },
  { id: 6, name: 'Kiwi', image: '🥝', description: 'Tangy green fruit' },
  { id: 7, name: 'Mango', image: '🥭', description: 'A popular variety found in the Caribbean and South American countries' },
  { id: 8, name: 'Orange', image: '🍊', description: 'Fresh citrus orange' },
  { id: 9, name: 'Pomegranate', image: '🍎', description: 'Rich in antioxidants' },
];

export function getFruitForDate(date: Date, eventImageUrl?: string): { image: string; description?: string } {
  if (eventImageUrl) {
    return { image: eventImageUrl };
  }

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const fruitIndex = (dayOfYear - 1) % FRUIT_IMAGES.length;
  const fruit = FRUIT_IMAGES[fruitIndex];
  
  return {
    image: fruit.image,
    description: fruit.description,
  };
}
