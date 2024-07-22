// src/App.tsx
import React from 'react';
import ConnectButton from './components/ConnectButton';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const App: React.FC = () => {
  return (
    <Container>
      <h1>Viction Kit</h1>
      <ConnectButton />
    </Container>
  );
};

export default App;