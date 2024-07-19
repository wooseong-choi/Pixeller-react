import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { _config } from "gsap/gsap-core";

const Auction_max_bid = ({ price }) => {
  const [prevPrice, setPrevPrice] = React.useState(0);

  const [styles, api] = useSpring(() => ({
    from: { backgroundColor: "white" },
  }));

  useEffect(() => {
    if (price !== prevPrice) {
      api.start({
        to: [{ backgroundColor: "green" }, { backgroundColor: "white" }],
        _config: { duration: 300 },
      });
      setPrevPrice(price);
    }
  });

  return (
    <>
      <div className="max-bid-wrapper">
        <div className="max-bid-container">
          <div className="max-bid-data">
            <animated.div style={styles} className="max-bid-price">
              경매 최고가: {price.toLocaleString()} 원
            </animated.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction_max_bid;
