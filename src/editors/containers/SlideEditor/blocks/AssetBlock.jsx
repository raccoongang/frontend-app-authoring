import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  ASSET_SUBTYPES,
  VIDEO_SOURCE_TYPES,
} from '../constants';
import { ImageBlock } from './assets';
import {
  AudioAssetPreview,
  VideoAssetPreview,
} from '@jigsaw-plugins/frontend-app-assets-library';

const AssetBlock = ({ block }) => {
  switch (block.subtype) {
    case ASSET_SUBTYPES.AUDIO:
      return (
        <AudioAssetPreview assetFile={block.src} className="p-1" />
      );
    case ASSET_SUBTYPES.VIDEO:
      return (
        <VideoAssetPreview
          assetFile={block.src}
          className={classNames(
            'h-100',
            {
              'm-3 w-auto video-asset-preview': block.sourceType === VIDEO_SOURCE_TYPES.EXTERNAL,
              'p-3': block.sourceType === VIDEO_SOURCE_TYPES.FILE,
            },
          )}
        />
      );
    case ASSET_SUBTYPES.IMAGE:
      return (
        <ImageBlock src={block.src} />
      );
    default:
      return null;
  }
};

AssetBlock.propTypes = {
  block: PropTypes.any.isRequired,
};

export default AssetBlock;
