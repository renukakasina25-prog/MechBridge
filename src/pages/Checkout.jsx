import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@/entities/User';
import { CartItem } from '@/entities/CartItem';
import { Product } from '@/entities/Product';
import { Order } from '@/entities/Order';
import { OrderItem } from '@/entities/OrderItem';
import { Deal } from '@/entities/Deal';
import { client } from '@/api/apiClient';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Clock, Wrench, Shield, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UPIPayment from '../components/checkout/UPIPayment';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];

const CITIES_BY_STATE = {
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi']
  // Add more states and cities as needed
};

const getDeliveryTime = (state, city) => {
  // Hyderabad and nearby areas - same day/1 hour delivery
  if (state === 'Telangana' && ['Hyderabad', 'Secunderabad', 'Cyberabad'].includes(city)) {
    return { days: 0, text: 'Within 1 Hour', express: true };
  }
  
  // Telangana state - next day delivery
  if (state === 'Telangana') {
    return { days: 1, text: '1-2 Days', express: true };
  }
  
  // South Indian states - 2-3 days
  if (['Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Kerala'].includes(state)) {
    return { days: 3, text: '2-3 Days', express: false };
  }
  
  // Western states - 3-5 days
  if (['Maharashtra', 'Gujarat', 'Goa'].includes(state)) {
    return { days: 5, text: '3-5 Days', express: false };
  }
  
  // Northern states - 5-7 days
  if (['Delhi', 'Punjab', 'Haryana', 'Rajasthan', 'Uttar Pradesh'].includes(state)) {
    return { days: 7, text: '5-7 Days', express: false };
  }
  
  // Eastern and remote states - 7-15 days
  return { days: 12, text: '7-15 Days', express: false };
};

const OWNER_UPI = 'kasinaramesh72@okaxis';
const OWNER_EMAIL = 'rameshkasina72@gmail.com';
const OWNER_NAME = 'Kasina Ramesh';

