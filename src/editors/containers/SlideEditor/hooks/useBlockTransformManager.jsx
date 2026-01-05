import { useState, useCallback } from 'react';

import {
  MIN_BLOCK_WIDTH_PX,
  MIN_BLOCK_HEIGHT_PX,
  TAIL_T_DRAG_MIN,
  TAIL_T_DRAG_MAX,
  DRAG_MODE,
} from '../constants';
import { clamp } from '../utils';

const processMove = (e, slideRect, dragState, updateBlock) => {
  const maxLeft = slideRect.width;
  const maxTop = slideRect.height;
  updateBlock(dragState.id, {
    left: clamp(e.clientX - slideRect.left - dragState.offsetX, 0, maxLeft),
    top: clamp(e.clientY - slideRect.top - dragState.offsetY, 0, maxTop),
  });
};

const processResize = (e, dragState, updateBlock) => {
  const {
    handle, startWidth, startHeight, startLeft, startTop, startX, startY, startRotation,
  } = dragState;

  const globalDeltaX = e.clientX - startX;
  const globalDeltaY = e.clientY - startY;

  const rad = (-startRotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const localDeltaX = globalDeltaX * cos - globalDeltaY * sin;
  const localDeltaY = globalDeltaX * sin + globalDeltaY * cos;

  let newWidth = startWidth;
  let newHeight = startHeight;

  if (handle.includes('right')) {
    newWidth = startWidth + localDeltaX;
  }
  if (handle.includes('left')) {
    newWidth = startWidth - localDeltaX;
  }
  if (handle.includes('bottom')) {
    newHeight = startHeight + localDeltaY;
  }
  if (handle.includes('top')) {
    newHeight = startHeight - localDeltaY;
  }

  const isCorner = (handle.includes('top') || handle.includes('bottom'))
    && (handle.includes('left') || handle.includes('right'));

  if (e.shiftKey && isCorner) {
    const aspect = startWidth / startHeight;
    const leadByWidth = Math.abs(localDeltaX) > Math.abs(localDeltaY);

    if (leadByWidth) {
      newHeight = newWidth / aspect;
    } else {
      newWidth = newHeight * aspect;
    }

    if (newWidth < MIN_BLOCK_WIDTH_PX || newHeight < MIN_BLOCK_HEIGHT_PX) {
      if (newWidth < MIN_BLOCK_WIDTH_PX) {
        newWidth = MIN_BLOCK_WIDTH_PX;
        newHeight = newWidth / aspect;
      }
      if (newHeight < MIN_BLOCK_HEIGHT_PX) {
        newHeight = MIN_BLOCK_HEIGHT_PX;
        newWidth = newHeight * aspect;
      }
    }
  } else {
    newWidth = Math.max(MIN_BLOCK_WIDTH_PX, newWidth);
    newHeight = Math.max(MIN_BLOCK_HEIGHT_PX, newHeight);
  }

  const dW = newWidth - startWidth;
  const dH = newHeight - startHeight;

  let dCenterX = 0;
  let dCenterY = 0;

  if (handle.includes('left')) {
    dCenterX -= dW / 2;
  }
  if (handle.includes('right')) {
    dCenterX += dW / 2;
  }
  if (handle.includes('top')) {
    dCenterY -= dH / 2;
  }
  if (handle.includes('bottom')) {
    dCenterY += dH / 2;
  }

  const radGlobal = (startRotation * Math.PI) / 180;
  const cosG = Math.cos(radGlobal);
  const sinG = Math.sin(radGlobal);

  const globalDCenterX = dCenterX * cosG - dCenterY * sinG;
  const globalDCenterY = dCenterX * sinG + dCenterY * cosG;

  const startCenterX = startLeft + startWidth / 2;
  const startCenterY = startTop + startHeight / 2;

  const newCenterX = startCenterX + globalDCenterX;
  const newCenterY = startCenterY + globalDCenterY;

  const newLeft = newCenterX - newWidth / 2;
  const newTop = newCenterY - newHeight / 2;

  updateBlock(dragState.id, {
    left: newLeft, top: newTop, width: newWidth, height: newHeight,
  });
};

const processTailMove = (e, slideRect, dragState, updateBlock) => {
  const {
    startWidth, startHeight, startLeft, startTop, startRotation,
  } = dragState;

  const centerX = startLeft + startWidth / 2;
  const centerY = startTop + startHeight / 2;

  const mx = e.clientX - slideRect.left;
  const my = e.clientY - slideRect.top;

  const dx = mx - centerX;
  const dy = my - centerY;

  const angle = (-startRotation * Math.PI) / 180;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const lx = dx * cosA - dy * sinA;
  const localX = lx + startWidth / 2;

  let tailT = localX / startWidth;
  tailT = clamp(tailT, TAIL_T_DRAG_MIN, TAIL_T_DRAG_MAX);
  updateBlock(dragState.id, {
    tailT,
  });
};

const useBlockTransformManager = ({ slideRef, updateBlock, activeBlockId }) => {
  const [dragState, setDragState] = useState(null);

  const handleDragStart = useCallback((e, block) => {
    if (!slideRef.current) {
      return;
    }
    e.preventDefault();
    const slideRect = slideRef.current.getBoundingClientRect();
    const offsetX = e.clientX - (slideRect.left + block.left);
    const offsetY = e.clientY - (slideRect.top + block.top);
    setDragState({
      id: block.id,
      mode: DRAG_MODE.MOVE,
      offsetX,
      offsetY,
    });
  }, [slideRef]);

  const handleResizeStart = useCallback((e, block, handle) => {
    if (!slideRef.current) {
      return;
    }
    e.preventDefault();
    setDragState({
      id: block.id,
      mode: DRAG_MODE.RESIZE,
      handle,
      startWidth: block.width,
      startHeight: block.height,
      startLeft: block.left,
      startTop: block.top,
      startX: e.clientX,
      startY: e.clientY,
      startRotation: block.rotation || 0,
    });
  }, [slideRef]);

  const handleTailMouseDown = (e, block) => {
    e.preventDefault();
    setDragState({
      id: block.id,
      mode: DRAG_MODE.TAIL,
      startWidth: block.width,
      startHeight: block.height,
      startLeft: block.left,
      startTop: block.top,
      startRotation: block.rotation,
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragState || !slideRef.current) {
      return;
    }
    const slideRect = slideRef.current.getBoundingClientRect();

    if (dragState.mode === DRAG_MODE.MOVE) {
      processMove(e, slideRect, dragState, updateBlock);
    } else if (dragState.mode === DRAG_MODE.RESIZE) {
      processResize(e, dragState, updateBlock);
    } else if (dragState.mode === DRAG_MODE.TAIL) {
      processTailMove(e, slideRect, dragState, updateBlock);
    }
  }, [dragState, slideRef, updateBlock]);

  const endInteraction = useCallback(() => setDragState(null), []);

  const handleRotationChange = useCallback((e) => {
    if (!activeBlockId) {
      return;
    }
    const value = Number.isFinite(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0;
    updateBlock(activeBlockId, { rotation: value });
  }, [activeBlockId, updateBlock]);

  return {
    dragState,
    handleDragStart,
    handleResizeStart,
    handleTailMouseDown,
    handleMouseMove,
    endInteraction,
    setDragState,
    handleRotationChange,
  };
};

export default useBlockTransformManager;
