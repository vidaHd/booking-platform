import Swal from "sweetalert2";

export const showNotification = (
  text?: string,
  type: "success" | "error" | "warning" | "info" | "question" = "success"
) => {
  Swal.fire({
    title: "",
    text,
    icon: type,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
    didOpen: (toast) => {
      const titleEl = toast.querySelector(".swal2-title");
      if (titleEl) titleEl.remove();
    },
  });
};
