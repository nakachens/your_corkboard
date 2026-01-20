/* eslint-disable no-unused-vars */
import React, { useState } from 'react';


// context menu component
function ContextMenu({ position, onMoveToBack, onMoveToFront, onDelete, onDuplicate, onMoveToVeryFront, isAtBack }) {
  return (
    <div
      style={{
        position: 'absolute',  // Changed from 'fixed' to 'absolute'
        left: position.x,
        top: position.y,
        background: '#fff',
        border: '2px solid #8B7355',
        borderRadius: '5px',
        padding: '5px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 3000,
        minWidth: '50px',
        width: '20%'
      }}
    >
      <button
        onClick={onMoveToVeryFront}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '6px 10px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#2196F3',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
         Move to Very Front
      </button>
      <button
        onClick={isAtBack ? onMoveToFront : onMoveToBack}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        {isAtBack ? ' Move to Front' : ' Move to Back'}
      </button>
      <button
        onClick={onDuplicate}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
         Duplicate
      </button>
      <button
        onClick={onDelete}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '8px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#ff0000',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
         Delete
      </button>
    </div>
  );
}

export default ContextMenu;