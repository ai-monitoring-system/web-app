import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  githubProvider,
  getAuthErrorMessage,
} from "../utils/config";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../components/shared/LoadingSpinner";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const passwordMessage =
    "Password must contain at least 6 characters, one letter, and one number.";

  const validatePassword = (password) => {
    return (
      password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password)
    );
  };

  // Add navigation handlers
  const handleAuthSuccess = () => {
    navigate("/");
    setError(null);
  };

  const handleAuthError = (err) => {
    setError(getAuthErrorMessage(err));
    setAuthLoading(false);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      handleAuthSuccess();
      return result.user;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign in with email/password
  const signInWithEmail = async (email, password) => {
    try {
      setError(null);
      setAuthLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setError(null);
      setAuthLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name if provided
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }

      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      await signOut(auth);
      navigate("/welcome");
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      setError(null);
      setAuthLoading(true);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, updates);
        // Force refresh the user state
        setUser({ ...auth.currentUser, ...updates });
      }
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  // Add GitHub sign-in function
  const signInWithGithub = async () => {
    try {
      setError(null);
      setAuthLoading(true);
      const result = await signInWithPopup(auth, githubProvider);
      handleAuthSuccess();
      return result.user;
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authLoading,
    error,
    validatePassword,
    passwordMessage,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <PageLoader /> : children}
    </AuthContext.Provider>
  );
};
