import React, { useState } from 'react';

function ExportSuccessPopup({ 
  onClose, 
  onShare, 
  hasShareAPI,
  shareButtonImage = null,   
  closeButtonImage = null   
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
          borderRadius: '12px',
          padding: '20px',
          width: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>✨</div>
        <h3 style={{ margin: '0 0 8px 0', fontFamily: 'monospace', color: '#3E2B27', fontSize: '16px' }}>
          LEZZGOO EXPORTED!
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '12px', marginBottom: '15px', color: '#666' }}>
          ur corkboard is saved~
        </p>
        
        {hasShareAPI && (
          <button
            onClick={onShare}
            onMouseEnter={() => setHoveredButton('share')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              width: '100%',
              background: shareButtonImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: shareButtonImage ? 'transparent' : '#fff',
              border: shareButtonImage ? 'none' : '2px solid #5a67d8',
              padding: shareButtonImage ? '0' : '10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px',
              fontFamily: 'monospace',
              marginBottom: '8px',
              transform: hoveredButton === 'share' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {shareButtonImage ? (
              <img 
                src={shareButtonImage} 
                alt="share it! ♡"
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'block',
                  objectFit: 'contain',
                  filter: hoveredButton === 'share' ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
            ) : (
              'share it! ♡'
            )}
          </button>
        )}
        
        <button
          onClick={onClose}
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            width: '100%',
            background: closeButtonImage ? 'transparent' : '#7C8B6A',
            color: closeButtonImage ? 'transparent' : '#fff',
            border: closeButtonImage ? 'none' : '2px solid #5A6B4A',
            padding: closeButtonImage ? '0' : '8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px',
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
              alt="close ♡"
              style={{
                width: '100%',
                height: '40px',
                display: 'block',
                objectFit: 'contain',
                filter: hoveredButton === 'close' ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
          ) : (
            'close ♡'
          )}
        </button>
      </div>
    </div>
  );
}

export default ExportSuccessPopup;