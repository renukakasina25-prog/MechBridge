import React, { useState, useEffect } from 'react';
import { Product } from '@/entities/Product';
import { User } from '@/entities/User';
import { CartItem } from '@/entities/CartItem';
import { WishlistItem } from '@/entities/WishlistItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Cog,
  Zap,
  Fuel,
  Settings,
  Disc,
  Waves,
  Bike,
  Car,
  Thermometer,
  Filter,
  Wind,
  Cable,
  Droplets,
  Wrench,
  ShoppingCart,
  Heart,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const CATEGORY_CONFIG = [
  {
    id: 'engine_parts',
    name: 'Engine Parts',
    icon: Cog,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    description: 'Pistons, Rings, Cylinders, Valves, Gaskets',
    subcategories: ['Piston & Rings', 'Cylinder Head', 'Valves & Springs', 'Gaskets & Seals', 'Connecting Rods', 'Crankshaft', 'Camshaft']
  },
  {
    id: 'electrical_system',
    name: 'Electrical System',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    description: 'Batteries, Spark Plugs, Lights, Wiring',
    subcategories: ['Batteries', 'Spark Plugs', 'Ignition Coils', 'Stators & Rotors', 'Headlights', 'Tail Lights', 'Indicators', 'Horns']
  },
  {
    id: 'fuel_system',
    name: 'Fuel System',
    icon: Fuel,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    description: 'Carburettors, Fuel Injectors, Pumps, Filters',
    subcategories: ['Carburettors', 'Fuel Injectors', 'Fuel Pumps', 'Fuel Filters', 'Fuel Tanks', 'Petcocks']
  },
  {
    id: 'transmission_drivetrain',
    name: 'Transmission & Drivetrain',
    icon: Settings,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    description: 'Clutch, Chains, Sprockets, Gearbox',
    subcategories: ['Clutch Plates', 'Drive Chains', 'Sprockets', 'Gearbox Parts', 'CVT Components', 'Clutch Springs']
  },
  {
    id: 'braking_system',
    name: 'Braking System',
    icon: Disc,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    description: 'Brake Pads, Discs, Drums, Cables, Fluid',
    subcategories: ['Brake Pads', 'Brake Discs', 'Brake Drums', 'Brake Cables', 'Master Cylinders', 'Brake Levers']
  },
  {
    id: 'suspension',
    name: 'Suspension',
    icon: Waves,
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    description: 'Shock Absorbers, Fork Springs, Seals',
    subcategories: ['Shock Absorbers', 'Fork Springs', 'Fork Seals', 'Swing Arms', 'Bushings', 'Dampers']
  },
  {
    id: 'wheels_tyres',
    name: 'Wheels & Tyres',
    icon: Bike,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    description: 'Tyres, Tubes, Rims, Spokes, Hubs',
    subcategories: ['Front Tyres', 'Rear Tyres', 'Tubes', 'Rims/Wheels', 'Spokes', 'Hub Assemblies']
  },
  {
    id: 'body_frame',
    name: 'Body & Frame',
    icon: Car,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    description: 'Fenders, Panels, Seats, Handlebars',
    subcategories: ['Fenders', 'Side Panels', 'Seats', 'Handlebars', 'Mirrors', 'Footrests', 'Mudguards']
  },
  {
    id: 'cooling_system',
    name: 'Cooling System',
    icon: Thermometer,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    description: 'Radiators, Fans, Thermostats, Hoses',
    subcategories: ['Radiators', 'Cooling Fans', 'Thermostats', 'Coolant Hoses', 'Water Pumps']
  },
  {
    id: 'air_filtration',
    name: 'Air & Filtration',
    icon: Filter,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    description: 'Air Filters, Oil Filters, Fuel Filters',
    subcategories: ['Air Filters', 'Oil Filters', 'Fuel Filters', 'Cabin Filters']
  },
  {
    id: 'exhaust_system',
    name: 'Exhaust System',
    icon: Wind,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    description: 'Exhaust Pipes, Silencers, Mufflers',
    subcategories: ['Exhaust Pipes', 'Silencers/Mufflers', 'Exhaust Gaskets', 'Catalytic Converters']
  },
  {
    id: 'controls_cables',
    name: 'Controls & Cables',
    icon: Cable,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    description: 'Throttle, Clutch, Brake Cables',
    subcategories: ['Throttle Cables', 'Clutch Cables', 'Brake Cables', 'Accelerator Cables', 'Speedometer Cables']
  },
  {
    id: 'maintenance_fluids',
    name: 'Maintenance & Fluids',
    icon: Droplets,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    description: 'Engine Oil, Brake Fluid, Coolant',
    subcategories: ['Engine Oil', 'Gear Oil', 'Brake Fluid', 'Coolant', 'Chain Lube', 'Grease']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: Wrench,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    description: 'Helmets, Locks, Covers, Tools',
    subcategories: ['Helmets', 'Locks', 'Bike Covers', 'Tool Kits', 'Phone Mounts', 'LED Strips']
  }
];

