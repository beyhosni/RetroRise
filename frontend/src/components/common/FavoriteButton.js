
import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';
import toast from 'react-hot-toast';

const FavoriteButtonContainer = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  ${({ isFavorite, theme }) => isFavorite && `
    background: ${theme.colors.primary};
    color: white;
  `}
`;

const FavoriteButton = ({ productId, isFavorite, onToggle }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      if (isFavorite) {
        await dispatch(removeFromFavorites(productId)).unwrap();
        toast.success('Retiré des favoris');
      } else {
        await dispatch(addToFavorites(productId)).unwrap();
        toast.success('Ajouté aux favoris');
      }
      if (onToggle) {
        onToggle();
      }
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FavoriteButtonContainer
      isFavorite={isFavorite}
      onClick={handleClick}
      disabled={loading}
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart 
        size={20} 
        fill={isFavorite ? 'currentColor' : 'none'}
        style={{ transition: 'fill 0.2s' }}
      />
    </FavoriteButtonContainer>
  );
};

export default FavoriteButton;
