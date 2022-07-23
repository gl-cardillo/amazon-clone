import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

export const handleRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i >= rating) {
      stars.push(<BsStar key={i} className="text-[#f0a04b] text-xl" />);
    } else if (i < rating && rating - i < 1) {
      stars.push(<BsStarHalf key={i} className="text-[#f0a04b] text-xl" />);
    } else {
      stars.push(<BsStarFill key={i} className="text-[#f0a04b] text-xl" />);
    }
  }
  return stars;
};
