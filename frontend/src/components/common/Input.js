import React from 'react';
import styled from 'styled-components';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: ${props => props.marginBottom || '16px'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.error ? '#F44336' : '#424242'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RequiredMark = styled.span`
  color: #F44336;
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => {
    switch(props.size) {
      case 'small': return '8px 12px';
      case 'large': return '14px 16px';
      default: return '10px 14px';
    }
  }};
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  border: 1px solid ${props => props.error ? '#F44336' : '#E0E0E0'};
  border-radius: 8px;
  background: white;
  color: #212121;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${props => props.error ? '#F44336' : '#212121'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'rgba(244, 67, 54, 0.1)' : 'rgba(33, 33, 33, 0.1)'};
  }

  &:disabled {
    background: #F5F5F5;
    cursor: not-allowed;
    color: #9E9E9E;
  }

  ${props => props.hasIcon && `
    padding-right: 40px;
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #757575;

  &:hover {
    color: #424242;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #F44336;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  size = 'medium',
  fullWidth = true,
  marginBottom = '16px',
  name,
  id,
  autoComplete,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <InputContainer fullWidth={fullWidth} marginBottom={marginBottom}>
      {label && (
        <Label htmlFor={inputId} error={!!error}>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <InputWrapper>
        <StyledInput
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
          disabled={disabled}
          size={size}
          hasIcon={isPassword}
          name={name}
          autoComplete={autoComplete}
          {...rest}
        />
        {isPassword && (
          <IconWrapper onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </IconWrapper>
        )}
      </InputWrapper>
      {error && (
        <ErrorMessage>
          <AlertCircle size={14} />
          {error}
        </ErrorMessage>
      )}
      {helperText && !error && (
        <ErrorMessage style={{ color: '#757575' }}>
          {helperText}
        </ErrorMessage>
      )}
    </InputContainer>
  );
};

export default Input;
