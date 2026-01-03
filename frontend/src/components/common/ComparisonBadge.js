
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { GitCompare } from 'lucide-react';
import { useSelector } from 'react-redux';

const BadgeContainer = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #616161;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background: #F44336;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0 4px;
`;

const ComparisonBadge = () => {
  const comparisonCount = useSelector(state => state.comparison.items.length);

  return (
    <BadgeContainer to="/comparison" aria-label="Comparer les produits">
      <GitCompare size={20} />
      {comparisonCount > 0 && <Badge>{comparisonCount}</Badge>}
    </BadgeContainer>
  );
};

export default ComparisonBadge;
