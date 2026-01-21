/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

function LoadingScreen({ onLoadComplete }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "pleasee waaitt almost there!!",
    "gah dont leave almost done",
    "loading assets so we dont have any issues later~"
  ];

  useEffect(() => {
    // Rotate messages every 2 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      // Only load essential assets - let others load lazily
      const criticalAssets = [
        '/corkboard/corkboard.jpg',
        '/corkboard/boardpin.png',
        '/corkboard/boardpin2.png',
        '/corkboard/buttons/PANEL_SMOL.png',
        '/corkboard/buttons/HAMBURGER_BTN.png',
        '/corkboard/buttons/SAVELOAD_BTN.png',
        '/corkboard/buttons/NEWBOARD_BTN.png',
        '/corkboard/buttons/POLAROIDS_BTN.png',
        '/corkboard/buttons/STICKERS_BTN.png',
        '/corkboard/buttons/UPLOAD_BTN.png',
        '/corkboard/buttons/STICKYNOTE_BTN.png',
        '/corkboard/buttons/EXPORT_BTN.png',
        '/corkboard/buttons/SETTINGS_BTN.png'
      ];

      const totalAssets = criticalAssets.length;
      let loadedCount = 0;

      const loadPromises = criticalAssets.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          
          const handleLoad = () => {
            loadedCount++;
            const progress = Math.round((loadedCount / totalAssets) * 100);
            setLoadingProgress(progress);
            resolve();
          };
          
          // Set timeout to prevent infinite loading
          const timeout = setTimeout(() => {
            handleLoad();
          }, 3000);
          
          img.onload = () => {
            clearTimeout(timeout);
            handleLoad();
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            handleLoad();
          };
          
          img.src = src;
        });
      });

      await Promise.all(loadPromises);

      setLoadingProgress(100);
      
      setTimeout(() => {
        onLoadComplete();
      }, 300);
    };

    loadAssets();
  }, [onLoadComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#E9D2B8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      {/* Spinner with bars */}
      <div style={{
        position: 'relative',
        width: '60px',
        height: '60px',
        marginBottom: '30px'
      }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '18px',
              background: i % 3 === 0 ? '#C70093' : i % 3 === 1 ? '#E5A4CB' : '#FFD0EC',
              borderRadius: '3px',
              top: '50%',
              left: '50%',
              transformOrigin: '3px 30px',
              transform: `rotate(${i * 30}deg)`,
              animation: `fade 1.2s linear infinite`,
              animationDelay: `${-1.2 + (i * 0.1)}s`
            }}
          />
        ))}
      </div>

      {/* Loading text with panel background */}
      <div style={{
        position: 'relative',
        display: 'inline-block'
      }}>
        {/* Panel image behind text */}
        <img 
          src="/corkboard/buttons/BIG_BTN.png"
          alt=""
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '350px',
            height: 'auto',
            zIndex: 0
          }}
        />
        
        {/* Text on top */}
        <p style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '10px',
          color: '#803F0A',
          textAlign: 'center',
          padding: '30px 40px',
          lineHeight: '1.8',
          maxWidth: '300px'
        }}>
          {messages[messageIndex]}
        </p>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes fade {
          0%, 39%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;