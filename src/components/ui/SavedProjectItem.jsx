import React, { useState } from 'react';


// Saved Project Item Component
function SavedProjectItem({ project, onLoad, onDelete }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div
      style={{
        background: '#fff',
        border: '2px solid #8B7355',
        boxShadow: '3px 3px 0 0 #6c5308',
        borderRadius: '5px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      className="saved-project-card"  
    >
      <div>
        <div style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px' }}>
          {project.name}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#666' }}>
          {new Date(project.timestamp).toLocaleString()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={() => onLoad(project.name)}
          onMouseEnter={() => setHoveredButton('load')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            background: 'url(/corkboard/buttons/LOAD_BTN.png) no-repeat center center',
            backgroundSize: 'contain',
            color: 'transparent',
            border: 'none',
            padding: '0',
            width: '60px',  // Adjust to your image size
            height: '30px', // Adjust to your image size
            cursor: 'pointer',
            fontFamily: 'monospace',
            transform: hoveredButton === 'load' ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s'
          }}
        >
        </button>
        <button
          onClick={(e) => onDelete(project.name, e)}
          onMouseEnter={() => setHoveredButton('delete')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            background: 'url(/corkboard/buttons/DELETE_BTN.png) no-repeat center center',
            backgroundSize: 'contain',
            color: 'transparent',
            border: 'none',
            padding: '0',
            width: '60px',  // Adjust to your image size
            height: '30px', // Adjust to your image size
            cursor: 'pointer',
            fontFamily: 'monospace',
            transform: hoveredButton === 'delete' ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.2s'
          }}
        >
        </button>
      </div>
    </div>
  );
}

export default SavedProjectItem;