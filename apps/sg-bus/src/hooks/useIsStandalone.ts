import { useEffect, useState } from "react";

export const useIsStandalone = (): boolean => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches || // Android/Chrome/modern browsers
      (window.navigator as any).standalone === true; // iOS Safari

    setIsStandalone(isStandaloneMode);
  }, []);

  return isStandalone;
};
