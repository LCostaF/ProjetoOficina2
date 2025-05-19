import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "@/services/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Get token initially when user logs in
  const getToken = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setToken(null);
      return null;
    }
    
    try {
      const idToken = await getIdToken(firebaseUser);
      setToken(idToken);
      return idToken;
    } catch (error) {
      console.error("Error getting ID token:", error);
      setToken(null);
      return null;
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "User logged in" : "No user");
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await getToken(firebaseUser);
      } else {
        setToken(null);
      }
      
      setLoading(false);
    });

    return () => unsub();
  }, [getToken]);

  // Function to refresh the token when needed
  const refreshToken = useCallback(async () => {
    if (user) {
      try {
        console.log("Refreshing token");
        const idToken = await getIdToken(user, true); // Force refresh
        console.log("Token refreshed successfully");
        setToken(idToken);
        return idToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
      }
    }
    return null;
  }, [user]);

  return { 
    user, 
    loading, 
    token, 
    refreshToken,
    isAuthenticated: !!user,
  };
}