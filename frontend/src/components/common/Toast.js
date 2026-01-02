import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  width: 100%;
`;

const ToastWrapper = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease;

  ${props => {
    switch(props.variant) {
      case 'success':
        return `
          border-left: 4px solid #4CAF50;
        `;
      case 'error':
        return `
          border-left: 4px solid #F44336;
        `;
      case 'warning':
        return `
          border-left: 4px solid #FF9800;
        `;
      case 'info':
      default:
        return `
          border-left: 4px solid #2196F3;
        `;
    }
  }}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${props => {
    switch(props.variant) {
      case 'success':
        return `
          color: #4CAF50;
        `;
      case 'error':
        return `
          color: #F44336;
        `;
      case 'warning':
        return `
          color: #FF9800;
        `;
      case 'info':
      default:
        return `
          color: #2196F3;
        `;
    }
  }}
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #212121;
`;

const Message = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: #616161;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #F5F5F5;
    color: #212121;
  }
`;

const Toast = ({ 
  id, 
  variant = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch(variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <ToastWrapper variant={variant}>
      <IconContainer variant={variant}>
        {getIcon()}
      </IconContainer>
      <Content>
        {title && <Title>{title}</Title>}
        {message && <Message>{message}</Message>}
      </Content>
      <CloseButton onClick={() => onClose(id)} aria-label="Fermer">
        <X size={16} />
      </CloseButton>
    </ToastWrapper>
  );
};

const ToastContainerWrapper = ({ toasts, onClose }) => {
  return (
    <ToastContainer>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={onClose}
        />
      ))}
    </ToastContainer>
  );
};

export default ToastContainerWrapper;
