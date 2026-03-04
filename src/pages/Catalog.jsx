import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '@/entities/Product';
import { User } from '@/entities/User';
import { CartItem } from '@/entities/CartItem';
import { WishlistItem } from '@/entities/WishlistItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, Star, ShoppingCart, Eye, ArrowLeft, Wrench, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import FilterPanel from '../components/catalog/FilterPanel';
import ProductLocationModal from '../components/products/ProductLocationModal';
import { toast } from 'sonner';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    vehicleType: 'all',
    brand: 'all',
    category: 'all',
    priceRange: 'all',
    inStock: 'all'
  });
  const location = useLocation();
  const urlSearchTerm = new URLSearchParams(location.search).get('search');
  const [user, setUser] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const initUser = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
        } catch(e) {
            // Not logged in or error fetching user, setUser will remain null
            console.warn("User not logged in or failed to fetch user:", e);
        }
    }
    initUser();
    
    // Get URL parameters for search and filters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const categoryParam = urlParams.get('category');
    const brandParam = urlParams.get('brand');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    if (brandParam) {
      setFilters(prev => ({ ...prev, brand: brandParam }));
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let filterConditions = {};
      
      if (filters.vehicleType !== 'all') filterConditions.vehicle_type = filters.vehicleType;
      if (filters.brand !== 'all') filterConditions.brand = filters.brand;
      if (filters.category !== 'all') filterConditions.category = filters.category;
      if (filters.inStock === 'true') filterConditions.stock_quantity = { $gt: 0 };
      if (filters.inStock === 'false') filterConditions.stock_quantity = { $lte: 0 }; // Corrected for out of stock
      
      const data = await Product.filter(filterConditions, '-created_date', 200); // Increased limit to 200
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error("Failed to load products.");
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      vehicleType: 'all',
      brand: 'all',
      category: 'all',
      priceRange: 'all',
      inStock: 'all'
    });
    setSearchTerm('');
    // Clear URL params as well
    window.history.pushState({}, '', window.location.pathname);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
                         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.part_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      const price = product.price;
      if (max) {
        matchesPrice = price >= parseInt(min) && price <= parseInt(max);
      } else {
        matchesPrice = price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesPrice;
  });

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

  const ProductCard = ({ product, isListView = false }) => (
    <Card className={`glass-effect border-0 hover:glow-effect transition-all duration-300 hover:scale-105 group ${
      isListView ? 'flex flex-row' : ''
    }`}>
      <CardHeader className={`relative overflow-hidden ${isListView ? 'w-48 flex-shrink-0' : ''}`}>
        <div className={`bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden ${
          isListView ? 'aspect-square' : 'aspect-square'
        }`}>
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="text-slate-400 flex items-center justify-center h-full w-full">
                <Wrench className="w-16 h-16" />
              </div>
            )}
          
          {/* Navigation Button - Top Right */}
          <Button
            size="icon"
            className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white shadow-lg z-10 h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setLocationModalOpen(true);
            }}
          >
            <MapPin className="w-4 h-4" />
          </Button>
          
          {/* Badges */}
          {product.original_price && product.price < product.original_price && (
            <Badge className="absolute top-12 right-2 bg-red-500 text-white font-bold text-xs">
              {Math.round((1 - product.price / product.original_price) * 100)}% OFF
            </Badge>
          )}
          
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white capitalize text-xs">
            {product.category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-bajaj-blue transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-500 text-sm mb-2">
            Code: {product.part_code}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 4) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-slate-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-slate-500 text-xs">({product.rating || 4.0})</span>
          </div>
        </div>
        
        <div className={`flex items-center justify-between mb-3 ${isListView ? 'flex-col items-start gap-2' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-bajaj-blue">₹{product.price.toLocaleString()}</span>
            {product.original_price && product.price < product.original_price && (
              <span className="text-slate-400 line-through text-sm">₹{product.original_price.toLocaleString()}</span>
            )}
          </div>
          <Badge variant="outline" className={`${
            product.stock_quantity > 10 ? 'text-green-600 border-green-600' :
            product.stock_quantity > 0 ? 'text-yellow-600 border-yellow-600' : 
            'text-red-600 border-red-600'
          } text-xs`}>
            {product.stock_quantity > 10 ? 'In Stock' :
             product.stock_quantity > 0 ? 'Limited' : 'Out of Stock'}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-black hover:text-white hover:border-black text-xs"
            onClick={() => addToWishlist(product)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Wishlist
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-black text-white text-xs"
            disabled={product.stock_quantity === 0}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="text-xs text-slate-500">
          {product.brand} {product.model} • {product.vehicle_type.toUpperCase()}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="glass-effect rounded-2xl p-6 flex-1">
              <h1 className="text-3xl font-bold text-gradient mb-2">Explore Parts Catalog</h1>
              <p className="text-slate-600">Browse our complete collection of 2-wheeler spare parts</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and View Controls */}
            <div className="glass-effect rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search parts by name, code, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 hover:border-bajaj-blue focus:border-bajaj-blue"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-green-600 hover:bg-black text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-green-600 hover:bg-black text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <p className="text-slate-600 text-sm">
                  {urlSearchTerm ? 
                    <>Showing <span className="font-bold">{filteredProducts.length}</span> results for <span className="font-bold text-bajaj-blue">"{urlSearchTerm}"</span></> :
                    <>Showing {filteredProducts.length} of {products.length} products</>
                  }
                </p>
                {(searchTerm || Object.values(filters).some(f => f !== 'all')) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-bajaj-maroon hover:bg-bajaj-maroon/10">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {Array(12).fill(0).map((_, i) => (
                  <Card key={i} className="glass-effect border-0">
                    <CardHeader>
                      <Skeleton className="aspect-square w-full rounded-xl" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-5 w-full mb-2" />
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isListView={viewMode === 'list'}
                  />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms</p>
                <Button 
                  onClick={clearFilters} 
                  className="mt-4 bg-gradient-to-r from-bajaj-blue to-bajaj-maroon"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <ProductLocationModal 
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}