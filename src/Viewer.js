import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db, servers } from "./config";
import { collectIceCandidates, cleanupMediaResources } from "./utils";

const Viewer = () => {
  const [callId, setCallId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Indicates if we are checking for a stream

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
      const callDoc = doc(db, "calls", userId);
      const callDocSnapshot = await getDoc(callDoc);
      if (callDocSnapshot.exists()) {
        setCallId(userId);
        setError(""); // Clear any previous errors
      } else {
        setError("Stream unavailable");
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
      setError("No Call ID to join.");
      return;
    }

    try {
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
      };

      const callDoc = doc(db, "calls", callId);
      const answerCandidates = collection(callDoc, "answerCandidates");
      const offerCandidates = collection(callDoc, "offerCandidates");

      collectIceCandidates(pc, answerCandidates);

      const callDocSnapshot = await getDoc(callDoc);
      const callData = callDocSnapshot.data();
      if (!callData) {
        throw new Error("Call ID not found");
      }

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

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
    } catch (error) {
      console.error("Error joining stream:", error);
      setError(error.message || "An error occurred while joining the stream.");
    }
  };

  useEffect(() => {
    checkForCall(); // Automatically check for an available call on mount

    return () => {
      cleanupMediaResources(
        pcRef.current,
        remoteStreamRef.current,
        remoteVideoRef
      );
    };
  }, []);

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
              <div className="flex justify-center w-full">
                <button
                  onClick={joinStream}
                  className="w-full max-w-[300px] py-4 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-lg text-lg transition duration-150 ease-in-out hover:bg-green-600 dark:hover:bg-green-700 mt-6"
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