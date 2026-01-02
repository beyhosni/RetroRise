import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DropGrid from '../../components/common/DropGrid';
import { fetchDrops } from '../../store/slices/dropsSlice';
import { SlidersHorizontal } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #FAFAFA;
  padding: 24px;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #212121;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: #616161;
  margin: 0;
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const FilterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #212121;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #212121;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #424242;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    display: ${props => props.isOpen ? 'grid' : 'none'};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #616161;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #212121;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const FilterInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #212121;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #212121;
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const ResultsCount = styled.p`
  font-size: 0.9375rem;
  color: #616161;
  margin: 0;
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #212121;
  background: white;
  cursor: pointer;
`;

const DropsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { drops, loading, pagination } = useSelector(state => state.drops);

  // Get filter values from URL
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || '-startDate';

  useEffect(() => {
    // Fetch drops with current filters
    const params = {
      limit: 20,
      page: 1,
      sort,
    };

    if (status) params.status = status;
    if (search) params.search = search;

    dispatch(fetchDrops(params));
  }, [dispatch, status, search, sort]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value);
  };

  return (
    <PageContainer>
      <ContentContainer>
        <HeaderSection>
          <PageTitle>Tous les drops</PageTitle>
          <PageDescription>
            Découvrez les drops exclusifs des marques les plus recherchées
          </PageDescription>
        </HeaderSection>

        <FilterSection>
          <FilterHeader>
            <FilterTitle>
              <SlidersHorizontal size={20} />
              Filtres
            </FilterTitle>
            <FilterButton onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? 'Masquer' : 'Afficher'} les filtres
            </FilterButton>
          </FilterHeader>

          <FiltersContainer isOpen={filtersOpen}>
            <FilterGroup>
              <FilterLabel>Statut</FilterLabel>
              <FilterSelect
                value={status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="upcoming">À venir</option>
                <option value="ended">Terminés</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Recherche</FilterLabel>
              <FilterInput
                type="text"
                placeholder="Rechercher..."
                value={search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>
          </FiltersContainer>
        </FilterSection>

        <ResultsInfo>
          <ResultsCount>
            {pagination.total} drop{pagination.total !== 1 ? 's' : ''} trouvé{pagination.total !== 1 ? 's' : ''}
          </ResultsCount>
          <SortSelect value={sort} onChange={handleSortChange}>
            <option value="-startDate">Plus récents</option>
            <option value="startDate">Plus anciens</option>
            <option value="title">Nom A-Z</option>
            <option value="-title">Nom Z-A</option>
          </SortSelect>
        </ResultsInfo>

        <DropGrid drops={drops} loading={loading} />
      </ContentContainer>
    </PageContainer>
  );
};

export default DropsPage;
