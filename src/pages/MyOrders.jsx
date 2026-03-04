import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Clock, Truck, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import ReviewModal from '@/components/orders/ReviewModal';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userOrders = await base44.entities.Order.filter(
        { user_email: currentUser.email },
        '-created_date',
        50
      );
      
      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => {
          const items = await base44.entities.OrderItem.filter({ order_id: order.id });
          const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
              const product = await base44.entities.Product.filter({ id: item.product_id });
              return { ...item, product: product[0] };
            })
          );
          return { ...order, items: itemsWithProducts };
        })
      );
      
      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Processing': return <Package className="w-5 h-5" />;
      case 'Shipped': return <Truck className="w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="w-5 h-5" />;
      case 'Cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReview = async (product, order) => {
    const existingReview = await base44.entities.Review.filter({
      product_id: product.id,
      order_id: order.id,
      user_email: user.email
    });
    
    if (existingReview.length > 0) {
      toast.info('You have already reviewed this product');
      return;
    }
    
    setSelectedProduct({ ...product, orderId: order.id });
    setReviewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-bold mb-2">Please Log In</h2>
            <p className="text-slate-600">You need to log in to view your orders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gradient">My Orders</h1>
          <p className="text-slate-600 mt-2">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
              <p className="text-slate-600 mb-4">Start shopping to see your orders here</p>
              <Button className="bg-green-600 hover:bg-black">
                Browse Catalog
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="glass-effect">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Placed on {new Date(order.created_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-2`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product?.name}</h4>
                            <p className="text-sm text-slate-600">
                              Quantity: {item.quantity} × ₹{item.price_at_purchase.toLocaleString()}
                            </p>
                          </div>
                          {order.status === 'Delivered' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReview(item.product, order)}
                              className="ml-4"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm">Shipping Address</h4>
                      <p className="text-sm text-slate-700">
                        {order.shipping_address.full_name}<br />
                        {order.shipping_address.address_line1}<br />
                        {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
                        {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                        Phone: {order.shipping_address.phone_number}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-xl font-bold text-green-600">₹{order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onReviewSubmitted={loadOrders}
      />
    </div>
  );
}