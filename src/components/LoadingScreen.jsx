import React, { useState, useEffect } from 'react';

function LoadingScreen({ onLoadComplete }) {
  // eslint-disable-next-line no-unused-vars
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "pleasee waaitt almost there!!",
    "gah dont leave almost done..",
    "loading assets so we dont have any issues later~"
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      const isMobile = window.innerWidth < 768;
      
      const mobileAssets = [
        '/corkboard/corkboard.jpg',
        '/corkboard/boardpin.png',
        '/corkboard/boardpin2.png',
        '/corkboard/buttons/PANEL_SMOL.png',
        '/corkboard/buttons/PANEL_LONG.png',
        '/corkboard/buttons/PANEL_LONG2.png',
        '/corkboard/buttons/SCROLL.png',
        '/corkboard/buttons/HAMBURGER_BTN.png',
        '/corkboard/buttons/SAVELOAD_BTN.png',
        '/corkboard/buttons/NEWBOARD_BTN.png',
        '/corkboard/buttons/POLAROIDS_BTN.png',
        '/corkboard/buttons/STICKERS_BTN.png',
        '/corkboard/buttons/UPLOAD_BTN.png',
        '/corkboard/buttons/STICKYNOTE_BTN.png',
        '/corkboard/buttons/EXPORT_BTN.png',
        '/corkboard/buttons/SETTINGS_BTN.png',
        '/corkboard/buttons/CLOSE_BTN.png',
        '/corkboard/buttons/SHARE_BTN.png',
        '/corkboard/buttons/YES_BTN.png',
        '/corkboard/buttons/NO_BTN.png',
        '/corkboard/buttons/X.png'
      ];
      
      const desktopAssets = [
        '/corkboard/corkboard.jpg',
        '/corkboard/boardpin.png',
        '/corkboard/boardpin2.png',
        ...Array.from({ length: 10 }, (_, i) => `/corkboard/polaroids/${i + 1}.png`),
        '/corkboard/sticker1.png', '/corkboard/sticker2.png', '/corkboard/sticker3.png',
        '/corkboard/sticker4.png', '/corkboard/sticker5.png', '/corkboard/sticker6.png',
        '/corkboard/sticker7.png', '/corkboard/sticker8.png', '/corkboard/sticker9.png',
        '/corkboard/sticker10.png', '/corkboard/sticker11.png', '/corkboard/sticker12.png',
        '/corkboard/sticker13.png', '/corkboard/sticker14.png', '/corkboard/sticker15.png',
        '/corkboard/sticker16.png', '/corkboard/sticker17.png', '/corkboard/sticker18.png',
        '/corkboard/sticker19.png', '/corkboard/sticker20.png', '/corkboard/sticker21.png',
        '/corkboard/sticker22.png', '/corkboard/sticker23.png', '/corkboard/sticker24.png',
        '/corkboard/sticker25.png', '/corkboard/sticker26.png', '/corkboard/sticker27.png',
        '/corkboard/sticker28.png', '/corkboard/sticker29.png', '/corkboard/sticker30.png',
        '/corkboard/sticker31.jpg', '/corkboard/sticker32.jpg', '/corkboard/sticker33.jpg',
        '/corkboard/sticker34.jpg', '/corkboard/sticker35.jpg', '/corkboard/sticker36.jpg',
        '/corkboard/buttons/PANEL_SMOL.png', '/corkboard/buttons/PANEL_LONG.png',
        '/corkboard/buttons/PANEL_LONG2.png', '/corkboard/buttons/SCROLL.png',
        '/corkboard/buttons/HAMBURGER_BTN.png', '/corkboard/buttons/SAVELOAD_BTN.png',
        '/corkboard/buttons/NEWBOARD_BTN.png', '/corkboard/buttons/POLAROIDS_BTN.png',
        '/corkboard/buttons/STICKERS_BTN.png', '/corkboard/buttons/UPLOAD_BTN.png',
        '/corkboard/buttons/STICKYNOTE_BTN.png', '/corkboard/buttons/EXPORT_BTN.png',
        '/corkboard/buttons/SETTINGS_BTN.png', '/corkboard/buttons/CLOSE_BTN.png',
        '/corkboard/buttons/YES_BTN.png', '/corkboard/buttons/NO_BTN.png',
        '/corkboard/buttons/YES2_BTN.png', '/corkboard/buttons/NO2_BTN.png',
        '/corkboard/buttons/DONE_BTN.png', '/corkboard/buttons/CANCEL_BTN.png',
        '/corkboard/buttons/SAVEFIRST_BTN.png', '/corkboard/buttons/NAH_BTN.png',
        '/corkboard/buttons/OPEN_BTN.png', '/corkboard/buttons/WAIT_BTN.png',
        '/corkboard/buttons/YAY_BTN.png', '/corkboard/buttons/LOAD_BTN.png',
        '/corkboard/buttons/DELETE_BTN.png', '/corkboard/buttons/X.png',
        '/corkboard/buttons/BIG_BTN.png', '/corkboard/buttons/SAVEFIRST2_BTN.png',
        '/corkboard/buttons/CANCEL2_BTN.png', '/corkboard/buttons/UNMUTE_BTN.png',
        '/corkboard/buttons/MUTE_BTN.png', '/corkboard/buttons/SHARE_BTN.png',
        '/corkboard/audio/click.mp3',
        '/corkboard/audio/paper.mp3',
        '/corkboard/audio/music.mp3'
      ];

      const assetsToLoad = isMobile ? mobileAssets : desktopAssets;
      const totalAssets = assetsToLoad.length;
      let loadedCount = 0;

      const loadPromises = assetsToLoad.map((src) => {
        return new Promise((resolve) => {
          const isAudio = src.endsWith('.mp3') || src.endsWith('.wav') || src.endsWith('.ogg');
          
          if (isAudio) {
            const audio = new Audio();
            
            const handleLoad = () => {
              loadedCount++;
              const progress = Math.round((loadedCount / totalAssets) * 100);
              setLoadingProgress(progress);
              resolve();
            };
            
            const timeout = setTimeout(() => {
              handleLoad();
            }, isMobile ? 2000 : 8000);
            
            audio.oncanplaythrough = () => {
              clearTimeout(timeout);
              handleLoad();
            };
            
            audio.onerror = () => {
              clearTimeout(timeout);
              handleLoad();
            };
            
            audio.preload = 'auto';
            audio.src = src;
          } else {
            const img = new Image();
            
            const handleLoad = () => {
              loadedCount++;
              const progress = Math.round((loadedCount / totalAssets) * 100);
              setLoadingProgress(progress);
              resolve();
            };
            
            const timeout = setTimeout(() => {
              handleLoad();
            }, isMobile ? 2000 : 8000);
            
            img.onload = () => {
              clearTimeout(timeout);
              handleLoad();
            };
            
            img.onerror = () => {
              clearTimeout(timeout);
              handleLoad();
            };
            
            img.src = src;
            
            if (!isMobile && img.decode) {
              img.decode().catch(() => {});
            }
          }
        });
      });

      await Promise.all(loadPromises);

      setLoadingProgress(100);
      
      setTimeout(() => {
        onLoadComplete();
      }, isMobile ? 300 : 2000);
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

      <div style={{
        position: 'relative',
        display: 'inline-block'
      }}>
        
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