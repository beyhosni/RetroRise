
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

const BrandsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  padding: 0.5rem;
  outline: none;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const BrandsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const BrandCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const BrandImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BrandContent = styled.div`
  padding: 1.5rem;
`;

const BrandName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const BrandDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BrandMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BrandScore = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const BrandStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ active, theme }) => active ? theme.colors.success : theme.colors.error};
  color: white;
`;

const BrandActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ theme, variant }) => 
    variant === 'danger' ? theme.colors.error : theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;

  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'danger' ? theme.colors.errorDark : theme.colors.primaryDark};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get(`/brands?page=${currentPage}&search=${searchTerm}`);
      // setBrands(response.data.content);
      // setTotalPages(response.data.totalPages);

      // Mock data for now
      setTimeout(() => {
        setBrands([
          {
            id: '1',
            name: 'Nike Air',
            description: 'Collection exclusive de sneakers Nike vintage',
            score: 85,
            active: true,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
          },
          {
            id: '2',
            name: 'Adidas Originals',
            description: 'Les modèles iconiques d'Adidas remis au goût du jour',
            score: 92,
            active: true,
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'
          },
          {
            id: '3',
            name: 'Puma Retro',
            description: 'La collection Puma des années 80',
            score: 78,
            active: false,
            image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400'
          },
        ]);
        setTotalPages(5);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (brandId) => {
    navigate(`/admin/brands/${brandId}`);
  };

  const handleDelete = async (brandId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
      try {
        // TODO: Replace with actual API call
        // await api.delete(`/brands/${brandId}`);
        setBrands(brands.filter(brand => brand.id !== brandId));
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  if (loading) {
    return (
      <BrandsContainer>
        <LoadingSpinner>
          <div>Chargement...</div>
        </LoadingSpinner>
      </BrandsContainer>
    );
  }

  return (
    <BrandsContainer>
      <PageHeader>
        <PageTitle>Gestion des marques</PageTitle>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SearchBar>
            <Search size={20} color="#666" />
            <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBar>
          <Button onClick={() => navigate('/admin/brands/new')}>
            <Plus size={20} />
            Nouvelle marque
          </Button>
        </div>
      </PageHeader>

      <BrandsGrid>
        {brands.map(brand => (
          <BrandCard key={brand.id}>
            <BrandImage src={brand.image} alt={brand.name} />
            <BrandContent>
              <BrandName>{brand.name}</BrandName>
              <BrandDescription>{brand.description}</BrandDescription>
              <BrandMeta>
                <BrandScore>Score: {brand.score}</BrandScore>
                <BrandStatus active={brand.active}>
                  {brand.active ? 'Active' : 'Inactive'}
                </BrandStatus>
              </BrandMeta>
              <BrandActions>
                <ActionButton onClick={() => handleEdit(brand.id)}>
                  <Edit size={16} />
                  Modifier
                </ActionButton>
                <ActionButton 
                  variant="danger" 
                  onClick={() => handleDelete(brand.id)}
                >
                  <Trash2 size={16} />
                  Supprimer
                </ActionButton>
              </BrandActions>
            </BrandContent>
          </BrandCard>
        ))}
      </BrandsGrid>

      <Pagination>
        <PaginationButton 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <span>Page {currentPage} sur {totalPages}</span>
        <PaginationButton 
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </Pagination>
    </BrandsContainer>
  );
};

export default BrandsPage;
