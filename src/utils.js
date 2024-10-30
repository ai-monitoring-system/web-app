import { addDoc } from "firebase/firestore";

/**
 * Collects ICE candidates from the peer connection and stores them in a Firestore collection.
 * @param {RTCPeerConnection} pc - The peer connection instance.
 * @param {CollectionReference} candidatesCollection - Firestore collection to store the ICE candidates.
 */
export const collectIceCandidates = (pc, candidatesCollection) => {
  pc.onicecandidate = async (event) => {
    if (event.candidate) {
      try {
        await addDoc(candidatesCollection, event.candidate.toJSON());
      } catch (error) {
        console.error("Error adding ICE candidate", error);
      }
    }
  };
};

/**
 * Cleans up the peer connection, media stream, and video element resources.
 * @param {RTCPeerConnection} pc - The peer connection instance to close.
 * @param {MediaStream} stream - The media stream to stop.
 * @param {React.RefObject} videoRef - A reference to the video element to clear.
 */
export const cleanupMediaResources = (pc, stream, videoRef) => {
  if (pc) {
    pc.close();
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (videoRef && videoRef.current) {
    videoRef.current.srcObject = null;
  }
};
