'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import { determineSize } from '@/lib/size-chart';

declare global {
  interface Window {
    Pose: any;
    Camera: any;
    POSE_CONNECTIONS: any;
    drawConnectors: any;
    drawLandmarks: any;
  }
}

export default function SizeCalculator() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [heightInches, setHeightInches] = useState<number>(68); // Default 5'8"
  const [measurements, setMeasurements] = useState({ shoulder: 0, chest: 0 });
  const [recommendedSize, setRecommendedSize] = useState<string>('-');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(0);

  const drawSilhouetteGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    // Simple oval for head
    ctx.ellipse(width / 2, height * 0.2, width * 0.1, height * 0.1, 0, 0, 2 * Math.PI);
    // Simple rectangle for torso
    ctx.rect(width * 0.35, height * 0.3, width * 0.3, height * 0.4);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const calculateSize = (landmarks: any[], canvasWidth: number, canvasHeight: number) => {
    // MediaPipe landmarks: 11 (left shoulder), 12 (right shoulder)
    // 23 (left hip), 24 (right hip)
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    // Check visibility
    if (leftShoulder.visibility < 0.5 || rightShoulder.visibility < 0.5) return;

    // Calculate shoulder width in pixels
    const shoulderPxWidth = Math.abs(leftShoulder.x - rightShoulder.x) * canvasWidth;
    
    // Estimate total height in pixels based on the visible bounding box
    const yValues = landmarks.map((l: any) => l.y);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const heightPx = (maxY - minY) * canvasHeight;

    // Prevent division by zero
    if (heightPx === 0) return;

    // Calibration: Pixels to Inches
    const pixelsPerInch = heightPx / heightInches;
    
    const shoulderInches = shoulderPxWidth / pixelsPerInch;
    
    // Chest estimation (simplified: shoulder width * 2.1 is roughly chest circumference for many body types)
    const chestInches = shoulderInches * 2.1; 

    setMeasurements({
      shoulder: Math.round(shoulderInches * 10) / 10,
      chest: Math.round(chestInches * 10) / 10
    });
    
    setRecommendedSize(determineSize(shoulderInches, chestInches));
  };

  const onResults = useCallback((results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    if (!window.drawConnectors || !window.drawLandmarks) return;

    const canvasCtx = canvasRef.current.getContext('2d');
    if (!canvasCtx) return;

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    canvasCtx.drawImage(results.image, 0, 0, canvasWidth, canvasHeight);

    // Draw Silhouette Guide
    drawSilhouetteGuide(canvasCtx, canvasWidth, canvasHeight);

    if (results.poseLandmarks) {
      window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
      window.drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });
      
      calculateSize(results.poseLandmarks, canvasWidth, canvasHeight);
    }
    
    canvasCtx.restore();
  }, [heightInches]);

  useEffect(() => {
    if (scriptsLoaded < 3) return;

    let camera: any = null;

    const startCamera = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        setError(null);
        
        const pose = new window.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        if (videoRef.current) {
          camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                await pose.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480
          });
          camera.start();
          setIsTracking(true);
        }
      } catch (err: any) {
        setHasPermission(false);
        setError("Camera permission denied or camera not found.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [onResults, scriptsLoaded]);

  const handleScriptLoad = () => {
    setScriptsLoaded((prev) => prev + 1);
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" onLoad={handleScriptLoad} strategy="lazyOnload" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" onLoad={handleScriptLoad} strategy="lazyOnload" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" onLoad={handleScriptLoad} strategy="lazyOnload" />

      <div className="flex flex-col items-center gap-6 p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-10">
        <h2 className="text-3xl font-bold text-gray-800">Real-Time Size Calculator</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full bg-gray-50 p-4 rounded-lg border">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Height (inches)</label>
            <input 
              type="number" 
              value={heightInches}
              onChange={(e) => setHeightInches(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 68 for 5'8&quot;"
            />
            <p className="text-xs text-gray-500 mt-1">Enter your exact height to calibrate the measurement scale.</p>
          </div>
          
          <div className="flex-1 bg-blue-50 p-4 rounded-md flex flex-col justify-center items-center border border-blue-100">
            <p className="text-sm text-blue-600 font-semibold mb-1">Recommended Size</p>
            <p className="text-4xl font-bold text-blue-800">{recommendedSize}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Live Measurements</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Shoulder Width:</span>
                <span className="font-mono font-medium">{measurements.shoulder}&quot;</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Estimated Chest:</span>
                <span className="font-mono font-medium">{measurements.chest}&quot;</span>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Step back so your full body is in the frame.</li>
                <li>Align your body with the dashed guide.</li>
                <li>Stand straight with arms slightly out.</li>
              </ul>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-black aspect-video md:aspect-[4/3] flex items-center justify-center">
            {error && <div className="text-red-500 z-10 absolute text-center px-4">{error}</div>}
            {!isTracking && !error && <div className="text-white z-10 absolute animate-pulse">Initializing Camera...</div>}
            
            <video 
              ref={videoRef} 
              className="hidden" 
              playsInline
            />
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={480}
              className="w-full h-full object-cover transform -scale-x-100" 
            />
          </div>
        </div>
      </div>
    </>
  );
}
