import React, { useEffect, useState } from "react";

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default behavior to keep the event for later use
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
    };

    // Check if the browser supports PWA features
    if ("serviceWorker" in navigator && "PushManager" in window) {
      // Attach the event listener for beforeinstallprompt
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // Listen for the appinstalled event
      window.addEventListener("appinstalled", handleAppInstalled);
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
    }

    return () => {
      // Remove the event listeners when the component is unmounted
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    try {
      if (deferredPrompt) {
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Demo for add to home screen prompt</h1>
      {!isAppInstalled && (
        <>
          <p>Install this app for a better experience!</p>
          <button onClick={handleInstallClick}>Install</button>
        </>
      )}
    </div>
  );
};

export default App;
