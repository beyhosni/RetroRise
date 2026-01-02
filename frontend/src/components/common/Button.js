import React from 'react';
import styled from 'styled-components';
import { Loader2 } from 'lucide-react';

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => {
    switch(props.size) {
      case 'small': return '8px 16px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: ${props => props.weight || '600'};
  border-radius: ${props => {
    switch(props.size) {
      case 'small': return '6px';
      case 'large': return '10px';
      default: return '8px';
    }
  }};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  text-decoration: none;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: ${props.disabled ? '#BDBDBD' : '#212121'};
          color: white;

          &:hover:not(:disabled) {
            background: ${props.disabled ? '#BDBDBD' : '#424242'};
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return `
          background: ${props.disabled ? '#F5F5F5' : 'white'};
          color: ${props.disabled ? '#9E9E9E' : '#212121'};
          border: 1px solid ${props.disabled ? '#E0E0E0' : '#212121'};

          &:hover:not(:disabled) {
            background: ${props.disabled ? '#F5F5F5' : '#F5F5F5'};
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: ${props.disabled ? '#FFCDD2' : '#F44336'};
          color: white;

          &:hover:not(:disabled) {
            background: ${props.disabled ? '#FFCDD2' : '#E53935'};
            transform: translateY(-1px);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${props.disabled ? '#9E9E9E' : '#212121'};

          &:hover:not(:disabled) {
            background: ${props.disabled ? 'transparent' : 'rgba(33, 33, 33, 0.05)'};
          }
        `;
      default:
        return '';
    }
  }}

  ${props => props.loading && `
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  weight = '600',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      weight={weight}
      disabled={disabled || loading}
      loading={loading}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      {...rest}
    >
      {loading && <LoadingSpinner size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />}
      {children}
    </ButtonContainer>
  );
};

export default Button;
