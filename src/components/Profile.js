import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../config";

const Profile = () => {
  async function mySignIn() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  }

  async function mySignOut() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>Manage your user profile and settings here.</p>
      {auth.currentUser ? (
        <div>
          <div className="mt-4 flex items-center">
            <img
              className="rounded-full h-20 w-20"
              src={auth.currentUser.photoURL}
              alt={auth.currentUser.displayName}
            />
            <div className="ml-4">
              <p className="font-bold">{auth.currentUser.displayName}</p>
              <p>{auth.currentUser.email}</p>
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={mySignOut}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={mySignIn}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Profile;
