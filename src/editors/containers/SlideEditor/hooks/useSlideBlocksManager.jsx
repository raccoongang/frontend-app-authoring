import {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@edx/frontend-platform/logging';
import {
  NEW_BLOCK_POSITION_OFFSET,
  NEW_BLOCK_LEFT_PX,
  NEW_BLOCK_TOP_PX,
  NEW_BLOCK_POSITION_X_WRAP_PX,
  NEW_BLOCK_POSITION_Y_WRAP_PX,
  NEW_BLOCK_WIDTH_PX,
  NEW_BLOCK_HEIGHT_PX,
  NEW_BLOCK_ROTATION_DEG,
  TEXT_BLOCK_CLASSNAME_BY_SUBTYPE,
  COPIED_BLOCK_POSITION_OFFSET_PX,
  EDITOR_BLOCK_TYPES,
  SHAPE_SUBTYPES,
} from '../constants';
import { createAssetBlock } from './utils';

/**
 * @typedef {Object} SlideBlock
 * @property {string} id
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 * @property {number} rotation
 * @property {string} content
 */
const useSlideBlocksManager = ({ initialBlocks, placeholder, closeAssetModal }) => {
  const [blocks, setBlocks] = useState(() => initialBlocks || []);
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [copiedBlock, setCopiedBlock] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setBlocks(initialBlocks || []);
  }, [initialBlocks]);

  const activeBlock = useMemo(
    () => blocks.find(b => b.id === activeBlockId) || null,
    [blocks, activeBlockId],
  );

  const addText = (subtype) => {
    const id = uuidv4();
    const newBlock = {
      id,
      type: EDITOR_BLOCK_TYPES.TEXT_BLOCK,
      subtype,
      typeCls: TEXT_BLOCK_CLASSNAME_BY_SUBTYPE[subtype] || TEXT_BLOCK_CLASSNAME_BY_SUBTYPE.textNormal,
      left: NEW_BLOCK_LEFT_PX + (NEW_BLOCK_POSITION_OFFSET % NEW_BLOCK_POSITION_X_WRAP_PX),
      top: NEW_BLOCK_TOP_PX + (NEW_BLOCK_POSITION_OFFSET % NEW_BLOCK_POSITION_Y_WRAP_PX),
      width: NEW_BLOCK_WIDTH_PX,
      height: NEW_BLOCK_HEIGHT_PX,
      rotation: NEW_BLOCK_ROTATION_DEG,
      content: `<p>${placeholder}</p>`,
    };
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(id);
  };

  const addShape = (subtype) => {
    const id = uuidv4();
    let width = NEW_BLOCK_WIDTH_PX;
    let height = NEW_BLOCK_HEIGHT_PX;

    if (subtype === SHAPE_SUBTYPES.SOFT_SQUARE || subtype === SHAPE_SUBTYPES.ELLIPSE) {
      width = NEW_BLOCK_HEIGHT_PX;
      height = NEW_BLOCK_HEIGHT_PX;
    }

    const newBlock = {
      id,
      type: EDITOR_BLOCK_TYPES.SHAPE_BLOCK,
      subtype,
      left: NEW_BLOCK_LEFT_PX + (NEW_BLOCK_POSITION_OFFSET % NEW_BLOCK_POSITION_X_WRAP_PX),
      top: NEW_BLOCK_TOP_PX + (NEW_BLOCK_POSITION_OFFSET % NEW_BLOCK_POSITION_Y_WRAP_PX),
      width,
      height,
      rotation: NEW_BLOCK_ROTATION_DEG,
    };

    setBlocks((prev) => [...prev, newBlock]);
    setActiveBlockId(id);
  };

  const addBlock = (type, subtype) => {
    if (type === EDITOR_BLOCK_TYPES.TEXT_BLOCK) {
      addText(subtype);
    } else if (type === EDITOR_BLOCK_TYPES.SHAPE_BLOCK) {
      addShape(subtype);
    } else {
      logError('Unsupported block type:', type);
    }
  };

  const deleteActive = useCallback(() => {
    if (!activeBlockId) {
      return;
    }
    setBlocks(prev => prev.filter(b => b.id !== activeBlockId));
    setActiveBlockId(null);
  }, [activeBlockId]);

  const updateBlock = useCallback((id, patch) => {
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const copyPasteHandler = useCallback((e) => {
    const isShortcut = e.ctrlKey || e.metaKey;

    if (isEditing || !isShortcut) {
      return;
    }

    if (e.code === 'KeyC') {
      if (activeBlock) {
        e.preventDefault();
        setCopiedBlock({ ...activeBlock });
      }
    } else if (e.code === 'KeyV') {
      if (copiedBlock) {
        e.preventDefault();
        const newId = uuidv4();
        setBlocks(prev => [...prev, {
          ...copiedBlock,
          id: newId,
          left: copiedBlock.left + COPIED_BLOCK_POSITION_OFFSET_PX,
          top: copiedBlock.top + COPIED_BLOCK_POSITION_OFFSET_PX,
        }]);
        setActiveBlockId(newId);
      }
    }
  }, [activeBlock, copiedBlock, isEditing]);

  const handleAssetInsert = useCallback((asset) => {
    const newBlock = createAssetBlock(asset);

    if (!newBlock) {
      logError('Unsupported asset subtype inserted into slide:', asset.subtype);
      return;
    }
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(newBlock.id);
    closeAssetModal();
  }, [closeAssetModal]);

  return {
    blocks,
    activeBlock,
    activeBlockId,
    isEditing,
    setActiveBlockId,
    setIsEditing,
    addBlock,
    deleteActive,
    updateBlock,
    copyPasteHandler,
    handleAssetInsert,
  };
};

export default useSlideBlocksManager;
