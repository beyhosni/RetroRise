
import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const WishlistButtonContainer = styled.button`
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

  ${({ isInWishlist, theme }) => isInWishlist && `
    background: ${theme.colors.primary};
    color: white;
  `}
`;

const WishlistButton = ({ productId, onToggle }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { items: wishlist } = useSelector(state => state.wishlist);
  const isInWishlist = wishlist.some(item => item.id === productId);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success('Retiré de la liste de souhaits');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success('Ajouté à la liste de souhaits');
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
    <WishlistButtonContainer
      isInWishlist={isInWishlist}
      onClick={handleClick}
      disabled={loading}
      aria-label={isInWishlist ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
    >
      <Heart 
        size={20} 
        fill={isInWishlist ? 'currentColor' : 'none'}
        style={{ transition: 'fill 0.2s' }}
      />
    </WishlistButtonContainer>
  );
};

export default WishlistButton;
