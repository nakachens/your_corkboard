/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function StickerGalleryPopup({ onClose, onAddSticker }) {
  const defaultStickers = [
    '/corkboard/sticker1.png',
    '/corkboard/sticker2.png',
    '/corkboard/sticker3.png',
    '/corkboard/sticker4.png',
    '/corkboard/sticker5.png',
    '/corkboard/sticker6.png',
    '/corkboard/sticker7.png',
    '/corkboard/sticker8.png',
    '/corkboard/sticker9.png',
    '/corkboard/sticker10.png',
    '/corkboard/sticker11.png',
    '/corkboard/sticker12.png',
    '/corkboard/sticker13.png',
    '/corkboard/sticker14.png',
    '/corkboard/sticker15.png',
    '/corkboard/sticker16.png',
    '/corkboard/sticker17.png',
    '/corkboard/sticker18.png',
    '/corkboard/sticker19.png',
    '/corkboard/sticker20.png',
    '/corkboard/sticker21.png',
    '/corkboard/sticker22.png',
    '/corkboard/sticker23.png',
    '/corkboard/sticker24.png',
    '/corkboard/sticker25.png',
    '/corkboard/sticker26.png',
    '/corkboard/sticker27.png',
    '/corkboard/sticker28.png',
    '/corkboard/sticker29.png',
    '/corkboard/sticker30.png',
    '/corkboard/sticker31.jpg',
    '/corkboard/sticker32.jpg',
    '/corkboard/sticker33.jpg',
    '/corkboard/sticker34.jpg',
    '/corkboard/sticker35.jpg',
    '/corkboard/sticker36.jpg',
  ];

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
          background: 'url(/corkboard/buttons/PANEL_LONG2.png) no-repeat center center',
          backgroundSize: '100% 100%',
          border: 'none',
          padding: '25px',
          paddingBottom: '40px',
          width: '400px',
          maxHeight: '90%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
          <h3 style={{ paddingLeft:'40px', marginTop:'30px',fontFamily: 'monospace', color: '#3E2B27' }}>Sticker Gallery !!</h3>
          <button
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              background: 'url(/corkboard/buttons/X.png) no-repeat center center',
              backgroundSize: 'contain',
              color: 'transparent',
              border: 'none',
              padding: '0',
              width: '40px',
              height: '60px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transform: 'scale(1)',
              transition: 'transform 0.2s'
            }}
          >
          </button>
        </div>
        
        {/* grid*/}
        <div 
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '5px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4A574 #F5E6D3',
            marginBottom:'40px'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '15px'
          }}>
            {defaultStickers.map((src, i) => (
              <div
                key={i}
                onClick={() => onAddSticker(src)}
                style={{
                  cursor: 'pointer',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  transform: 'scale(1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={src}
                  alt={`sticker ${i + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickerGalleryPopup;