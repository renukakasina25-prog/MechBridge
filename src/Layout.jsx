import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from '@/entities/User';
import { toast } from "sonner";
import { 
  Home, 
  Package, 
  Zap, 
  User as UserIcon,
  Settings, 
  Menu,
  QrCode,
  Sparkles,
  Search,
  ShoppingCart,
  Heart,
  LogOut,
  Camera,
  Mic,
  MapPin,
  Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QRScannerModal from "@/components/common/QRScannerModal";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Catalog",
    url: createPageUrl("Catalog"),
    icon: Package,
  },
  {
    title: "Daily Deals",
    url: createPageUrl("Deals"),
    icon: Zap,
  },
  {
    title: "My Orders",
    url: createPageUrl("MyOrders"),
    icon: Package,
  },
  {
    title: "Find Locations",
    url: createPageUrl("LocationFinder"),
    icon: MapPin,
  },
  {
    title: "QR Scanner",
    url: createPageUrl("Scanner"),
    icon: QrCode,
  },
  {
    title: "QR Generator",
    url: createPageUrl("QRGenerator"),
    icon: Sparkles,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await User.logout();
      toast.success("Logged out successfully!");
      window.location.href = createPageUrl("Home"); 
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

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
    <div className="min-h-screen bg-slate-100 overflow-x-hidden">
      <style>{`
        :root {
          --bajaj-blue: #002D62;
          --bajaj-maroon: #6D0000;
          --classy-black: #1a1a1a;
          --classy-white: #FFFFFF;
          --classy-light-gray: #f0f2f5;
          --accent-silver: #C0C0C0;

          --primary-blue: var(--bajaj-blue);
          --accent-yellow: var(--accent-silver);

          --glass-bg: rgba(255, 255, 255, 0.6);
          --glass-border: rgba(209, 213, 219, 0.3);
        }
        
        .glass-effect {
          background: var(--glass-bg);
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .floating-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          75% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        .glow-effect {
          box-shadow: 0 0 20px rgba(0, 45, 98, 0.2);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, var(--bajaj-blue), var(--bajaj-maroon));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Mobile fixes - prevent horizontal scroll and fix widths */
        * {
          box-sizing: border-box;
        }
        
        body, html {
          overflow-x: hidden;
          max-width: 100vw;
        }
        
        .sidebar {
          max-width: 100vw;
        }
      `}</style>
      
      <SidebarProvider>
        <div className="flex w-full max-w-full overflow-x-hidden">
          <Sidebar className="border-r-0 glass-effect">
            <SidebarHeader className="p-4 md:p-6 border-b border-slate-200">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68bd4d604890101c87a5b6b7/ffe32f84d_ChatGPTImageJan7202610_45_37PM.png"
                    alt="MechBridge Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-bold text-gradient">MechBridge</h2>
                  <p className="text-xs text-bajaj-blue/70">One Click to All Spares</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-2">
              <SidebarGroup>
                <SidebarGroupLabel className="text-bajaj-blue/80 font-semibold px-2 py-2 text-xs md:text-sm">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-bajaj-blue/10 hover:text-bajaj-blue transition-all duration-300 rounded-xl mb-1 ${
                            location.pathname === item.url ? 'bg-bajaj-blue/10 text-bajaj-blue' : 'text-slate-600'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3">
                            <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-xs md:text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-bajaj-blue/80 font-semibold px-2 py-2 text-xs md:text-sm">
                  Account
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-bajaj-blue/10 hover:text-bajaj-blue transition-all duration-300 rounded-xl mb-1 text-slate-600`}
                        >
                          <Link to={createPageUrl("Profile")} className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3">
                            <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-xs md:text-sm">My Profile</span>
                          </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {user?.role === 'admin' && (
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-green-600/10 hover:text-green-600 transition-all duration-300 rounded-xl mb-1 text-slate-600`}
                        >
                          <Link to={createPageUrl("AdminOrders")} className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3">
                            <Shield className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-xs md:text-sm">Admin Orders</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                     <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={handleLogout}
                          className={`hover:bg-bajaj-maroon/10 hover:text-bajaj-maroon text-slate-600 transition-all duration-300 rounded-xl mb-1 w-full`}
                        >
                          <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3">
                            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-xs md:text-sm">Logout</span>
                          </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200 p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-bajaj-blue to-classy-black rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-700 text-xs md:text-sm truncate">Welcome Back</p>
                  <p className="text-xs text-bajaj-blue/70">Spare Parts Expert</p>
                </div>
                 <Link to={createPageUrl("Profile")}>
                    <Settings className="w-4 h-4 md:w-5 md:h-5 text-slate-400 hover:text-bajaj-blue cursor-pointer transition-colors" />
                </Link>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col max-w-full overflow-x-hidden">
            <header className="glass-effect border-b-0 sticky top-0 z-30 px-3 md:px-4 py-2">
              <div className="flex items-center justify-between gap-2 md:gap-4 max-w-full">
                 <div className="flex items-center gap-2">
                    <SidebarTrigger className="hover:bg-bajaj-blue/10 p-2 rounded-lg transition-colors md:hidden">
                      <Menu className="w-5 h-5 text-bajaj-blue" />
                    </SidebarTrigger>
                    <h1 className="text-lg md:text-xl font-bold text-gradient md:hidden truncate">MechBridge</h1>
                 </div>

                {currentPageName !== 'Home' && (
                  <form onSubmit={handleSearch} className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 md:w-4 md:h-4 pointer-events-none" />
                    <Input
                      placeholder={isListening ? "Listening..." : "Search parts..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 md:pl-10 pr-16 md:pr-20 text-sm md:text-base bg-white/80 hover:border-bajaj-blue focus:border-bajaj-blue focus:ring-bajaj-blue"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 md:h-8 md:w-8 hover:bg-bajaj-blue/10"
                        onClick={handleVoiceSearch}
                      >
                        <Mic className={`w-3 h-3 md:w-4 md:h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 md:h-8 md:w-8 hover:bg-bajaj-blue/10"
                        onClick={() => setIsScannerOpen(true)}
                      >
                        <Camera className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                      </Button>
                    </div>
                  </form>
                )}

                <div className="flex items-center gap-1 md:gap-2">
                   <Link to={createPageUrl("Wishlist")}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 hover:bg-bajaj-blue/10">
                      <Heart className="w-4 h-4 md:w-5 md:h-5 text-slate-600 hover:text-bajaj-maroon" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Cart")}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 hover:bg-bajaj-blue/10">
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-slate-600 hover:text-bajaj-blue" />
                    </Button>
                  </Link>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto bg-classy-light-gray max-w-full">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanSuccess} />
    </div>
  );
}