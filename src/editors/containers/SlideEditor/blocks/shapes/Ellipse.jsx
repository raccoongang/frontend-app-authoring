import PropTypes from 'prop-types';

import {
  DEFAULT_SHAPE_FILL_COLOR,
  DEFAULT_SHAPE_STROKE_COLOR,
  DEFAULT_SHAPE_STROKE_WIDTH,
} from '../../constants';

const Ellipse = ({
  width,
  height,
  stroke,
  strokeWidth,
  fill,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;
  return (
    <svg width={width} height={height}>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

Ellipse.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
};

Ellipse.defaultProps = {
  stroke: DEFAULT_SHAPE_STROKE_COLOR,
  strokeWidth: DEFAULT_SHAPE_STROKE_WIDTH,
  fill: DEFAULT_SHAPE_FILL_COLOR,
};

export default Ellipse;
