import Swal, { type SweetAlertOptions } from "sweetalert2";

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
