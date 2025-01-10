import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, servers } from "./config";
import { collectIceCandidates, cleanupMediaResources } from "./utils";

const Viewer = () => {
  const [callId, setCallId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const clipLength = 15;
  let mediaRecorder;
  let recordingInterval;

  const joinStream = async () => {
    if (!callId) {
      setError("Please enter a Call ID");
      return;
    }

    console.log("Initializing PeerConnection...");
    const pc = new RTCPeerConnection(servers);
    pcRef.current = pc;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    pc.ontrack = (event) => {
      console.log("ontrack event triggered:", event);
      event.streams.forEach((stream) => {
        console.log("Adding stream:", stream);
        stream.getTracks().forEach((track) => {
          console.log(`Track added: ${track.kind}`);
          remoteStream.addTrack(track);
        });
      });

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        console.log("Remote video element updated:", remoteVideoRef.current);
      } else {
        console.warn("remoteVideoRef is not set.");
      }

      if (!mediaRecorder) {
        console.log("Initializing MediaRecorder...");
        mediaRecorder = new MediaRecorder(remoteStream);
        const recordedChunks = [];
        let blob;
        let url;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            console.log("Recording chunk available:", event.data.size, "bytes");
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (recordedChunks.length > 0) {
            console.log("Compiling recorded chunks...");
            blob = new Blob(recordedChunks, { type: "video/webm" });
            url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            console.log("Recording URL created:", url);
          } else {
            console.warn("No chunks recorded.");
          }

          if (!recordingStopped) {
            recordedChunks.splice(0, recordedChunks.length);
            mediaRecorder.start();
          }
        };

        mediaRecorder.start();
        recordingInterval = setInterval(() => {
          console.log("Resetting MediaRecorder...");
          if (!recordingStopped) {
            mediaRecorder.stop();
          }
        }, clipLength * 1000);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        const candidate = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        };
        setDoc(doc(collection(doc(db, "calls", callId), "answerCandidates")), candidate);
      }
    };

    const callDoc = doc(db, "calls", callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    collectIceCandidates(pc, answerCandidates);

    const callDocSnapshot = await getDoc(callDoc);
    const callData = callDocSnapshot.data();
    if (!callData) {
      setError("Call ID not found");
      console.error("No call data found for ID:", callId);
      return;
    }

    const offerDescription = callData.offer;
    console.log("Received offer:", offerDescription);
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);
    console.log("Answer created and set:", answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await setDoc(callDoc, { ...callData, answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log("Adding ICE candidate:", data);
          pc.addIceCandidate(new RTCIceCandidate(data)).catch((e) => {
            console.error("Error adding received ICE candidate", e);
          });
        }
      });
    });

    pc.onconnectionstatechange = () => {
      console.log("Connection state changed to:", pc.connectionState);
      if (pc.connectionState === "connected") {
        console.log("PeerConnection is established.");
      } else if (["failed", "disconnected"].includes(pc.connectionState)) {
        console.error("Connection failed or disconnected.");
        clearInterval(recordingInterval);
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
          setRecordingStopped(true);
        }
      }
    };

    setHasJoined(true);
  };

  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      cleanupMediaResources(
        pcRef.current,
        remoteStreamRef.current,
        remoteVideoRef
      );
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Viewer</h1>
      {!hasJoined && (
        <div className="mb-4">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Enter Call ID"
            value={callId}
            onChange={(e) => setCallId(e.target.value)}
            className="px-2 py-1 border rounded-md mr-2"
          />
          <button
            onClick={joinStream}
            className="px-4 py-2 bg-green-500 text-white rounded-md transition duration-150 ease-out hover:opacity-80 active:text-blue-200"
          >
            Join Stream
          </button>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-auto bg-black rounded-md"
        ></video>
      </div>
      {downloadUrl ? (
        <div className="mt-10">
          <a
            href={downloadUrl}
            download="recording.webm"
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition duration-150 ease-out hover:opacity-80 active:text-blue-200"
          >
            Download Latest Recording ({clipLength}s)
          </a>
        </div>
      ) : (
        <div className="mt-10">Recording Unavailable... Please Wait</div>
      )}
    </div>
  );
};

export default Viewer;
