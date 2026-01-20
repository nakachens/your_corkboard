import React, { useState } from 'react';

function SuccessPopup({ 
  message, 
  onClose,
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
          background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
          backgroundSize: '100% 100%',
          border: 'none',
          padding: '25px',
          paddingBottom: '40px',
          width: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '25px', marginBottom: '20px' }}></div>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '15px', color: '#3E2B27', fontWeight: 'bold' }} className='message-size'>
          {message}
        </p>
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
              alt="YATTA"
              style={{
                width: '100%',
                height: '40px',
                display: 'block',
                objectFit: 'contain',
                filter: hoveredButton === 'close' ? 'brightness(1.1)' : 'brightness(1)'
              }}
            />
          ) : (
            'YATTA'
          )}
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;