
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductGrid from '../components/common/ProductGrid';
import AdvancedFilters from '../components/common/AdvancedFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchProducts } from '../store/slices/productsSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProductsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const ProductsHeader = styled.div`
  margin-bottom: 2rem;
`;

const ProductsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductsContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

const FiltersSection = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;
`;

const ProductsSection = styled.div``;

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

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.products);
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    brands: [],
    sizes: [],
    colors: [],
    minRating: 0,
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // TODO: Implement filtered products fetch
    // dispatch(fetchFilteredProducts(newFilters));
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      brands: [],
      sizes: [],
      colors: [],
      minRating: 0,
    });
    // TODO: Reset products
    // dispatch(fetchProducts());
  };

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingSpinner />
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <ProductsHeader>
        <ProductsTitle>Nos produits</ProductsTitle>
      </ProductsHeader>

      <ProductsContent>
        <FiltersSection>
          <AdvancedFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </FiltersSection>

        <ProductsSection>
          {products.length === 0 ? (
            <EmptyState>
              <EmptyTitle>Aucun produit trouvé</EmptyTitle>
              <EmptyText>
                Essayez de modifier vos filtres pour voir plus de résultats.
              </EmptyText>
            </EmptyState>
          ) : (
            <ProductGrid products={products} />
          )}
        </ProductsSection>
      </ProductsContent>
    </ProductsContainer>
  );
};

export default Products;
