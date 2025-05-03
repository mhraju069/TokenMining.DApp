import Swal from 'sweetalert2'
export default function showAlert(message,alertType) {
        Swal.fire({
          text: message,
          icon: alertType,
          buttonsStyling: true,
          confirmButtonText: 'Got it!',
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          timer: 5000
        });
      }

