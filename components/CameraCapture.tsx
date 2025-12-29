import React, { useEffect, useRef, useState } from 'react';
import LevelIndicator from './LevelIndicator';

interface CameraCaptureProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  onCancel: () => void;
  title: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoCapture, onCancel, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      setError('Camera requires a secure connection (HTTPS). Please use HTTPS or localhost.');
      return;
    }

    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not available in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please use HTTPS or a modern browser.');
      }

      console.log('Requesting camera access...');
      
      // Request camera access with rear camera preference
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use rear camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      console.log('Camera access granted!');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setIsReady(true);
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = 'Failed to access camera.';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !isReady) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 image
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      
      console.log('Photo captured, size:', canvas.width, 'x', canvas.height);
      
      // Stop camera and return photo
      stopCamera();
      onPhotoCapture(photoDataUrl);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <button
          onClick={handleCancel}
          className="text-slate-600 hover:text-slate-800 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
      </div>

      
      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Overlay image with opacity */}
        <img 
          src="./IMG_5500.PNG" 
          alt="Overlay" 
          className="absolute inset-0 w-full h-full object-cover opacity-55 pointer-events-none"
        />

        {/* Level Indicator */}
        {isReady && !error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur rounded-2xl shadow-lg z-10">
            <LevelIndicator />
          </div>
        )}
        
        {!isReady && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-bold">Starting Camera...</p>
            <p className="text-sm text-slate-400 mt-2">Please allow camera access</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Camera Not Available</h3>
            <p className="text-center text-sm text-slate-300 mb-2 max-w-md">{error}</p>
            <p className="text-center text-xs text-slate-400 mb-6 max-w-md">
              Don't worry! You can still upload photos from your device.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold active:scale-95 transition-all"
              >
                ← Go Back to Upload
              </button>
            </div>
            {error.includes('HTTPS') && (
              <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30 max-w-md">
                <p className="text-xs text-blue-200">
                  💡 <strong>Tip:</strong> If you're developing locally, make sure you're using <code className="bg-blue-900/50 px-1 rounded">localhost</code> or <code className="bg-blue-900/50 px-1 rounded">https://</code>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Capture Frame Guide */}
        {isReady && !error && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Grid overlay for composition */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="border border-white/20"></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {isReady && !error && (
        <div className="bg-slate-900 border-t border-slate-700 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-6">
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                className="w-14 h-14 rounded-full bg-slate-700 text-white flex items-center justify-center active:scale-95 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Capture Button */}
              <button
                onClick={handleCapture}
                className="bg-white w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-4xl active:scale-95 transition-all border-4 border-slate-700"
              >
                📷
              </button>

              {/* Placeholder for symmetry */}
              <div className="w-14 h-14"></div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-4">
              Tap to capture • Use grid for alignment
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;

