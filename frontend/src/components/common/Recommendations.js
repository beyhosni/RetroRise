
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import api from '../../services/api';

const RecommendationsContainer = styled.div`
  margin: 2rem 0;
`;

const RecommendationsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const RecommendationsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const RecommendationsIcon = styled(Sparkles)`
  color: ${({ theme }) => theme.colors.primary};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Recommendations = ({ type = 'personalized', limit = 4, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, [type]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint;
      switch (type) {
        case 'trending':
          endpoint = '/products/trending';
          break;
        case 'similar':
          endpoint = '/products/similar';
          break;
        case 'new':
          endpoint = '/products/new';
          break;
        case 'personalized':
        default:
          endpoint = '/recommendations/personalized';
      }

      const response = await api.get(endpoint, { params: { limit } });
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Erreur lors du chargement des recommandations');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (title) return title;

    switch (type) {
      case 'trending':
        return 'Tendances du moment';
      case 'similar':
        return 'Produits similaires';
      case 'new':
        return 'Nouveautés';
      case 'personalized':
      default:
        return 'Recommandé pour vous';
    }
  };

  if (loading) {
    return (
      <RecommendationsContainer>
        <RecommendationsHeader>
          <RecommendationsTitle>{getTitle()}</RecommendationsTitle>
          <RecommendationsIcon size={24} />
        </RecommendationsHeader>
        <LoadingSpinner />
      </RecommendationsContainer>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <RecommendationsContainer>
      <RecommendationsHeader>
        <RecommendationsTitle>{getTitle()}</RecommendationsTitle>
        <RecommendationsIcon size={24} />
      </RecommendationsHeader>

      <ProductsGrid>
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            showFavoriteButton
          />
        ))}
      </ProductsGrid>
    </RecommendationsContainer>
  );
};

export default Recommendations;
