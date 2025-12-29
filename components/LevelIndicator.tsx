import { useEffect, useState } from "react";

export default function LevelIndicator() {
  const [gamma, setGamma] = useState(0); // left/right tilt
  const [beta, setBeta] = useState(0);   // front/back tilt
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      console.log('Orientation event:', event.gamma, event.beta);
      if (event.gamma !== null && event.beta !== null) {
        setGamma(event.gamma);
        setBeta(event.beta);
        setError(null);
      } else {
        console.warn('Orientation values are null');
      }
    };

    const startListening = () => {
      console.log('Starting device orientation listener');
      window.addEventListener("deviceorientation", handleOrientation, true);
      
      cleanup = () => {
        console.log('Cleaning up device orientation listener');
        window.removeEventListener("deviceorientation", handleOrientation);
      };
    };

    const requestPermission = async () => {
      console.log('Checking device orientation support...');
      
      // Check if DeviceOrientationEvent is available
      if (typeof DeviceOrientationEvent === 'undefined') {
        console.error('DeviceOrientationEvent not supported');
        setError('Device orientation not supported');
        setHasPermission(false);
        return;
      }

      // iOS 13+ requires permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        console.log('iOS - requesting permission');
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          console.log('Permission result:', permission);
          if (permission === 'granted') {
            setHasPermission(true);
            startListening();
          } else {
            setError('Permission denied');
            setHasPermission(false);
          }
        } catch (err) {
          console.error('Error requesting device orientation permission:', err);
          setError('Tap "Enable Level" to allow');
          setHasPermission(false);
        }
      } else {
        // Non-iOS or older iOS - no permission needed
        console.log('Non-iOS - starting directly');
        setHasPermission(true);
        startListening();
      }
    };

    requestPermission();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Calculate if the phone is roughly level
  const isLevel = Math.abs(beta) < 5 && Math.abs(gamma) < 5;

  // Map gamma (-90 → 90) to left/right position of bubble
  const bubbleX = ((gamma + 90) / 180) * 192; // 192px container (w-48)

  const requestPermissionManually = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        console.log('Manual permission request');
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        console.log('Manual permission result:', permission);
        
        if (permission === 'granted') {
          setHasPermission(true);
          setError(null);
          
          // Start listening
          const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma !== null && event.beta !== null) {
              setGamma(event.gamma);
              setBeta(event.beta);
            }
          };
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          setError('Permission denied');
        }
      } catch (err) {
        console.error('Manual permission error:', err);
        setError('Permission request failed');
      }
    }
  };

  // Show loading state
  if (hasPermission === null) {
    return (
      <div className="text-center p-3">
        <div className="text-xs text-white/60">Loading sensor...</div>
      </div>
    );
  }

  // Show error or permission request
  if (error || hasPermission === false) {
    return (
      <div className="text-center p-3">
        <div className="text-xs text-yellow-400 mb-2">{error || 'Sensor unavailable'}</div>
        {typeof (DeviceOrientationEvent as any).requestPermission === 'function' && (
          <button
            onClick={requestPermissionManually}
            className="text-xs bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-white font-bold shadow-lg active:scale-95 transition-all"
          >
            Enable Level Sensor
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center p-3">
      <div className={`text-sm font-bold mb-2 ${isLevel ? 'text-green-400' : 'text-white'}`}>
        {isLevel ? "Level 👍" : "Adjust to level"}
      </div>
      <div className="w-48 h-4 bg-white/20 rounded-full mx-auto relative">
        <div
          className={`w-4 h-4 rounded-full absolute top-0 transition-all duration-100 ${
            isLevel ? 'bg-green-400' : 'bg-yellow-400'
          }`}
          style={{
            left: `${bubbleX - 8}px`,
          }}
        ></div>
      </div>
      <div className="mt-2 text-[10px] text-white/60">
        <p>Tilt: {gamma.toFixed(1)}° | Pitch: {beta.toFixed(1)}°</p>
      </div>
    </div>
  );
}

