import { useIsSafari, useIsStandalone } from "@repo/react-hook";
import { Modal } from "@repo/ui/containers";
import Image from "next/image";
import {
  ComponentProps,
  forwardRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";

type PwaInstallPromptProps = ComponentProps<"div"> & {
  onDisplayChange?: (isDisplayed: boolean) => void;
  /**
   * for non-safari browsers to display app icon, suggested to use 192x192
   */
  imageSrc: string;
};

export const PwaInstallPrompt = forwardRef<
  HTMLDivElement,
  PwaInstallPromptProps
>(function PwaInstallPromptComp(
  { onDisplayChange, imageSrc, ...rest }: PwaInstallPromptProps,
  ref: Ref<HTMLDivElement>,
) {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [isBeforeInstallPromptTriggered, setIsBeforeInstallPromptTriggered] =
    useState(false);
  const isSafari = useIsSafari();
  const isStandalone = useIsStandalone();

  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    setDisplayModal(
      isBeforeInstallPromptTriggered || (isSafari && !isStandalone),
    );
  }, [isBeforeInstallPromptTriggered, isSafari, isStandalone]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setIsBeforeInstallPromptTriggered(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  useEffect(() => {
    onDisplayChange?.(displayModal);
  }, [displayModal]);

  const handleInstallClick = async () => {
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();

      // wait for user's choice
      await deferredPromptRef.current.userChoice;
      deferredPromptRef.current = null;
      setDisplayModal(false);
    }
  };

  const handleClose = () => {
    setDisplayModal(false);
  };

  if (!displayModal) return null;
  return (
    <Modal ref={ref} {...rest}>
      {isSafari ? (
        <IosInstallModalBody onDismiss={handleClose} />
      ) : (
        <NonIosInstallModalBody
          imageSrc={imageSrc}
          onClose={handleClose}
          onInstallClick={handleInstallClick}
        />
      )}
    </Modal>
  );
});

type NonSafariInstallModalBodyProps = {
  onInstallClick: () => void;
  onClose: () => void;
  imageSrc: string;
};

const NonIosInstallModalBody = ({
  onClose,
  onInstallClick,
  imageSrc,
}: NonSafariInstallModalBodyProps) => (
  <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
    <h2 className="text-lg font-semibold text-gray-800">Install App</h2>
    <p className="my-4 text-sm text-gray-600">
      Get quick access to this app by installing it on your home screen.
    </p>
    <div className="mb-4 flex justify-center">
      <Image
        width={48}
        height={48}
        src={imageSrc}
        alt="App Icon"
        className="h-12 w-12 rounded-full"
      />
    </div>
    <div className="flex justify-between">
      <button
        onClick={onInstallClick}
        className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Install Now
      </button>
      <button
        onClick={onClose}
        className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400"
      >
        Close
      </button>
    </div>
  </div>
);

type SafariInstallModalBodyProps = {
  onDismiss: () => void;
};

const IosInstallModalBody = ({ onDismiss }: SafariInstallModalBodyProps) => (
  <div className="w-80 rounded-lg bg-blue-500 p-6 text-center text-white shadow-lg">
    <h2 className="text-2xl font-semibold">Install App</h2>
    <div className="my-4">
      <p className="text-sm">
        Get quick access to this app by installing it on your home screen:
      </p>
      <p className="text-sm">
        Open Safari, tap <strong>Share</strong> and then{" "}
        <strong>Add to Home Screen</strong>.
      </p>
    </div>
    <button
      className="rounded bg-white px-4 py-2 font-bold text-blue-500"
      onClick={onDismiss}
    >
      Dismiss
    </button>
  </div>
);
