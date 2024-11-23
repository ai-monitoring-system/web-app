import React, { useRef, useEffect, useState } from "react";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, servers } from "./utils/config";
import { collectIceCandidates, cleanupMediaResources } from "./utils/utils";

const Streamer = () => {
  const [callId, setCallId] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const pcRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Fetch available video devices
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoInputs);
        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching video devices:", error);
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
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    if (selectedDeviceId) {
      startCamera(selectedDeviceId);
    }

    // Cleanup media resources on component unmount
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
      return;
    }

    try {
      const pc = new RTCPeerConnection(servers);
      pcRef.current = pc;

      // Add tracks from the local stream to the connection
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });

      // Create a Firestore document to manage the call with the user ID as the doc ID
      const callDoc = doc(db, "calls", auth.currentUser.uid);
      const offerCandidates = collection(callDoc, "offerCandidates");
      const answerCandidates = collection(callDoc, "answerCandidates");

      setCallId(callDoc.id); // This will now be the user's ID

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

      // Listen for answer and update connection
      onSnapshot(callDoc, (snapshot) => {
        const data = snapshot.data();
        if (data?.answer && !pc.currentRemoteDescription) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription).catch((e) => {
            console.error("Failed to set remote description:", e);
          });
        }
      });

      // Listen for answer candidates and add to the connection
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

      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting streaming:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg mx-auto mt-12 flex flex-col gap-12 max-w-screen-xl">
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