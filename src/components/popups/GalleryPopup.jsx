// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';


function GalleryPopup({ onClose, onAddPolaroid }) {
  const polaroidImages = Array.from({ length: 10 }, (_, i) => `/corkboard/polaroids/${i + 1}.png`);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'url(/corkboard/buttons/SCROLL.png) no-repeat center center',
          backgroundSize: '100% 100%',
          border: 'none',
          padding: '40px',
          paddingTop: '50px',
          paddingBottom: '60px',
          width: '800px',
          maxHeight: '90%',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontFamily: 'monospace', color: '#3E2B27' }}></h3>
          <button
            onClick={onClose}
            style={{
              background: '#8B2A2A',
              color: '#fff',
              border: 'none',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '15px'
        }}>
          {polaroidImages.map((src, i) => (
            <div
              key={i}
              onClick={() => onAddPolaroid(src)}
              style={{
                cursor: 'pointer',
                background: '#fff',
                padding: '8px',
                paddingBottom: '30px',
                boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={src}
                alt={`polaroid ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default GalleryPopup;