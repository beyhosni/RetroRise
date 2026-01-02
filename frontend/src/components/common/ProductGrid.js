import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: #616161;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  color: #BDBDBD;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const ProductGrid = ({ 
  products, 
  loading, 
  onWishlistToggle, 
  wishlist = {},
  emptyMessage = 'Aucun produit disponible' 
}) => {
  if (loading) {
    return (
      <GridContainer>
        {[...Array(8)].map((_, index) => (
          <LoadingSpinner key={index} />
        ))}
      </GridContainer>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <svg width={64} height={64} viewBox="0 0 24 24} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </EmptyStateIcon>
        <EmptyStateText>{emptyMessage}</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onWishlistToggle={onWishlistToggle}
          isWishlisted={wishlist[product.id] || false}
        />
      ))}
    </GridContainer>
  );
};

export default ProductGrid;
