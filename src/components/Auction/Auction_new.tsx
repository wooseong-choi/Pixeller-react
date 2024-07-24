import "./Auction.css";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { io } from "socket.io-client";
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";

// 컴포넌트
import ProductDetailNew from "../Boards/ProductDetailNew";
import AudioComponent from "../OpenVidu/AudioComponent.tsx";
import VideoComponent from "../OpenVidu/VideoComponent.tsx";
import useSpeechRecognition from "./useSpeechRecognition.js";
import { analyzeBid, convertToWon } from "./bidAnalyzer.js";
import AuctionBidEffector from "./Auction_max_bid.jsx";
import AnimatedBidPrice from "./Auction_BidPrice_Animated.jsx";
import Tooltip from "../Tooltip.jsx";

// AXIOS API 콜
import { getProductById, checkSellerTrueOrFalse } from "../../api/products.jsx";

// 캔버스 컨페티
import confetti from "canvas-confetti";
import CircularProgressBar from "../UI/CircularProgressBar.jsx";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type AuctionSellerProps = {
  userName: string;
  isSeller: boolean;
  auctionRoomId: string;
  auctionPrice: number;
  handleClose: () => void;
  AuctionRoom: Room | undefined;
  setAuctionRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
};

export type VideoCanvasHandle = {
  leaveRoom: () => void;
};

let APPLICATION_SERVER_URL = "https://openvidu-token.pixeller.net/"; // The URL of your application server
let LIVEKIT_URL = "https://openvidu.pixeller.net/"; // The URL of your LiveKit server

/**
 * <<MAIN>> 함수형 컴포넌트
 * @param param0
 * @returns
 */
