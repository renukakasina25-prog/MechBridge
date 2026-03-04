import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ReviewModal({ isOpen, onClose, product, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      const user = await base44.auth.me();
      
      await base44.entities.Review.create({
        product_id: product.id,
        order_id: product.orderId,
        user_email: user.email,
        rating: rating,
        review_text: reviewText
      });

      toast.success('Thank you for your review!');
      setRating(0);
      setReviewText('');
      onClose();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
    setSubmitting(false);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-slate-600">Part Code: {product.part_code}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Your Review (Optional)</label>
            <Textarea
              placeholder="Tell us about your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-black text-white"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}