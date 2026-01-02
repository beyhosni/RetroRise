import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const CardContainer = styled(Link)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: block;
  text-decoration: none;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  background: #F5F5F5;
`;

const BrandImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #BDBDBD;

  svg {
    width: 64px;
    height: 64px;
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const BrandName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #212121;
`;

const BrandDescription = styled.p`
  color: #616161;
  font-size: 0.875rem;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid #F5F5F5;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: #616161;

  svg {
    width: 16px;
    height: 16px;
    color: #757575;
  }
`;

const BrandCard = ({ brand }) => {
  const {
    id,
    name,
    description,
    logo,
    productCount = 0,
    dropCount = 0
  } = brand;

  return (
    <CardContainer to={`/brands/${id}`}>
      <ImageContainer>
        {logo ? (
          <BrandImage src={logo} alt={name} />
        ) : (
          <PlaceholderIcon>
            <Package size={64} />
          </PlaceholderIcon>
        )}
      </ImageContainer>
      <Content>
        <BrandName>{name}</BrandName>
        <BrandDescription>{description}</BrandDescription>
        <Stats>
          <Stat>
            <Package size={16} />
            {productCount} produit{productCount !== 1 ? 's' : ''}
          </Stat>
          {dropCount > 0 && (
            <Stat>
              <Package size={16} />
              {dropCount} drop{dropCount !== 1 ? 's' : ''}
            </Stat>
          )}
        </Stats>
      </Content>
    </CardContainer>
  );
};

export default BrandCard;
