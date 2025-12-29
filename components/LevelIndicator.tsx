import { useEffect, useState } from "react";

export default function LevelIndicator() {
  const [gamma, setGamma] = useState(0); // left/right tilt
  const [beta, setBeta] = useState(0);   // front/back tilt

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setGamma(event.gamma ?? 0);
      setBeta(event.beta ?? 0);
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Calculate if the phone is roughly level
  const isLevel = Math.abs(beta) < 5 && Math.abs(gamma) < 5;

  // Map gamma (-90 → 90) to left/right position of bubble
  const bubbleX = ((gamma + 90) / 180) * 192; // 192px container (w-48)

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

