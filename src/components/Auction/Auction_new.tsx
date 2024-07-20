import ProductDetailNew from "../Boards/ProductDetailNew";
import "./Auction.css";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";


const Auction_new = ({handleClose,productId}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    // Replace all non-numeric characters except for the first decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    event.target.value = numericValue;
  };

  const handleBid = (event) => {
    alert('여기다 이벤트 걸어');
  };
  const handleMinBid = (event) => {
    alert('여기다 이벤트 걸어');
  };
  const handleMinBidTimes = (event) => {
    alert('여기다 이벤트 걸어');
  };

  
  
  // function updateNumber(): void {
  //   let numberElement = document.getElementById('number') as HTMLElement;
  //   let currentNumber = parseInt(numberElement.textContent || '0');
  //   if (currentNumber > 0) {
  //       currentNumber--;
  //       numberElement.textContent = currentNumber.toString();
  //   } else {
  //       clearInterval(timer);
  //   }
  // }

  // let timer = setInterval(updateNumber, 1000);

  return (
    <>
      <div className="auction-new-background"> 
        <div className={`auction-new-modal ${isMenuOpen ? 'modal-expanded' : ''}`}>
          <div className={`auction-new-left ${isMenuOpen ? 'slide-out' : ''}`}>
            <div className="vertical-text">
                a<br/>b<br/>o<br/>u<br/>t<br/><br/>
                p<br/>r<br/>o<br/>d<br/>u<br/>c<br/>t
            </div>
            <ProductDetailNew productId={productId} />
          </div>
          <div className="auction-new-right">
            <div className="auction-new-right-top">
              <span className="seller">판매자 : 
                <p className="seller-n"> Ryuu</p>
              </span>
              <span className="product-name">트랙패드</span>
              <span className="isAuctionInProgress">경매중</span>

              <div className="syschat">
                <p>[입찰 알림 🔔] 만두님이 50000원에 입찰했습니다!</p>
                <p>[입찰 알림 🔔] 민사님이 50500원에 입찰했습니다!</p>
                <p>[입찰 알림 🔔] 만두님이 51000원에 입찰했습니다!</p>
                <p>[입찰 알림 🔔] 성우님이 51500원에 입찰했습니다!</p>
                <p>[입찰 알림 🔔] 만두님이 52000원에 입찰했습니다!</p>
                <p>[경매 종료 임박 ⏳] 5</p>
                <p>[경매 종료 임박 ⏳] 4</p>
                <p>[경매 종료 임박 ⏳] 3</p>
                <p>[경매 종료 임박 ⏳] 2</p>
                <p>[경매 종료 임박 ⏳] 1</p>
                <p>[ 낙찰 선언 🎉] "축하합니다! 만두님, 52000원에 낙찰되셨습니다!"</p>
              </div>
              <div className="circle-container">
                  <div className="circle">
                      <div className="number" id="number">10</div>
                  </div>
              </div>
            </div>
            <div className="auction-new-right-bottom">
              <div className="auction-new-right-left">
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
                <div>
                  <div>
                    <img src="icon/svg/person.svg"/>
                  </div>
                  <span>만두</span>
                </div>
              </div>
              <div className="auction-new-right-right">
                <div className="title">
                  <h1>Price</h1>
                </div>
                <div className="voice-input">
                  <span>원하시는 가격이 맞으신가요?</span>
                  <span className="bid_mic" onClick={()=>{alert('작동')}}></span>
                  <input className="bid_price" name="bid_price" type="text" onChange={handleInputChange} />
                  <button className="bid_button" onClick={handleBid}>Place Bid</button>
                </div>
                <div className="minimun-bid">
                  <span>버튼을 눌러 경매에 참여하세요!</span>
                  <div className="bid-button-div">
                    <button className="bid-button" onClick={handleMinBid}>+500</button>
                    <button className="bid-button" onClick={handleMinBidTimes}>+1000</button>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={toggleMenu} className={`toggle-product-detail ${isMenuOpen ? 'open' : ''}`}>
              
            </button>
          </div>
          <button className="close-button" onClick={handleClose}>
            <img src="svg/exit.svg" />
          </button>
        </div>
      </div>
    </>
  );
}
export default Auction_new;
