import { useEffect, useState } from 'react';

let isLoggedIn = false;
let listeners: (() => void)[] = [];

export const setLoggedIn = (status: boolean) => {
  isLoggedIn = status;
  listeners.forEach(listener => listener());
};

export const useAuthState = () => {
  const [state, setState] = useState(isLoggedIn);
  
  useEffect(() => {
    const listener = () => setState(isLoggedIn);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return state;
};
