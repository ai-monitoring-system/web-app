import React, { useRef, useEffect, useState } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, servers } from "./utils/config";
import { collectIceCandidates, cleanupMediaResources } from "./utils/utils";

const Streamer = () => {
  const [callId, setCallId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [error, setError] = useState(null); // New error state for user feedback
  const pcRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Fetch available video devices on mount
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((device) => device.kind === "videoinput");
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        } else {
          setError("No video devices found.");
        }
      } catch (error) {
        console.error("Error fetching video devices:", error);
        setError("Failed to fetch video devices.");
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
      console.log("Camera started with device ID:", deviceId);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setError("Failed to start camera. Please check device permissions.");
    }
  };

  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }

    // Cleanup media resources on unmount
    return () => {
      cleanupMediaResources(pcRef.current, localStreamRef.current, webcamVideoRef);
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

      // Add tracks from the local stream to the connection
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      // Create Firestore document for the call
      const callDoc = doc(db, "calls", auth.currentUser.uid);
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      setCallId(callDoc.id); // Set call ID for display

      // Collect ICE candidates
      collectIceCandidates(pc, offerCandidates);

      // Create and set the offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        userId: auth.currentUser.uid,
      };
      await setDoc(callDoc, { offer });

      console.log("Offer created and saved:", offer);

      // Listen for answer and update connection
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

      // Listen for answer candidates and add to the connection
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
              console.warn("Remote description is not set yet.Candidate ignored.");
            }
          }
        });
      });

      setIsStreaming(true);
      setError(null); // Clear errors if successful
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

      {/* Left Section: Controls */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Streamer Mode
        </h2>

        {/* Camera Selector */}
        <div className="mb-6">
          <label className="block text-gray-600 dark:text-gray-400 mb-2 text-lg">
            Select Camera:
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-lg"
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

        {/* Start Streaming Button */}
        {isStreaming ? (
          <div className="text-center w-full py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg mt-6">
            Streaming...
          </div>
        ) : (
          <button
            type="button"
            onClick={startStreaming}
            className="w-full py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg transition duration-150 ease-in-out hover:bg-green-600 dark:hover:bg-green-700 mt-6"
          >
            Start Streaming
          </button>
        )}
      </div>

      {/* Right Section: Video Preview */}
      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner p-6 w-full lg:w-[800px] mx-auto">
        <video
          ref={webcamVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-[400px] bg-black rounded-lg"
        ></video>
      </div>
    </div>
  );
};

export default Streamer; 