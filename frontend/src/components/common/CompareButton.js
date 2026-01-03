
import React from 'react';
import styled from 'styled-components';
import { GitCompare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToComparison, removeFromComparison } from '../../store/slices/comparisonSlice';
import toast from 'react-hot-toast';

const CompareButtonContainer = styled.button`
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

  ${({ isComparing, theme }) => isComparing && `
    background: ${theme.colors.primary};
    color: white;
  `}
`;

const CompareButton = ({ productId, onToggle }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { items: comparison } = useSelector(state => state.comparison);
  const isComparing = comparison.some(item => item.id === productId);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);
      if (isComparing) {
        await dispatch(removeFromComparison(productId)).unwrap();
        toast.success('Retiré de la comparaison');
      } else {
        if (comparison.length >= 4) {
          toast.error('Vous pouvez comparer au maximum 4 produits');
          return;
        }
        await dispatch(addToComparison(productId)).unwrap();
        toast.success('Ajouté à la comparaison');
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
    <CompareButtonContainer
      isComparing={isComparing}
      onClick={handleClick}
      disabled={loading}
      aria-label={isComparing ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}
    >
      <GitCompare 
        size={20} 
        style={{ transition: 'all 0.2s' }}
      />
    </CompareButtonContainer>
  );
};

export default CompareButton;
