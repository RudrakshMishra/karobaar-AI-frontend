'use client';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { setGlobalToken } from '../../lib/api';

export default function TokenProvider() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      setGlobalToken("");
      return;
    }

    const updateToken = async () => {
      try {
        const token = await getToken();
        setGlobalToken(token || "");
      } catch (e) {
        console.error("Failed to get token", e);
        setGlobalToken("");
      }
    };
    
    updateToken();
    const interval = setInterval(updateToken, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [getToken, isLoaded, isSignedIn]);
  
  return null;
}
