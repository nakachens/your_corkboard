import React, { useState } from 'react';

function ConfirmationPopup({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Yes", 
  cancelText = "Cancel", 
  confirmColor = "#8B2A2A",
  confirmImage = null,  
  cancelImage = null    
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
      onClick={onCancel}
    >
      <div
        style={{
          background: 'linear-gradient(to bottom, #fff8dc, #fffacd)',
          border: '3px solid #8B7355',
          borderRadius: '8px',
          padding: '20px',
          width: '300px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27' }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {/* confirm button */}
          <button
            onClick={onConfirm}
            onMouseEnter={() => setHoveredButton('confirm')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: confirmImage ? 'transparent' : confirmColor,
              color: confirmImage ? 'transparent' : '#fff',
              border: confirmImage ? 'none' : '2px solid ' + confirmColor,
              padding: confirmImage ? '0' : '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace',
              transform: hoveredButton === 'confirm' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}
          >
            {confirmImage ? (
              <img 
                src={confirmImage} 
                alt={confirmText}
                style={{
                  width: '120px', 
                  height: '40px',  
                  display: 'block',
                  filter: hoveredButton === 'confirm' ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
            ) : (
              confirmText
            )}
          </button>

          {/* cancel button */}
          <button
            onClick={onCancel}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: cancelImage ? 'transparent' : '#7C8B6A',
              color: cancelImage ? 'transparent' : '#fff',
              border: cancelImage ? 'none' : '2px solid #5A6B4A',
              padding: cancelImage ? '0' : '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              fontFamily: 'monospace',
              transform: hoveredButton === 'cancel' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}
          >
            {cancelImage ? (
              <img 
                src={cancelImage} 
                alt={cancelText}
                style={{
                  width: '120px',
                  height: '40px',  
                  display: 'block',
                  filter: hoveredButton === 'cancel' ? 'brightness(1.1)' : 'brightness(1)'
                }}
              />
            ) : (
              cancelText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;