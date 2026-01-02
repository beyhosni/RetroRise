import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for products when query changes
  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.getProducts({ q: query, limit: 5 });
        setResults(response.data.items || []);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const handleResultClick = (productId) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchForm onSubmit={handleSearch}>
        <SearchIconWrapper>
          <Search size={20} />
        </SearchIconWrapper>
        <SearchInput
          type="text"
          placeholder="Search for sneakers, brands, drops..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </SearchForm>

      {showResults && (
        <SearchResults>
          {loading ? (
            <LoadingMessage>Searching...</LoadingMessage>
          ) : results.length > 0 ? (
            results.map((product) => (
              <SearchResultItem
                key={product.id}
                onClick={() => handleResultClick(product.id)}
              >
                <ProductImage
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                />
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductBrand>{product.brand?.name}</ProductBrand>
                  <ProductPrice>${product.price}</ProductPrice>
                </ProductInfo>
              </SearchResultItem>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </SearchResults>
      )}
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const SearchIconWrapper = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-right: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: ${props => props.theme.colors.text};

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchResults = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const NoResults = styled.div`
  padding: 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

const SearchResultItem = styled.div`
  display: flex;
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 5px;
`;

const ProductBrand = styled.div`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

export default SearchBar;
