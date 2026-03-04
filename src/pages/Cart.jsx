import React, { useState, useEffect, useMemo } from 'react';
import { CartItem } from '@/entities/CartItem';
import { Product } from '@/entities/Product';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus, PackageX, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                await fetchCartItems(currentUser.email);
            } catch (error) {
                toast.error("You must be logged in to view your cart.");
                setLoading(false);
            }
        };
        initialize();
    }, []);

    const fetchCartItems = async (userEmail) => {
        setLoading(true);
        try {
            const items = await CartItem.filter({ user_email: userEmail });
            setCartItems(items);

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
            console.error("Failed to fetch cart items:", error);
            toast.error("Failed to load your cart. Please try again.");
        }
        setLoading(false);
    };

    const updateQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) {
            await removeItem(item.id);
            return;
        }
        try {
            await CartItem.update(item.id, { quantity: newQuantity });
            toast.success("Cart updated!");
            fetchCartItems(user.email);
        } catch (error) {
            toast.error("Failed to update quantity.");
        }
    };

    const removeItem = async (itemId) => {
        try {
            await CartItem.delete(itemId);
            toast.success("Item removed from cart.");
            fetchCartItems(user.email);
        } catch (error) {
            toast.error("Failed to remove item.");
        }
    };

    const totalAmount = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }, [cartItems, products]);

    if (loading) {
        return (
             <div className="p-4 md:p-6">
                <Skeleton className="h-12 w-1/4 mb-6" />
                <Card className="glass-effect"><CardContent className="p-6 space-y-4">
                    <div className="flex gap-4"><Skeleton className="h-24 w-24" /><div className="space-y-2 flex-1"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>
                    <div className="flex gap-4"><Skeleton className="h-24 w-24" /><div className="space-y-2 flex-1"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>
                </CardContent></Card>
             </div>
        );
    }
    
    if (!user) {
        return (
             <div className="p-4 md:p-6 text-center">
                <h1 className="text-xl text-red-600">Please Log In</h1>
                <p>You need to be logged in to manage your shopping cart.</p>
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
                        <ShoppingCart className="w-8 h-8"/> Your Shopping Cart
                      </h1>
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 glass-effect rounded-2xl">
                        <PackageX className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h3>
                        <p className="text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link to={createPageUrl("Home")}>
                            <Button className="bg-gradient-to-r from-bajaj-blue to-bajaj-maroon">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map(item => {
                                const product = products[item.product_id];
                                if (!product) return <Skeleton key={item.id} className="h-32 w-full" />;
                                return (
                                    <Card key={item.id} className="glass-effect border-0 flex items-center p-4">
                                        <div className="w-24 h-24 bg-slate-100 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center">
                                            <Wrench className="w-12 h-12 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800">{product.name}</h4>
                                            <p className="text-sm text-slate-500">Part Code: {product.part_code}</p>
                                            <p className="font-bold text-bajaj-blue mt-1">₹{product.price.toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item, item.quantity - 1)}><Minus className="w-4 h-4"/></Button>
                                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item, item.quantity + 1)}><Plus className="w-4 h-4"/></Button>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-bold text-lg">₹{(product.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="ml-4 text-slate-400 hover:text-red-500" onClick={() => removeItem(item.id)}>
                                            <Trash2 className="w-5 h-5"/>
                                        </Button>
                                    </Card>
                                )
                            })}
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="glass-effect border-0 sticky top-6">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-slate-600">
                                        <div className="flex justify-between"><span>Subtotal</span> <span>₹{totalAmount.toLocaleString()}</span></div>
                                        <div className="flex justify-between"><span>Shipping</span> <span className="text-green-600 font-semibold">FREE</span></div>
                                        <div className="border-t my-2"></div>
                                        <div className="flex justify-between font-bold text-slate-800 text-lg"><span>Total</span> <span>₹{totalAmount.toLocaleString()}</span></div>
                                    </div>
                                    <Link to={createPageUrl("Checkout")} className="w-full">
                                        <Button className="w-full mt-6 bg-gradient-to-r from-[#6D0000] to-[#002D62] hover:bg-black text-white active:bg-black transition-all">Proceed to Checkout</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}