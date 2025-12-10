import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import {
  Container,
  Button,
  AlertModal,
  ActionRow,
} from '@openedx/paragon';
import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import EditorContainer from '../../../EditorContainer';
import { selectors, actions } from '../../../../data/redux';
import { getDataFromOlx } from '../../../../data/redux/thunkActions/problem';
import RawEditor from '../../../../sharedComponents/RawEditor';
import { ProblemTypeKeys } from '../../../../data/constants/problem';
import { ProblemEditorPluginSlot } from '../../../../../plugin-slots/ProblemEditorPluginSlot';

import {
  checkIfEditorsDirty, parseState, saveWarningModalToggle, getContent, fetchEditorContent,
} from './hooks';
import ReactStateOLXParser from '../../data/ReactStateOLXParser';
import './index.scss';
import messages from './messages';

import ExplanationWidget from './ExplanationWidget';
import { saveBlock } from '../../../../hooks';

const EditProblemView = ({
  returnFunction,
  // redux
  problemType,
  isMarkdownEditorEnabled,
  problemState,
  lmsEndpointUrl,
  returnUrl,
  analytics,
  isDirty,
  defaultSettings,
  // injected
  intl,
}) => {
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  const isAdvancedProblemType = problemType === ProblemTypeKeys.ADVANCED;
  
  // Cache the last known good OLX content - only update when we get non-empty content
  const cachedOLXRef = useRef(problemState.rawOLX || '');
  
  // Create the getContent function that EditorContainer uses (this works for saving)
  const getContentFn = () => getContent({
    problemState,
    openSaveWarningModal,
    isAdvancedProblemType,
    isMarkdownEditorEnabled,
    editorRef,
    lmsEndpointUrl,
  });
  const { isSaveWarningModalOpen, openSaveWarningModal, closeSaveWarningModal } = saveWarningModalToggle();

  const checkIfDirty = () => {
    if (isAdvancedProblemType && editorRef && editorRef?.current) {
      /* istanbul ignore next */
      return editorRef.current.observer?.lastChange !== 0;
    }
    return isDirty || checkIfEditorsDirty();
  };

  return (
    <EditorContainer
      getContent={() => getContent({
        problemState,
        openSaveWarningModal,
        isAdvancedProblemType,
        isMarkdownEditorEnabled,
        editorRef,
        lmsEndpointUrl,
      })}
      isDirty={checkIfDirty}
      returnFunction={returnFunction}
    >
      <AlertModal
        title={isAdvancedProblemType ? (
          intl.formatMessage(messages.olxSettingDiscrepancyTitle)
        ) : intl.formatMessage(messages.noAnswerTitle)}
        isOpen={isSaveWarningModalOpen}
        onClose={closeSaveWarningModal}
        footerNode={(
          <ActionRow>
            <Button variant="tertiary" onClick={closeSaveWarningModal}>
              <FormattedMessage {...messages.saveWarningModalCancelButtonLabel} />
            </Button>
            <Button
              onClick={() => saveBlock({
                content: parseState({
                  problem: problemState,
                  isAdvanced: isAdvancedProblemType,
                  isMarkdown: isMarkdownEditorEnabled,
                  ref: editorRef,
                  lmsEndpointUrl,
                })(),
                returnFunction,
                destination: returnUrl,
                dispatch,
                analytics,
              })}
            >
              <FormattedMessage {...messages.saveWarningModalSaveButtonLabel} />
            </Button>
          </ActionRow>
        )}
      >
        {isAdvancedProblemType ? (
          <FormattedMessage {...messages.olxSettingDiscrepancyBodyExplanation} />
        ) : (
          <>
            <div>
              <FormattedMessage {...messages.saveWarningModalBodyQuestion} />
            </div>
            <div>
              <FormattedMessage {...messages.noAnswerBodyExplanation} />
            </div>
          </>
        )}
      </AlertModal>
      <div className="editProblemView d-flex flex-row flex-nowrap justify-content-end">
        {isAdvancedProblemType || isMarkdownEditorEnabled ? (
          <Container fluid className="advancedEditorTopMargin p-0">
            <RawEditor editorRef={editorRef} lang={isMarkdownEditorEnabled ? 'markdown' : 'xml'} content={isMarkdownEditorEnabled ? problemState.rawMarkdown : problemState.rawOLX} />
          </Container>
        ) : (
          <span className="flex-grow-1 mb-5">
            <ProblemEditorPluginSlot
              getCurrentContent={() => {
                // Use the EXACT same getContent function that EditorContainer uses for saving
                try {
                  const contentData = getContentFn();
                  // getContentFn returns { olx, settings } or null if validation fails
                  if (contentData && contentData.olx && contentData.olx.trim().length > 0) {
                    // Got valid non-empty OLX - update cache and return it
                    cachedOLXRef.current = contentData.olx;
                    return contentData.olx;
                  }
                  
                  // If we got empty/null content, return cached content (if available)
                  if (cachedOLXRef.current && cachedOLXRef.current.trim().length > 0) {
                    return cachedOLXRef.current;
                  }
                } catch (error) {
                  console.warn('Failed to get problem content via getContentFn:', error);
                }
                
                // Fallback: try parseState directly
                try {
                  if (window.tinymce?.editors && Object.keys(window.tinymce.editors).length > 0) {
                    const contentData = parseState({
                      problem: problemState,
                      isAdvanced: false,
                      isMarkdownEditorEnabled,
                      ref: editorRef,
                      lmsEndpointUrl,
                    })();
                    if (contentData && contentData.olx && contentData.olx.trim().length > 0) {
                      // Got valid non-empty OLX - update cache and return it
                      cachedOLXRef.current = contentData.olx;
                      return contentData.olx;
                    }
                  }
                } catch (parseError) {
                  console.warn('Failed to get content via parseState:', parseError);
                }
                
                // Final fallback: return cached content or rawOLX
                return cachedOLXRef.current || problemState.rawOLX || '';
              }}
              updateContent={(newOLX) => {
                // Update the cache with new OLX content
                if (newOLX && typeof newOLX === 'string') {
                  cachedOLXRef.current = newOLX;
                }
                
                // Parse and update the problem state
                const rawSettings = {
                  weight: problemState.settings?.scoring?.weight || 1,
                  max_attempts: problemState.settings?.scoring?.attempts?.number || null,
                  showanswer: problemState.settings?.showAnswer?.on || null,
                  show_reset_button: problemState.settings?.showResetButton || null,
                  rerandomize: problemState.settings?.randomization || null,
                };
                
                const parsedData = getDataFromOlx({
                  rawOLX: newOLX,
                  rawSettings,
                  defaultSettings: defaultSettings || {},
                });
                
                dispatch(actions.problem.load({
                  ...parsedData,
                  rawOLX: newOLX,
                  rawMarkdown: problemState.rawMarkdown,
                  isMarkdownEditorEnabled,
                }));
              }}
              blockType={problemType || 'problem'}
            />
            <QuestionWidget />
            <ExplanationWidget />
            <AnswerWidget problemType={problemType} />
          </span>
        )}
        <span className="editProblemView-settingsColumn">
          <SettingsWidget problemType={problemType} />
        </span>
      </div>
    </EditorContainer>
  );
};

