import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Swal, { type SweetAlertOptions } from "sweetalert2";

export const handleRating = (rating?: number) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating === undefined || i >= rating) {
      stars.push(<BsStar key={i} className="text-[#FFA41C] text-xl" />);
    } else if (i < rating && rating - i < 1) {
      stars.push(<BsStarHalf key={i} className="text-[#FFA41C] text-xl" />);
    } else {
      stars.push(<BsStarFill key={i} className="text-[#FFA41C] text-xl" />);
    }
  }
  return stars;
};

export const swalStyle: SweetAlertOptions = {
  allowOutsideClick: false,
  backdrop: false,
};

export const handleError = (text: string) => {
  Swal.fire({
    title: "Something went wrong",
    text,
    position: "top",
    confirmButtonText: "Close",
    ...swalStyle,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
    }
  });
};

export const handleSuccess = (title: string, refresh = false) => {
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  })
    .fire({
      icon: "success",
      title,
    })
    .then((result) => {
      if (result.isConfirmed) {
        if (refresh) {
          window.location.reload();
        }
        Swal.close();
      }
    });
};
