import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  QrCode, 
  Flashlight, 
  FlashlightOff, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Scanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [stream, setStream] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError('');
      setIsProcessing(true);
      
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // Start QR code detection
      setTimeout(() => {
        detectQRCode();
      }, 1000);
      
    } catch (err) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setError('Camera access denied. Please enable camera permission and try again.');
    }
    setIsProcessing(false);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const detectQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simulate QR code detection (in a real app, you'd use a QR code library)
    // For demo purposes, we'll simulate finding a QR code after 3 seconds
    setTimeout(() => {
      if (isScanning && Math.random() > 0.7) {
        const mockQRData = 'DEAL:CHAIN30:https://autospareone.com/deals/chain30';
        handleQRDetected(mockQRData);
      } else if (isScanning) {
        detectQRCode();
      }
    }, 1000);
  };

  const handleQRDetected = (data) => {
    setScannedData(data);
    setIsScanning(false);
    
    // Parse QR code data
    if (data.startsWith('DEAL:')) {
      const [, couponCode, url] = data.split(':');
      setScannedData({
        type: 'deal',
        couponCode,
        url,
        message: `Deal found! Use coupon code: ${couponCode}`
      });
    } else if (data.startsWith('PRODUCT:')) {
      const [, productId, url] = data.split(':');
      setScannedData({
        type: 'product',
        productId,
        url,
        message: `Product found! Opening product details...`
      });
    } else {
      setScannedData({
        type: 'unknown',
        data,
        message: 'QR code detected but not recognized as MechBridge code'
      });
    }
  };

  const toggleFlash = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashEnabled }]
          });
          setFlashEnabled(!flashEnabled);
        } catch (err) {
          console.error('Flash toggle error:', err);
        }
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const resetScanner = () => {
    setScannedData(null);
    setError('');
    startCamera();
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center glow-effect">
              <QrCode className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-2">QR Code Scanner</h1>
          <p className="text-slate-600">Scan QR codes to access exclusive deals and product information</p>
        </div>

        {/* Scanner Interface */}
        {!hasPermission && hasPermission !== null && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Camera access is required to scan QR codes. Please enable camera permission in your browser settings.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Camera Interface */}
        <Card className="glass-effect border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner
              </span>
              {isScanning && (
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  Active
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
              
              {/* Scanner Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanner Frame */}
                    <div className="w-64 h-64 border-4 border-yellow-400 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
                      
                      {/* Scanning Line */}
                      <div 
                        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
                        style={{
                          animation: 'scan 2s ease-in-out infinite',
                          top: '50%'
                        }}
                      ></div>
                    </div>
                    
                    <style>{`
                      @keyframes scan {
                        0%, 100% { top: 10%; opacity: 0; }
                        50% { top: 90%; opacity: 1; }
                      }
                    `}</style>
                  </div>
                </div>
              )}
              
              {!isScanning && !scannedData && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera Ready</p>
                    <p className="text-sm opacity-70">Tap start to begin scanning</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 justify-center mb-4">
              {!isScanning && !scannedData && (
                <Button
                  onClick={startCamera}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Starting...' : 'Start Scanning'}
                </Button>
              )}
              
              {isScanning && (
                <>
                  <Button variant="outline" onClick={stopCamera}>
                    Stop
                  </Button>
                  
                  <Button variant="outline" onClick={switchCamera}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" onClick={toggleFlash}>
                    {flashEnabled ? <FlashlightOff className="w-4 h-4" /> : <Flashlight className="w-4 h-4" />}
                  </Button>
                </>
              )}
              
              {scannedData && (
                <Button onClick={resetScanner} className="bg-green-600 hover:bg-green-700">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan Another
                </Button>
              )}
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-slate-600">
              <Smartphone className="w-5 h-5 mx-auto mb-2" />
              <p>Position the QR code within the yellow frame</p>
              <p className="text-xs mt-1">Make sure the code is well-lit and clearly visible</p>
            </div>
          </CardContent>
        </Card>

        {/* Scanned Result */}
        {scannedData && (
          <Card className="glass-effect border-0 glow-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                QR Code Detected!
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">{scannedData.message}</p>
                  
                  {scannedData.type === 'deal' && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-slate-600">Coupon Code:</p>
                      <p className="text-xl font-bold text-blue-700">{scannedData.couponCode}</p>
                      <Button className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                        Apply Deal
                      </Button>
                    </div>
                  )}
                  
                  {scannedData.type === 'product' && (
                    <div className="mt-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View Product Details
                      </Button>
                    </div>
                  )}
                  
                  {scannedData.type === 'unknown' && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">Raw Data:</p>
                      <p className="font-mono text-xs break-all">{scannedData.data}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="glass-effect border-0 mt-6">
          <CardHeader>
            <CardTitle className="text-lg">How to Use QR Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">1</div>
              <p>Tap "Start Scanning" to activate your camera</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">2</div>
              <p>Point your camera at the QR code on MechBridge deals or products</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">3</div>
              <p>Keep the QR code within the yellow frame until detected</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">4</div>
              <p>Follow the prompts to apply deals or view product details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}