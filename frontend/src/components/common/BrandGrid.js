import React from 'react';
import styled from 'styled-components';
import BrandCard from './BrandCard';
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

const BrandGrid = ({ 
  brands, 
  loading, 
  emptyMessage = 'Aucune marque disponible' 
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

  if (!brands || brands.length === 0) {
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
      {brands.map(brand => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </GridContainer>
  );
};

export default BrandGrid;
