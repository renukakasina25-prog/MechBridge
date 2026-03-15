import React, { useState, useEffect } from 'react';
import { client } from '@/api/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Star, Search, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from 'sonner';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
}

export default function LocationFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [mapCenter, setMapCenter] = useState([15.9129, 79.7400]); // Andhra Pradesh center

  useEffect(() => {
    loadMerchants();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Location access denied:', error);
        }
      );
    }
  };

  const loadMerchants = async () => {
    setLoading(true);
    try {
      const data = await client.entities.Merchant.list('-rating', 500);
      setMerchants(data);
      setFilteredMerchants(data);
    } catch (error) {
      console.error('Error loading merchants:', error);
      toast.error('Failed to load merchant locations');
    }
    setLoading(false);
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

  const handleSearch = () => {
    let filtered = merchants;

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.brands && m.brands.some(b => b.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(m => m.district === selectedDistrict);
    }

    // Sort by distance if user location available
    if (userLocation) {
      filtered = filtered.map(m => ({
        ...m,
        distance: calculateDistance(userLocation.lat, userLocation.lng, m.latitude, m.longitude)
      })).sort((a, b) => a.distance - b.distance);
    }

    setFilteredMerchants(filtered);
  };

  const openNavigation = (merchant) => {
    if (!userLocation) {
      toast.error('Please enable location access to use navigation');
      return;
    }
    
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${merchant.latitude},${merchant.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const districts = [...new Set(merchants.map(m => m.district))].sort();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gradient mb-2">Find Nearest Spare Parts Shop</h1>
          <p className="text-slate-600">Locate authorized dealers and spare parts merchants across India with real-time navigation</p>
        </div>

        {/* Search & Filters */}
        <Card className="glass-effect border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by shop name, city, district, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">All Districts</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Button onClick={handleSearch} className="bg-gradient-to-r from-bajaj-blue to-bajaj-maroon">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map & Results */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Map View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] rounded-xl overflow-hidden">
                <MapContainer 
                  center={mapCenter} 
                  zoom={12} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapUpdater center={mapCenter} />
                  
                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                  
                  {/* Merchant Markers */}
                  {filteredMerchants.map(merchant => (
                    <Marker 
                      key={merchant.id} 
                      position={[merchant.latitude, merchant.longitude]}
                      eventHandlers={{
                        click: () => {
                          setSelectedMerchant(merchant);
                          setMapCenter([merchant.latitude, merchant.longitude]);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{merchant.shop_name}</h3>
                          <p className="text-sm">{merchant.city}</p>
                          {merchant.distance && (
                            <p className="text-xs text-slate-600">{merchant.distance.toFixed(1)} km away</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="space-y-4 max-h-[560px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-bajaj-blue" />
              </div>
            ) : filteredMerchants.length === 0 ? (
              <Card className="glass-effect border-0">
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">No merchants found. Try adjusting your search.</p>
                </CardContent>
              </Card>
            ) : (
              filteredMerchants.map(merchant => (
                <Card 
                  key={merchant.id} 
                  className={`glass-effect border-0 hover:shadow-lg transition-all cursor-pointer ${
                    selectedMerchant?.id === merchant.id ? 'ring-2 ring-bajaj-blue' : ''
                  }`}
                  onClick={() => {
                    setSelectedMerchant(merchant);
                    setMapCenter([merchant.latitude, merchant.longitude]);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800">{merchant.shop_name}</h3>
                        <p className="text-sm text-slate-600">{merchant.city}, {merchant.district}</p>
                      </div>
                      {merchant.rating && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                          {merchant.rating}
                        </Badge>
                      )}
                    </div>

                    {merchant.brands && merchant.brands.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {merchant.brands.slice(0, 3).map((brand, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {brand}
                          </Badge>
                        ))}
                        {merchant.brands.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{merchant.brands.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <p className="text-sm text-slate-600 mb-3">{merchant.address}</p>

                    <div className="flex gap-2">
                      {merchant.phone && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${merchant.phone}`, '_blank');
                          }}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-bajaj-blue to-bajaj-maroon"
                        onClick={(e) => {
                          e.stopPropagation();
                          openNavigation(merchant);
                        }}
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Navigate
                        {merchant.distance && ` (${merchant.distance.toFixed(1)} km)`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}