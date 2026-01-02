import React from 'react';
import styled from 'styled-components';
import DropCard from './DropCard';
import LoadingSpinner from './LoadingSpinner';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const DropGrid = ({ 
  drops, 
  loading, 
  emptyMessage = 'Aucun drop disponible' 
}) => {
  if (loading) {
    return (
      <GridContainer>
        {[...Array(6)].map((_, index) => (
          <LoadingSpinner key={index} />
        ))}
      </GridContainer>
    );
  }

  if (!drops || drops.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <svg width={64} height={64} viewBox="0 0 24 24} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </EmptyStateIcon>
        <EmptyStateText>{emptyMessage}</EmptyStateText>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {drops.map(drop => (
        <DropCard key={drop.id} drop={drop} />
      ))}
    </GridContainer>
  );
};

export default DropGrid;
