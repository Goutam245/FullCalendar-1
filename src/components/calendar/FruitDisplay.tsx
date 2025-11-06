interface FruitDisplayProps {
  image: string;
  description?: string;
}

export function FruitDisplay({ image, description }: FruitDisplayProps) {
  const isEmoji = image.length <= 4;

  return (
    <div className="mb-4 text-center">
      {isEmoji ? (
        <div className="text-8xl mb-2">{image}</div>
      ) : (
        <img
          src={image}
          alt="Event image"
          className="w-32 h-32 mx-auto object-cover rounded-lg mb-2"
        />
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
