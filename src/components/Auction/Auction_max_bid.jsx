import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { _config } from "gsap/gsap-core";
import { Display } from "phaser";

const AuctionBidEffector = ({ price }) => {
  const [prevPrice, setPrevPrice] = React.useState(0);

  const [styles, api] = useSpring(() => ({
    from: {
      backgroundColor: "white",
      Display: "inline",
    },
  }));

  useEffect(() => {
    if (price !== prevPrice) {
      api.start({
        to: [
          { backgroundColor: "grey" },
          { backgroundColor: "white", Display: "inline" },
        ],
        _config: { duration: 300 },
      });
      setPrevPrice(price);
    }
  });

  return (
    <>
      <animated.div style={styles} className="max-bid-price">
        ₩ {price.toLocaleString()}
      </animated.div>
    </>
  );
};

export default AuctionBidEffector;
