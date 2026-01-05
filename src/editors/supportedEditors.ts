import TextEditor from './containers/TextEditor';
import VideoEditor from './containers/VideoEditor';
import ProblemEditor from './containers/ProblemEditor';
import VideoUploadEditor from './containers/VideoUploadEditor';
import GameEditor from './containers/GameEditor';
import SlideEditor from './containers/SlideEditor';

// ADDED_EDITOR_IMPORTS GO HERE

import { blockTypes } from './data/constants/app';

const supportedEditors = {
  [blockTypes.html]: TextEditor,
  [blockTypes.video]: VideoEditor,
  [blockTypes.problem]: ProblemEditor,
  [blockTypes.video_upload]: VideoUploadEditor,
  // ADDED_EDITORS GO BELOW
  [blockTypes.game]: GameEditor,
  [blockTypes.slide]: SlideEditor,
} as const;

export default supportedEditors;
