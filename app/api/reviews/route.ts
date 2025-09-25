import { NextRequest, NextResponse } from 'next/server';

// In-memory review storage (for hackathon demo)
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: string;
  verified: boolean;
}

const reviewsStorage: Review[] = [
  {
    id: '1',
    name: 'Alex Chen',
    rating: 5,
    comment: 'Amazing real-time monitoring! The Reactive Network integration is seamless and the live updates help me track whale movements instantly.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    verified: true
  },
  {
    id: '2', 
    name: 'Sarah Rodriguez',
    rating: 5,
    comment: 'The governance proposal tracking is exactly what I needed. Clean UI and the filtering system makes it easy to focus on what matters.',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    verified: true
  },
  {
    id: '3',
    name: 'Marcus Thompson',
    rating: 4,
    comment: 'Great for monitoring on-chain activity. Would love to see more advanced analytics in future updates.',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    verified: false
  }
];

// GET endpoint - Retrieve all reviews
export async function GET() {
  try {
    // Sort reviews by timestamp (newest first)
    const sortedReviews = [...reviewsStorage].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      reviews: sortedReviews,
      total: sortedReviews.length,
      averageRating: sortedReviews.length > 0 
        ? (sortedReviews.reduce((sum, r) => sum + r.rating, 0) / sortedReviews.length).toFixed(1)
        : '0'
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST endpoint - Submit new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment } = body;

    // Validation
    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, rating, and comment are required' }, 
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' }, 
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' }, 
        { status: 400 }
      );
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters long' }, 
        { status: 400 }
      );
    }

    // Create new review
    const newReview: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      verified: false // New reviews start as unverified
    };

    // Add to storage
    reviewsStorage.unshift(newReview); // Add to beginning for newest-first order

    // Optional: Limit total reviews in memory (keep last 50)
    if (reviewsStorage.length > 50) {
      reviewsStorage.splice(50);
    }



    return NextResponse.json({
      success: true,
      review: newReview,
      message: 'Review submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' }, 
      { status: 500 }
    );
  }
}