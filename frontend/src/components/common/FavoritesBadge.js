
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
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

const FavoritesBadge = () => {
  const favoritesCount = useSelector(state => state.favorites.items.length);

  return (
    <BadgeContainer to="/favorites" aria-label="Favoris">
      <Heart size={20} />
      {favoritesCount > 0 && <Badge>{favoritesCount}</Badge>}
    </BadgeContainer>
  );
};

export default FavoritesBadge;
