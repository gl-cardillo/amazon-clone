import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import Swal from "sweetalert2";

export const handleRating = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i >= rating || rating === undefined) {
      stars.push(<BsStar key={i} className="text-[#FFA41C] text-xl" />);
    } else if (i < rating && rating - i < 1) {
      stars.push(<BsStarHalf key={i} className="text-[#FFA41C] text-xl" />);
    } else {
      stars.push(<BsStarFill key={i} className="text-[#FFA41C] text-xl" />);
    }
  }
  return stars;
};

export const swalStyle = {
  allowOutsideClick: false,
  backdrop: false,
};

export const handleError = (text) => {
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

export const handleSuccess = (title, refresh = false) => {
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
