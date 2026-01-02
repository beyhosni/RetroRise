import React from 'react';
import styled from 'styled-components';

const CartBadge = ({ count }) => {
  if (count === 0) return null;

  return (
    <Badge>
      {count > 99 ? '99+' : count}
    </Badge>
  );
};

const Badge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

export default CartBadge;
