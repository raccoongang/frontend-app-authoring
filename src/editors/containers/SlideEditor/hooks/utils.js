import { v4 as uuidv4 } from 'uuid';

import { ASSET_SUBTYPES, EDITOR_BLOCK_TYPES, VIDEO_SOURCE_TYPES } from '../constants';

/**
 * Creates a new asset block for the slide editor based on the provided asset.
 * 
 * @param {Object} asset - The asset object containing information about the media file
 * @param {string} asset.id - Unique identifier of the asset
 * @param {string} asset.subtype - Type of asset (IMAGE, AUDIO, or VIDEO)
 * @param {string} [asset.sourceFile] - Path to uploaded file (if asset is uploaded)
 * @param {string} [asset.externalLink] - External URL (if asset is from external source)
 * @returns {Object|null} Returns a new block object with appropriate properties for the asset type, or null if unsupported
 */
export const createAssetBlock = (asset) => {
  // Although each asset has a unique identifier, we do not rely on it,
  // since we need to allow adding the same asset multiple times to a slide.
  const id = uuidv4();
  
  const baseBlock = {
    id,
    asset_id: asset.id,
    type: EDITOR_BLOCK_TYPES.ASSET_BLOCK,
    src: asset.sourceFile || asset.externalLink,
    left: 200,
    top: 150,
    rotation: 0,
  };

  switch (asset.subtype) {
    case ASSET_SUBTYPES.IMAGE:
      return {
        ...baseBlock,
        subtype: ASSET_SUBTYPES.IMAGE,
        width: 200,
        height: 200,
      };
      
    case ASSET_SUBTYPES.AUDIO:
      return {
        ...baseBlock,
        subtype: ASSET_SUBTYPES.AUDIO,
        width: 350,
      };
      
    case ASSET_SUBTYPES.VIDEO:
      return {
        ...baseBlock,
        subtype: ASSET_SUBTYPES.VIDEO,
        sourceType: asset.sourceFile ? VIDEO_SOURCE_TYPES.FILE : VIDEO_SOURCE_TYPES.EXTERNAL,
        width: 350,
        height: 220,
        minWidth: 350,
        minHeight: 220,
      };
      
    default:
      return null;
  }
};
