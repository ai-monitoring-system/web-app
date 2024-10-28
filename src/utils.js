import { addDoc } from "firebase/firestore";

export const collectIceCandidates = (pc, candidatesCollection) => {
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      addDoc(candidatesCollection, event.candidate.toJSON());
    }
  };
};

export const closeConnection = (pc, stream) => {
  if (pc) {
    pc.close();
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};
