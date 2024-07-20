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
import Tooltip from "../Tooltip.jsx";

// AXIOS API 콜
import {
  getProductById,
  getProductFiles,
  checkSellerTrueOrFalse,
} from "../../api/products.jsx";

// 캔버스 컨페티
import confetti from "canvas-confetti";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type AuctionSellerProps = {
  userName: string;
  auctionRoomId: string;
  auctionPrice: number;
  isSeller: boolean;
  handleClose: () => void;
};

type Product = {
  name: string;
  price: string;
  description: string;
  fileImage: string[];
  seller: string;
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
    const username = props.userName;
    const [isSeller, setIsSeller] = useState(props.isSeller);
    const URL = "ws://localhost:3333/auction";
    // const URL = "//api.pixeller.net/auction";
    const token = sessionStorage.getItem("user");

    const productId = props.auctionRoomId;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 경매 관련
    const [AuctionStatusText, setAuctionStatusText] = useState("경매 시작");
    const [isAuctionStarted, setIsAuctionStarted] = useState(false);
    const [everAuctionStarted, setEverAuctionStarted] = useState(false);
    const initialPrice = props.auctionPrice; // 초기 경매 시작 가격
    const [winner, setWinner] = useState(""); // 낙찰자
    const [bidPrice, setBidPrice] = useState(initialPrice); // 현재 입찰가
    const [maxBidPrice, setMaxBidPrice] = useState(initialPrice); // 최고 입찰가
    const [syschat, setSyschat] = useState("");

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

    const sysChatEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
      sysChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        zIndex: 1003,
      });
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
        product_id: props.auctionRoomId,
        bid_time: new Date().toISOString(),
      });
    };

    const handleBid = (event) => {
      if (isAuctionStarted && bidPrice > maxBidPrice) {
        bidding(bidPrice);
      }
      // && !isSeller) // <= 로직 정리 후에 다시 삽입.
    };
    const handleMinBid = (event) => {
      if (isAuctionStarted) {
        setBidPrice((prev) => prev + 500);
        bidding(bidPrice + 500);
      }
    };
    const handleMinBidTimes = (event) => {
      if (isAuctionStarted) {
        setBidPrice((prev) => prev + 1000);
        bidding(bidPrice + 1000);
      }
    };

    //// *** 경매 타이머 이벤트 ***
    const [countDown, setCountDown] = useState(10);

    function updateNumber(timer): void {
      if (countDown > 0) {
        setCountDown((prev) => prev - 1);
      } else {
        clearInterval(timer);
      }
    }

    // OpenVidu 토큰 요청 정보
    const roomName = props.auctionRoomId + "auction";
    const participantName = isSeller ? "seller-" + username : username!;

    // OpenVidu token 세션 접속 정보
    const [room, setRoom] = useState<Room | undefined>(undefined); // Room 객체 화상 회의에 대한 정보
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
      undefined
    ); // LocalVideoTrack 객체는 로컬 사용자의 비디오 트랙을 나타냄
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // TrackInfo 객체는 화상 회의에 참가하는 다른 사용자의 비디오 트랙을 나타냄

    useImperativeHandle(ref, () => ({
      leaveRoom,
      micController,
      camController,
    }));

    useEffect(() => {
      // axios 날려서 현재 플레이어가 판매자인지 구매자인지 확인
      checkSellerTrueOrFalse(props.userName, props.auctionRoomId).then(
        (res) => {
          if (res) {
            setIsSeller(true);
          } else {
            setIsSeller(false);
            setAuctionStatusText("경매 전");
          }
        }
      );

      return () => {
        room?.disconnect();
      };
    }, []);

    // socket 관련
    const socketRef = useRef<any>();

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
    }, []);

    useEffect(() => {
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

      return () => {
        socketRef.current.disconnect();
      };
    }, []);

    useEffect(() => {
      bidPrice !== currentPrice && setBidPrice(currentPrice);
    }, [currentPrice]);

    useEffect(() => {
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

        switch (data.type) {
          case "bid":
            setMaxBidPrice(data.bid_price);
            setBidPrice(data.bid_price);
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            setCountDown(10);
            console.log(syschat);
            break;
          case "countdown":
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            break;
          case "message":
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            break;
          case "join":
            console.log(data.message);
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            if (data.started) {
              setAuctionStatusText("경매 중");
              setIsAuctionStarted(true);
              setEverAuctionStarted(true);
            }
            break;
          case "leave":
            console.log(data.message);
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            break;
          case "start":
            setAuctionStatusText("경매 중");
            setIsAuctionStarted(true);
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            break;
          case "end":
            setSyschat((prev) => {
              return prev + data.message + "\n";
            });
            // setEndText("52000원에 만두님이 트랙패드의 낙찰자가 되셨습니다.");
            setEndText(
              `축하합니다! ${data.winner}님이 ${data.bid_price}에 낙찰받으셨습니다!`
            );
            setIsEnd(true);
            setTimeout(() => {
              setIsEnd(false);
              setEndText("");
            }, 5000);
            handleConfetti();
            break;
          default:
            break;
        }
      });

      return () => {
        socketRef.current.emit("leave", { username: username });
        socketRef.current.disconnect();
      };
    }, []);

    async function joinRoom() {
      const room = new Room();
      setRoom(room);

      room.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant
        ) => {
          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
        }
      );

      room.on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
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
      if (room) {
        room.localParticipant.setMicrophoneEnabled(isMicOpen);
      }
      // if (localTrack) {
      //   if (localTrack.isMuted && !isMicOpen) {
      //     localTrack.unmute();
      //   } else if (!localTrack.isMuted && isMicOpen) {
      //     localTrack.mute();
      //   } else {
      //     console.log("undefined status: ", localTrack.isMuted, isMicOpen);
      //   }
      // } else {
      //   console.log("localTrack is undefined");
      // }
    }

    async function camController(isCamOpen: boolean) {
      if (room) {
        room.localParticipant.setCameraEnabled(isCamOpen);
      }
      // if (localTrack) {
      //   if (localTrack.isUpstreamPaused && !isCamOpen) {
      //     localTrack.resumeUpstream();
      //   } else if (!localTrack.isUpstreamPaused && isCamOpen) {
      //     localTrack.pauseUpstream();
      //   } else {
      //     console.log(
      //       "undefined status: ",
      //       localTrack.isUpstreamPaused,
      //       isCamOpen
      //     );
      //   }
      // } else {
      //   console.log("localTrack is undefined");
      // }
    }

    async function leaveRoom() {
      // Leave the room by calling 'disconnect' method over the Room object
      await room?.disconnect();

      // Reset the state
      setRoom(undefined);
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
        // 경매 시작 로직 작성
        if (everAuctionStarted && !isAuctionStarted) {
          alert("이미 경매가 완료되었습니다.");
        } else if (isAuctionStarted === false && everAuctionStarted === false) {
          setAuctionStatusText("경매 중");
          setIsAuctionStarted(true);
          setEverAuctionStarted(true);
          // handleStart();
          await joinRoom();
          socketRef.current.emit("start", {
            room: props.auctionRoomId,
            init_price: initialPrice,
          });

          // 경매 종료 로직 작성
        } else if (isAuctionStarted === true && everAuctionStarted === true) {
          setAuctionStatusText("경매 종료");
          setIsAuctionStarted(false);
          setEverAuctionStarted(false);

          // handleStop();
          await leaveRoom();
          // socketRef.current.emit("end", {
          //   room: props.auctionRoomId,
          //   price: currentPrice,
          // });
          // 여기에 openvidu 세션 강제 종료 로직을 넣을 수 있으면 넣을 것.
        }
      } else {
        if (isAuctionStarted && !everAuctionStarted) {
          joinRoom();
          handleStart();
          setAuctionStatusText("경매 중");
        } else if (isAuctionStarted && everAuctionStarted) {
          // 여기서 판매자 분기쳐야함.
          handleStop();
          leaveRoom();
          setAuctionStatusText("경매 종료");
          // alert("경매가 시작되지 않았습니다.");
        }
      }
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
                {/* // 여기에 판매자 영상 - 현재 우선 자신의 영상 */}
                {isSeller && localTrack && (
                  <VideoComponent
                    track={localTrack}
                    participantId={participantName}
                    local={true}
                  />
                )}
                {!isSeller &&
                  remoteTracks.map((remoteTrack) => (
                    <>
                      {remoteTrack.participantIdentity.split("-")[0] ===
                        "seller" &&
                      remoteTrack.trackPublication.kind === "video" ? (
                        <div>
                          <div
                            className={`auction-buyer-video-container ${
                              remoteTrack.participantIdentity === winner
                                ? "winner"
                                : ""
                            }`}
                          >
                            <VideoComponent
                              key={remoteTrack.trackPublication.trackSid}
                              track={remoteTrack.trackPublication.videoTrack!}
                              participantId={remoteTrack.participantIdentity}
                            />
                          </div>
                          <span>{remoteTrack.participantIdentity}</span>
                        </div>
                      ) : (
                        <AudioComponent
                          key={remoteTrack.trackPublication.trackSid}
                          track={remoteTrack.trackPublication.audioTrack!}
                        />
                      )}
                    </>
                  ))}
                <div className="syschat">
                  {syschat.split("\n").map((line, index) => {
                    return <p key={index}>{line}</p>;
                  })}
                  <div ref={sysChatEndRef}></div>
                </div>
                <div className="circle-container">
                  <div className="circle">
                    <div className="number" id="number">
                      {countDown}
                    </div>
                  </div>
                </div>
              </div>
              <div className="auction-new-right-bottom">
                <div className="auction-new-right-left">
                  {!isSeller && localTrack && (
                    <VideoComponent
                      track={localTrack}
                      participantId={participantName}
                      local={true}
                    />
                  )}
                  {remoteTracks.map((remoteTrack) => (
                    <>
                      {remoteTrack.trackPublication.kind === "video" ? (
                        <div>
                          <div
                            className={`auction-buyer-video-container ${
                              remoteTrack.participantIdentity === winner
                                ? "winner"
                                : ""
                            }`}
                          >
                            <VideoComponent
                              key={remoteTrack.trackPublication.trackSid}
                              track={remoteTrack.trackPublication.videoTrack!}
                              participantId={remoteTrack.participantIdentity}
                            />
                          </div>
                          <span>{remoteTrack.participantIdentity}</span>
                        </div>
                      ) : (
                        <AudioComponent
                          key={remoteTrack.trackPublication.trackSid}
                          track={remoteTrack.trackPublication.audioTrack!}
                        />
                      )}
                    </>
                  ))}
                  {/* <div>
                    <div>
                      <img src="icon/svg/person.svg" />
                    </div>
                    <span>만두</span>
                  </div>
                  <div>
                    <div>
                      <img src="icon/svg/person.svg" />
                    </div>
                    <span>만두</span>
                  </div>
                   */}
                </div>
                <div className="auction-new-right-right">
                  <div className="title">
                    <h1>Price {<AuctionBidEffector price={maxBidPrice} />}</h1>
                  </div>
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
