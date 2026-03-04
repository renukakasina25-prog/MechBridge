import React, { useRef, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, Upload, Loader2 } from 'lucide-react';
import { InvokeLLM, UploadFile } from '@/integrations/Core';
import { toast } from 'sonner';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setIsScanning(true);
      toast.success("Camera activated! Point at a spare part to identify it.");
    } catch (err) {
      console.error("Camera access denied:", err);
      toast.error("Camera access required. Please enable camera permissions.");
      onClose();
    }
  }, [onClose]);

  const captureAndAnalyze = useCallback(async () => {
    if (!videoRef.current || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Capture frame from video
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        try {
          // Upload image to get URL
          const uploadResult = await UploadFile({ file: blob });
          
          // Use AI to identify the product
          const aiResponse = await InvokeLLM({
            prompt: `Analyze this image of a motorcycle/scooter spare part. Identify the specific part name and provide a search term that would help find this part in a spare parts catalog. Consider common 2-wheeler parts like brake pads, chain sprockets, air filters, spark plugs, etc. 
            
            Respond with just the most likely part name in simple terms that a customer would search for (e.g., "brake pad", "chain sprocket", "air filter").`,
            file_urls: [uploadResult.file_url],
            response_json_schema: {
              type: "object",
              properties: {
                part_name: { type: "string", description: "Simple, searchable part name" },
                confidence: { type: "number", description: "Confidence level 0-1" }
              }
            }
          });

          if (aiResponse.confidence > 0.3) {
            stopCamera();
            onScanSuccess(aiResponse.part_name);
            toast.success(`Identified: ${aiResponse.part_name}`);
          } else {
            toast.error("Couldn't identify the part clearly. Try a different angle or better lighting.");
          }
        } catch (error) {
          console.error('AI analysis error:', error);
          toast.error("Failed to analyze image. Please try again.");
        }
      }, 'image/jpeg', 0.8);
      
    } catch (error) {
      console.error('Capture error:', error);
      toast.error("Failed to capture image. Please try again.");
    }
    setIsProcessing(false);
  }, [isProcessing, stopCamera, onScanSuccess]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const uploadResult = await UploadFile({ file });
      
      const aiResponse = await InvokeLLM({
        prompt: `Analyze this image of a motorcycle/scooter spare part. Identify the specific part name and provide a search term that would help find this part in a spare parts catalog. 
        
        Respond with just the most likely part name in simple terms that a customer would search for.`,
        file_urls: [uploadResult.file_url],
        response_json_schema: {
          type: "object",
          properties: {
            part_name: { type: "string" },
            confidence: { type: "number" }
          }
        }
      });

      if (aiResponse.confidence > 0.3) {
        onScanSuccess(aiResponse.part_name);
        toast.success(`Identified: ${aiResponse.part_name}`);
      } else {
        toast.error("Couldn't identify the part clearly. Please try a clearer image.");
      }
    } catch (error) {
      console.error('Upload analysis error:', error);
      toast.error("Failed to analyze image. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-bajaj-blue" />
            AI Part Scanner
          </DialogTitle>
          <DialogDescription>
            Use AI to identify spare parts from photos. Point camera at part or upload image.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          {!isScanning ? (
            <div className="space-y-4">
              <Button 
                onClick={startCamera} 
                className="w-full bg-gradient-to-r from-bajaj-blue to-bajaj-maroon"
                disabled={isProcessing}
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera Scanner
              </Button>
              
              <div className="text-center text-sm text-slate-500">or</div>
              
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-square bg-black rounded-xl overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={captureAndAnalyze}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-bajaj-blue to-bajaj-maroon"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <QrCode className="w-4 h-4 mr-2" />
                  )}
                  {isProcessing ? 'Analyzing...' : 'Scan Part'}
                </Button>
                
                <Button variant="outline" onClick={stopCamera} disabled={isProcessing}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-center text-sm text-bajaj-blue">
              AI is analyzing the image... Please wait.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}