import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { cn } from "../../utils/cn";

const STARS = [1, 2, 3, 4, 5];

const sizes = { sm: "text-lg", md: "text-xl" };

interface StarsProps {
  // undefined means not rated yet
  rating?: number;
  size?: keyof typeof sizes;
  className?: string;
}

// any fraction shows as a half star
export default function Stars({ rating, size = "md", className }: StarsProps) {
  const value = rating ?? 0;
  return (
    <div
      role="img"
      aria-label={
        rating === undefined
          ? "No ratings yet"
          : `${value.toFixed(1)} out of 5 stars`
      }
      className={cn("flex gap-1 text-star", sizes[size], className)}
    >
      {STARS.map((star) =>
        value >= star ? (
          <BsStarFill key={star} aria-hidden />
        ) : value > star - 1 ? (
          <BsStarHalf key={star} aria-hidden />
        ) : (
          <BsStar key={star} aria-hidden />
        ),
      )}
    </div>
  );
}

interface StarInputProps {
  value: number | null;
  onChange: (value: number) => void;
}

// one button per star, for picking a rating in a form
export function StarInput({ value, onChange }: StarInputProps) {
  return (
    <div className="flex items-center gap-3 text-xl text-star">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={value === star}
          onClick={() => onChange(star)}
        >
          {(value ?? 0) >= star ? <BsStarFill /> : <BsStar />}
        </button>
      ))}
    </div>
  );
}
