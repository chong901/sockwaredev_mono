import { useEffect, useState } from "react";

export const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;

    // Ios chrome also contains "Safari" in userAgent since all browsers on iOS are required to use WebKit as their underlying browser engine, which is the same engine that powers Safari.
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua); // Check if it contains "Safari" but not "Chrome" or "Android"
    setIsSafari(isSafariBrowser);
  }, []);

  return isSafari;
};