const Auction_new = forwardRef<VideoCanvasHandle, AuctionSellerProps>(
  (props, ref) => {
    // init data
    const [isSeller, setIsSeller] = useState(props.isSeller);
    const [joinReady, setJoinReady] = useState(false);
    // const URL = "ws://localhost:3333/auction";
    const URL = "//api.pixeller.net/auction";
    const token = sessionStorage.getItem("user");
    const username = props.userName;
    const productId = props.auctionRoomId;

    useEffect(() => {
      if (productId === "" || productId === undefined || productId === null) {
        alert("상품 정보가 없습니다.");
        return;
      }
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const bidSound = new Audio("/sounds/bidding_sound.wav");
    const bidSound = new Audio("/sounds/bidding_sound.mp3");
    const congratulation = new Audio("/sounds/congratulation.mp3");

    // 경매 관련
    const [AuctionStatusText, setAuctionStatusText] = useState("경매 시작");
    const [isAuctionStarted, setIsAuctionStarted] = useState(false);
    const [everAuctionStarted, setEverAuctionStarted] = useState(false);
    const initialPrice = props.auctionPrice; // 초기 경매 시작 가격
    const [winner, setWinner] = useState(""); // 낙찰자
    const [bidder, setBidder] = useState(""); // 입찰자
    const [bidPrice, setBidPrice] = useState(initialPrice); // 현재 입찰가
    const [maxBidPrice, setMaxBidPrice] = useState(initialPrice); // 최고 입찰가
    const [syschat, setSyschat] = useState(""); // 시스템 채팅

    // 상품 관련
    const [product, setProduct] = useState({
      name: "",
      price: "",
      description: "",
      fileImage: [],
      seller: "",
    });

    // bid analyzer
    const {
      listening,
      lastResult,
      confidence,
      currentPrice,
      handleStart,
      handleStop,
      resetTranscript,
      resetPrice,
      browserSupportsSpeechRecognition,
    } = useSpeechRecognition(initialPrice);
    const [bidAid, setBidAid] = useState(false);

    // 시스템 채팅
    const sysChatEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
      sysChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // socket 관련
    const socketRef = useRef<any>();

    //////////////////////////
    // 선언된 변수들 정의 끝 //
    /////////////////////////

    const calculateOpacity = (index) => {
      return 1 - (index / syschat.length) * 0.5;
    };

    useEffect(() => {
      scrollToBottom();
    }, [syschat]);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    // 경매 종료 시 낙찰자를 축하하는 함수
    const handleConfetti = () => {
      confetti({
        particleCount: 1000,
        spread: 360,
        origin: { y: 0.6 },
        zIndex: 1003,
      });

      congratulation
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    };

    const [showPriceAnimation, setShowPriceAnimation] = useState(false);

    // 입찰 효과 함수
    const triggerCoinConfetti = () => {
      const defaults = {
        spread: 360,
        ticks: 70,
        gravity: 3,
        decay: 0.97,
        startVelocity: 20,
        zIndex: 1003,
        shapes: ["circle"],
        colors: ["#FFD700", "#FFDF00", "#F0E68C"],
        origin: { x: 0.5, y: 0.3 },
      };

      confetti({
        ...defaults,
        particleCount: 80,
        scalar: 2,
        shapes: ["circle"],
      });

      confetti({
        ...defaults,
        particleCount: 80,
        scalar: 2,
        shapes: ["circle"],
      });

      confetti({
        ...defaults,
        particleCount: 80,
        scalar: 3,
        shapes: ["circle"],
      });

      setShowPriceAnimation(true);
      setTimeout(() => setShowPriceAnimation(false), 1000);
    };

    const handleInputChange = (event) => {
      const inputValue = event.target.value;
      // Replace all non-numeric characters except for the first decimal point
      const numericValue = Number(inputValue.replace(/[^0-9.]/g, ""));
      // event.target.value = numericValue;
      setBidPrice(numericValue);
    };

    const bidding = (price) => {
      socketRef.current.emit("bid", {
        room: props.auctionRoomId,
        bid_price: price,
        username: username,
        product_id: productId,
        bid_time: new Date().toISOString(),
      });

      triggerCoinConfetti();
      bidSound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    };

    const handleBid = (event) => {
      if (isAuctionStarted && bidPrice > maxBidPrice) {
        bidding(bidPrice);
      }
      // && !isSeller) // <= 로직 정리 후에 다시 삽입.
    };
    const handleMinBid = (event) => {
      if (isAuctionStarted) {
        setBidPrice(maxBidPrice + 500);
        bidding(maxBidPrice + 500);
      }
    };
    const handleMinBidTimes = (event) => {
      if (isAuctionStarted) {
        setBidPrice(maxBidPrice + 1000);
        bidding(maxBidPrice + 1000);
      }
    };

    // *** 경매 타이머 이벤트 ***
    const [countDown, setCountDown] = useState(10);

    // function updateNumber(timer): void {
    //   if (countDown > 0) {
    //     setCountDown((prev) => prev - 1);
    //   } else {
    //     clearInterval(timer);
    //   }
    // }

    // OpenVidu 토큰 요청 정보
    const roomName = props.auctionRoomId + "auction";
    // const participantName = isSeller ? "seller-" + username : username!;
    const [participantName, setParticipantName] = useState(username);

    // OpenVidu token 세션 접속 정보
    const [room, setRoom] = useState<Room | undefined>(undefined); // Room 객체 화상 회의에 대한 정보
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
      undefined
    ); // LocalVideoTrack 객체는 로컬 사용자의 비디오 트랙을 나타냄
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // TrackInfo 객체는 화상 회의에 참가하는 다른 사용자의 비디오 트랙을 나타냄
    const [sellerCam, setSellerCam] = useState<TrackInfo[]>([]); // 판매자 화상 데이터

    useImperativeHandle(ref, () => ({
      leaveRoom,
      micController,
      camController,
    }));

    // 경매 화상 참여
    const join = async () => {
      await joinRoom();
    };

    useEffect(() => {
      console.log("변경이 감지되었습니다. joinReady: ", joinReady);
      if (joinReady) {
        console.log("join ready, joining room");
        join();
      }
    }, [joinReady]);

    useEffect(() => {
      getProductById(productId).then((res) => {
        setProduct({
          name: res.name,
          price: res.price,
          description: res.description,
          fileImage: res.imageFileUrls,
          seller: res.memberDto.id,
        });
      });

      socketRef.current = io(URL, {
        // autoConnect: false,
        transportOptions: {
          polling: {
            extraHeaders: {
              Authentication: "Bearer " + token,
            },
          },
          auth: {
            token: token,
          },
        },
      });

      socketRef.current.emit("join", {
        username: username,
        room: props.auctionRoomId,
      });

      socketRef.current.on("connect", () => {
        console.log("DEBUG: Connected to AUCTION server");
      });

      socketRef.current.on("disconnect", () => {
        socketRef.current.emit("leave", { username: username });
        console.log("Disconnected from server");
      });

      socketRef.current.on("message", (data) => {
        // console.log(data);
        setSyschat((prev) => {
          return prev + data.message + "\n";
        });

        switch (data.type) {
          case "bid":
            setMaxBidPrice(data.bid_price);
            setBidder(data.username);
            // setCountDown(10);
            triggerCoinConfetti();
            bidSound
              .play()
              .catch((error) => console.error("Error playing sound:", error));
            break;
          // case "countdown":
          //   break;
          // case "message":
          //   break;
          // case "leave":
          //   break;
          case "join":
            if (data.done) {
              setAuctionStatusText("경매 종료");
              setIsAuctionStarted(false);
              setEverAuctionStarted(true);
            } else if (data.started) {
              setAuctionStatusText("경매 중");
              setIsAuctionStarted(true);
              setEverAuctionStarted(true);
            }
            break;
          case "start":
            setAuctionStatusText("경매 중");
            setIsAuctionStarted(true);
            setEverAuctionStarted(true);
            break;
          case "end":
            setAuctionStatusText("경매 종료");
            setIsAuctionStarted(false);
            setWinner(data.winner);
            setEndText(
              `축하합니다! ${data.winner}님이 ${data.bid_price}원에 낙찰받으셨습니다!`
            );
            setIsEnd(true);
            handleConfetti();
            setTimeout(() => {
              setIsEnd(false);
              setEndText("");
            }, 5000);
            break;
          default:
            break;
        }
      });

      checkSellerTrueOrFalse(username, productId).then((res) => {
        if (res) {
          setIsSeller(true);
          setParticipantName("seller-" + username);
          console.log("판매자입니다.");
        } else {
          setIsSeller(false);
          console.log("구매자입니다.");
        }
        setJoinReady(true);
      });

      return () => {
        socketRef.current.disconnect();
        leaveRoom();
        socketRef.current.emit("leave", { username: username });
        // room?.disconnect();
        // props.AuctionRoom?.disconnect();
      };
    }, []);

    useEffect(() => {
      bidPrice !== currentPrice && setBidPrice(currentPrice);
    }, [currentPrice]);

    async function joinRoom() {
      const room = new Room();
      props.setAuctionRoom(room);
      console.log("roomName: ", roomName);
      console.log("username: ", username);
      console.log("room : ", room);
      // setRoom(room);

      room.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          if (participant.identity.split("-")[0] === "seller") {
            setSellerCam((prev) => [
              ...prev,
              {
                trackPublication: publication,
                participantIdentity: participant.identity,
              },
            ]);
          } else {
            setRemoteTracks((prev) => [
              ...prev,
              {
                trackPublication: publication,
                participantIdentity: participant.identity,
              },
            ]);
          }
        }
      );

      room.on(
        RoomEvent.TrackUnsubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          if (participant.identity.split("-")[0] === "seller") {
            setSellerCam([]);
          }
          setRemoteTracks((prev) =>
            prev.filter(
              (track) =>
                track.trackPublication.trackSid !== publication.trackSid
            )
          );
        }
      );

      try {
        const token = await getToken(roomName, participantName);

        await room.connect(LIVEKIT_URL, token);
        console.log("connected room: ", room);

        await room.localParticipant.enableCameraAndMicrophone();

        setLocalTrack(
          room.localParticipant.videoTrackPublications.values().next().value
            .videoTrack
        );
      } catch (error) {
        console.log(
          "There was an error connecting to the room: ",
          (error as Error).message
        );
        await leaveRoom();
      }
    }

    async function micController(isMicOpen: boolean) {
      if (props.AuctionRoom) {
        props.AuctionRoom.localParticipant.setMicrophoneEnabled(isMicOpen);
      }
    }

    async function camController(isCamOpen: boolean) {
      if (props.AuctionRoom) {
        props.AuctionRoom.localParticipant.setCameraEnabled(isCamOpen);
      }
    }

    async function leaveRoom() {
      // Leave the room by calling 'disconnect' method over the Room object
      // await room?.disconnect();
      await props.AuctionRoom?.disconnect();

      // Reset the state
      // setRoom(undefined);
      props.setAuctionRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
    }

    async function getToken(roomName: string, participantName: string) {
      const response = await fetch(APPLICATION_SERVER_URL + "token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: roomName,
          participantName: participantName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get token: ${error.errorMessage}`);
      }

      const data = await response.json();
      return data.token;
    }

    const startAuction = async (e) => {
      e.preventDefault();

      if (isSeller) {
        if (everAuctionStarted && !isAuctionStarted) {
          alert("이미 경매가 완료되었습니다.");
        } else if (isAuctionStarted === false && everAuctionStarted === false) {
          socketRef.current.emit("start", {
            room: props.auctionRoomId,
            init_price: initialPrice,
          });
          setAuctionStatusText("경매 중");
        } else {
          setAuctionStatusText("경매 종료");
        }
      }

      // if (isSeller) {
      //   // 경매 시작 로직 작성
      //   if (everAuctionStarted && !isAuctionStarted) {
      //     alert("이미 경매가 완료되었습니다.");
      //   } else if (isAuctionStarted === false && everAuctionStarted === false) {
      //     setAuctionStatusText("경매 중");
      //     setIsAuctionStarted(true);
      //     setEverAuctionStarted(true);

      //     await joinRoom();
      //     socketRef.current.emit("start", {
      //       room: props.auctionRoomId,
      //       init_price: initialPrice,
      //     });

      //     // 경매 종료 로직 작성
      //   } else if (isAuctionStarted === true && everAuctionStarted === true) {
      //     setAuctionStatusText("경매 종료");
      //     setIsAuctionStarted(false);

      //     await leaveRoom();

      //     // 여기에 openvidu 세션 강제 종료 로직을 넣을 수 있으면 넣을 것.
      //   }
      // } else {
      //   if (everAuctionStarted && !isAuctionStarted) {
      //     alert("이미 경매가 완료되었습니다.");
      //   } else if (isAuctionStarted && AuctionStatusText === "경매 중") {

      //   }
      //   if (isAuctionStarted) {
      //     joinRoom();
      //     handleStart();
      //     setEverAuctionStarted(true);
      //     setAuctionStatusText("경매 중");
      //   } else if (isAuctionStarted && everAuctionStarted) {
      //     handleStop();
      //     leaveRoom();
      //     setIsAuctionStarted(false);
      //     setAuctionStatusText("경매 종료");
      //     // alert("경매가 시작되지 않았습니다.");
      //   }
      // }
    };

    // 금액을 올바른 형식으로 표시하는 함수
    const formatAmount = (amount) => {
      const wonAmount =
        typeof amount === "number" ? amount : convertToWon(amount);
      return wonAmount.toLocaleString() + "원";
    };

    const bidAnalysis = analyzeBid(lastResult);
    const [isEnd, setIsEnd] = useState(false);
    const [endText, setEndText] = useState("");

    if (!browserSupportsSpeechRecognition) {
      return <span>크롬을 사용해 주세요</span>;
    }

    return (
      <>
        <div className="auction-new-background">
          <div className={isEnd ? "auction-winner-alert" : ""}>
            <div className="auction-winner-text">
              <p>{endText}</p>
            </div>
          </div>
          <div
            className={`auction-new-modal ${
              isMenuOpen ? "modal-expanded" : ""
            }`}
          >
            <div
              className={`auction-new-left ${isMenuOpen ? "slide-out" : ""}`}
            >
              <div className="vertical-text">
                a<br />b<br />o<br />u<br />t<br />
                <br />
                p<br />r<br />o<br />d<br />u<br />c<br />t
              </div>
              <ProductDetailNew productData={product} />
            </div>
            <div className="auction-new-right">
              <div className="auction-new-right-top">
                <span className="seller">
                  판매자 :<p className="seller-n"> {product.seller}</p>
                </span>
                <span className="product-name">{product.name}</span>
                <span className="isAuctionInProgress" onClick={startAuction}>
                  {AuctionStatusText}
                </span>
                {isSeller && localTrack && (
                  <VideoComponent
                    track={localTrack}
                    participantId={participantName}
                    local={true}
                  />
                )}
                {!isSeller &&
                  sellerCam.map((sellerTrack) => {
                    return sellerTrack.trackPublication.kind === "video" ? (
                      <VideoComponent
                        key={sellerTrack.trackPublication.trackSid}
                        track={sellerTrack.trackPublication.videoTrack!}
                        participantId={sellerTrack.participantIdentity}
                      />
                    ) : (
                      <AudioComponent
                        key={sellerTrack.trackPublication.trackSid}
                        track={sellerTrack.trackPublication.audioTrack!}
                      />
                    );
                  })}
                <div className="syschat">
                  {syschat.split("\n").map((line, index) => {
                    return <p key={index}>{line}</p>;
                  })}
                  <div ref={sysChatEndRef}></div>
                </div>
                {/* <CircularProgressBar /> */}
              </div>
              <div className="auction-new-right-bottom">
                <div className="auction-new-right-left">
                  {!isSeller &&
                    (bidder === "") !== (bidder === participantName) &&
                    localTrack && (
                      <div
                        className={`auction-buyer-video-container ${
                          username === winner ? "winner" : ""
                        } ${username === bidder ? "bidder" : ""}`}
                      >
                        <VideoComponent
                          track={localTrack}
                          participantId={participantName}
                          local={true}
                        />
                      </div>
                    )}
                  {remoteTracks.map(
                    (remoteTrack, index) =>
                      (remoteTrack.participantIdentity === bidder ||
                        remoteTrack.participantIdentity === winner) && (
                        <>
                          {remoteTrack.trackPublication.kind === "video" ? (
                            <>
                              <div
                                key={index}
                                className={`auction-buyer-video-container ${
                                  remoteTrack.participantIdentity === winner
                                    ? "winner"
                                    : ""
                                } ${
                                  remoteTrack.participantIdentity === bidder
                                    ? "bidder"
                                    : ""
                                }`}
                              >
                                <VideoComponent
                                  key={remoteTrack.trackPublication.trackSid}
                                  track={
                                    remoteTrack.trackPublication.videoTrack!
                                  }
                                  participantId={
                                    remoteTrack.participantIdentity
                                  }
                                />
                              </div>
                              <span>{remoteTrack.participantIdentity}</span>
                            </>
                          ) : // <AudioComponent
                          //   key={remoteTrack.trackPublication.trackSid}
                          //   track={remoteTrack.trackPublication.audioTrack!}
                          // />
                          null}
                        </>
                      )
                  )}
                  {remoteTracks.map((remoteTrack, index) => (
                    <>
                      {remoteTrack.trackPublication.kind === "video" ? null : (
                        <AudioComponent
                          key={remoteTrack.trackPublication.trackSid}
                          track={remoteTrack.trackPublication.audioTrack!}
                        />
                      )}
                    </>
                  ))}
                </div>
                <div className="auction-new-right-right">
                  <div className="title">
                    <h1>Price {<AnimatedBidPrice price={maxBidPrice} />}</h1>
                  </div>
                  {showPriceAnimation && (
                    <div className="price-animation-overlay">
                      <AnimatedBidPrice price={maxBidPrice} />
                    </div>
                  )}
                  <div className="voice-input">
                    <span>원하시는 가격이 맞으신가요?</span>
                    <span
                      className={"bid_mic" + (!bidAid ? " off" : "")}
                      onClick={() => {
                        if (bidAid) {
                          handleStop();
                          setBidAid(false);
                        } else {
                          handleStart();
                          setBidAid(true);
                        }
                      }}
                    >
                      <Tooltip text={"음성 인식 기능을 활용해보세요!"}>
                        <div>　　</div>
                      </Tooltip>
                    </span>
                    <input
                      className="bid_price"
                      name="bid_price"
                      type="text"
                      value={bidPrice}
                      onChange={handleInputChange}
                    />
                    <button className="bid_button" onClick={handleBid}>
                      Place Bid
                    </button>
                  </div>
                  <div className="minimun-bid">
                    <span>버튼을 눌러 경매에 참여하세요!</span>
                    <div className="bid-button-div">
                      <button className="bid-button" onClick={handleMinBid}>
                        +500
                      </button>
                      <button
                        className="bid-button"
                        onClick={handleMinBidTimes}
                      >
                        +1000
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleMenu}
                className={`toggle-product-detail ${isMenuOpen ? "open" : ""}`}
              ></button>
            </div>
            <button className="close-button" onClick={props.handleClose}>
              <img src="svg/exit.svg" />
            </button>
          </div>
        </div>
      </>
    );
  }
);
export default Auction_new;