export default function CategoryShowcase() {
  const [categoryStats, setCategoryStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch(e) {
        console.warn('User not logged in:', e);
      }
      await loadCategoryStats();
    };
    init();
  }, []);

  const loadCategoryStats = async () => {
    try {
      const stats = {};
      const allProducts = await Product.list('-created_date', 500); 

      for (const category of CATEGORY_CONFIG) {
        const categoryProds = allProducts.filter(p => p.category === category.id);
        stats[category.id] = categoryProds.length;
        setCategoryProducts(prev => ({
          ...prev,
          [category.id]: categoryProds
        }));
      }
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error loading category stats:', error);
    }
    setLoading(false);
  };

  const addToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      const existingItem = await CartItem.filter({ user_email: user.email, product_id: product.id });
      if (existingItem.length > 0) {
        await CartItem.update(existingItem[0].id, { quantity: existingItem[0].quantity + 1 });
        toast.success("Increased quantity in cart!");
      } else {
        await CartItem.create({ user_email: user.email, product_id: product.id, quantity: 1 });
        toast.success(`Added ${product.name} to cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Failed to add to cart.");
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist.");
      return;
    }
    try {
      const existingItem = await WishlistItem.filter({ user_email: user.email, product_id: product.id });
      if (existingItem.length > 0) {
        toast.info(`${product.name} is already in your wishlist.`);
      } else {
        await WishlistItem.create({ user_email: user.email, product_id: product.id });
        toast.success(`Added ${product.name} to wishlist!`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error("Failed to add to wishlist.");
    }
  };

  const totalProductCount = Object.values(categoryStats).reduce((a, b) => a + b, 0);

  return (
    <div className="py-8 md:py-16 px-4 md:px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Category Names */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gradient mb-6">
            <span className="text-bajaj-blue">{totalProductCount}</span> Parts Across 14 Categories
          </h2>
          
          {/* Category Tags */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-5xl mx-auto">
            {CATEGORY_CONFIG.map((category) => (
              <Link 
                key={category.id}
                to={`${createPageUrl("Catalog")}?category=${category.id}`}
              >
                <Badge 
                  className="bg-slate-700 hover:bg-black text-white px-3 md:px-4 py-2 text-xs md:text-sm cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {CATEGORY_CONFIG.map((category) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;
            const products = categoryProducts[category.id] || [];
            const previewProducts = isExpanded ? products : products.slice(0, 3); 

            return (
              <Card
                key={category.id}
                className="glass-effect border-0 hover:glow-effect transition-all duration-300 group"
              >
                <CardHeader className="pb-3 md:pb-4">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <div className={`p-2 md:p-3 rounded-2xl bg-gradient-to-r ${category.color}`}>
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <Badge variant="outline" className={`${category.textColor} border-current text-xs`}>
                      {loading ? '...' : `${categoryStats[category.id] || 0} parts`}
                    </Badge>
                  </div>
                  <CardTitle className="text-base md:text-lg font-bold text-slate-800 group-hover:text-bajaj-blue transition-colors">
                    <Link to={`${createPageUrl("Catalog")}?category=${category.id}`} className="hover:underline">
                      {category.name}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 space-y-3 md:space-y-4">
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Products Preview */}
                  {previewProducts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">Popular Parts:</p>
                      <div className={`space-y-1 ${isExpanded ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                        {previewProducts.map((product, idx) => (
                          <div key={idx} className="p-2 bg-white/50 rounded-lg border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <Link to={`${createPageUrl("ProductDetail")}?id=${product.id}`} className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 truncate hover:text-bajaj-blue">{product.name}</h4>
                                <p className="text-slate-500">₹{product.price.toLocaleString()}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className={`w-2 h-2 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                                  ))}
                                </div>
                            </Link>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 h-6 w-8 p-0 text-xs"
                                onClick={(e) => { e.preventDefault(); addToWishlist(product); }}
                                aria-label={`Add ${product.name} to wishlist`}
                              >
                                <Heart className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 h-6 w-8 p-0 text-xs bg-green-600 hover:bg-black text-white"
                                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                aria-label={`Add ${product.name} to cart`}
                              >
                                <ShoppingCart className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {products.length > 3 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      >
                        {isExpanded ? 'Show Less' : `Show ${products.length - 3} More`}
                      </Button>
                    )}

                    <Link to={`${createPageUrl("Catalog")}?category=${category.id}`} className="flex-1">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-black text-white border-0 text-xs"
                        size="sm"
                      >
                        Shop All {category.name}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Contact Support Section */}
        <div className="mt-12 md:mt-16 glass-effect rounded-3xl p-6 md:p-8 text-center glow-effect">
          <h3 className="text-xl md:text-2xl font-bold text-gradient mb-4">
            Need Help Finding the Right Part?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto text-sm md:text-base">
            Our BikeMitra expert team can help you find the exact spare part you need.
            Contact us with your vehicle details and part requirements.
          </p>

          <div className="bg-white/80 rounded-2xl p-4 md:p-6 mb-6 border border-slate-200">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Contact Support</h4>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-classy-black">Name:</span> Kasina Ramesh
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-classy-black">Phone:</span>
                  <a href="tel:9246634112" className="text-bajaj-blue hover:text-bajaj-maroon ml-1">
                    9246634112
                  </a>
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-classy-black">Email:</span>
                  <a href="mailto:rameshkasina72@gmail.com" className="text-bajaj-blue hover:text-bajaj-maroon ml-1">
                    rameshkasina72@gmail.com
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Business Hours</h4>
                <p className="text-sm text-slate-600">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                <p className="text-sm text-slate-600">Sunday: 10:00 AM - 4:00 PM</p>
                <p className="text-sm text-bajaj-maroon font-semibold">Response within 2 hours</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a href="tel:9246634112">
              <Button className="bg-green-600 hover:bg-black text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
                Call Now: 9246634112
              </Button>
            </a>
            <a href="mailto:rameshkasina72@gmail.com">
              <Button className="bg-blue-600 hover:bg-black text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
                Email Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}