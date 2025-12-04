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
import AIAssistantWidget from '../../../../sharedComponents/AIAssistantWidget';

import {
  checkIfEditorsDirty, parseState, saveWarningModalToggle, getContent,
} from './hooks';
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
            <AIAssistantWidget
              getCurrentContent={() => {
                if (isMarkdownEditorEnabled && editorRef?.current) {
                  return editorRef.current.state.doc.toString();
                }
                if (editorRef?.current) {
                  return editorRef.current.state.doc.toString();
                }
                return isMarkdownEditorEnabled ? problemState.rawMarkdown : problemState.rawOLX;
              }}
              updateContent={(newContent) => {
                if (isMarkdownEditorEnabled) {
                  dispatch(actions.problem.updateField({ rawMarkdown: newContent }));
                  // Update the editor if it exists
                  if (editorRef?.current) {
                    const transaction = editorRef.current.state.update({
                      changes: {
                        from: 0,
                        to: editorRef.current.state.doc.length,
                        insert: newContent,
                      },
                    });
                    editorRef.current.dispatch(transaction);
                  }
                } else {
                  // For advanced/raw editor, update rawOLX and editor
                  dispatch(actions.problem.updateField({ rawOLX: newContent }));
                  // Update the editor if it exists
                  if (editorRef?.current) {
                    const transaction = editorRef.current.state.update({
                      changes: {
                        from: 0,
                        to: editorRef.current.state.doc.length,
                        insert: newContent,
                      },
                    });
                    editorRef.current.dispatch(transaction);
                  }
                }
                
                // Reset horizontal scroll position after content update
                setTimeout(() => {
                  const modalBody = document.querySelector('.pgn__modal-body');
                  if (modalBody) {
                    modalBody.scrollLeft = 0;
                  }
                  window.scrollTo({ left: 0, behavior: 'auto' });
                }, 0);
              }}
              blockType={problemType || 'problem'}
            />
            <RawEditor editorRef={editorRef} lang={isMarkdownEditorEnabled ? 'markdown' : 'xml'} content={isMarkdownEditorEnabled ? problemState.rawMarkdown : problemState.rawOLX} />
          </Container>
        ) : (
          <span className="flex-grow-1 mb-5">
            <AIAssistantWidget
              getCurrentContent={() => {
                // For visual problem editor, we need to get the current OLX
                // This is a simplified version - in practice, you might want to
                // call parseState to get the current OLX representation
                return problemState.rawOLX || '';
              }}
              updateContent={(newOLX) => {
                // For visual problem editor, we need to parse the OLX and update the problem state
                // Use the same logic as initializeProblem to parse and load the problem
                const rawSettings = {
                  weight: problemState.settings?.scoring?.weight || 1,
                  max_attempts: problemState.settings?.scoring?.attempts?.number || null,
                  showanswer: problemState.settings?.showAnswer?.on || null,
                  show_reset_button: problemState.settings?.showResetButton || null,
                  rerandomize: problemState.settings?.randomization || null,
                };
                
                // Parse the new OLX and update the problem state
                const parsedData = getDataFromOlx({
                  rawOLX: newOLX,
                  rawSettings,
                  defaultSettings: defaultSettings || {},
                });
                
                // Update the problem state with parsed data
                dispatch(actions.problem.load({
                  ...parsedData,
                  rawOLX: newOLX,
                  rawMarkdown: problemState.rawMarkdown,
                  isMarkdownEditorEnabled,
                }));
                
                // Reset horizontal scroll position after content update
                // Use setTimeout to ensure DOM has updated
                setTimeout(() => {
                  const modalBody = document.querySelector('.pgn__modal-body');
                  if (modalBody) {
                    modalBody.scrollLeft = 0;
                  }
                  // Also reset scroll on the window if needed
                  window.scrollTo({ left: 0, behavior: 'auto' });
                }, 0);
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
