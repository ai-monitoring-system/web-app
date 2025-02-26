import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db, servers } from "./utils/config";
import { collectIceCandidates, cleanupMediaResources } from "./utils/utils";
import { requestPermissionAndGetToken } from "./hooks/useFCM";
import { listenForForegroundMessages } from "./hooks/useFCM";

const Viewer = () => {
  const [callId, setCallId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const checkForCall = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      console.log("Checking for call with user ID:", userId);

      const callDoc = doc(db, "calls", userId);
      const callDocSnapshot = await getDoc(callDoc);
      if (callDocSnapshot.exists()) {
        console.log("Stream found for user ID:", userId);
        setCallId(userId);
        setError(null);
      } else {
        console.error("Stream unavailable for user ID:", userId);
        setError("Stream unavailable. Please check with the streamer.");
      }
    } catch (e) {
      console.error("Error checking for call:", e);
      setError("Failed to check for an active stream.");
    } finally {
      setLoading(false);
    }
  };

  const joinStream = async () => {
    if (!callId) {
      console.error("No Call ID to join.");
      setError("No Call ID to join. Please check the stream availability.");
      return;
    }

    try {
      console.log("🔔 Requesting notification permission...");

      // Ask for notification permission before joining
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("❌ Notifications are required for this feature. Please enable them in your browser settings.");
        return;
      }

      console.log("✅ Notification permission granted.");
      
      // Retrieve the FCM token
      const token = await requestPermissionAndGetToken(auth.currentUser?.uid);
      if (token) {
        setNotificationsEnabled(true);
        console.log("🔔 Notifications enabled! Token:", token);
      } else {
        alert("⚠️ Failed to get notification token. Please check your browser settings.");
        return;
      }

      console.log("Joining stream with Call ID:", callId);

      const pc = new RTCPeerConnection(servers);
      pcRef.current = pc;

      const remoteStream = new MediaStream();
      remoteStreamRef.current = remoteStream;

      pc.ontrack = (event) => {
        console.log("🎥 Track received from stream:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      const callDoc = doc(db, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      collectIceCandidates(pc, answerCandidates);

      const callDocSnapshot = await getDoc(callDoc);
      const callData = callDocSnapshot.data();
      if (!callData) {
        throw new Error("Call data not found for the provided Call ID.");
      }

      console.log("Call data retrieved:", callData);

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));
      console.log("📡 Remote description set:", offerDescription);

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      console.log("✅ Answer created and set:", answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };
      await setDoc(callDoc, { ...callData, answer });
      console.log("📌 Answer saved to Firestore:", answer);

      onSnapshot(offerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidateData = change.doc.data();
            console.log("Received ICE candidate from offer:", candidateData);
            pc.addIceCandidate(new RTCIceCandidate(candidateData)).catch((e) => {
              console.error("Error adding received ICE candidate", e);
              setError("Error adding ICE candidate.");
            });
          }
        });
      });

      setHasJoined(true);
      setError(null);
      console.log("🎉 Successfully joined the stream.");
    } catch (error) {
      console.error("Error joining stream:", error);
      setError(error.message || "An error occurred while joining the stream.");
    }
  };

  useEffect(() => {
    checkForCall(); // Check for an active stream
  
    if (auth.currentUser) {
      requestPermissionAndGetToken(auth.currentUser.uid);
      listenForForegroundMessages(); // ADD THIS LINE to enable foreground notifications
    }
  
    return () => {
      cleanupMediaResources(pcRef.current, remoteStreamRef.current, remoteVideoRef);
    };
  }, [auth.currentUser]);

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg mx-auto mt-12 max-w-screen-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Viewer Mode
        </h2>
        {hasJoined && (
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-800 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-md px-4 py-1 shadow-md">
            <span className="text-sm font-semibold">Connected</span>
            <div className="relative flex items-center justify-center w-3.5 h-3.5">
              <span className="absolute inline-flex w-full h-full bg-green-500 opacity-75 rounded-full animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-green-600 rounded-full"></span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12">
        {!hasJoined && (
          <div className="flex flex-col flex-grow items-center">
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Checking for stream availability...
              </p>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg p-3 shadow-md mt-6 max-w-[300px]">
                <span className="text-md font-semibold">{error}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full max-w-[600px] mx-auto gap-4 mt-6">
                <button
                  onClick={joinStream}
                  className="w-full py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg transition duration-150 ease-in-out hover:bg-green-600 dark:hover:bg-green-700"
                >
                  Join Call
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`${
            hasJoined ? "flex" : "hidden"
          } justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner w-full lg:w-[800px] mx-auto`}
        >
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-auto max-h-[400px] bg-black rounded-lg"
          ></video>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
