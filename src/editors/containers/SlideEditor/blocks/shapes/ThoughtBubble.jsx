import PropTypes from 'prop-types';

import {
  DEFAULT_SHAPE_FILL_COLOR,
  DEFAULT_SHAPE_STROKE_COLOR,
  DEFAULT_SHAPE_STROKE_WIDTH,
  TAIL_T_DRAG_MAX,
  TAIL_T_DRAG_MIN,
} from '../../constants';
import { clamp } from '../../utils';

const VIEWBOX_WIDTH = 260;
const VIEWBOX_HEIGHT = 150;
// Constants for tail geometry configuration
const TAIL_BASE_Y = 108;
// Offsets for the 2nd and 3rd bubbles relative to the base
const TAIL_OFFSET_X_2 = 18;
const TAIL_OFFSET_X_3 = 32;
const TAIL_OFFSET_Y_2 = 16;
const TAIL_OFFSET_Y_3 = 30;
// Radii for the bubbles
const TAIL_BUBBLE_R1 = 9;
const TAIL_BUBBLE_R2 = 7;
const TAIL_BUBBLE_R3 = 5;
const TAIL_HANDLE_COLOR = '#3B82F6';

const ThoughtBubble = ({
  width,
  height,
  stroke,
  strokeWidth,
  fill,
  tailT,
  isActive,
  onTailMouseDown,
}) => {
  const clampedT = clamp(tailT, TAIL_T_DRAG_MIN, TAIL_T_DRAG_MAX);
  const baseX = clampedT * VIEWBOX_WIDTH;
  const dir = clampedT < 0.5 ? -1 : 1;

  // Coordinates for the bubbles
  const cx1 = baseX;
  const cy1 = TAIL_BASE_Y;
  const cx2 = baseX + (TAIL_OFFSET_X_2 * dir);
  const cy2 = TAIL_BASE_Y + TAIL_OFFSET_Y_2;
  const cx3 = baseX + (TAIL_OFFSET_X_3 * dir);
  const cy3 = TAIL_BASE_Y + TAIL_OFFSET_Y_3;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 2 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className="d-block"
      preserveAspectRatio="none"
    >
      <path
        d="
        M 50 80
        C 30 80  18 65  28 52
        C 14 42  18 26  36 26
        C 38 14  56 8   72 14

        C 78 4   96 2  112 12
        C 126 2  152 6  158 18
        C 176 14 192 24 198 36

        C 214 36 222 56 210 66
        C 222 76 204 98 186 92

        C 178 102 160 104 146 94
        C 132 106 102 106 90 94

        C 78 102 60 98 52 88
        Z"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 90 94 C 85 90 87 84 94 84"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M 146 94 C 140 90 142 82 150 82"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M 72 14 C 68 18 68 22 74 24"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M 112 12 C 108 16 108 20 114 22"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M 158 18 C 154 22 154 26 160 28"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />

      <circle
        cx={cx1}
        cy={cy1}
        r={TAIL_BUBBLE_R1}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx2}
        cy={cy2}
        r={TAIL_BUBBLE_R2}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx3}
        cy={cy3}
        r={TAIL_BUBBLE_R3}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      {isActive && (
        <circle
          cx={cx1}
          cy={cy1}
          r={TAIL_BUBBLE_R1 * 0.7}
          fill={TAIL_HANDLE_COLOR}
          style={{ cursor: 'grab' }}
          onMouseDown={onTailMouseDown}
        />
      )}
    </svg>
  );
};

ThoughtBubble.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  tailT: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
  onTailMouseDown: PropTypes.func.isRequired,
};

ThoughtBubble.defaultProps = {
  stroke: DEFAULT_SHAPE_STROKE_COLOR,
  strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
  fill: DEFAULT_SHAPE_FILL_COLOR,
  tailT: 0.8,
};

export default ThoughtBubble;
