import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../store/slices/productsSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingCart, Share2, ChevronLeft, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
  padding: 24px;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  color: #616161;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const ProductContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px 0;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#212121' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #424242;
  }
`;

const InfoSection = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const BrandName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #757575;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #212121;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #212121;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.25rem;
  color: #9E9E9E;
  text-decoration: line-through;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DiscountBadge = styled.span`
  padding: 4px 8px;
  background: #F44336;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #616161;
  line-height: 1.6;
  margin: 0;
`;

const SizeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SizeLabel = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #424242;
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SizeOption = styled.button`
  min-width: 48px;
  padding: 8px 12px;
  border: 1px solid ${props => props.selected ? '#212121' : '#E0E0E0'};
  background: ${props => props.selected ? '#212121' : 'white'};
  color: ${props => props.selected ? 'white' : '#212121'};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #424242;
    background: #F5F5F5;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    text-decoration: line-through;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #212121;
    background: #F5F5F5;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1rem;
  font-weight: 600;
  min-width: 32px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SecondaryActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #E0E0E0;
  background: white;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9375rem;
  color: #212121;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #212121;
    background: #F5F5F5;
  }
`;

const StockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9375rem;
  color: ${props => props.inStock ? '#4CAF50' : '#F44336'};
  font-weight: 500;
`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct: product, loading } = useSelector(state => state.products);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Veuillez sélectionner une pointure');
      return;
    }

    dispatch(addToCart({
      productId: product.id,
      quantity,
      product
    }));

    toast.success('Produit ajouté au panier');
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Produit retiré de la liste de souhaits' : 'Produit ajouté à la liste de souhaits');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingSpinner fullWidth fullHeight />
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <ContentContainer>
          <BackButton onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Retour
          </BackButton>
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#212121' }}>
              Produit non trouvé
            </h2>
            <p style={{ fontSize: '1rem', color: '#616161', marginBottom: '24px' }}>
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.discountPrice / product.price) * 100) 
    : 0;

  return (
    <PageContainer>
      <ContentContainer>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Retour
        </BackButton>

        <ProductContainer>
          <ImageSection>
            <MainImage src={product.image} alt={product.name} />
            <ThumbnailContainer>
              {product.images && product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  active={index === 0}
                />
              ))}
            </ThumbnailContainer>
          </ImageSection>

          <InfoSection>
            <div>
              <BrandName>{product.brand?.name || 'Marque inconnue'}</BrandName>
              <ProductName>{product.name}</ProductName>
            </div>

            <PriceContainer>
              <Price>{hasDiscount ? `${product.discountPrice}€` : `${product.price}€`}</Price>
              {hasDiscount && (
                <>
                  <OriginalPrice>{product.price}€</OriginalPrice>
                  <DiscountBadge>-{discountPercentage}%</DiscountBadge>
                </>
              )}
            </PriceContainer>

            <StockStatus inStock={product.inStock}>
              {product.inStock ? (
                <>
                  <Check size={18} />
                  En stock
                </>
              ) : (
                <>
                  <span style={{ fontSize: '18px' }}>×</span>
                  Rupture de stock
                </>
              )}
            </StockStatus>

            <Description>{product.description}</Description>

            {product.inStock && (
              <>
                <SizeSelector>
                  <SizeLabel>Pointure</SizeLabel>
                  <SizeOptions>
                    {product.sizes && product.sizes.map(size => (
                      <SizeOption
                        key={size.id}
                        selected={selectedSize === size.id}
                        disabled={!size.inStock}
                        onClick={() => setSelectedSize(size.id)}
                      >
                        {size.label}
                      </SizeOption>
                    ))}
                  </SizeOptions>
                </SizeSelector>

                <QuantitySelector>
                  <SizeLabel>Quantité</SizeLabel>
                  <QuantityButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </QuantityButton>
                </QuantitySelector>

                <ActionButtons>
                  <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                  >
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </Button>
                </ActionButtons>

                <SecondaryActions>
                  <SecondaryButton onClick={handleToggleWishlist}>
                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                    {isWishlisted ? 'Retirer' : 'Ajouter'}
                  </SecondaryButton>
                  <SecondaryButton onClick={handleShare}>
                    <Share2 size={18} />
                    Partager
                  </SecondaryButton>
                </SecondaryActions>
              </>
            )}
          </InfoSection>
        </ProductContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProductDetailPage;