export default function CheckoutPage() {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const initialize = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
                setSelectedState(currentUser.state || '');
                setSelectedCity(currentUser.city || '');
                
                const items = await CartItem.filter({ user_email: currentUser.email });
                setCartItems(items);

                if (items.length > 0) {
                    const productIds = [...new Set(items.map(item => item.product_id))];
                    const productDetails = await Promise.all(productIds.map(id => Product.get(id)));
                    const productsMap = productDetails.reduce((acc, product) => {
                        if (product) acc[product.id] = product;
                        return acc;
                    }, {});
                    setProducts(productsMap);
                } else {
                    toast.info("Your cart is empty. Redirecting to catalog...");
                    navigate(createPageUrl("Catalog"));
                }
            } catch (error) {
                toast.error("You must be logged in to checkout.");
                navigate(createPageUrl("Home"));
            }
            setLoading(false);
        };
        initialize();
    }, [navigate]);

    const subtotalAmount = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const product = products[item.product_id];
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }, [cartItems, products]);

    const totalAmount = useMemo(() => {
        return subtotalAmount - couponDiscount;
    }, [subtotalAmount, couponDiscount]);

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        try {
            const deals = await Deal.filter({ coupon_code: couponCode.trim(), is_active: true });
            if (deals.length === 0) {
                toast.error("Invalid coupon code. Please enter a valid coupon.");
                return;
            }
            const deal = deals[0];
            const today = new Date();
            const validUntil = new Date(deal.valid_until);
            if (today > validUntil) {
                toast.error("This coupon has expired.");
                return;
            }
            if (deal.max_usage && deal.current_usage >= deal.max_usage) {
                toast.error("This coupon has reached its maximum usage limit.");
                return;
            }
            const discount = Math.round((subtotalAmount * deal.discount_percentage) / 100);
            setCouponDiscount(discount);
            setAppliedCoupon(deal);
            toast.success(`Coupon applied! You saved ₹${discount.toLocaleString()}`);
        } catch (error) {
            console.error("Error applying coupon:", error);
            toast.error("Failed to apply coupon. Please try again.");
        }
    };

    const removeCoupon = () => {
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        toast.info("Coupon removed");
    };

    const deliveryInfo = useMemo(() => {
        if (selectedState && selectedCity) {
            return getDeliveryTime(selectedState, selectedCity);
        }
        return { days: 15, text: '7-15 Days', express: false };
    }, [selectedState, selectedCity]);

    const handlePaymentInitiate = async (paymentData) => {
        setShowPaymentModal(true);
        setIsPlacingOrder(true);
        
        toast.info("Processing payment...");
        
        // Simulate payment processing
        setTimeout(async () => {
            await completeOrder(paymentData);
        }, 3000);
    };

    const completeOrder = async (paymentData) => {
        try {
            // Update coupon usage if applied
            if (appliedCoupon) {
                await Deal.update(appliedCoupon.id, { 
                    current_usage: (appliedCoupon.current_usage || 0) + 1 
                });
            }

            const orderData = {
                user_email: user.email,
                total_amount: totalAmount,
                coupon_applied: appliedCoupon ? appliedCoupon.coupon_code : null,
                discount_amount: couponDiscount,
                shipping_address: {
                    full_name: user.full_name,
                    address_line1: user.address_line1,
                    address_line2: user.address_line2 || '',
                    city: selectedCity,
                    state: selectedState,
                    pincode: user.pincode,
                    phone_number: user.phone_number || ''
                },
                status: "Confirmed",
                payment_method: paymentData.type,
                payment_status: 'success',
                expected_delivery_days: deliveryInfo.days,
                delivery_text: deliveryInfo.text
            };

            // Create the Order
            const newOrder = await Order.create(orderData);

            // Create OrderItems
            const orderItemsData = cartItems.map(item => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: products[item.product_id].price
            }));
            await OrderItem.bulkCreate(orderItemsData);

            // Send order confirmation email to owner
            const orderDetails = `
New Order Received - BikeMitra

Order ID: ${newOrder.id}
Customer: ${user.full_name}
Email: ${user.email}
Phone: ${user.phone_number}
Total Amount: ₹${totalAmount.toLocaleString()}
Payment Method: ${paymentData.type === 'upi' ? `UPI (${paymentData.app})` : 'Bank Card'}
Payment Status: Success
${paymentData.type === 'upi' ? `Customer UPI: ${paymentData.upiId}` : `Card: ${paymentData.cardNumber}`}

Delivery Address:
${user.address_line1}
${user.address_line2 ? user.address_line2 + '\n' : ''}${selectedCity}, ${selectedState} ${user.pincode}

Expected Delivery: ${deliveryInfo.text}

Items Ordered:
${cartItems.map(item => {
    const product = products[item.product_id];
    return `- ${product.name} (${product.part_code}) x${item.quantity} - ₹${(product.price * item.quantity).toLocaleString()}`;
}).join('\n')}

Payment has been received successfully.
Please process this order and contact the customer if needed.

Best regards,
BikeMitra System
            `;

            await client.integrations.Core.SendEmail({
                to: OWNER_EMAIL,
                subject: `New Order #${newOrder.id} - ₹${totalAmount.toLocaleString()} PAID`,
                body: orderDetails,
                from_name: 'BikeMitra'
            });

            // Clear the cart
            const deletePromises = cartItems.map(item => CartItem.delete(item.id));
            await Promise.all(deletePromises);

            toast.success(`Order confirmed! ${OWNER_NAME} has been notified.`);
            navigate(createPageUrl(`OrderConfirmation?orderId=${newOrder.id}`));

        } catch (error) {
            console.error("Failed to complete order:", error);
            toast.error("There was an issue completing your order. Please try again.");
        }
        setIsPlacingOrder(false);
        setShowPaymentModal(false);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-bajaj-blue"/></div>;

    return (
        <div className="min-h-screen p-4 md:p-6 bg-slate-50 max-w-full overflow-x-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                    <Button variant="outline" size="icon" onClick={() => window.history.back()} className="h-8 w-8 md:h-10 md:w-10">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-xl md:text-3xl font-bold text-gradient">Secure Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
                    {/* Left Column - Shipping & Payment */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Shipping Address */}
                        <Card className="glass-effect border-0">
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="text-base md:text-lg">Shipping Address</CardTitle>
                                <CardDescription className="text-xs md:text-sm">Select delivery location</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-4 md:p-6 pt-0">
                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold">State</label>
                                        <Select value={selectedState} onValueChange={setSelectedState}>
                                            <SelectTrigger className="text-xs md:text-sm">
                                                <SelectValue placeholder="Select State" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {INDIAN_STATES.map(state => (
                                                    <SelectItem key={state} value={state}>{state}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm font-semibold">City</label>
                                        <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
                                            <SelectTrigger className="text-xs md:text-sm">
                                                <SelectValue placeholder="Select City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(CITIES_BY_STATE[selectedState] || []).map(city => (
                                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                {selectedState && selectedCity && (
                                    <div className={`p-3 md:p-4 rounded-lg border-2 ${deliveryInfo.express ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className={`w-3 h-3 md:w-4 md:h-4 ${deliveryInfo.express ? 'text-green-600' : 'text-blue-600'}`} />
                                            <span className={`font-semibold text-xs md:text-sm ${deliveryInfo.express ? 'text-green-900' : 'text-blue-900'}`}>
                                                Delivery: {deliveryInfo.text}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="text-slate-700 text-xs md:text-sm">
                                    <p className="font-bold">{user.full_name}</p>
                                    <p>{user.address_line1}</p>
                                    {user.address_line2 && <p>{user.address_line2}</p>}
                                    <p>{selectedCity}, {selectedState} {user.pincode}</p>
                                    {user.phone_number && <p>Phone: {user.phone_number}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* UPI Payment Component */}
                        <UPIPayment 
                            totalAmount={totalAmount}
                            ownerUPI={OWNER_UPI}
                            onPaymentInitiate={handlePaymentInitiate}
                            isPlacingOrder={isPlacingOrder}
                            selectedState={selectedState}
                            selectedCity={selectedCity}
                            deliveryInfo={deliveryInfo}
                        />
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <Card className="glass-effect border-0 lg:sticky lg:top-6">
                            <CardHeader className="p-4 md:p-6">
                                <CardTitle className="text-base md:text-lg">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 md:p-6 pt-0">
                                <div className="space-y-3 max-h-64 md:max-h-80 overflow-y-auto pr-2">
                                    {cartItems.map(item => {
                                        const product = products[item.product_id];
                                        return product ? (
                                            <div key={item.id} className="flex justify-between items-center text-xs md:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        <Wrench className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-800 truncate">{product.name}</p>
                                                        <p className="text-slate-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium flex-shrink-0">₹{(product.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                                <div className="border-t my-4"></div>
                                <div className="space-y-2 text-slate-600 text-xs md:text-sm">
                                    <div className="flex justify-between"><span>Subtotal</span> <span>₹{subtotalAmount.toLocaleString()}</span></div>
                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Coupon Discount</span> 
                                            <span>-₹{couponDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between"><span>Shipping</span> <span className="text-green-600 font-semibold">FREE</span></div>
                                    <div className="border-t my-2"></div>
                                    <div className="flex justify-between font-bold text-slate-800 text-lg md:text-xl">
                                        <span>Total</span> 
                                        <span>₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Return Policy */}
                                <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2 text-xs md:text-sm">Return & Exchange</h4>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• 7-day return policy</li>
                                        <li>• Free exchange for damaged items</li>
                                        <li>• Contact: 9246634112</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Payment Processing Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Shield className="w-6 h-6 text-green-600" />
                                Processing Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="font-semibold text-green-900">Payment to: {OWNER_NAME}</p>
                                <p className="text-sm text-green-800">UPI: {OWNER_UPI}</p>
                                <p className="text-lg font-bold text-green-900">Amount: ₹{totalAmount.toLocaleString()}</p>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-bajaj-blue" />
                                <span>Verifying payment...</span>
                            </div>
                            
                            <p className="text-sm text-slate-600">
                                Please complete the payment in your UPI app. 
                                Order will be confirmed once payment is verified.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}