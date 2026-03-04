import React, { useState, useEffect } from 'react';
import { WishlistItem } from '@/entities/WishlistItem';
import { Product } from '@/entities/Product';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Heart, ArrowLeft, PackageX, ShoppingCart, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                await fetchWishlistItems(currentUser.email);
            } catch (error) {
                toast.error("You must be logged in to view your wishlist.");
                setLoading(false);
            }
        };
        initialize();
    }, []);

    const fetchWishlistItems = async (userEmail) => {
        setLoading(true);
        try {
            const items = await WishlistItem.filter({ user_email: userEmail });
            setWishlistItems(items);

            if (items.length > 0) {
                const productIds = [...new Set(items.map(item => item.product_id))];
                const productDetails = await Promise.all(
                    productIds.map(id => Product.get(id))
                );
                const productsMap = productDetails.reduce((acc, product) => {
                    if (product) acc[product.id] = product;
                    return acc;
                }, {});
                setProducts(productsMap);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist items:", error);
            toast.error("Failed to load your wishlist. Please try again.");
        }
        setLoading(false);
    };

    const removeItem = async (itemId) => {
        try {
            await WishlistItem.delete(itemId);
            toast.success("Item removed from wishlist.");
            fetchWishlistItems(user.email);
        } catch (error) {
            toast.error("Failed to remove item.");
        }
    };
    
    // Placeholder for moving item to cart
    const moveToCart = (item) => {
        toast.info("Move to Cart functionality to be implemented.");
        console.log("Moving to cart: ", item);
    }

    if (loading) {
        return (
             <div className="p-4 md:p-6">
                <Skeleton className="h-12 w-1/4 mb-6" />
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                </div>
             </div>
        );
    }
    
    if (!user) {
        return (
             <div className="p-4 md:p-6 text-center">
                <h1 className="text-xl text-red-600">Please Log In</h1>
                <p>You need to be logged in to manage your wishlist.</p>
             </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gradient flex items-center gap-3">
                        <Heart className="w-8 h-8"/> Your Wishlist
                      </h1>
                    </div>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 glass-effect rounded-2xl">
                        <PackageX className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Your wishlist is empty</h3>
                        <p className="text-slate-500 mb-6">Add your favourite items to your wishlist to keep track of them.</p>
                        <Link to={createPageUrl("Home")}>
                            <Button className="bg-gradient-to-r from-blue-600 to-black text-white hover:from-blue-700 hover:to-slate-900">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map(item => {
                            const product = products[item.product_id];
                            if (!product) return <Skeleton key={item.id} className="h-64 w-full rounded-lg" />;
                            return (
                                <Card key={item.id} className="glass-effect border-0 group">
                                    <CardHeader className="p-0 relative">
                                        <div className="aspect-square w-full bg-slate-100 rounded-t-lg flex items-center justify-center">
                                            <Wrench className="w-16 h-16 text-slate-400" />
                                        </div>
                                        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-50 group-hover:opacity-100" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
                                        <p className="text-sm text-slate-500">Part Code: {product.part_code}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="font-bold text-bajaj-blue text-lg">₹{product.price.toLocaleString()}</p>
                                            <Button size="sm" onClick={() => moveToCart(product)}>
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Move to Cart
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}