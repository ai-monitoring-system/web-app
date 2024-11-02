import React, { useRef, useEffect, useState } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, servers } from "./config";
import { collectIceCandidates, cleanupMediaResources } from "./utils";

const Streamer = () => {
  const [callId, setCallId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const pcRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const wsRef = useRef(null);
  let mediaRecorder;

  useEffect(() => {
    const getVideoDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setVideoDevices(videoInputs);
      if (videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    };

    getVideoDevices();
  }, []);

  const startCamera = async (deviceId) => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined },
        audio: false,
      });
      localStreamRef.current = localStream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = localStream;
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8080");
    wsRef.current.binaryType = "arraybuffer";

    wsRef.current.onopen = () => {
      console.log("Connected to the signaling server");
    };
    wsRef.current.onerror = (err) => {
      console.error(err);
    };
    wsRef.current.onclose = () => {
      console.log("Disconnected from the signaling server");
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }

    return () => {
      cleanupMediaResources(
        pcRef.current,
        localStreamRef.current,
        webcamVideoRef
      );

      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [selectedDeviceId]);

  const startStreaming = async () => {
    if (!localStreamRef.current) {
      console.error("No local stream available");
      return;
    }

    const pc = new RTCPeerConnection(servers);
    pcRef.current = pc;

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    const callDoc = doc(collection(db, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    setCallId(callDoc.id);

    collectIceCandidates(pc, offerCandidates);

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = { sdp: offerDescription.sdp, type: offerDescription.type };
    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data?.answer && !pc.currentRemoteDescription) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription).catch((e) => {
          console.error("Failed to set remote description:", e);
        });
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate).catch((e) => {
            console.error("Error adding received ICE candidate", e);
          });
        }
      });
    });

    mediaRecorder = new MediaRecorder(localStreamRef.current, {
      mimeType: "video/webm",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
          console.log("Sent data chunk of size", event.data.size);
        }
      }
    };

    mediaRecorder.start(100);

    setIsStreaming(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Streamer</h1>

      <select
        className="mb-4 p-2 border rounded"
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        {videoDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </option>
        ))}
      </select>

      <video
        ref={webcamVideoRef}
        autoPlay
        playsInline
        muted
        className="w-64 h-48 bg-black rounded-md mb-4"
      ></video>

      {!isStreaming && (
        <button
          type="button"
          onClick={startStreaming}
          className="px-4 py-2 bg-green-500 text-white rounded-md transition duration-150 ease-out hover:opacity-80 active:text-blue-200"
        >
          Start Streaming
        </button>
      )}

      {callId && (
        <div>
          <p className="mb-2">Share this Call ID with the viewer:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">{callId}</p>
        </div>
      )}
    </div>
  );
};

export default Streamer;
