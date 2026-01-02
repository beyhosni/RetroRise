import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => props.variant === 'new' ? '#4CAF50' : '#FF5722'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  svg {
    color: ${props => props.isWishlisted ? '#FF5722' : '#333'};
    fill: ${props => props.isWishlisted ? '#FF5722' : 'none'};
  }
`;

const Content = styled.div`
  padding: 16px;
`;

const BrandName = styled.span`
  color: #757575;
  font-size: 0.875rem;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const Price = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #212121;
`;

const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #9E9E9E;
  text-decoration: line-through;
  margin-left: 8px;
`;

const AddToCartButton = styled.button`
  background: #212121;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: #424242;
  }

  &:disabled {
    background: #BDBDBD;
    cursor: not-allowed;
  }
`;

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted = false,
  showAddToCart = true 
}) => {
  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    isNew = false,
    isSale = false,
    inStock = true
  } = product;

  return (
    <CardContainer>
      <ImageContainer>
        {isNew && <Badge variant="new">New</Badge>}
        {isSale && !isNew && <Badge variant="sale">Sale</Badge>}
        <WishlistButton 
          onClick={() => onToggleWishlist && onToggleWishlist(product)}
          isWishlisted={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} />
        </WishlistButton>
        <Link to={`/products/${id}`}>
          <ProductImage src={image || '/images/placeholder-product.jpg'} alt={name} />
        </Link>
      </ImageContainer>
      <Content>
        <BrandName>{brand?.name || 'Unknown Brand'}</BrandName>
        <ProductName>{name}</ProductName>
        <PriceContainer>
          <div>
            <Price>{price.toFixed(2)} €</Price>
            {originalPrice && originalPrice > price && (
              <OriginalPrice>{originalPrice.toFixed(2)} €</OriginalPrice>
            )}
          </div>
          {showAddToCart && (
            <AddToCartButton 
              onClick={() => onAddToCart && onAddToCart(product)}
              disabled={!inStock}
            >
              <ShoppingCart size={16} />
              {inStock ? 'Add' : 'Out of Stock'}
            </AddToCartButton>
          )}
        </PriceContainer>
      </Content>
    </CardContainer>
  );
};

export default ProductCard;
