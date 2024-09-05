import { useEffect, useState } from "react";

export const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua); // Check if it contains "Safari" but not "Chrome" or "Android"
    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
};
