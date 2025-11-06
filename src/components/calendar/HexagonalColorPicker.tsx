import { useState, useRef, useEffect } from 'react';

interface HexagonalColorPickerProps {
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

export function HexagonalColorPicker({ onColorSelect, selectedColor }: HexagonalColorPickerProps) {
  const [hoveredColor, setHoveredColor] = useState<string>(selectedColor || '#00ff00');
  const [shades, setShades] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedColor) {
      generateShades(selectedColor);
    }
  }, [selectedColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    // Draw hexagonal color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      for (let r = 0; r <= radius; r += 1) {
        const x = centerX + r * Math.cos((angle * Math.PI) / 180);
        const y = centerY + r * Math.sin((angle * Math.PI) / 180);
        
        const saturation = (r / radius) * 100;
        const lightness = 50;
        const color = `hsl(${angle}, ${saturation}%, ${lightness}%)`;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    setHoveredColor(color);
    generateShades(color);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    
    setHoveredColor(color);
  };

  const generateShades = (baseColor: string) => {
    const shadeVariations: string[] = [];
    const percentages = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    percentages.forEach(percent => {
      const factor = percent / 50;
      const newR = Math.round(r * factor);
      const newG = Math.round(g * factor);
      const newB = Math.round(b * factor);
      
      const shade = `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
      shadeVariations.push(shade);
    });

    setShades(shadeVariations);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        className="mx-auto cursor-crosshair rounded-lg"
      />

      <div className="h-12 rounded" style={{ backgroundColor: hoveredColor }} />
      
      <div className="text-center font-mono text-sm">{hoveredColor.toUpperCase()}</div>

      {shades.length > 0 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {shades.map((shade, index) => (
            <button
              key={index}
              onClick={() => onColorSelect(shade)}
              className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: shade }}
              title={shade}
            />
          ))}
        </div>
      )}
    </div>
  );
}
