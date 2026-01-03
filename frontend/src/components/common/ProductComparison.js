
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { X, ArrowLeft } from 'lucide-react';
import { removeFromComparison, clearComparison } from '../../store/slices/comparisonSlice';
import { useNavigate } from 'react-router-dom';

const ComparisonContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ClearButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.errorDark};
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 200px repeat(auto-fit, minmax(250px, 1fr));
  gap: 1px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ComparisonRow = styled.div`
  display: contents;
`;

const ComparisonCell = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100px;
`;

const LabelCell = styled(ComparisonCell)`
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 200px;
  height: auto;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductBrand = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
`;

const FeatureHighlight = styled(FeatureValue)`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
`;

const FeatureNeutral = styled(FeatureValue)`
  color: ${({ theme }) => theme.colors.textLight};
`;

const FeatureNegative = styled(FeatureValue)`
  color: ${({ theme }) => theme.colors.error};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const ProductComparison = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.comparison);

  const handleRemove = (productId) => {
    dispatch(removeFromComparison(productId));
  };

  const handleClear = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider la comparaison ?')) {
      dispatch(clearComparison());
    }
  };

  const getFeatureValue = (product, feature) => {
    switch (feature) {
      case 'price':
        return `${product.price.toFixed(2)} €`;
      case 'brand':
        return product.brand?.name || 'Non spécifié';
      case 'category':
        return product.category || 'Non spécifié';
      case 'rating':
        return `${product.rating || 0}/5`;
      case 'stock':
        return product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock';
      case 'color':
        return product.colors?.join(', ') || 'Non spécifié';
      case 'size':
        return product.sizes?.join(', ') || 'Non spécifié';
      case 'material':
        return product.material || 'Non spécifié';
      case 'releaseDate':
        return product.releaseDate 
          ? new Date(product.releaseDate).toLocaleDateString('fr-FR')
          : 'Non spécifié';
      default:
        return 'Non spécifié';
    }
  };

  const getFeatureType = (feature) => {
    const features = {
      price: 'Prix',
      brand: 'Marque',
      category: 'Catégorie',
      rating: 'Note',
      stock: 'Stock',
      color: 'Couleurs',
      size: 'Tailles',
      material: 'Matière',
      releaseDate: 'Date de sortie',
    };
    return features[feature] || feature;
  };

  const getBestValue = (feature) => {
    if (feature === 'price') {
      return Math.min(...items.map(item => item.price));
    }
    if (feature === 'rating') {
      return Math.max(...items.map(item => item.rating || 0));
    }
    if (feature === 'stock') {
      return Math.max(...items.map(item => item.stock));
    }
    return null;
  };

  const features = ['price', 'brand', 'category', 'rating', 'stock', 'color', 'size', 'material', 'releaseDate'];

  if (items.length === 0) {
    return (
      <ComparisonContainer>
        <ComparisonHeader>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Retour
          </BackButton>
          <HeaderTitle>Comparaison de produits</HeaderTitle>
        </ComparisonHeader>

        <EmptyState>
          <EmptyTitle>Aucun produit à comparer</EmptyTitle>
          <EmptyText>
            Ajoutez des produits à votre liste de comparaison pour les comparer côte à côte.
          </EmptyText>
        </EmptyState>
      </ComparisonContainer>
    );
  }

  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Retour
        </BackButton>
        <HeaderTitle>Comparaison de produits ({items.length})</HeaderTitle>
        <ClearButton onClick={handleClear}>
          Vider la comparaison
        </ClearButton>
      </ComparisonHeader>

      <ComparisonGrid>
        {/* Header row with product images and names */}
        <ComparisonRow>
          <LabelCell>Produit</LabelCell>
          {items.map(product => (
            <ComparisonCell key={product.id} style={{ position: 'relative' }}>
              <RemoveButton onClick={() => handleRemove(product.id)}>
                <X size={16} />
              </RemoveButton>
              <ProductImage src={product.image} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductBrand>{product.brand?.name}</ProductBrand>
              <ProductPrice>{product.price.toFixed(2)} €</ProductPrice>
            </ComparisonCell>
          ))}
        </ComparisonRow>

        {/* Feature rows */}
        {features.map(feature => (
          <ComparisonRow key={feature}>
            <LabelCell>{getFeatureType(feature)}</LabelCell>
            {items.map(product => {
              const value = getFeatureValue(product, feature);
              const bestValue = getBestValue(feature);
              const isBest = bestValue !== null && 
                (feature === 'price' 
                  ? product.price === bestValue 
                  : (feature === 'rating' || feature === 'stock') 
                    ? (product[feature] || 0) === bestValue 
                    : false);

              return (
                <ComparisonCell key={product.id}>
                  {isBest ? (
                    <FeatureHighlight>{value}</FeatureHighlight>
                  ) : (
                    <FeatureNeutral>{value}</FeatureNeutral>
                  )}
                </ComparisonCell>
              );
            })}
          </ComparisonRow>
        ))}
      </ComparisonGrid>
    </ComparisonContainer>
  );
};

export default ProductComparison;
