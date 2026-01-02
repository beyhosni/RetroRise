import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  max-width: ${props => props.size === 'small' ? '400px' : props.size === 'large' ? '800px' : '600px'};
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #F5F5F5;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #212121;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  transition: all 0.2s ease;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const Body = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const Footer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #F5F5F5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #FAFAFA;
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer size={size}>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </CloseButton>
        </Header>
        <Body>
          {children}
        </Body>
        {footer && (
          <Footer>
            {footer}
          </Footer>
        )}
      </ModalContainer>
    </Overlay>,
    document.body
  );
};

export default Modal;
