import PropTypes from 'prop-types';

import {
  SpeechBubble, SoftRectangle, Ellipse, ThoughtBubble,
} from './shapes';
import { SHAPE_SUBTYPES } from '../constants';

const ShapeBlock = ({ block, activeBlockId, handleTailMouseDown }) => {
  switch (block.subtype) {
    case SHAPE_SUBTYPES.SPEECH_BUBBLE:
      return (
        <SpeechBubble
          {...block}
          isActive={block.id === activeBlockId}
          onTailMouseDown={(e) => handleTailMouseDown(e, block)}
        />
      );
    case SHAPE_SUBTYPES.SOFT_SQUARE:
    case SHAPE_SUBTYPES.SOFT_RECTANGLE:
      return (
        <SoftRectangle {...block} />
      );
    case SHAPE_SUBTYPES.ELLIPSE:
      return (
        <Ellipse {...block} />
      );
    case SHAPE_SUBTYPES.THOUGHT_BUBBLE:
      return (
        <ThoughtBubble
          {...block}
          isActive={block.id === activeBlockId}
          onTailMouseDown={(e) => handleTailMouseDown(e, block)}
        />
      );
    default:
      return null;
  }
};

ShapeBlock.propTypes = {
  activeBlockId: PropTypes.string,
  block: PropTypes.any.isRequired,
  handleTailMouseDown: PropTypes.func.isRequired,
};

ShapeBlock.defaultProps = {
  activeBlockId: null,
};

export default ShapeBlock;
