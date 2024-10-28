import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, servers } from "./config";
import { collectIceCandidates } from "./utils";

const Viewer = () => {
  const [callId, setCallId] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const joinStream = async () => {
    if (!callId) {
      alert("Please enter a Call ID");
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
    };

    const callDoc = doc(db, "calls", callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    collectIceCandidates(pc, answerCandidates);

    const callDocSnapshot = await getDoc(callDoc);
    const callData = callDocSnapshot.data();
    if (!callData) {
      alert("Call ID not found");
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
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Viewer</h1>
      {!hasJoined && (
        <div className="mb-4">
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
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-64 h-48 bg-black rounded-md"
      ></video>
    </div>
  );
};

export default Viewer;
