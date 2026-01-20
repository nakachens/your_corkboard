import React, { useState } from 'react';

function NewProjectPopup({ onConfirm, onCancel }) {
  const [projectName, setProjectName] = useState('');
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
          create new corkboard? ♡
        </h3>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="project name here..."
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '2px solid #8B7355',
            borderRadius: '5px',
            fontFamily: 'monospace',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (projectName.trim()) {
                onConfirm(projectName.trim());
              }
            }}
            onMouseEnter={() => setHoveredButton('done')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              flex: 1,
              background: 'url(/corkboard/buttons/DONE_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '0',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transform: hoveredButton === 'done' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s',
              filter: hoveredButton === 'done' ? 'brightness(1.1)' : 'brightness(1)'
            }}
          >
          </button>
          <button
            onClick={onCancel}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              flex: 1,
              background: 'url(/corkboard/buttons/CANCEL_BTN.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '0',
              height: '40px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transform: hoveredButton === 'cancel' ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s',
              filter: hoveredButton === 'cancel' ? 'brightness(1.1)' : 'brightness(1)'
            }}
          >
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewProjectPopup;
