import React, { useState } from 'react';

function SettingsPopup({ 
  onClose, 
  volume, 
  setVolume, 
  isPlaying, 
  toggleMusic,
  closeButtonImage = null,       
  musicOnButtonImage = null,     
  musicOffButtonImage = null      
}) {
  const [hoveredButton, setHoveredButton] = useState(null); 

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '250px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
          Settings
        </h3>
        
        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={toggleMusic}
            onMouseEnter={() => setHoveredButton('music')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: (isPlaying && musicOnButtonImage) || (!isPlaying && musicOffButtonImage) 
                ? 'transparent' 
                : (isPlaying ? '#4CAF50' : '#9E9E9E'),
              color: (isPlaying && musicOnButtonImage) || (!isPlaying && musicOffButtonImage) 
                ? 'transparent' 
                : '#fff',
              border: (isPlaying && musicOnButtonImage) || (!isPlaying && musicOffButtonImage) 
                ? 'none' 
                : 'none',
              padding: (isPlaying && musicOnButtonImage) || (!isPlaying && musicOffButtonImage) 
                ? '0' 
                : '8px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transform: hoveredButton === 'music' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}
          >
            {isPlaying ? (
              musicOnButtonImage ? (
                <img 
                  src={musicOnButtonImage} 
                  alt="Music On"
                  style={{
                    width: '50px',  
                    height: '50px',
                    display: 'block',
                    filter: hoveredButton === 'music' ? 'brightness(1.1)' : 'brightness(1)'
                  }}
                />
              ) : (
                '🔊'
              )
            ) : (
              musicOffButtonImage ? (
                <img 
                  src={musicOffButtonImage} 
                  alt="Music Off"
                  style={{
                    width: '50px',  
                    height: '50px',
                    display: 'block',
                    filter: hoveredButton === 'music' ? 'brightness(1.1)' : 'brightness(1)'
                  }}
                />
              ) : (
                '🔇'
              )
            )}
          </button>
          <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {isPlaying ? 'Music On' : 'Music Off'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '14px', minWidth: '60px' }}>Volume:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: '120px',
              background: `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`,
              borderRadius: '10px',
              outline: 'none',
              WebkitAppearance: 'none',
              height: '6px'
            }}
            onMouseDown={(e) => {
              e.target.style.background = `linear-gradient(to right, #6B553A 0%, #6B553A ${volume * 100}%, #d0d0d0 ${volume * 100}%, #d0d0d0 100%)`;
            }}
            onMouseUp={(e) => {
              e.target.style.background = `linear-gradient(to right, #8B7355 0%, #8B7355 ${volume * 100}%, #e0e0e0 ${volume * 100}%, #e0e0e0 100%)`;
            }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: '12px', minWidth: '30px' }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
        
        <button
          onClick={onClose}
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            marginTop: '15px',
            width: '100%',
            background: closeButtonImage ? 'transparent' : '#8B2A2A',
            color: closeButtonImage ? 'transparent' : '#fff',
            border: closeButtonImage ? 'none' : '2px solid #5A1A1A',
            padding: closeButtonImage ? '0' : '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'monospace',
            transform: hoveredButton === 'close' ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {closeButtonImage ? (
            <img 
              src={closeButtonImage} 
              alt="Close"
              style={{
                width: '100%',
                height: '40px',
                display: 'block',
                objectFit: 'contain',
                filter: hoveredButton === 'close' ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
          ) : (
            'Close'
          )}
        </button>
      </div>
    </div>
  );
}

export default SettingsPopup;