import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Clock, Zap } from 'lucide-react';
import ProductGrid from '../../components/common/ProductGrid';
import DropGrid from '../../components/common/DropGrid';
import { fetchActiveDrops, fetchUpcomingDrops } from '../../store/slices/dropsSlice';
import { fetchProducts } from '../../store/slices/productsSlice';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #212121 0%, #424242 100%);
  color: white;
  padding: 80px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 48px 16px;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 32px 0;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: white;
  color: #212121;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const SectionContainer = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #212121;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #616161;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: color 0.2s ease;

  &:hover {
    color: #212121;
  }
`;

const FeaturesSection = styled.section`
  background: white;
  padding: 64px 24px;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 24px;
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #F5F5F5;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #212121;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #212121;
`;

const FeatureDescription = styled.p`
  font-size: 0.9375rem;
  color: #616161;
  margin: 0;
  line-height: 1.6;
`;

const HomePage = () => {
  const dispatch = useDispatch();
  const { activeDrops, upcomingDrops, loading: dropsLoading } = useSelector(state => state.drops);
  const { products, loading: productsLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchActiveDrops());
    dispatch(fetchUpcomingDrops());
    dispatch(fetchProducts({ limit: 8, sort: '-createdAt' }));
  }, [dispatch]);

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Découvrez les sneakers les plus exclusives</HeroTitle>
          <HeroSubtitle>
            Accédez aux drops exclusifs des marques les plus recherchées. 
            Ne manquez jamais une sortie avec RetroRise.
          </HeroSubtitle>
          <CTAButton to="/drops">
            Explorer les drops
            <ArrowRight size={20} />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <TrendingUp size={32} />
            </FeatureIcon>
            <FeatureTitle>Tendances</FeatureTitle>
            <FeatureDescription>
              Découvrez les sneakers les plus populaires et les tendances du moment.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Clock size={32} />
            </FeatureIcon>
            <FeatureTitle>Drops exclusifs</FeatureTitle>
            <FeatureDescription>
              Accédez aux drops exclusifs des marques les plus recherchées.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Zap size={32} />
            </FeatureIcon>
            <FeatureTitle>Livraison rapide</FeatureTitle>
            <FeatureDescription>
              Recevez vos commandes rapidement grâce à notre service de livraison express.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {activeDrops && activeDrops.length > 0 && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Drops actifs</SectionTitle>
            <ViewAllLink to="/drops">
              Voir tous les drops
              <ArrowRight size={16} />
            </ViewAllLink>
          </SectionHeader>
          <DropGrid drops={activeDrops.slice(0, 3)} loading={dropsLoading} />
        </SectionContainer>
      )}

      {upcomingDrops && upcomingDrops.length > 0 && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>Drops à venir</SectionTitle>
            <ViewAllLink to="/drops?status=upcoming">
              Voir tous les drops
              <ArrowRight size={16} />
            </ViewAllLink>
          </SectionHeader>
          <DropGrid drops={upcomingDrops.slice(0, 3)} loading={dropsLoading} />
        </SectionContainer>
      )}

      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Nouveautés</SectionTitle>
          <ViewAllLink to="/products">
            Voir tous les produits
            <ArrowRight size={16} />
          </ViewAllLink>
        </SectionHeader>
        <ProductGrid products={products} loading={productsLoading} />
      </SectionContainer>
    </PageContainer>
  );
};

export default HomePage;
