import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedBidPrice = ({ price }) => {
  const [styles, api] = useSpring(() => ({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
  }));

  useEffect(() => {
    api.start({
      from: { opacity: 0, transform: "scale(0.8)" },
      to: { opacity: 1, transform: "scale(1)" },
      config: { tension: 300, friction: 10 },
    });
  }, [price, api]);

  return (
    <animated.div style={styles} className="animated-max-bid-price">
      ₩ {price.toLocaleString()}
    </animated.div>
  );
};

export default AnimatedBidPrice;