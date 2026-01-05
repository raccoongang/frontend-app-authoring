import messages from './messages';

export const EDITOR_BLOCK_TYPES = {
  ASSET_BLOCK: 'assetBlock',
  TEXT_BLOCK: 'textBlock',
  SHAPE_BLOCK: 'shapeBlock',
};

export const VIDEO_SOURCE_TYPES = {
  EXTERNAL: 'external',
  FILE: 'file',
};

export const DRAG_MODE = {
  MOVE: 'move',
  RESIZE: 'resize',
  TAIL: 'tail',
};

export const SHAPE_SUBTYPES = {
  SPEECH_BUBBLE: 'speechBubble',
  THOUGHT_BUBBLE: 'thoughtBubble',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  SOFT_SQUARE: 'softSquare',
  SOFT_RECTANGLE: 'softRectangle',
};

export const ASSET_SUBTYPES = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
};

export const MIN_BLOCK_WIDTH_PX = 80;
export const MIN_BLOCK_HEIGHT_PX = 40;
export const TAIL_T_DRAG_MIN = 0.1;
export const TAIL_T_DRAG_MAX = 0.9;
export const TEXT_BLOCK_CLASSNAME_BY_SUBTYPE = {
  textTitle: 't-title',
  textHeading: 't-heading',
  textNormal: 't-normal',
};
export const NEW_BLOCK_POSITION_OFFSET = 40;
export const NEW_BLOCK_LEFT_PX = 60;
export const NEW_BLOCK_TOP_PX = 60;
export const NEW_BLOCK_POSITION_X_WRAP_PX = 200;
export const NEW_BLOCK_POSITION_Y_WRAP_PX = 120;
export const NEW_BLOCK_WIDTH_PX = 260;
export const NEW_BLOCK_HEIGHT_PX = 80;
export const NEW_BLOCK_ROTATION_DEG = 0;

export const COPIED_BLOCK_POSITION_OFFSET_PX = 20;

export const DEFAULT_SHAPE_STROKE_COLOR = '#000C30';
export const DEFAULT_SHAPE_STROKE_WIDTH = 1;
export const DEFAULT_SHAPE_FILL_COLOR = '#FDF7E9';
export const DEFAULT_TAIL_T_POSITION = 0.8;

export const COLOR_MAP = [
  '#40104D', messages.deepPurple,
  '#000C30', messages.richBlack,
  '#FDF7E9', messages.cream,
  '#F47B20', messages.orangeLight,
  '#BD5100', messages.orangeDark,
  '#F75E91', messages.pinkLight,
  '#D11553', messages.pinkDark,
  '#5FC9E0', messages.skyLight,
  '#007E99', messages.skyDark,
  '#97BF3D', messages.greenLight,
  '#577D00', messages.greenDark,
  '#FF6463', messages.watermelonLight,
  '#BA2625', messages.watermelonDark,
  '#C2A6E1', messages.lilacLight,
  '#8251B8', messages.lilacDark,
];
export const DEFAULT_TEXT_COLOR = '#000C30';

export const RESIZE_HANDLES = [
  { cls: 'corner top-left', dir: 'top-left' },
  { cls: 'corner top-right', dir: 'top-right' },
  { cls: 'corner bottom-left', dir: 'bottom-left' },
  { cls: 'corner bottom-right', dir: 'bottom-right' },
  { cls: 'side top', dir: 'top' },
  { cls: 'side bottom', dir: 'bottom' },
  { cls: 'side left', dir: 'left' },
  { cls: 'side right', dir: 'right' },
];

export const MENUS = {
  NONE: 'NONE',
  TEXT: 'TEXT',
  SHAPE: 'SHAPE',
};
