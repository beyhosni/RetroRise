
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Clock, X } from 'lucide-react';

const HistoryContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.card};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.cardHover};
  }
`;

const HistoryIcon = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
`;

const HistoryInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const HistoryPageName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryTime = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ClearButton = styled.button`
  width: 100%;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    border-color: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const NavigationHistory = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('retrorise_navigation_history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.slice(0, 10)); // Keep only last 10 items
      }
    } catch (error) {
      console.error('Error loading navigation history:', error);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('retrorise_navigation_history');
    setHistory([]);
  };

  const handleItemClick = (item) => {
    window.location.href = item.path;
    onClose();
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const itemDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - itemDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
    return itemDate.toLocaleDateString('fr-FR');
  };

  if (!isOpen) return null;

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>
          <Clock size={20} />
          Historique de navigation
        </HistoryTitle>
        <CloseButton onClick={onClose}>
          <X size={24} />
        </CloseButton>
      </HistoryHeader>

      <HistoryList>
        {history.length === 0 ? (
          <EmptyState>
            Aucun historique de navigation
          </EmptyState>
        ) : (
          history.map((item, index) => (
            <HistoryItem 
              key={`${item.path}-${index}`}
              onClick={() => handleItemClick(item)}
            >
              <HistoryIcon>
                <Clock size={20} />
              </HistoryIcon>
              <HistoryInfo>
                <HistoryPageName>{item.title}</HistoryPageName>
                <HistoryTime>{formatTime(item.timestamp)}</HistoryTime>
              </HistoryInfo>
            </HistoryItem>
          ))
        )}
      </HistoryList>

      {history.length > 0 && (
        <ClearButton onClick={clearHistory}>
          Effacer l'historique
        </ClearButton>
      )}
    </HistoryContainer>
  );
};

export default NavigationHistory;