EditProblemView.defaultProps = {
  lmsEndpointUrl: null,
  returnFunction: null,
  isDirty: false,
};

EditProblemView.propTypes = {
  problemType: PropTypes.string.isRequired,
  returnFunction: PropTypes.func,
  // eslint-disable-next-line
  problemState: PropTypes.any.isRequired,
  analytics: PropTypes.shape({}).isRequired,
  lmsEndpointUrl: PropTypes.string,
  returnUrl: PropTypes.string.isRequired,
  isDirty: PropTypes.bool,
  isMarkdownEditorEnabled: PropTypes.bool,
  defaultSettings: PropTypes.object,
  // injected
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  analytics: selectors.app.analytics(state),
  lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
  returnUrl: selectors.app.returnUrl(state),
  problemType: selectors.problem.problemType(state),
  isMarkdownEditorEnabled: selectors.problem.isMarkdownEditorEnabled(state)
   && selectors.app.isMarkdownEditorEnabledForCourse(state),
  problemState: selectors.problem.completeState(state),
  isDirty: selectors.problem.isDirty(state),
  defaultSettings: selectors.problem.defaultSettings(state) || {},
});

export const EditProblemViewInternal = EditProblemView; // For testing only
export default injectIntl(connect(mapStateToProps)(EditProblemView));
