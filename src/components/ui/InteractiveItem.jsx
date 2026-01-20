/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';
import DeleteConfirmation from '../popups/DeleteConfirmation';

function InteractiveItem({ 
  children, 
  initialPosition, 
  initialSize = { width: 150, height: 150 },
  initialRotation = 0,
  onPositionChange, 
  onSizeChange,
  onRotationChange,
  onDelete,
  onDuplicate,
  onZIndexChange,
  zIndex,
  isAtBack,
  type,
  id
}) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [rotation, setRotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    setSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    setRotation(initialRotation);
  }, [initialRotation]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('control-handle') || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    setIsDragging(true);
    setIsSelected(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.stopPropagation();
  };

  const handleRightClick = (e) => {
  e.preventDefault();
  
  const corkboardRect = e.currentTarget.closest('[ref="corkboardRef"]')?.getBoundingClientRect() || 
                        e.currentTarget.offsetParent?.getBoundingClientRect();

  const menuWidth = 150;
  const menuHeight = 160; 
  
  let menuX = e.clientX;
  let menuY = e.clientY;
  
  if (corkboardRect) {
    menuX = e.clientX - corkboardRect.left;
    menuY = e.clientY - corkboardRect.top;
    
    if (menuX + menuWidth > corkboardRect.width) {
      menuX = corkboardRect.width - menuWidth - 10;
    }
    
    if (menuY + menuHeight > corkboardRect.height) {
      menuY = corkboardRect.height - menuHeight - 10;
    }
    
    menuX = Math.max(10, menuX);
    menuY = Math.max(10, menuY);
  }
  
  setContextMenuPosition({ x: menuX, y: menuY });
  setShowContextMenu(true);
  setIsSelected(true);
};

  const handleResizeMouseDown = (e, corner) => {
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
      corner: corner
    });
    e.stopPropagation();
  };

  const handleRotateMouseDown = (e) => {
    setIsRotating(true);
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        setPosition(newPosition);
        if (onPositionChange) onPositionChange(newPosition);
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        switch(resizeStart.corner) {
          case 'se':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(50, resizeStart.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(50, resizeStart.height + deltaY);
            if (newWidth >= 50) newX = resizeStart.posX + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(50, resizeStart.height - deltaY);
            if (newHeight >= 50) newY = resizeStart.posY + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(50, resizeStart.height - deltaY);
            if (newWidth >= 50) newX = resizeStart.posX + deltaX;
            if (newHeight >= 50) newY = resizeStart.posY + deltaY;
            break;
        }

        const newSize = { width: newWidth, height: newHeight };
        const newPos = { x: newX, y: newY };
        setSize(newSize);
        setPosition(newPos);
        if (onSizeChange) onSizeChange(newSize);
        if (onPositionChange) onPositionChange(newPos);
      } else if (isRotating) {
        const centerX = position.x + size.width / 2;
        const centerY = position.y + size.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
        setRotation(angle);
        if (onRotationChange) onRotationChange(angle);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsRotating(false);
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest('.interactive-item') && !e.target.closest('.context-menu')) {
        setIsSelected(false);
        setShowContextMenu(false);
      }
    };

    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDragging, isResizing, isRotating, dragOffset, position, size, resizeStart, onPositionChange, onSizeChange, onRotationChange]);

  const handleMoveToBack = () => {
    if (onZIndexChange) onZIndexChange('back');
    setShowContextMenu(false);
  };

  const handleMoveToFront = () => {
    if (onZIndexChange) onZIndexChange('front');
    setShowContextMenu(false);
  };

  const handleMoveToVeryFront = () => {
    if (onZIndexChange) onZIndexChange('veryfront');
    setShowContextMenu(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
    setShowContextMenu(false);
  };

  const handleDuplicateClick = () => {
    if (onDuplicate) onDuplicate();
    setShowContextMenu(false);
  };

  const confirmDelete = () => {
    if (onDelete) onDelete();
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        className="interactive-item"
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          transform: `rotate(${rotation}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: zIndex || 10,
          userSelect: 'none',
          outline: isSelected ? '2px solid #2196F3' : 'none',
          outlineOffset: '2px'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
      >
        {children}
        
        {/* SELECTION EDGES */}
        {isSelected && (
          <>
            {/* HANDLES */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '12px',
                height: '12px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            />
            
            {/* ROTATION BALL THINGY */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '50%',
                cursor: 'crosshair',
                zIndex: 1000
              }}
              onMouseDown={handleRotateMouseDown}
            >
              <div style={{
                position: 'absolute',
                width: '2px',
                height: '14px',
                background: '#2196F3',
                left: '50%',
                bottom: '100%',
                transform: 'translateX(-50%)'
              }} />
            </div>
          </>
        )}
      </div>

      {showContextMenu && (
        <div className="context-menu">
          <ContextMenu
            position={contextMenuPosition}
            onMoveToBack={handleMoveToBack}
            onMoveToFront={handleMoveToFront}
            onMoveToVeryFront={handleMoveToVeryFront}
            onDelete={handleDelete}
            onDuplicate={handleDuplicateClick}
            isAtBack={isAtBack}
          />
        </div>
      )}

      {showDeleteConfirm && (
  <DeleteConfirmation
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    confirmImage="/corkboard/buttons/YES_BTN.png"  
    cancelImage="/corkboard/buttons/NO_BTN.png"    
  />
)}
    </>
  );
}

export default InteractiveItem;