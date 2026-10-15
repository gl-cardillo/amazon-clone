import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Swal, { type SweetAlertOptions } from "sweetalert2";

export const handleRating = (rating?: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating === undefined || i >= rating) {
      stars.push(<BsStar key={i} className="text-xl text-[#FFA41C]" />);
    } else if (i < rating && rating - i < 1) {
      stars.push(<BsStarHalf key={i} className="text-xl text-[#FFA41C]" />);
    } else {
      stars.push(<BsStarFill key={i} className="text-xl text-[#FFA41C]" />);
    }
  }
  return stars;
};

export const swalStyle: SweetAlertOptions = {
  allowOutsideClick: false,
  backdrop: false,
};

export const handleSuccess = (title: string) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    icon: "success",
    title,
  });
};
