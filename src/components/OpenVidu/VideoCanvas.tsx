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
};

export type VideoCanvasHandle = {
  leaveRoom: () => void;
};

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
    }));

    useEffect(() => {
      const join = async () => {
        await joinRoom();
      };
      join();

      return () => {
        console.log("component unmount");
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

    return (
      <>
        <div id="room">
          <div id="room-header">
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
