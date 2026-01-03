
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Star, StarHalf, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ReviewsContainer = styled.div`
  margin: 2rem 0;
`;

const ReviewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ReviewsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const RatingSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AverageRating = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const RatingCount = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const ReviewForm = styled.form`
  background: ${({ theme }) => theme.colors.card};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const StarIcon = styled(Star)`
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  ${({ filled, theme }) => filled ? `
    color: ${theme.colors.warning};
    fill: ${theme.colors.warning};
  ` : `
    color: ${theme.colors.border};
  `}
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 1.5rem;
  border-radius: 12px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ReviewerAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const ReviewerName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ReviewDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ReviewRating = styled.div`
  display: flex;
  gap: 0.125rem;
  color: ${({ theme }) => theme.colors.warning};
`;

const ReviewContent = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReviewActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ active, theme }) => active && `
    color: ${theme.colors.primary};
    font-weight: 600;
  `}
`;

const LoadMoreButton = styled.button`
  width: 100%;
  background: transparent;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}/reviews`, {
        params: { page, limit: 5 }
      });

      if (page === 1) {
        setReviews(response.data.reviews);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }

      setAverageRating(response.data.averageRating);
      setTotalReviews(response.data.totalReviews);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/products/${productId}/reviews`, {
        rating: userRating,
        comment: reviewText
      });

      toast.success('Avis ajouté avec succès');
      setReviewText('');
      setUserRating(0);
      setPage(1);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l'ajout de l'avis');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (reviewId, type) => {
    try {
      await api.post(`/reviews/${reviewId}/vote`, { type });
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            userVote: type,
            helpfulCount: review.helpfulCount + (review.userVote === type ? -1 : 1)
          };
        }
        return review;
      }));
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const renderStars = (rating, interactive = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <StarIcon
        key={star}
        size={24}
        filled={star <= Math.round(rating)}
        onClick={interactive ? () => setUserRating(star) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ));
  };

  if (loading && page === 1) {
    return <div>Chargement...</div>;
  }

  return (
    <ReviewsContainer>
      <ReviewsHeader>
        <ReviewsTitle>Avis clients</ReviewsTitle>
        <RatingSummary>
          <AverageRating>{averageRating.toFixed(1)}</AverageRating>
          <RatingCount>({totalReviews} avis)</RatingCount>
        </RatingSummary>
      </ReviewsHeader>

      <ReviewForm onSubmit={handleSubmitReview}>
        <FormTitle>Donner votre avis</FormTitle>
        <StarRating>
          {renderStars(hoverRating || userRating, true)}
        </StarRating>
        <TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          required
        />
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Envoi en cours...' : 'Publier mon avis'}
        </SubmitButton>
      </ReviewForm>

      <ReviewList>
        {reviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <ReviewerInfo>
                <ReviewerAvatar 
                  src={review.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=random`}
                  alt={review.user.name}
                />
                <div>
                  <ReviewerName>{review.user.name}</ReviewerName>
                  <ReviewDate>
                    {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </ReviewDate>
                </div>
              </ReviewerInfo>
              <ReviewRating>
                {renderStars(review.rating)}
              </ReviewRating>
            </ReviewHeader>

            <ReviewContent>{review.comment}</ReviewContent>

            <ReviewActions>
              <ActionButton
                active={review.userVote === 'helpful'}
                onClick={() => handleVote(review.id, 'helpful')}
              >
                <ThumbsUp size={16} />
                Utile ({review.helpfulCount})
              </ActionButton>
              <ActionButton
                active={review.userVote === 'notHelpful'}
                onClick={() => handleVote(review.id, 'notHelpful')}
              >
                <ThumbsDown size={16} />
                Pas utile
              </ActionButton>
            </ReviewActions>
          </ReviewCard>
        ))}
      </ReviewList>

      {hasMore && !loading && (
        <LoadMoreButton onClick={() => setPage(prev => prev + 1)}>
          Charger plus d'avis
        </LoadMoreButton>
      )}

      {loading && page > 1 && <div>Chargement...</div>}
    </ReviewsContainer>
  );
};

export default Reviews;
