import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, Download, Share, MessageCircle, Send, Instagram as InstagramIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function WebsiteQR() {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const websiteUrl = 'https://preview--mechbridge-spareparts.base44.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(websiteUrl)}`;
  const largeQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(websiteUrl)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl);
      toast.success('Website URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
      console.error('Failed to copy:', err);
    }
  };

  const downloadQR = async () => {
    try {
      const response = await fetch(largeQrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mechbridge-qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('QR code downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download QR code');
      console.error('Download error:', err);
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Check out MechBridge - India's Premier 2-Wheeler Spare Parts Platform!\n\n🏍️ 2,500+ Parts Available\n⚡ Daily Deals\n✅ Quality Assured\n\nVisit: ${websiteUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaTelegram = () => {
    const message = encodeURIComponent(`Check out MechBridge for all your 2-wheeler spare parts needs! ${websiteUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(websiteUrl)}&text=${message}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaMessenger = () => {
    window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(websiteUrl)}&app_id=`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaInstagram = () => {
    copyToClipboard();
    toast.info('URL copied! Open Instagram and paste it in your story or post');
    setShowShareOptions(false);
  };

  return (
    <div className="space-y-6">
      {/* Main QR Code Card */}
      <Card className="glass-effect border-0 glow-effect">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center glow-effect">
              <QrCode className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gradient">MechBridge Website QR</CardTitle>
          <Badge className="bg-green-100 text-green-700 border-green-300 mx-auto">
            Scan to Visit Website
          </Badge>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="relative p-6 bg-white rounded-2xl shadow-lg border-4 border-blue-100">
              <img 
                src={qrCodeUrl}
                alt="MechBridge Website QR Code"
                className="w-72 h-72 rounded-xl"
                style={{ imageRendering: 'pixelated' }}
              />
              
              {/* MechBridge Logo Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-600">
                  <span className="text-2xl">🏍️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Website URL Display */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">Website URL:</p>
            <p className="font-mono text-sm text-blue-700 break-all bg-white px-3 py-2 rounded border">
              {websiteUrl}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={copyToClipboard}
              variant="outline" 
              className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </Button>
            
            <Button 
              onClick={downloadQR}
              variant="outline"
              className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR
            </Button>
            
            <Button 
              onClick={() => setShowShareOptions(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Usage Instructions */}
          <div className="text-left bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              How to Use This QR Code:
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>Open your phone's camera app or QR scanner</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>Point the camera at this QR code</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>Tap the notification to open MechBridge website</span>
              </li>
              <li className="flex gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                <span>Browse 2,500+ spare parts and exclusive deals!</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Card */}
      <Card className="glass-effect border-0">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold text-gradient">Share MechBridge</h3>
            <p className="text-slate-600">
              Help others discover India's premier 2-wheeler spare parts platform
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🏍️</span>
                </div>
                <h4 className="font-semibold text-slate-700">2,500+ Parts</h4>
                <p className="text-sm text-slate-500">Complete catalog</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-slate-700">Instant Deals</h4>
                <p className="text-sm text-slate-500">QR code offers</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-semibold text-slate-700">Quality Assured</h4>
                <p className="text-sm text-slate-500">Premium parts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Options Dialog */}
      <Dialog open={showShareOptions} onOpenChange={setShowShareOptions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Share MechBridge</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={shareViaWhatsApp}
              className="h-24 flex flex-col gap-2 bg-green-500 hover:bg-green-600"
            >
              <MessageCircle className="w-8 h-8" />
              <span>WhatsApp</span>
            </Button>
            
            <Button
              onClick={shareViaTelegram}
              className="h-24 flex flex-col gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-8 h-8" />
              <span>Telegram</span>
            </Button>
            
            <Button
              onClick={shareViaMessenger}
              className="h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="w-8 h-8" />
              <span>Messenger</span>
            </Button>
            
            <Button
              onClick={shareViaInstagram}
              className="h-24 flex flex-col gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <InstagramIcon className="w-8 h-8" />
              <span>Instagram</span>
            </Button>
          </div>
          <div className="text-center text-sm text-slate-500">
            Click on any platform to share MechBridge
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}