
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Calendar, Users, Package } from 'lucide-react';

const DropsContainer = styled.div`
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

const FiltersBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.card};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const DropsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const DropCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const DropImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const DropContent = styled.div`
  padding: 1.5rem;
`;

const DropName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const DropDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DropMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
`;

const DropStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'upcoming': return theme.colors.primary;
      case 'ended': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  color: white;
`;

const DropActions = styled.div`
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

const DropsPage = () => {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrops();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchDrops = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get(`/drops?page=${currentPage}&search=${searchTerm}&status=${statusFilter}`);
      // setDrops(response.data.content);
      // setTotalPages(response.data.totalPages);

      // Mock data for now
      setTimeout(() => {
        setDrops([
          {
            id: '1',
            name: 'Nike Air Max 90 Retro',
            description: 'Édition limitée du modèle culte des années 90',
            startDate: '2024-02-15T10:00:00',
            endDate: '2024-02-28T23:59:59',
            status: 'active',
            stock: 150,
            sold: 75,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'
          },
          {
            id: '2',
            name: 'Adidas Superstar Vintage',
            description: 'La superstar adidas dans sa version originale',
            startDate: '2024-03-01T10:00:00',
            endDate: '2024-03-15T23:59:59',
            status: 'upcoming',
            stock: 200,
            sold: 0,
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'
          },
          {
            id: '3',
            name: 'Puma Suede Classic',
            description: 'Le modèle iconique Puma des années 70',
            startDate: '2024-01-01T10:00:00',
            endDate: '2024-01-31T23:59:59',
            status: 'ended',
            stock: 100,
            sold: 95,
            image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400'
          },
        ]);
        setTotalPages(5);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching drops:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleEdit = (dropId) => {
    navigate(`/admin/drops/${dropId}`);
  };

  const handleDelete = async (dropId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce drop ?')) {
      try {
        // TODO: Replace with actual API call
        // await api.delete(`/drops/${dropId}`);
        setDrops(drops.filter(drop => drop.id !== dropId));
      } catch (error) {
        console.error('Error deleting drop:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'upcoming': return 'À venir';
      case 'ended': return 'Terminé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <DropsContainer>
        <LoadingSpinner>
          <div>Chargement...</div>
        </LoadingSpinner>
      </DropsContainer>
    );
  }

  return (
    <DropsContainer>
      <PageHeader>
        <PageTitle>Gestion des drops</PageTitle>
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
          <Button onClick={() => navigate('/admin/drops/new')}>
            <Plus size={20} />
            Nouveau drop
          </Button>
        </div>
      </PageHeader>

      <FiltersBar>
        <FilterButton 
          active={statusFilter === 'all'} 
          onClick={() => handleStatusFilter('all')}
        >
          Tous
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'active'} 
          onClick={() => handleStatusFilter('active')}
        >
          Actifs
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'upcoming'} 
          onClick={() => handleStatusFilter('upcoming')}
        >
          À venir
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'ended'} 
          onClick={() => handleStatusFilter('ended')}
        >
          Terminés
        </FilterButton>
      </FiltersBar>

      <DropsGrid>
        {drops.map(drop => (
          <DropCard key={drop.id}>
            <DropImage src={drop.image} alt={drop.name} />
            <DropContent>
              <DropName>{drop.name}</DropName>
              <DropDescription>{drop.description}</DropDescription>
              <DropMeta>
                <MetaItem>
                  <Calendar size={16} />
                  {formatDate(drop.startDate)}
                </MetaItem>
                <MetaItem>
                  <Package size={16} />
                  Stock: {drop.stock - drop.sold} / {drop.stock}
                </MetaItem>
                <MetaItem>
                  <Users size={16} />
                  {drop.sold} vendus
                </MetaItem>
              </DropMeta>
              <DropStatus status={drop.status}>
                {getStatusLabel(drop.status)}
              </DropStatus>
              <DropActions>
                <ActionButton onClick={() => handleEdit(drop.id)}>
                  <Edit size={16} />
                  Modifier
                </ActionButton>
                <ActionButton 
                  variant="danger" 
                  onClick={() => handleDelete(drop.id)}
                >
                  <Trash2 size={16} />
                  Supprimer
                </ActionButton>
              </DropActions>
            </DropContent>
          </DropCard>
        ))}
      </DropsGrid>

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
    </DropsContainer>
  );
};

export default DropsPage;
