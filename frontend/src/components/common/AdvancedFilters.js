
import React, { useState } from 'react';
import styled from 'styled-components';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  user-select: none;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const PriceRange = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const PriceInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const RangeSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 0.5rem;
`;

const SizeButton = styled.button`
  padding: 0.5rem;
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background: ${({ selected, theme }) => selected ? theme.colors.primary : 'transparent'};
  color: ${({ selected, theme }) => selected ? 'white' : theme.colors.text};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ selected, theme }) => selected && `
    &:hover {
      color: white;
    }
  `}
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ColorButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : 'transparent'};
  background: ${({ color }) => color};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  ${({ selected }) => selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 14px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  `}
`;

const RatingButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RatingButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  background: ${({ selected, theme }) => selected ? theme.colors.primary : 'transparent'};
  color: ${({ selected, theme }) => selected ? 'white' : theme.colors.text};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ selected, theme }) => selected && `
    &:hover {
      color: white;
    }
  `}
`;

const ApplyButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AdvancedFilters = ({ filters, onFilterChange, onClear }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brands: true,
    sizes: true,
    colors: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];
  const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  const colors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Rouge', value: '#FF0000' },
    { name: 'Bleu', value: '#0000FF' },
    { name: 'Vert', value: '#008000' },
    { name: 'Jaune', value: '#FFFF00' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Violet', value: '#800080' },
  ];

  return (
    <FiltersContainer>
      <FiltersHeader>
        <FiltersTitle>
          <Filter size={20} />
          Filtres
        </FiltersTitle>
        <ClearButton onClick={onClear}>
          <X size={16} />
          Effacer tout
        </ClearButton>
      </FiltersHeader>

      {/* Price Range */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('price')}>
          <SectionTitle>Prix</SectionTitle>
          {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SectionHeader>
        {expandedSections.price && (
          <PriceRange>
            <PriceInputs>
              <PriceInput
                type="number"
                placeholder="Min"
                value={filters.priceRange.min || ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
              <span>-</span>
              <PriceInput
                type="number"
                placeholder="Max"
                value={filters.priceRange.max || ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </PriceInputs>
          </PriceRange>
        )}
      </FilterSection>

      {/* Brands */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('brands')}>
          <SectionTitle>Marques</SectionTitle>
          {expandedSections.brands ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SectionHeader>
        {expandedSections.brands && (
          <CheckboxGroup>
            {brands.map(brand => (
              <CheckboxLabel key={brand}>
                <Checkbox
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                {brand}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        )}
      </FilterSection>

      {/* Sizes */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('sizes')}>
          <SectionTitle>Tailles</SectionTitle>
          {expandedSections.sizes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SectionHeader>
        {expandedSections.sizes && (
          <SizeGrid>
            {sizes.map(size => (
              <SizeButton
                key={size}
                selected={filters.sizes.includes(size)}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </SizeButton>
            ))}
          </SizeGrid>
        )}
      </FilterSection>

      {/* Colors */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('colors')}>
          <SectionTitle>Couleurs</SectionTitle>
          {expandedSections.colors ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SectionHeader>
        {expandedSections.colors && (
          <ColorGrid>
            {colors.map(color => (
              <ColorButton
                key={color.name}
                color={color.value}
                selected={filters.colors.includes(color.value)}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
              />
            ))}
          </ColorGrid>
        )}
      </FilterSection>

      {/* Rating */}
      <FilterSection>
        <SectionHeader onClick={() => toggleSection('rating')}>
          <SectionTitle>Note minimale</SectionTitle>
          {expandedSections.rating ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </SectionHeader>
        {expandedSections.rating && (
          <RatingButtons>
            {[1, 2, 3, 4, 5].map(rating => (
              <RatingButton
                key={rating}
                selected={filters.minRating === rating}
                onClick={() => handleRatingChange(rating)}
              >
                {'★'.repeat(rating)}
              </RatingButton>
            ))}
          </RatingButtons>
        )}
      </FilterSection>

      <ApplyButton onClick={() => onFilterChange(filters)}>
        Appliquer les filtres
      </ApplyButton>
    </FiltersContainer>
  );
};

export default AdvancedFilters;
