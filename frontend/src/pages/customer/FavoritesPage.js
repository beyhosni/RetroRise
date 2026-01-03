
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../store/slices/favoritesSlice';
import ProductGrid from '../../components/common/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FavoritesContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  margin-top: 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
`;

const BrowseButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { items: favorites, loading, error } = useSelector(state => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <FavoritesContainer>
        <LoadingSpinner />
      </FavoritesContainer>
    );
  }

  if (favorites.length === 0) {
    return (
      <FavoritesContainer>
        <PageHeader>
          <PageTitle>Mes favoris</PageTitle>
          <PageSubtitle>Retrouvez tous vos produits préférés</PageSubtitle>
        </PageHeader>

        <EmptyState>
          <EmptyIcon>❤️</EmptyIcon>
          <EmptyTitle>Aucun favori pour le moment</EmptyTitle>
          <EmptyText>
            Commencez à explorer notre collection et ajoutez vos produits préférés à vos favoris !
          </EmptyText>
          <BrowseButton onClick={() => window.location.href = '/products'}>
            Découvrir nos produits
          </BrowseButton>
        </EmptyState>
      </FavoritesContainer>
    );
  }

  return (
    <FavoritesContainer>
      <PageHeader>
        <PageTitle>Mes favoris</PageTitle>
        <PageSubtitle>{favorites.length} produit{favorites.length > 1 ? 's' : ''} dans vos favoris</PageSubtitle>
      </PageHeader>

      <ProductGrid products={favorites} showFavoriteButton />
    </FavoritesContainer>
  );
};

export default FavoritesPage;
