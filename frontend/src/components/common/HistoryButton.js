
import React, { useState } from 'react';
import styled from 'styled-components';
import { Clock } from 'lucide-react';
import NavigationHistory from './NavigationHistory';

const HistoryButtonContainer = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #616161;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const HistoryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHistory = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <HistoryButtonContainer
        onClick={toggleHistory}
        aria-label="Historique de navigation"
      >
        <Clock size={20} />
      </HistoryButtonContainer>
      <NavigationHistory
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default HistoryButton;
