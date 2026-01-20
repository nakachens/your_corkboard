import React, { useState } from 'react';

function DeleteConfirmation({ 
  onConfirm, 
  onCancel,
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
    >
      <div
        style={{
          background: 'url(/corkboard/buttons/PANEL_SMOL.png) no-repeat center center',
          backgroundSize: '100% 100%',
          border: 'none',
          padding: '25px',
          paddingBottom: '40px',
          width: '320px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: '0 0 15px 0', fontFamily: 'monospace', color: '#3E2B27', textAlign: 'center' }}>
          Confirm Delete
        </h3>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '20px', textAlign: 'center', color: '#3E2B27' }}>
          U sure you wanna to delete this item?
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            onMouseEnter={() => setHoveredButton('confirm')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              flex: 1,
              background: confirmImage 
                ? `url(${confirmImage}) no-repeat center center`
                : '#8B2A2A',
              backgroundSize: 'contain',
              color: confirmImage ? 'transparent' : '#fff',
              border: 'none',
              padding: '0',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'filter 0.2s',
              filter: hoveredButton === 'confirm' ? 'brightness(1.1)' : 'brightness(1)'
            }}
          >
            {!confirmImage && 'Yes, Delete'}
          </button>
          <button
            onClick={onCancel}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              flex: 1,
              background: cancelImage 
                ? `url(${cancelImage}) no-repeat center center`
                : '#7C8B6A',
              backgroundSize: 'contain',
              color: cancelImage ? 'transparent' : '#fff',
              border: 'none',
              padding: '0',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'filter 0.2s',
              filter: hoveredButton === 'cancel' ? 'brightness(1.1)' : 'brightness(1)'
            }}
          >
            {!cancelImage && 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;