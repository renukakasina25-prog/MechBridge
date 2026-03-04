import React, { useState, useEffect } from 'react';
import { Product } from '@/entities/Product';
import { User } from '@/entities/User';
import { CartItem } from '@/entities/CartItem';
import { WishlistItem } from '@/entities/WishlistItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Eye, Wrench, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProductLocationModal from '../products/ProductLocationModal';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const init = async () => {
        try {
            const currentUser = await User.me();
            setUser(currentUser);
        } catch(e) {
            // User not logged in, continue without user data
        }
        await loadFeaturedProducts();
    }
    init();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const data = await Product.filter({ is_featured: true }, '-created_date', 6);
      setProducts(data);
    } catch (error) {
      console.error('Error loading featured products:', error);
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
  
  if (loading) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="glass-effect border-0">
                <CardHeader>
                  <Skeleton className="aspect-square w-full rounded-xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Featured Parts
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Premium quality spare parts trusted by thousands of mechanics and riders across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="glass-effect border-0 hover:glow-effect transition-all duration-300 hover:scale-105 group"
            >
              <CardHeader className="relative overflow-hidden">
                <Link to={createPageUrl(`Catalog?search=${product.part_code}`)}>
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <div className="text-slate-400 flex items-center justify-center h-full w-full">
                            <Wrench className="w-20 h-20" />
                          </div>
                        )}
                    
                    {/* Navigation Button - Top Right */}
                    <Button
                      size="icon"
                      className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white shadow-lg z-10 h-9 w-9 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setLocationModalOpen(true);
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                    
                    {/* Discount Badge */}
                    {product.original_price && product.price < product.original_price && (
                        <Badge 
                        className="absolute top-14 right-3 bg-red-500 text-white font-bold"
                        >
                        {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                        </Badge>
                    )}
                    
                    {/* Category Badge */}
                    <Badge 
                        className="absolute top-3 left-3 bg-blue-600 text-white capitalize"
                    >
                        {product.category.replace('_', ' ')}
                    </Badge>
                    </div>
                </Link>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-2">
                    Part Code: {product.part_code}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 4) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-slate-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-slate-500 text-sm">({product.rating || 4.0})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-700">₹{product.price.toLocaleString()}</span>
                    {product.original_price && product.price < product.original_price && (
                      <span className="text-slate-400 line-through text-sm">₹{product.original_price.toLocaleString()}</span>
                    )}
                  </div>
                  <Badge variant="outline" className={`${
                    product.stock_quantity > 10 ? 'text-green-600 border-green-600' :
                    product.stock_quantity > 0 ? 'text-yellow-600 border-yellow-600' : 
                    'text-red-600 border-red-600'
                  }`}>
                    {product.stock_quantity > 10 ? 'In Stock' :
                     product.stock_quantity > 0 ? 'Limited' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 hover:bg-black hover:text-white hover:border-black"
                    onClick={() => addToWishlist(product)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Wishlist
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-black text-white"
                    disabled={product.stock_quantity === 0}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                
                {/* Compatibility Info */}
                <div className="mt-3 text-xs text-slate-500">
                  Compatible: {product.brand} {product.model} ({product.vehicle_type})
                </div>
              </CardContent>
            </Card>
          ))}
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