import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrop } from '../../store/slices/dropsSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { Calendar, Clock, ChevronLeft, Users } from 'lucide-react';
import ProductGrid from '../../components/common/ProductGrid';
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

const DropHeader = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;

  @media (max-width: 768px) {
    height: 250px;
  }
`;

const DropContent = styled.div`
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;

  ${props => {
    switch(props.status) {
      case 'active':
        return `
          background: rgba(76, 175, 80, 0.1);
          color: #4CAF50;
        `;
      case 'upcoming':
        return `
          background: rgba(33, 150, 243, 0.1);
          color: #2196F3;
        `;
      case 'ended':
        return `
          background: rgba(158, 158, 158, 0.1);
          color: #9E9E9E;
        `;
      default:
        return `
          background: rgba(0, 0, 0, 0.05);
          color: #616161;
        `;
    }
  }}
`;

const DropTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #212121;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const DropDescription = styled.p`
  font-size: 1.125rem;
  color: #616161;
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #F5F5F5;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #616161;
  font-size: 0.9375rem;

  svg {
    color: #757575;
    flex-shrink: 0;
  }
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

const ProductCount = styled.span`
  font-size: 0.9375rem;
  color: #616161;
`;

const DropDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentDrop: drop, loading: dropLoading } = useSelector(state => state.drops);
  const { products, loading: productsLoading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchDrop(id));
    dispatch(fetchProducts({ dropId: id, limit: 20 }));
  }, [dispatch, id]);

  const formatDate = (date) => {
    if (!date) return 'Non défini';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Actif';
      case 'upcoming': return 'À venir';
      case 'ended': return 'Terminé';
      default: return status;
    }
  };

  if (dropLoading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingSpinner fullWidth fullHeight />
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!drop) {
    return (
      <PageContainer>
        <ContentContainer>
          <BackButton onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            Retour
          </BackButton>
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: '#212121' }}>
              Drop non trouvé
            </h2>
            <p style={{ fontSize: '1rem', color: '#616161', marginBottom: '24px' }}>
              Le drop que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Link to="/drops">
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
                Retour aux drops
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

        <DropHeader>
          <HeroImage src={drop.image} alt={drop.title} />
          <DropContent>
            <StatusBadge status={drop.status}>
              {getStatusLabel(drop.status)}
            </StatusBadge>
            <DropTitle>{drop.title}</DropTitle>
            <DropDescription>{drop.description}</DropDescription>

            <InfoGrid>
              <InfoItem>
                <Calendar size={20} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Début</div>
                  {formatDate(drop.startDate)}
                </div>
              </InfoItem>

              {drop.endDate && (
                <InfoItem>
                  <Clock size={20} />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Fin</div>
                    {formatDate(drop.endDate)}
                  </div>
                </InfoItem>
              )}

              <InfoItem>
                <Users size={20} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Produits</div>
                  {products.length} produit{products.length !== 1 ? 's' : ''}
                </div>
              </InfoItem>
            </InfoGrid>
          </DropContent>
        </DropHeader>

        {products.length > 0 && (
          <ProductsSection>
            <SectionHeader>
              <SectionTitle>Produits du drop</SectionTitle>
              <ProductCount>{products.length} produit{products.length !== 1 ? 's' : ''}</ProductCount>
            </SectionHeader>
            <ProductGrid products={products} loading={productsLoading} />
          </ProductsSection>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default DropDetailPage;
