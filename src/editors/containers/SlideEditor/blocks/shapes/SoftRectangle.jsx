import PropTypes from 'prop-types';

import {
  DEFAULT_SHAPE_FILL_COLOR,
  DEFAULT_SHAPE_STROKE_COLOR,
  DEFAULT_SHAPE_STROKE_WIDTH,
} from '../../constants';

const getCornerRadius = (width, height) => Math.min(width, height) * 0.25;

const SoftRectangle = ({
  width,
  height,
  stroke,
  strokeWidth,
  fill,
}) => (
  <svg width={width} height={height}>
    <rect
      x="0"
      y="0"
      width={width}
      height={height}
      rx={getCornerRadius(width, height)}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  </svg>
);

SoftRectangle.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
};

SoftRectangle.defaultProps = {
  stroke: DEFAULT_SHAPE_STROKE_COLOR,
  strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
  fill: DEFAULT_SHAPE_FILL_COLOR,
};

export default SoftRectangle;
