import React, { useState, useRef, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
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

    const pc = new RTCPeerConnection(servers);
    pcRef.current = pc;

    const remoteStream = new MediaStream();
    remoteStreamRef.current = remoteStream;

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      if (!mediaRecorder) {
        mediaRecorder = new MediaRecorder(remoteStream);
        const recordedChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);

          if (!recordingStopped) {
            recordedChunks.splice(0, recordedChunks.length);
            mediaRecorder.start();
          }
        };

        mediaRecorder.start();

        recordingInterval = setInterval(() => {
          if (!recordingStopped) {
            mediaRecorder.stop();
          }
        }, clipLength * 1000);
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
      return;
    }

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };
    await setDoc(callDoc, { ...callData, answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data)).catch((e) => {
            console.error("Error adding received ICE candidate", e);
          });
        }
      });
    });

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" && mediaRecorder) {
        clearInterval(recordingInterval);
        mediaRecorder.stop();
        setRecordingStopped(true);
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
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-screen-lg mx-auto mt-8 flex flex-col lg:flex-row gap-8">
      {/* Left Section: Call ID Input and Controls */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Viewer Mode</h2>

        {/* Input for Call ID */}
        {!hasJoined && (
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Enter Call ID:</label>
            <input
              type="text"
              placeholder="Enter Call ID"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}

        {/* Join Stream Button */}
        {!hasJoined && (
          <button
            onClick={joinStream}
            className="w-full py-3 mt-2 bg-green-500 text-white font-semibold rounded-md transition duration-150 ease-in-out hover:bg-green-600 active:bg-green-700"
          >
            Join Stream
          </button>
        )}

        {/* Download Recording Button */}
        {downloadUrl && (
          <div className="text-center mt-6">
            <a
              href={downloadUrl}
              download="recording.webm"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
              Download Latest Recording ({clipLength}s)
            </a>
          </div>
        )}

        {/* Recording Status */}
        {hasJoined && !downloadUrl && (
          <div className="text-center text-gray-600 mt-6">
            Recording Unavailable... Please Wait
          </div>
        )}
      </div>

      {/* Right Section: Video Display */}
      <div className="flex justify-center items-center bg-gray-100 rounded-lg shadow-inner p-4 flex-grow h-96">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full bg-black rounded-md"
        ></video>
      </div>
    </div>
  );
};

export default Viewer;
