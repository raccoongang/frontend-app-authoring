import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import { selectors } from '../../../../../data/redux';
import messages from './messages';
import TinyMceWidget from '../../../../../sharedComponents/TinyMceWidget';
import { prepareEditorRef, replaceStaticWithAsset } from '../../../../../sharedComponents/TinyMceWidget/hooks';

const ExplanationWidget = ({
  // redux
  settings,
  learningContextId,
  images,
  isLibrary,
  blockId,
}) => {
  const intl = useIntl();
  const { editorRef, refReady, setEditorRef } = prepareEditorRef();
  const initialContent = settings?.solutionExplanation || '';
  const newContent = replaceStaticWithAsset({
    initialContent,
    learningContextId,
  });
  const solutionContent = newContent || initialContent;
  let staticRootUrl;
  if (isLibrary) {
    staticRootUrl = `${getConfig().STUDIO_BASE_URL }/library_assets/blocks/${ blockId }/`;
  }
  if (!refReady) { return null; }
  return (
    <div className="tinyMceWidget mt-4 text-primary-500">
      <div className="h4 mb-3">
        <FormattedMessage {...messages.solutionWidgetTitle} />
      </div>
      <div className="small mb-3">
        <FormattedMessage {...messages.solutionDescriptionText} />
      </div>
      <TinyMceWidget
        id="solution"
        editorType="solution"
        editorRef={editorRef}
        editorContentHtml={solutionContent}
        setEditorRef={setEditorRef}
        minHeight={150}
        placeholder={intl.formatMessage(messages.placeholder)}
        {...{
          images,
          isLibrary,
          learningContextId,
          staticRootUrl,
        }}
      />
    </div>
  );
};

ExplanationWidget.propTypes = {
  // redux
  // eslint-disable-next-line
  settings: PropTypes.any.isRequired,
  learningContextId: PropTypes.string.isRequired,
  images: PropTypes.shape({}).isRequired,
  isLibrary: PropTypes.bool.isRequired,
  blockId: PropTypes.string.isRequired,
};
export const mapStateToProps = (state) => ({
  settings: selectors.problem.settings(state),
  learningContextId: selectors.app.learningContextId(state),
  images: selectors.app.images(state),
  isLibrary: selectors.app.isLibrary(state),
  blockId: selectors.app.blockId(state),
});

export const ExplanationWidgetInternal = ExplanationWidget; // For testing only
export default connect(mapStateToProps)(ExplanationWidget);
