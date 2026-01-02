import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CardContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;

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
`;

const DropImage = styled.img`
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

const StatusBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 1;

  ${props => {
    switch(props.status) {
      case 'active':
        return `
          background: rgba(76, 175, 80, 0.9);
          color: white;
        `;
      case 'upcoming':
        return `
          background: rgba(33, 150, 243, 0.9);
          color: white;
        `;
      case 'ended':
        return `
          background: rgba(158, 158, 158, 0.9);
          color: white;
        `;
      default:
        return `
          background: rgba(0, 0, 0, 0.7);
          color: white;
        `;
    }
  }}
`;

const Content = styled.div`
  padding: 20px;
`;

const DropTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #616161;
  font-size: 0.875rem;

  svg {
    margin-right: 8px;
    color: #757575;
  }
`;

const Description = styled.p`
  color: #616161;
  font-size: 0.875rem;
  margin: 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F5F5F5;
`;

const ProductCount = styled.span`
  font-size: 0.875rem;
  color: #616161;

  svg {
    margin-right: 6px;
    color: #757575;
  }
`;

const ViewButton = styled(Link)`
  background: #212121;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #424242;
    transform: translateY(-1px);
  }
`;

const DropCard = ({ drop }) => {
  const {
    id,
    title,
    description,
    image,
    startDate,
    endDate,
    status,
    productCount = 0
  } = drop;

  const formatDate = (date) => {
    if (!date) return 'Non défini';
    return format(new Date(date), 'dd MMM yyyy à HH:mm', { locale: fr });
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Actif';
      case 'upcoming': return 'À venir';
      case 'ended': return 'Terminé';
      default: return status;
    }
  };

  return (
    <CardContainer>
      <ImageContainer>
        <StatusBadge status={status}>{getStatusLabel(status)}</StatusBadge>
        <Link to={`/drops/${id}`}>
          <DropImage src={image || '/images/placeholder-drop.jpg'} alt={title} />
        </Link>
      </ImageContainer>
      <Content>
        <DropTitle>{title}</DropTitle>
        <InfoRow>
          <Calendar size={16} />
          <span>Début: {formatDate(startDate)}</span>
        </InfoRow>
        {endDate && (
          <InfoRow>
            <Clock size={16} />
            <span>Fin: {formatDate(endDate)}</span>
          </InfoRow>
        )}
        <Description>{description}</Description>
        <Footer>
          <ProductCount>
            <Users size={16} />
            {productCount} produit{productCount !== 1 ? 's' : ''}
          </ProductCount>
          <ViewButton to={`/drops/${id}`}>Voir le drop</ViewButton>
        </Footer>
      </Content>
    </CardContainer>
  );
};

export default DropCard;
