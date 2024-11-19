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
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-lg max-w-screen-lg mx-auto mt-8 flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Viewer Mode
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Checking for stream availability...
          </p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : !hasJoined ? (
          <button
            onClick={joinStream}
            className="w-full py-3 mt-2 bg-green-500 dark:bg-green-600 text-white font-semibold rounded-md transition duration-150 ease-in-out hover:bg-green-600 dark:hover:bg-green-700"
          >
            Join Call
          </button>
        ) : null}
      </div>

      <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner p-4 flex-grow h-96">
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
