import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: ${props => props.fullHeight ? '100%' : 'auto'};
  padding: ${props => props.padding || '16px'};
`;

const Spinner = styled.div`
  border: ${props => {
    switch(props.size) {
      case 'small': return '2px';
      case 'large': return '4px';
      default: return '3px';
    }
  }} solid rgba(33, 33, 33, 0.1);
  border-top: ${props => {
    switch(props.size) {
      case 'small': return '2px';
      case 'large': return '4px';
      default: return '3px';
    }
  }} solid #212121;
  border-radius: 50%;
  width: ${props => {
    switch(props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner = ({ 
  size = 'medium', 
  fullWidth = false, 
  fullHeight = false,
  padding 
}) => {
  return (
    <SpinnerContainer fullWidth={fullWidth} fullHeight={fullHeight} padding={padding}>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
