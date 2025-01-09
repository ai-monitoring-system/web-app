import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; // Ensure TensorFlow.js is loaded
import React, { useState, useRef, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db, servers } from "./config";
import { collectIceCandidates, cleanupMediaResources } from "./utils";

const Viewer = () => {
  const [callId, setCallId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");
  const remoteVideoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const pcRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const [model, setModel] = useState(null);

  const loadModel = async () => {
    try {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
      console.log("YOLO model loaded successfully.");
    } catch (error) {
      console.error("Error loading YOLO model:", error);
    }
  };

  const runDetection = async () => {
    if (
      !model ||
      !remoteVideoRef.current ||
      remoteVideoRef.current.videoWidth === 0 ||
      remoteVideoRef.current.videoHeight === 0
    ) {
      requestAnimationFrame(runDetection); // Wait and retry
      return;
    }

    const video = remoteVideoRef.current;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const predictions = await model.detect(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      if (prediction.class === "person") {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        ctx.font = "16px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          x,
          y - 10
        );
      }
    });

    requestAnimationFrame(runDetection); // Continue detection loop
  };

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

        // Wait for video metadata to load before starting detection
        remoteVideoRef.current.onloadedmetadata = () => {
          runDetection(); // Start detection once video is ready
        };
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

    setHasJoined(true);
  };

  useEffect(() => {
    loadModel(); // Load YOLO model on component mount
    return () => cleanupMediaResources(pcRef.current, remoteStreamRef.current, remoteVideoRef);
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
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Join Stream
          </button>
        </div>
      )}
      <div className="relative w-full max-w-2xl">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-auto bg-black rounded-md"
        ></video>
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        ></canvas>
      </div>
    </div>
  );
};

export default Viewer;