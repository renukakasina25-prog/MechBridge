import React, { useState, useEffect } from 'react';
import { client } from '@/api/apiClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Star, Loader2, MapPinOff } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductLocationModal({ isOpen, onClose, product }) {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      loadMerchantsForProduct();
    }
  }, [isOpen, product]);

  const loadMerchantsForProduct = async () => {
    setLoading(true);
    try {
      const allMerchants = await client.entities.Merchant.list('-rating', 500);
      
      // Filter merchants that have this product in stock or sell this brand
      const relevantMerchants = allMerchants.filter(merchant => {
        // Check if product ID is in stock
        if (merchant.stock_products && merchant.stock_products.includes(product.id)) {
          return true;
        }
        // Check if merchant sells this brand
        if (merchant.brands && product.brand && 
            merchant.brands.some(b => b.toLowerCase().includes(product.brand.toLowerCase()))) {
          return true;
        }
        return false;
      });

      setMerchants(relevantMerchants);
    } catch (error) {
      console.error('Error loading merchants:', error);
      toast.error('Failed to load merchant locations');
    }
    setLoading(false);
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLocationError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          sortMerchantsByDistance(location);
          toast.success('Location access granted!');
        },
        (error) => {
          setLocationError('Location access denied. Please enable location permissions.');
          toast.error('Location access denied');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation not supported');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortMerchantsByDistance = (location) => {
    const sorted = merchants.map(m => ({
      ...m,
      distance: calculateDistance(location.lat, location.lng, m.latitude, m.longitude)
    })).sort((a, b) => a.distance - b.distance);
    setMerchants(sorted);
  };

  const openNavigation = (merchant) => {
    if (!userLocation) {
      toast.error('Please allow location access first');
      requestLocation();
      return;
    }
    
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${merchant.latitude},${merchant.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-bajaj-blue" />
            Find {product?.name} Near You
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Location Permission */}
          {!userLocation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPinOff className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800 mb-2">
                    Enable location access for best results
                  </p>
                  <p className="text-sm text-yellow-700 mb-3">
                    We'll show you the nearest shops and provide turn-by-turn navigation
                  </p>
                  <Button 
                    onClick={requestLocation}
                    className="bg-green-600 hover:bg-black text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Allow Location Access
                  </Button>
                  {locationError && (
                    <p className="text-xs text-red-600 mt-2">{locationError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-bajaj-blue" />
            </div>
          )}

          {/* Merchants List */}
          {!loading && merchants.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">No merchants found with this product</p>
              <p className="text-sm text-slate-500">Try checking other products or contact support</p>
            </div>
          )}

          {!loading && merchants.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Found {merchants.length} shop{merchants.length > 1 ? 's' : ''} selling this product
                {userLocation && ' (sorted by distance)'}
              </p>

              {merchants.map((merchant) => (
                <div 
                  key={merchant.id}
                  className="glass-effect border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{merchant.shop_name}</h3>
                      <p className="text-sm text-slate-600">{merchant.city}, {merchant.district}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {merchant.rating && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                          {merchant.rating}
                        </Badge>
                      )}
                      {merchant.distance && (
                        <Badge variant="outline" className="text-xs">
                          {merchant.distance.toFixed(1)} km away
                        </Badge>
                      )}
                    </div>
                  </div>

                  {merchant.brands && merchant.brands.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {merchant.brands.slice(0, 3).map((brand, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-600 mb-3">{merchant.address}</p>

                  <div className="flex gap-2">
                    {merchant.phone && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`tel:${merchant.phone}`, '_blank')}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-black text-white flex-1"
                      onClick={() => openNavigation(merchant)}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}