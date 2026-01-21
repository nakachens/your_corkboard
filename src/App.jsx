import React, { useState, useEffect } from 'react';
import CorkboardApp from './components/CorkboardApp';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

function App() {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      background: '#C19A6B'
    }}>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      {!isLoading && <CorkboardApp isFullscreen={isLargeScreen} />}
    </div>
  );
}

export default App;