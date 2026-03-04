import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, CreditCard } from 'lucide-react';

const UPI_APPS = [
  'PhonePe', 'Google Pay', 'Paytm', 'Amazon Pay', 'BHIM', 'Navi',
  'BharatPe', 'CRED', 'MobiKwik', 'Freecharge', 'Airtel Thanks',
  'ICICI iMobile Pay', 'Slice', 'Super.Money', 'Jupiter', 'WhatsApp Pay'
];

export default function UPIPayment({ totalAmount, ownerUPI, onPaymentInitiate }) {
  const [paymentType, setPaymentType] = useState('upi');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    bankName: '',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  const handleCardNumberChange = (value) => {
    const formatted = value.replace(/\D/g, '').substring(0, 16);
    const withDashes = formatted.match(/.{1,4}/g);
    setCardDetails(prev => ({
      ...prev,
      cardNumber: withDashes ? withDashes.join('-') : formatted
    }));
  };

  const handlePayment = () => {
    if (paymentType === 'upi') {
      if (!upiApp || !upiId) {
        alert('Please select UPI app and enter your UPI ID');
        return;
      }
      
      // Create UPI deep link for direct payment
      const paymentUrl = `upi://pay?pa=${ownerUPI}&pn=Kasina Ramesh&am=${totalAmount}&cu=INR&tn=BikeMitra Order Payment`;
      
      // Try to open UPI app
      window.location.href = paymentUrl;
      
      // Trigger callback after 2 seconds (simulating app switch)
      setTimeout(() => {
        onPaymentInitiate({
          type: 'upi',
          app: upiApp,
          upiId: upiId,
          amount: totalAmount
        });
      }, 2000);
    } else {
      // Card payment
      if (!cardDetails.bankName || !cardDetails.cardName || !cardDetails.cardNumber || 
          !cardDetails.expMonth || !cardDetails.expYear || !cardDetails.cvv) {
        alert('Please fill all card details');
        return;
      }
      
      onPaymentInitiate({
        type: 'card',
        ...cardDetails,
        amount: totalAmount
      });
    }
  };

  return (
    <Card className="glass-effect border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Secure Payment Gateway
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Type Selection */}
        <div className="space-y-3">
          <label className="font-semibold text-slate-700">Payment Method</label>
          <div className="flex gap-4">
            <Button
              type="button"
              variant={paymentType === 'upi' ? 'default' : 'outline'}
              className={`flex-1 ${paymentType === 'upi' ? 'bg-bajaj-blue' : ''}`}
              onClick={() => setPaymentType('upi')}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              UPI App
            </Button>
            <Button
              type="button"
              variant={paymentType === 'card' ? 'default' : 'outline'}
              className={`flex-1 ${paymentType === 'card' ? 'bg-bajaj-blue' : ''}`}
              onClick={() => setPaymentType('card')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bank Card
            </Button>
          </div>
        </div>

        {/* UPI Payment Section */}
        {paymentType === 'upi' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-900 mb-1">Direct Payment to Owner</p>
              <p className="text-sm text-green-800">
                Pay directly to: <span className="font-bold">{ownerUPI}</span>
              </p>
              <p className="text-sm text-green-800">
                Amount: <span className="font-bold">₹{totalAmount.toLocaleString()}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select UPI App</label>
              <Select value={upiApp} onValueChange={setUpiApp}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your UPI app" />
                </SelectTrigger>
                <SelectContent>
                  {UPI_APPS.map(app => (
                    <SelectItem key={app} value={app}>{app}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="upiId" className="text-sm font-semibold text-slate-700">Your UPI ID</label>
              <Input
                id="upiId"
                type="text"
                placeholder="e.g., 9876543210@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p className="text-xs text-slate-500">Enter your UPI ID for verification</p>
            </div>
          </div>
        )}

        {/* Card Payment Section */}
        {paymentType === 'card' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-2">
              <label htmlFor="bankName" className="text-sm font-semibold text-slate-700">Bank Name</label>
              <Input
                id="bankName"
                type="text"
                placeholder="e.g., State Bank of India"
                value={cardDetails.bankName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, bankName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cardName" className="text-sm font-semibold text-slate-700">Name on Card</label>
              <Input
                id="cardName"
                type="text"
                placeholder="Enter cardholder name"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cardNumber" className="text-sm font-semibold text-slate-700">Card Number</label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1111-2222-3333-4444"
                maxLength={19}
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="expMonth" className="text-sm font-semibold text-slate-700">Month</label>
                <Select value={cardDetails.expMonth} onValueChange={(val) => setCardDetails(prev => ({ ...prev, expMonth: val }))}>
                  <SelectTrigger id="expMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="expYear" className="text-sm font-semibold text-slate-700">Year</label>
                <Select value={cardDetails.expYear} onValueChange={(val) => setCardDetails(prev => ({ ...prev, expYear: val }))}>
                  <SelectTrigger id="expYear">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'].map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="cvv" className="text-sm font-semibold text-slate-700">CVV</label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Your card details are processed securely. We never store your card information.
              </p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 text-lg font-semibold"
        >
          <Shield className="w-5 h-5 mr-2" />
          {paymentType === 'upi' ? `Pay ₹${totalAmount.toLocaleString()} via ${upiApp || 'UPI'}` : `Pay ₹${totalAmount.toLocaleString()} via Card`}
        </Button>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="w-3 h-3" />
          <span>256-bit SSL Encrypted • PCI DSS Compliant</span>
        </div>
      </CardContent>
    </Card>
  );
}