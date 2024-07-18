import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Alert({price}){
    const user = jwtDecode(sessionStorage.getItem('user'));
    
    const showAuctionAlert = async (price) => {
        let title = '';
        title = `입찰가가 갱신되었습니다. \n 입찰가 : ${price}`;
        
        await Swal.fire({
            title: `${title}`,
            timer: 1000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    }

    showAuctionAlert();
    return (
        <>

        </>
    )

}

export default Alert;