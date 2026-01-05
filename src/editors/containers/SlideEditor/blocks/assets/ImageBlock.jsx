import PropTypes from 'prop-types';

const ImageBlock = ({ src }) => (
  <div
    className="image-block w-100 h-100"
    style={{
      backgroundImage: `url(${src})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  />
);

ImageBlock.propTypes = {
  src: PropTypes.string.isRequired,
};

export default ImageBlock;
