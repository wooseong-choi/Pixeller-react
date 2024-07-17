import ReactDOM from 'react-dom/client'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Alert({stompClient}){
    const showSwal = () => {
        let timerInterval;
        Swal.fire({
        title: "Auto close alert!",
        html: "I will close in <b></b> milliseconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
            timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
        });
    }
    // showSwal();
    return (
        <>

        </>
    )

}

export default Alert;