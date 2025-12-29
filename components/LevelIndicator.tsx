import { useEffect, useState } from "react";

interface LevelIndicatorProps {
  onValidityChange?: (isValid: boolean) => void;
}

export default function LevelIndicator({ onValidityChange }: LevelIndicatorProps) {
  const [beta, setBeta] = useState(0);   // front/back tilt (pitch)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      console.log('Orientation event - beta (pitch):', event.beta);
      if (event.beta !== null) {
        setBeta(event.beta);
        setError(null);
      } else {
        console.warn('Orientation beta value is null');
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

  // Calculate if the phone pitch is between 85-95 degrees (upright position)
  const isPitchValid = beta >= 85 && beta <= 95;

  // Notify parent component when validity changes
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isPitchValid);
    }
  }, [isPitchValid, onValidityChange]);

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
            if (event.beta !== null) {
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
        <div className="text-xs text-yellow-300 mb-2">{error || 'Sensor unavailable'}</div>
        {typeof (DeviceOrientationEvent as any).requestPermission === 'function' && (
          <button
            onClick={requestPermissionManually}
            className="text-xs bg-gradient-to-r from-[#54A18A] to-[#007A67] hover:shadow-lg px-4 py-2 rounded-full text-white font-bold shadow-md active:scale-95 transition-all"
          >
            Enable Level Sensor
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center p-3">
      <div className={`text-sm font-bold mb-2 ${isPitchValid ? 'text-[#10B981]' : 'text-white'}`}>
        {isPitchValid ? "Perfect Angle 👍" : "Hold phone upright"}
      </div>
      
      {/* Visual pitch indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className="text-xs text-white/80">85°</div>
        <div className="w-32 h-2 bg-white/20 rounded-full relative shadow-inner">
          {/* Acceptable range highlight */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#10B981]/40 to-[#10B981]/30 rounded-full"></div>
          {/* Current position indicator */}
          <div
            className={`w-3 h-3 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-100 shadow-lg ${
              isPitchValid ? 'bg-gradient-to-br from-[#10B981] to-[#059669]' : 'bg-gradient-to-br from-yellow-400 to-yellow-500'
            }`}
            style={{
              left: `${Math.max(0, Math.min(100, ((beta - 85) / 10) * 100))}%`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        </div>
        <div className="text-xs text-white/80">95°</div>
      </div>
      
      <div className="mt-2 text-[10px] text-white/70">
        <p>Pitch: {beta.toFixed(1)}°</p>
      </div>
    </div>
  );
}

