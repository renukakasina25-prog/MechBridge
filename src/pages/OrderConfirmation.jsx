import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Order } from '@/entities/Order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('orderId');

    useEffect(() => {
        if (orderId) {
            const fetchOrder = async () => {
                try {
                    const fetchedOrder = await Order.get(orderId);
                    setOrder(fetchedOrder);
                } catch (error) {
                    console.error("Failed to fetch order details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return <div className="p-6"><Skeleton className="h-64 w-full" /></div>
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                 <Card className="w-full max-w-lg text-center glass-effect">
                    <CardHeader>
                        <CardTitle className="text-red-500">Order Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">We couldn't find the details for this order. It might have been an error.</p>
                        <Link to={createPageUrl("Home")}>
                            <Button>Go to Homepage</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <Card className="glass-effect border-0 text-center">
                    <CardHeader>
                         <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-gradient">Order Placed Successfully!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-slate-600">
                            Thank you for your purchase, {order.shipping_address.full_name}! 
                            Your order <span className="font-bold text-bajaj-blue">#{order.id.slice(0, 8)}</span> has been confirmed. 
                            You will receive an update once your order is shipped.
                        </p>
                        
                        <div className="text-left p-4 bg-slate-50 border rounded-lg">
                            <h3 className="font-semibold mb-2">Shipping to:</h3>
                            <div className="text-slate-700">
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                            </div>
                        </div>

                         <div className="text-left p-4 bg-slate-50 border rounded-lg">
                            <h3 className="font-semibold mb-2">Order Summary:</h3>
                            <div className="text-slate-700 flex justify-between">
                                <span>Total Amount:</span>
                                <span className="font-bold">₹{order.total_amount.toLocaleString()}</span>
                            </div>
                         </div>
                        
                        <div className="flex justify-center gap-4">
                            <Link to={createPageUrl("Home")}>
                                <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping</Button>
                            </Link>
                             <Link to={createPageUrl("Profile")}>
                                <Button className="bg-gradient-to-r from-bajaj-blue to-classy-black">View My Orders</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
