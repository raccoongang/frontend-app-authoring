import PropTypes from 'prop-types';

import {
  DEFAULT_SHAPE_STROKE_COLOR,
  DEFAULT_SHAPE_STROKE_WIDTH,
  DEFAULT_SHAPE_FILL_COLOR,
  DEFAULT_TAIL_T_POSITION,
} from '../../constants';
import { clamp } from '../../utils';

const BASE_CORNER_RADIUS_RATIO = 0.18;
const MIN_TAIL_WIDTH = 20;
const TAIL_WIDTH_RATIO = 0.12;
const MIN_TAIL_HEIGHT = 18;
const TAIL_HEIGHT_RATIO = 0.22;
const TAIL_BASE_RATIO = 0.55;
const TAIL_HANDLE_RADIUS = 5;
const TAIL_HANDLE_COLOR = '#3B82F6';

/**
 * Calculates and returns the geometry parameters for a tail shape based on the provided dimensions and alignment value.
 *
 * @param {number} width - The width of the shape where the tail is being positioned.
 * @param {number} height - The height of the shape where the tail is being positioned.
 * @param {number} tailT - A normalized value (between 0 and 1)
 * representing the horizontal position of the tail tip relative to the width.
 *
 * @returns {Object} An object containing the calculated geometric properties of the tail:
 * - `radius` {number}: The corner radius for the tail based on the smaller dimension between width and height.
 * - `bodyBottom` {number}: The vertical position of the bottom part of the body above the tail.
 * - `tipX` {number}: The x-coordinate position of the tail's tip.
 * - `leftBaseX` {number}: The x-coordinate of the left base point of the tail.
 * - `rightBaseX` {number}: The x-coordinate of the right base point of the tail.
 */
const getTailGeometry = (width, height, tailT) => {
  const radius = Math.min(width, height) * BASE_CORNER_RADIUS_RATIO;

  const tailWidth = Math.max(MIN_TAIL_WIDTH, width * TAIL_WIDTH_RATIO);
  const tailHeight = Math.max(MIN_TAIL_HEIGHT, height * TAIL_HEIGHT_RATIO);

  const minT = (tailWidth * TAIL_BASE_RATIO + radius) / width;
  const maxT = (width - (tailWidth * TAIL_BASE_RATIO + radius)) / width;
  const clampedTailT = clamp(tailT, minT, maxT);

  const bodyBottom = height - tailHeight;
  const tipX = clampedTailT * width;
  const leftBaseX = tipX - tailWidth * TAIL_BASE_RATIO;
  const rightBaseX = tipX + tailWidth * TAIL_BASE_RATIO;

  return {
    radius,
    bodyBottom,
    tipX,
    leftBaseX,
    rightBaseX,
  };
};

/**
 * Generates the SVG path string for drawing a speech bubble shape.
 *
 * @param {number} width - The total width of the speech bubble.
 * @param {number} height - The total height of the speech bubble, including the tail.
 * @param {Object} geometry - Object containing detailed geometric information for the speech bubble.
 * @param {number} geometry.radius - The corner radius for the rounded edges of the bubble.
 * @param {number} geometry.bodyBottom - The vertical position where the speech bubble's body ends.
 * @param {number} geometry.tipX - The horizontal position of the speech bubble's tail tip.
 * @param {number} geometry.leftBaseX - The horizontal position of the left base of the speech bubble's tail.
 * @param {number} geometry.rightBaseX - The horizontal position of the right base of the speech bubble's tail.
 * @returns {string} The SVG path string that represents the speech bubble shape.
 */
const buildSpeechBubblePath = (width, height, geometry) => {
  const {
    radius, bodyBottom, tipX, leftBaseX, rightBaseX,
  } = geometry;

  return `
    M ${radius} 0
    H ${width - radius}
    Q ${width} 0, ${width} ${radius}
    V ${bodyBottom - radius}
    Q ${width} ${bodyBottom}, ${width - radius} ${bodyBottom}
    H ${rightBaseX}
    L ${tipX} ${height}
    L ${leftBaseX} ${bodyBottom}
    H ${radius}
    Q 0 ${bodyBottom}, 0 ${bodyBottom - radius}
    V ${radius}
    Q 0 0, ${radius} 0
    Z
  `;
};

const SpeechBubble = ({
  width,
  height,
  stroke,
  strokeWidth,
  fill,
  tailT,
  onTailMouseDown,
  isActive,
}) => {
  const {
    radius, bodyBottom, tipX, leftBaseX, rightBaseX,
  } = getTailGeometry(
    width,
    height,
    tailT,
  );

  const bubblePath = buildSpeechBubblePath(width, height, {
    radius,
    bodyBottom,
    tipX,
    leftBaseX,
    rightBaseX,
  });

  return (
    <svg width={width} height={height} className="d-block">
      <path d={bubblePath} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />

      {isActive && (
        <circle
          cx={tipX}
          cy={bodyBottom}
          r={TAIL_HANDLE_RADIUS}
          fill={TAIL_HANDLE_COLOR}
          style={{ cursor: 'grab' }}
          onMouseDown={onTailMouseDown}
        />
      )}
    </svg>
  );
};

SpeechBubble.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  tailT: PropTypes.number,
  onTailMouseDown: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

SpeechBubble.defaultProps = {
  stroke: DEFAULT_SHAPE_STROKE_COLOR,
  strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
  fill: DEFAULT_SHAPE_FILL_COLOR,
  tailT: DEFAULT_TAIL_T_POSITION,
};

export default SpeechBubble;
