
import React, { useState, useEffect } from 'react';
import { Deal } from '@/entities/Deal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket, Zap, Clock, Copy, Gift, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch active deals, ordered by valid_until (most recent first if valid_until is descending)
        const activeDeals = await Deal.filter({ is_active: true }, '-valid_until');
        setDeals(activeDeals);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
        toast.error("Could not load deals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const copyCoupon = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast.success(`Coupon "${code}" copied to clipboard!`);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          toast.error("Failed to copy coupon code. Please try manually.");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom of page
      textArea.style.left = "-9999px"; // Hide from view
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success(`Coupon "${code}" copied to clipboard!`);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        toast.error("Failed to copy coupon code. Please try manually.");
      }
      document.body.removeChild(textArea);
    }
  };
  
  const DealCard = ({ deal }) => {
    // Assume deal.redemption_url exists for the e-commerce flow
    // If not, this button will not render.
    const hasRedemptionUrl = typeof deal.redemption_url === 'string' && deal.redemption_url.length > 0;
    
    // Check for "Buy 1 Get 1" in a case-insensitive manner
    const isBOGO = deal.title.toLowerCase().includes('buy 1 get 1');
    
    // Format expiration time
    let expiresIn;
    try {
      expiresIn = formatDistanceToNow(parseISO(deal.valid_until), { addSuffix: true });
    } catch (error) {
      console.warn("Invalid date format for deal.valid_until:", deal.valid_until, error);
      expiresIn = "N/A"; // Fallback for invalid date string
    }

    const handleRedeemClick = () => {
        if (hasRedemptionUrl) {
            window.open(deal.redemption_url, '_blank'); // Open in a new tab
        }
    };

    return (
      <Card className="glass-effect border-0 hover:glow-effect transition-all duration-300 group">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              {deal.is_daily_deal && (
                 <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-2 font-bold">
                   <Zap className="w-3 h-3 mr-1" /> Daily Deal
                 </Badge>
              )}
              <CardTitle className="text-xl font-bold text-gradient group-hover:text-bajaj-blue transition-colors">
                {deal.title}
              </CardTitle>
            </div>
             <div className={`p-3 rounded-xl bg-gradient-to-r ${isBOGO ? 'from-green-500 to-teal-500' : 'from-bajaj-blue to-bajaj-maroon'}`}>
                {isBOGO ? <Gift className="w-6 h-6 text-white" /> : <Ticket className="w-6 h-6 text-white" />}
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Removed fixed height 'h-12' to allow full description content */}
          <p className="text-slate-600 mb-4">{deal.description}</p> 
          
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Expires {expiresIn}</span>
          </div>

          <div className="bg-slate-100/80 rounded-lg p-4 flex flex-col items-center justify-center gap-2 border border-dashed">
            <p className="text-sm text-slate-600">COUPON CODE:</p>
            <p className="text-2xl font-bold text-bajaj-maroon tracking-widest">{deal.coupon_code || 'N/A'}</p>
          </div>
          
          <Button 
            className="w-full mt-4 bg-gradient-to-r from-bajaj-blue to-classy-black hover:from-bajaj-maroon"
            onClick={() => copyCoupon(deal.coupon_code)}
            disabled={!deal.coupon_code} // Disable if no coupon code
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>

          {hasRedemptionUrl && (
            <Button 
              className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600"
              onClick={handleRedeemClick}
            >
              <Ticket className="w-4 h-4 mr-2" />
              Redeem Deal / Shop Now
            </Button>
          )}
        </CardContent>
      </Card>
    )
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="glass-effect rounded-2xl p-6 mb-2 text-center flex-1">
              <h1 className="text-3xl font-bold text-gradient mb-2">Today's Deals & Offers</h1>
              <p className="text-slate-600">Grab these limited-time offers before they're gone!</p>
            </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="glass-effect border-0">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          deals.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <div className="text-center py-16">
                <Ticket className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No Active Deals</h3>
                <p className="text-slate-500">Please check back later for new offers.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

