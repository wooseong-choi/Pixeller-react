import "./Auction.css";
import UserInfo from "../UI/UserInfo.jsx";
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import AudioComponent from "../OpenVidu/AudioComponent.tsx";
import VideoComponent from "../OpenVidu/VideoComponent.tsx";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type VideoCanvasProps = {
  userName: string;
  auctionRoomId: string;
  isSeller: boolean;
  handleClose: () => void;
};

export type VideoCanvasHandle = {
  leaveRoom: () => void;
};

let APPLICATION_SERVER_URL = "https://openvidu-token.pixeller.net/"; // The URL of your application server
let LIVEKIT_URL = "https://openvidu.pixeller.net/"; // The URL of your LiveKit server

const Auction_OpenVidu = forwardRef<VideoCanvasHandle, VideoCanvasProps>(
  (props, ref) => {
    console.log("Auction_OpenVidu Seller On");

    const username = props.userName;
    const isSeller = props.isSeller; // 판매자 여부
    const handleClose = props.handleClose;

    // 경매 관련
    const [text, setText] = useState("경매 시작");
    const [isAuctionStarted, setIsAuctionStarted] = useState(false);
    const [everAuctionStarted, setEverAuctionStarted] = useState(false);

    // OpenVidu 토큰 요청 정보
    const [roomName, setRoomName] = useState<string>(
      props.auctionRoomId + "auction"
    ); // 화상 회의 방 이름
    const [participantName, setParticipantName] = useState<string>(username!); // 참가자 이름

    // OpenVidu token 세션 접속 정보
    const [room, setRoom] = useState<Room | undefined>(undefined); // Room 객체 화상 회의에 대한 정보
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>( // LocalVideoTrack 객체는 로컬 사용자의 비디오 트랙을 나타냄
      undefined
    );
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // TrackInfo 객체는 화상 회의에 참가하는 다른 사용자의 비디오 트랙을 나타냄

    useImperativeHandle(ref, () => ({
      leaveRoom,
      micController,
      camController,
    }));

    const join = async () => {
      await joinRoom();
    };

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
          console.log(
            "track subscribed: ",
            publication.trackSid,
            participant.identity
          );
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
      if (localTrack) {
        if (localTrack.isMuted && !isMicOpen) {
          localTrack.unmute();
        } else if (!localTrack.isMuted && isMicOpen) {
          localTrack.mute();
        } else {
          console.log("undefined status: ", localTrack.isMuted, isMicOpen);
        }
      } else {
        console.log("localTrack is undefined");
      }
    }

    async function camController(isCamOpen: boolean) {
      if (localTrack) {
        if (localTrack.isUpstreamPaused && !isCamOpen) {
          localTrack.resumeUpstream();
        } else if (!localTrack.isUpstreamPaused && isCamOpen) {
          localTrack.pauseUpstream();
        } else {
          console.log(
            "undefined status: ",
            localTrack.isUpstreamPaused,
            isCamOpen
          );
        }
      } else {
        console.log("localTrack is undefined");
      }
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

    const startAuction = (e) => {
      e.preventDefault();

      if (isSeller) {
        if (isAuctionStarted === false && everAuctionStarted === false) {
          setText("경매 중");
          setIsAuctionStarted(true);
          setEverAuctionStarted(true);
          join();
        } else if (isAuctionStarted === true && everAuctionStarted === true) {
          setText("경매 종료");
          setIsAuctionStarted(false);
          setEverAuctionStarted(false);

          // 경매 종료 로직 작성
          //
          //

          leaveRoom();
          // 여기에 openvidu 세션 강제 종료 로직을 넣을 수 있으면 넣을 것.
        }
      }
    };

    return (
      <>
        <div className="auction-wrapper">
          <div className="auction-container">
            <div className="auction-container-left">
              <div>
                <div className="auction-product">
                  <button className="btn-auction-start" onClick={startAuction}>
                    {text}
                  </button>
                  <p className="bid-price">
                    <img src="svg/Dollar.svg" />
                    현재 가격 <span className="rtp"></span>
                  </p>
                </div>

                {localTrack && (
                  <VideoComponent
                    track={localTrack}
                    participantId={participantName}
                    local={true}
                  />
                )}
                {!localTrack && (
                  <div className="auction-seller-video-container">
                    <div className="auction-seller-video-icon"></div>
                  </div>
                )}
                {/* <div className="auction-seller-video-name"></div> */}
                <div className="auction-seller-local-userinfo">
                  <UserInfo user={username} logoutEvent={null} />
                </div>
              </div>
            </div>
            <div className="auction-container-right">
              {remoteTracks.map((remoteTrack) => (
                <div>
                  {remoteTrack.trackPublication.kind === "video" ? (
                    <div>
                      <div className="auction-buyer-video-container">
                        <VideoComponent
                          key={remoteTrack.trackPublication.trackSid}
                          track={remoteTrack.trackPublication.videoTrack!}
                          participantId={remoteTrack.participantIdentity}
                        />
                      </div>
                    </div>
                  ) : (
                    <AudioComponent
                      key={remoteTrack.trackPublication.trackSid}
                      track={remoteTrack.trackPublication.audioTrack!}
                    />
                  )}
                  <UserInfo user={username} logoutEvent={null} />
                </div>
              ))}
              {remoteTracks.length === 0 && (
                <div className="no-one-is-here">
                  <div className="auction-buyer-video-container">
                    <div className="auction-buyer-video-icon"></div>
                    <div className="auction-buyer-video-name"></div>
                  </div>
                  <UserInfo user={"waiting..."} logoutEvent={null} />
                </div>
              )}
            </div>
            <div>
              <button className="close-button" onClick={handleClose}>
                <img src="svg/exit.svg" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Auction_OpenVidu;
