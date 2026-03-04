import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Clock, Truck, CheckCircle, XCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        return;
      }
      
      const allOrders = await base44.entities.Order.list('-created_date', 100);
      
      const ordersWithItems = await Promise.all(
        allOrders.map(async (order) => {
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await base44.entities.Order.update(orderId, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-4">
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen p-6 bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-slate-600">This page is only accessible to administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Order Management</h1>
            <p className="text-slate-600 mt-2">Manage all customer orders</p>
          </div>
          <Badge className="bg-green-600 text-white px-4 py-2">
            {orders.length} Total Orders
          </Badge>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Filter by Status:</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
              <p className="text-slate-600">No orders match the selected filter</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="glass-effect">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        Customer: {order.shipping_address.full_name} ({order.user_email})
                      </p>
                      <p className="text-sm text-slate-600">
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
                      <h4 className="font-semibold text-sm">Order Items:</h4>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div>
                            <h4 className="font-semibold">{item.product?.name}</h4>
                            <p className="text-sm text-slate-600">
                              Quantity: {item.quantity} × ₹{item.price_at_purchase.toLocaleString()}
                            </p>
                          </div>
                          <span className="font-semibold">
                            ₹{(item.quantity * item.price_at_purchase).toLocaleString()}
                          </span>
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

                    {/* Actions and Total */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">Update Status:</span>
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="text-xl font-bold text-green-600">₹{order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}