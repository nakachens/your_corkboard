/* eslint-disable react-hooks/purity */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Touch-specific states
  const [lastTap, setLastTap] = useState(0);
  const touchStartRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    setSize(initialSize);
  }, [initialSize]);

  useEffect(() => {
    setRotation(initialRotation);
  }, [initialRotation]);

  // MOUSE HANDLERS
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
    showContextMenuAt(e.clientX, e.clientY);
  };

  // TOUCH HANDLERS
  const handleTouchStart = (e) => {
    // Ignore if touching a control handle or textarea
    if (e.target.classList.contains('control-handle') || e.target.tagName === 'TEXTAREA') {
      return;
    }

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Double tap detection for context menu
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected - show context menu
      e.preventDefault();
      showContextMenuAt(touch.clientX, touch.clientY);
      setLastTap(0);
      return;
    }
    
    setLastTap(now);

    // Start dragging
    setIsDragging(true);
    setIsSelected(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    if (!isDragging && !isResizing && !isRotating) return;

    const touch = e.touches[0];
    
    if (isDragging) {
      e.preventDefault();
      const newPosition = {
        x: touch.clientX - dragOffset.x,
        y: touch.clientY - dragOffset.y
      };
      setPosition(newPosition);
      if (onPositionChange) onPositionChange(newPosition);
    } else if (isResizing) {
      e.preventDefault();
      handleResizeMove(touch.clientX, touch.clientY);
    } else if (isRotating) {
      e.preventDefault();
      handleRotateMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e) => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    touchStartRef.current = null;
  };

  // RESIZE HANDLERS
  const handleResizeMouseDown = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  const handleResizeTouchStart = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    setIsResizing(true);
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
      corner: corner
    });
  };

  const handleResizeMove = (clientX, clientY) => {
    const deltaX = clientX - resizeStart.x;
    const deltaY = clientY - resizeStart.y;
    
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
  };

  // ROTATE HANDLERS
  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  };

  const handleRotateTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  };

  const handleRotateMove = (clientX, clientY) => {
    const centerX = position.x + size.width / 2;
    const centerY = position.y + size.height / 2;
    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
    setRotation(angle);
    if (onRotationChange) onRotationChange(angle);
  };

  // Context menu helper
  const showContextMenuAt = (clientX, clientY) => {
    const corkboardRect = itemRef.current?.closest('[ref="corkboardRef"]')?.getBoundingClientRect() || 
                          itemRef.current?.offsetParent?.getBoundingClientRect();

    const menuWidth = 150;
    const menuHeight = 160;
    
    let menuX = clientX;
    let menuY = clientY;
    
    if (corkboardRect) {
      menuX = clientX - corkboardRect.left;
      menuY = clientY - corkboardRect.top;
      
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

  // MOUSE MOVE AND UP LISTENERS
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
        handleResizeMove(e.clientX, e.clientY);
      } else if (isRotating) {
        handleRotateMove(e.clientX, e.clientY);
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

    const handleTouchOutside = (e) => {
      if (!e.target.closest('.interactive-item') && !e.target.closest('.context-menu')) {
        setIsSelected(false);
        setShowContextMenu(false);
      }
    };

    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
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
        ref={itemRef}
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
          outlineOffset: '2px',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleRightClick}
        onTouchStart={handleTouchStart}
      >
        {children}
        
        {/* SELECTION HANDLES */}
        {isSelected && (
          <>
            {/* RESIZE HANDLES */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                width: '20px',
                height: '20px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000,
                touchAction: 'none'
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'nw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '20px',
                height: '20px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000,
                touchAction: 'none'
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'ne')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '-6px',
                width: '20px',
                height: '20px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nesw-resize',
                zIndex: 1000,
                touchAction: 'none'
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'sw')}
            />
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '20px',
                height: '20px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '2px',
                cursor: 'nwse-resize',
                zIndex: 1000,
                touchAction: 'none'
              }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              onTouchStart={(e) => handleResizeTouchStart(e, 'se')}
            />
            
            {/* ROTATION HANDLE */}
            <div
              className="control-handle"
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '24px',
                background: '#fff',
                border: '2px solid #2196F3',
                borderRadius: '50%',
                cursor: 'crosshair',
                zIndex: 1000,
                touchAction: 'none'
              }}
              onMouseDown={handleRotateMouseDown}
              onTouchStart={handleRotateTouchStart}
            >
              <div style={{
                position: 'absolute',
                width: '2px',
                height: '16px',
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