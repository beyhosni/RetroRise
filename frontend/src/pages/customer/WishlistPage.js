
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import ProductGrid from '../../components/common/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const WishlistContainer = styled.div`
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

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items: wishlist, loading, error } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <WishlistContainer>
        <LoadingSpinner />
      </WishlistContainer>
    );
  }

  if (wishlist.length === 0) {
    return (
      <WishlistContainer>
        <PageHeader>
          <PageTitle>Ma liste de souhaits</PageTitle>
          <PageSubtitle>Retrouvez tous les produits que vous souhaitez acheter</PageSubtitle>
        </PageHeader>

        <EmptyState>
          <EmptyIcon>💝</EmptyIcon>
          <EmptyTitle>Votre liste de souhaits est vide</EmptyTitle>
          <EmptyText>
            Ajoutez des produits à votre liste de souhaits pour les retrouver facilement plus tard !
          </EmptyText>
          <BrowseButton onClick={() => window.location.href = '/products'}>
            Découvrir nos produits
          </BrowseButton>
        </EmptyState>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <PageHeader>
        <PageTitle>Ma liste de souhaits</PageTitle>
        <PageSubtitle>{wishlist.length} produit{wishlist.length > 1 ? 's' : ''} dans votre liste</PageSubtitle>
      </PageHeader>

      <ProductGrid products={wishlist} showWishlistButton />
    </WishlistContainer>
  );
};

export default WishlistPage;
