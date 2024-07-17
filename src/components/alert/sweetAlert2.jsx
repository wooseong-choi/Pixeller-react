import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Alert({stompClient}){
    const user = jwtDecode(sessionStorage.getItem('user'));
    useEffect(() => {
        if (stompClient) {
            const subscribe = () => {
                stompClient.subscribe(`/sub/alarm/`+user.uid, (message) => {
                    console.log(JSON.parse(message.body));
                    showSwal(JSON.parse(message.body));
                });
            };
            subscribe();
        }
    }, [stompClient]);


    const showSwal = async (data) => {
        let timerInterval;
        let title = '';
        let html = '';
        if(data.type == 'auction_start'){
            title = `1분 후 ${data.productName} 상품의 경매가 시작합니다.`;
            html = '<b></b>';
        }else if (data.type == 'purchase_request'){
            title = '구매희망자가 발생했습니다!';
            html = '<b></b>';
        }
        await Swal.fire({
        title: `${title}`,
        html: `${html}`,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
            // timer.textContent = `${Swal.getTimerLeft()}`;
            }, 1000);
        },
        willClose: () => {
            clearInterval(47);
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
        });
    }
    return (
        <>

        </>
    )

}

export default Alert;