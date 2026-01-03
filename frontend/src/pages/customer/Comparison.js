
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ProductComparison from '../../components/common/ProductComparison';

const ComparisonContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Comparison = () => {
  const { items } = useSelector(state => state.comparison);

  return (
    <ComparisonContainer>
      <ProductComparison products={items} />
    </ComparisonContainer>
  );
};

export default Comparison;
