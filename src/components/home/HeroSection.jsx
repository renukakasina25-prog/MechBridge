import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Zap, Package, Search, Camera, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FloatingSpares from '../3d/FloatingSpares';
import QRScannerModal from '../common/QRScannerModal';
import { toast } from 'sonner';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = createPageUrl(`Catalog?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleScanSuccess = (scannedData) => {
    setIsScannerOpen(false);
    window.location.href = createPageUrl(`Catalog?search=${encodeURIComponent(scannedData)}`);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice search is not supported by your browser.");
      return;
    }

    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Speak the part name now.");
    };

    recognition.onresult = (event) => {
      const voiceResult = event.results[0][0].transcript;
      setSearchTerm(voiceResult);
      if (voiceResult.trim()) {
        window.location.href = createPageUrl(`Catalog?search=${encodeURIComponent(voiceResult.trim())}`);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please enable it in browser settings.");
      } else {
        toast.warning("Could not recognize speech. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8 md:py-0">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <FloatingSpares count={15} />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-bajaj-blue/10 via-transparent to-bajaj-maroon/10"></div>
      
      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto text-center">
        <div className="glass-effect rounded-2xl md:rounded-3xl p-6 md:p-12 glow-effect">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="floating-animation relative">
              {/* Dramatic shadow beneath the logo */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-6 md:w-24 md:h-8 bg-black/60 blur-2xl rounded-full"></div>

              {/* Full Logo Display */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68bd4d604890101c87a5b6b7/ffe32f84d_ChatGPTImageJan7202610_45_37PM.png" 
                  alt="MechBridge Logo" 
                  className="w-full h-full object-contain"
                  style={{
                    filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))'
                  }}
                />

                {/* Glow effects */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-bajaj-blue/20 to-cyan-500/30 animate-pulse opacity-60 blur-lg"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
            <span className="text-gradient">MechBridge</span>
            <span className="block text-lg md:text-2xl lg:text-3xl text-slate-700 mt-2 font-medium">
              One Click to All Your 2-Wheeler Spares
            </span>
          </h1>

          {/* Mobile-First Search Bar */}
          <div className="mb-6 md:mb-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
              <Input
                placeholder={isListening ? "Listening..." : "Search by voice, scan, or text..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 md:pl-12 pr-20 md:pr-24 py-3 md:py-4 text-base md:text-lg bg-white/90 hover:border-bajaj-blue focus:border-bajaj-blue focus:ring-bajaj-blue rounded-xl md:rounded-2xl shadow-lg"
              />
              <div className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 md:h-10 md:w-10 hover:bg-bajaj-blue/10 rounded-lg md:rounded-xl"
                  onClick={handleVoiceSearch}
                >
                  <Mic className={`w-4 h-4 md:w-5 md:h-5 ${isListening ? 'text-red-500 animate-pulse' : 'text-bajaj-blue'}`} />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 md:h-10 md:w-10 hover:bg-bajaj-blue/10 rounded-lg md:rounded-xl"
                  onClick={() => setIsScannerOpen(true)}
                >
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-bajaj-blue" />
                </Button>
              </div>
            </form>
          </div>
          
          <p className="text-sm md:text-lg lg:text-xl text-slate-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Your trusted partner for premium quality 2-wheeler spare parts. 
            <span className="text-bajaj-blue font-semibold"> AI-powered scanning</span>, 
            <span className="text-bajaj-maroon font-semibold"> instant deals</span>, 
            and <span className="text-bajaj-blue font-semibold"> direct payment to owner</span> 
            for secure transactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-2">
            <Link to={createPageUrl("Catalog")} className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-green-600 hover:bg-black 
                         text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl glow-effect transition-all duration-300 
                         hover:scale-105"
              >
                <Package className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Explore Catalog
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Button>
            </Link>

            <Link to={createPageUrl("Deals")} className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto bg-blue-600 hover:bg-black text-white
                         px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Today's Deals
              </Button>
            </Link>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-bajaj-blue mb-3 md:mb-4 mx-auto" />
              <h3 className="font-bold text-slate-700 mb-1 md:mb-2 text-sm md:text-base">2,500+ Parts</h3>
              <p className="text-slate-600 text-xs md:text-sm">Complete catalog for all major 2-wheeler brands</p>
            </div>
            
            <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-bajaj-maroon mb-3 md:mb-4 mx-auto" />
              <h3 className="font-bold text-slate-700 mb-1 md:mb-2 text-sm md:text-base">Instant Deals</h3>
              <p className="text-slate-600 text-xs md:text-sm">Daily offers and QR code deals</p>
            </div>
            
            <div className="glass-effect rounded-xl md:rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-green-600 mb-3 md:mb-4 mx-auto" />
              <h3 className="font-bold text-slate-700 mb-1 md:mb-2 text-sm md:text-base">Secure Payment</h3>
              <p className="text-slate-600 text-xs md:text-sm">Direct UPI to owner with instant confirmation</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements - Hidden on mobile for cleaner look */}
      <div className="hidden md:block absolute top-20 left-10 floating-animation opacity-70 z-10">
        <div className="w-12 h-12 bg-gradient-to-r from-bajaj-maroon to-bajaj-blue rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">🔧</span>
        </div>
      </div>
      
      <div className="hidden md:block absolute bottom-20 right-10 floating-animation opacity-70 z-10" style={{animationDelay: '2s'}}>
        <div className="w-16 h-16 bg-gradient-to-r from-bajaj-blue to-bajaj-maroon rounded-full flex items-center justify-center shadow-lg">
          <span className="text-3xl">⚙️</span>
        </div>
      </div>
      
      <div className="hidden lg:block absolute top-1/2 left-5 floating-animation opacity-50 z-10" style={{animationDelay: '4s'}}>
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-bajaj-blue rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl">🏍️</span>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanSuccess={handleScanSuccess} 
      />
    </div>
  );
}