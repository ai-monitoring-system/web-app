import React, { useRef, useEffect, useState } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, servers } from "./utils/config";
import { collectIceCandidates, cleanupMediaResources } from "./utils/utils";

const Streamer = () => {
  const [callId, setCallId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [error, setError] = useState(null);

  const pcRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  const requestCameraAccess = async () => {
    try {
      // Ask for camera permission with a simple constraint
      await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      // Now that permission is granted, enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === "videoinput");
      setVideoDevices(videoInputs);

      if (videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      } else {
        setError("No video devices found.");
      }
    } catch (err) {
      console.error("Error requesting camera access:", err);
      setError("Camera access was denied or failed.");
    }
  };

  const startCamera = async (deviceId) => {
    if (!deviceId) return;
    try {
      console.log("Attempting to start camera with deviceId:", deviceId);
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId }, // more relaxed constraint
        audio: false,
      });
      localStreamRef.current = localStream;

      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = localStream;
        // Some browsers need an explicit play
        webcamVideoRef.current
          .play()
          .catch((e) => console.error("video play error:", e));
      }
      console.log("Camera started successfully.");
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Failed to start camera. Please check device permissions.");
    }
  };

  // Start or restart camera when selectedDeviceId changes
  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }
    // Cleanup media resources on unmount
    return () => {
      cleanupMediaResources(
        pcRef.current,
        localStreamRef.current,
        webcamVideoRef
      );
    };
  }, [selectedDeviceId]);

  const startStreaming = async () => {
    if (!localStreamRef.current) {
      console.error("No local stream available");
      setError("No local stream available. Please check your camera.");
      return;
    }

    try {
      if (!auth.currentUser) {
        console.error("User not authenticated");
        setError("User is not authenticated. Please log in.");
        return;
      }

      const pc = new RTCPeerConnection(servers);
      pcRef.current = pc;

      // Add tracks from the local stream
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      // Create Firestore document for the call
      const callDoc = doc(db, "calls", auth.currentUser.uid);
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      setCallId(callDoc.id);

      // Collect ICE candidates
      collectIceCandidates(pc, offerCandidates);

      // Create & set the offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        userId: auth.currentUser.uid,
      };
      await setDoc(callDoc, { offer });

      console.log("Offer created and saved:", offer);

      // Listen for answer
      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pc.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription).catch((e) => {
            console.error("Failed to set remote description:", e);
            setError("Error setting remote description.");
          });
        }
      });

      // Listen for answer candidates
      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            if (pc.remoteDescription) {
              pc.addIceCandidate(candidate).catch((e) => {
                console.error("Error adding received ICE candidate:", e);
                setError("Error adding ICE candidate.");
              });
            } else {
              console.warn(
                "Remote description not set yet. Candidate ignored."
              );
            }
          }
        });
      });

      setIsStreaming(true);
      setError(null);
      console.log("Streaming started successfully.");
    } catch (error) {
      console.error("Error starting streaming:", error);
      setError("Failed to start streaming. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg mx-auto mt-12 flex flex-col gap-12 max-w-screen-xl">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg p-3 shadow-md">
          <span className="text-md font-semibold">{error}</span>
        </div>
      )}

      <div className="flex flex-col flex-grow">
        <h2 className="text-3xl font-semibold mb-6">Streamer Mode</h2>

        {/* Button to request camera access & load devices */}
        <button
          className="w-full py-4 bg-blue-500 dark:bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-600 dark:hover:bg-blue-700"
          onClick={requestCameraAccess}
        >
          Request Camera Access
        </button>

        {/* Camera Selector */}
        {videoDevices.length > 0 && (
          <div className="mt-6">
            <label className="block mb-2 text-lg">Select Camera:</label>
            <select
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 text-lg"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Start Streaming Button */}
        {isStreaming ? (
          <div className="text-center w-full py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg mt-6">
            Streaming...
          </div>
        ) : (
          <button
            type="button"
            onClick={startStreaming}
            className="w-full py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg mt-6 hover:bg-green-600 dark:hover:bg-green-700"
          >
            Start Streaming
          </button>
        )}
      </div>

      {/* Video Preview */}
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner p-6 w-full lg:w-[800px] mx-auto">
        <video
          ref={webcamVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-[400px] bg-black rounded-lg"
        />
      </div>
    </div>
  );
};

export default Streamer;
