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
import "../../static/css/VideoComponent.css";
import AudioComponent from "./AudioComponent.tsx";
import VideoComponent from "./VideoComponent.tsx";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

type VideoCanvasProps = {
  userName: string;
  auctionRoomId: string;
  isSeller: boolean;
  setRoom: React.Dispatch<React.SetStateAction<Room | undefined>>;
  Room: Room;
};

export type VideoCanvasHandle = {
  leaveRoom: () => void;
};

// let APPLICATION_SERVER_URL = "http://localhost:6080/"; // The URL of your application server
let APPLICATION_SERVER_URL = "https://openvidu-token.pixeller.net/"; // The URL of your application server
let LIVEKIT_URL = "https://openvidu.pixeller.net/"; // The URL of your LiveKit server
configureUrls();

function configureUrls() {
  // If APPLICATION_SERVER_URL is not configured, use default value from local development
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === "localhost") {
      APPLICATION_SERVER_URL = "http://localhost:6080/";
    } else {
      APPLICATION_SERVER_URL = "http://" + window.location.hostname + ":6443/";
    }
  }

  // If LIVEKIT_URL is not configured, use default value from local development
  if (!LIVEKIT_URL) {
    if (window.location.hostname === "localhost") {
      LIVEKIT_URL = "ws://localhost:7880/";
    } else {
      LIVEKIT_URL = "wss://" + window.location.hostname + ":7443/";
    }
  }
}

const VideoCanvas = forwardRef<VideoCanvasHandle, VideoCanvasProps>(
  (props, ref) => {
    const [room, setRoom] = useState<Room | undefined>(undefined); // Room 객체 화상 회의에 대한 정보
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>( // LocalVideoTrack 객체는 로컬 사용자의 비디오 트랙을 나타냄
      undefined
    );

    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // TrackInfo 객체는 화상 회의에 참가하는 다른 사용자의 비디오 트랙을 나타냄
    const [participantName, setParticipantName] = useState<string>(
      props.userName
    ); // 참가자 이름
    const [roomName, setRoomName] = useState<string>(props.auctionRoomId); // 화상 회의 방 이름

    useImperativeHandle(ref, () => ({
      leaveRoom,
      micController,
      camController,
    }));

    useEffect(() => {
      const join = async () => {
        await joinRoom();
      };
      console.log("component mount");
      join();

      return () => {
        console.log("component unmount");
        leaveRoom();
      };
    }, []);

    async function joinRoom() {
      const room = new Room();
      props.setRoom(room);
      // setRoom(room);

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
      // if (room) {
      //   room.localParticipant.setMicrophoneEnabled(isMicOpen);
      // }
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
      // if (room) {
      //   room.localParticipant.setCameraEnabled(isCamOpen);
      // }
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
      // await room?.disconnect();
      await props.Room?.disconnect();

      // Reset the state
      // props.setRoom(undefined);
      // setRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
    }

    async function getToken(roomName: string, participantName: string) {
      const response = await fetch(APPLICATION_SERVER_URL + "token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + localStorage.getItem("token") || "",
          // "Access-Control-Allow-Origin": "*",
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

    return (
      <>
        <div id="room" className="room">
          <div id="room-header" className="room-header">
            {localTrack && (
              <VideoComponent
                track={localTrack}
                participantId={participantName}
                local={true}
              />
            )}
            {remoteTracks.map((remoteTrack) =>
              remoteTrack.trackPublication.kind === "video" ? (
                <VideoComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.videoTrack!}
                  participantId={remoteTrack.participantIdentity}
                />
              ) : (
                <AudioComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.audioTrack!}
                />
              )
            )}
          </div>
        </div>
      </>
    );
  }
);

export default VideoCanvas;
