import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrand } from '../../store/slices/brandsSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import ProductGrid from '../../components/common/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ChevronLeft, Instagram, Twitter, Facebook, Globe } from 'lucide-react';

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

const BrandHeader = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

const BrandBanner = styled.div`
  position: relative;
  height: 200px;
  background: ${props => props.bannerImage 
    ? `url(${props.bannerImage}) center/cover` 
    : 'linear-gradient(135deg, #212121 0%, #424242 100%)'};

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const BrandContent = styled.div`
  padding: 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
  }
`;

const BrandLogo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const BrandInfo = styled.div`
  flex: 1;
`;

const BrandName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #212121;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const BrandDescription = styled.p`
  font-size: 1.125rem;
  color: #616161;
  line-height: 1.6;
  margin: 0 0 20px 0;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #F5F5F5;
  border-radius: 8px;
  color: #616161;
  transition: all 0.2s ease;

  &:hover {
    background: #E0E0E0;
    color: #212121;
    transform: translateY(-2px);
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid #F5F5F5;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 16px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #212121;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #616161;
`;

const ProductsSection = styled.section`
  margin-top: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #212121;
`;

const BrandDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBrand: brand, loading: brandLoading } = useSelector(state => state.brands);
  const { products, loading: productsLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchBrand(id));
    dispatch(fetchProducts({ brandId: id, limit: 20 }));
  }, [dispatch, id]);

  if (brandLoading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingSpinner fullWidth fullHeight />
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!brand) {
    return (
      <PageContainer>
        <ContentContainer>
          <BackButton onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Retour
          </BackButton>
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#212121' }}>
              Marque non trouvée
            </h2>
            <p style={{ fontSize: '1rem', color: '#616161', marginBottom: '24px' }}>
              La marque que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Link to="/brands">
              <button style={{
                padding: '12px 24px',
                background: '#212121',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Retour aux marques
              </button>
            </Link>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Retour
        </BackButton>

        <BrandHeader>
          <BrandBanner bannerImage={brand.bannerImage} />
          <BrandContent>
            <BrandLogo src={brand.logo} alt={brand.name} />
            <BrandInfo>
              <BrandName>{brand.name}</BrandName>
              <BrandDescription>{brand.description}</BrandDescription>

              {brand.socialLinks && (
                <SocialLinks>
                  {brand.socialLinks.instagram && (
                    <SocialLink href={brand.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram size={20} />
                    </SocialLink>
                  )}
                  {brand.socialLinks.twitter && (
                    <SocialLink href={brand.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter size={20} />
                    </SocialLink>
                  )}
                  {brand.socialLinks.facebook && (
                    <SocialLink href={brand.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook size={20} />
                    </SocialLink>
                  )}
                  {brand.website && (
                    <SocialLink href={brand.website} target="_blank" rel="noopener noreferrer">
                      <Globe size={20} />
                    </SocialLink>
                  )}
                </SocialLinks>
              )}

              <Stats>
                <StatItem>
                  <StatValue>{products.length}</StatValue>
                  <StatLabel>Produits</StatLabel>
                </StatItem>
                {brand.dropCount && (
                  <StatItem>
                    <StatValue>{brand.dropCount}</StatValue>
                    <StatLabel>Drops</StatLabel>
                  </StatItem>
                )}
                {brand.followerCount && (
                  <StatItem>
                    <StatValue>{brand.followerCount}</StatValue>
                    <StatLabel>Abonnés</StatLabel>
                  </StatItem>
                )}
              </Stats>
            </BrandInfo>
          </BrandContent>
        </BrandHeader>

        {products.length > 0 && (
          <ProductsSection>
            <SectionHeader>
              <SectionTitle>Produits de {brand.name}</SectionTitle>
            </SectionHeader>
            <ProductGrid products={products} loading={productsLoading} />
          </ProductsSection>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default BrandDetailPage;
