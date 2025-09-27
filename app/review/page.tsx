"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: string;
  verified: boolean;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  averageRating: string;
}

export default function ReviewPage() {
  const { user } = useAuth();
  const derivedName = user?.email ? user.email.split('@')[0] : '';
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [pollVote, setPollVote] = useState<string | null>(null);

  // Fetch existing reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data: ReviewsResponse = await response.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: derivedName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setRating(5);
        setComment('');
        // Refresh reviews list
        fetchReviews();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Review submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
        
        {submitted && (
          <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md mb-6 backdrop-blur-md">
            <h3 className="font-semibold">Thank you for your review!</h3>
            <p className="text-sm">Your feedback has been submitted successfully.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {derivedName ? (
            <div className="text-sm text-neutral-400 bg-neutral-800/40 border border-neutral-700 rounded px-3 py-2 flex items-center gap-2 backdrop-blur-md">
              <span className="text-neutral-300">Posting as</span>
              <span className="font-semibold text-indigo-400">{derivedName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-green-600 text-white">Verified</span>
            </div>
          ) : (
            <div className="text-xs text-amber-500 bg-amber-900/20 border border-amber-600/30 px-3 py-2 rounded backdrop-blur-md">
              You are not logged in. Login to post as a verified user.
            </div>
          )}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-neutral-400">({rating} star{rating !== 1 ? 's' : ''})</span>
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input w-full"
              rows={5}
              placeholder="What did you think of the Reactive Network monitoring app?"
              minLength={10}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !derivedName}
            className="btn btn-primary w-full"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Vote for the Next Feature!</h2>
        <p className="text-sm text-neutral-400 mb-4">Help us decide what to build next. What experimental feature would you like to see?</p>
        <div className="space-y-3">
          <button
            onClick={() => setPollVote('ai-summary')}
            disabled={!!pollVote}
            className={`w-full p-3 text-left rounded-md border transition ${
              pollVote === 'ai-summary'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/70'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            AI-Powered News Summaries
          </button>
          <button
            onClick={() => setPollVote('portfolio-tracking')}
            disabled={!!pollVote}
            className={`w-full p-3 text-left rounded-md border transition ${
              pollVote === 'portfolio-tracking'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/70'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            Portfolio Tracking Integration
          </button>
          <button
            onClick={() => setPollVote('sentiment-analysis')}
            disabled={!!pollVote}
            className={`w-full p-3 text-left rounded-md border transition ${
              pollVote === 'sentiment-analysis'
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-700/70'
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            Market Sentiment Analysis
          </button>
        </div>
        {pollVote && (
          <p className="text-center text-sm text-indigo-400 mt-4">Thanks for your vote!</p>
        )}
      </div>

      {/* Reviews Display Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
        
        {reviewsLoading ? (
          <div className="text-center py-8">
            <p className="text-neutral-400">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-neutral-900/20 rounded-lg backdrop-blur-md">
            <p className="text-neutral-400">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reviews Stats */}
            <div className="bg-neutral-900/20 rounded-lg p-4 mb-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.round(parseFloat(reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'))
                              ? 'text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold">
                      {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-400">Total Reviews</p>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            {reviews.slice(0, 10).map((review) => (
              <div key={review.id} className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-indigo-400">
                      {review.name}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Verified</span>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    {Array.from({ length: 5 - review.rating }, (_, i) => (
                      <span key={i} className="text-gray-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-neutral-200 mb-2">{review.comment}</p>
                <p className="text-xs text-neutral-400">
                  {new Date(review.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            ))}
            
            {reviews.length > 10 && (
              <p className="text-center text-sm text-neutral-400 mt-4">
                Showing 10 of {reviews.length} reviews
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
