import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { updateQueryPendingStatus } from '../../data/slice';
import { getXBlockSupportMessages } from '../../constants';
import AddComponentButton from '../add-component-btn';
import messages from '../messages';
import ModalContainer from './ModalContainer';

// Template names come from the CMS in English; the ones with a message here are shown translated.
export const TEMPLATE_NAME_MESSAGES = {
  announcement: messages.templateAnnouncement,
  'anonymous user id': messages.templateAnonymousUserId,
  'iframe tool': messages.templateIframeTool,
  'raw html': messages.templateRawHtml,
  'zooming image tool': messages.templateZoomingImageTool,
  poll: messages.templatePoll,
  survey: messages.templateSurvey,
  'word cloud': messages.templateWordCloud,
  'self assessment only': messages.templateSelfAssessmentOnly,
  'staff assessment only': messages.templateStaffAssessmentOnly,
  'self assessment to peer assessment': messages.templateSelfToPeer,
  'self assessment to staff assessment': messages.templateSelfToStaff,
};

const ComponentModalView = ({
  component,
  modalParams,
  handleCreateNewXBlock,
  isRequestedModalView,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [moduleTitle, setModuleTitle] = useState('');
  const { open, close, isOpen } = modalParams;
  const {
    type, displayName, templates, supportLegend,
  } = component;
  const supportLabels = getXBlockSupportMessages(intl);
  const templateName = (name) => {
    const message = TEMPLATE_NAME_MESSAGES[(name ?? '').toLowerCase()];
    return message ? intl.formatMessage(message) : name;
  };

  const handleSubmit = () => {
    handleCreateNewXBlock(type, moduleTitle);
    dispatch(updateQueryPendingStatus(true));
    setModuleTitle('');
  };

  const renderAddComponentButton = () => (
    <li>
      <AddComponentButton
        onClick={open}
        type={type}
        displayName={displayName}
      />
    </li>
  );

  return (
    <>
      {!isRequestedModalView && renderAddComponentButton()}
      <ModalContainer
        isOpen={isOpen}
        close={close}
        title={intl.formatMessage(messages.modalContainerTitle, { componentTitle: (displayName ?? '').toLowerCase() })}
        btnText={intl.formatMessage(messages.modalBtnText)}
        onSubmit={handleSubmit}
        resetDisabled={() => setModuleTitle('')}
        hasValue={!moduleTitle.length}
      >
        <Form.Group>
          <Form.RadioSet
            name={displayName}
            onChange={(e) => setModuleTitle(e.target.value)}
          >
            {templates.map((componentTemplate) => {
              const value = componentTemplate.boilerplateName || componentTemplate.category;
              const isDisplaySupportLabel = supportLegend.showLegend && supportLabels[componentTemplate.supportLevel];

              return (
                <div
                  key={componentTemplate.displayName}
                  className="d-flex justify-content-between w-100 mb-2.5 align-items-end"
                >
                  <Form.Radio
                    className="add-component-modal-radio"
                    value={value}
                  >
                    {templateName(componentTemplate.displayName)}
                  </Form.Radio>
                  {isDisplaySupportLabel && (
                    <OverlayTrigger
                      placement="right"
                      overlay={(
                        <Tooltip id={`${componentTemplate.displayName}-support-tooltip`}>
                          {supportLabels[componentTemplate.supportLevel].tooltip}
                        </Tooltip>
                      )}
                    >
                      <span className="x-small text-gray-500 flex-shrink-0 ml-2">
                        {supportLabels[componentTemplate.supportLevel].label}
                      </span>
                    </OverlayTrigger>
                  )}
                </div>
              );
            })}
          </Form.RadioSet>
        </Form.Group>
      </ModalContainer>
    </>
  );
};

ComponentModalView.defaultProps = {
  isRequestedModalView: false,
};

ComponentModalView.propTypes = {
  modalParams: PropTypes.shape({
    open: PropTypes.func,
    close: PropTypes.func,
    isOpen: PropTypes.bool,
  }).isRequired,
  handleCreateNewXBlock: PropTypes.func.isRequired,
  component: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    category: PropTypes.string,
    type: PropTypes.string.isRequired,
    templates: PropTypes.arrayOf(
      PropTypes.shape({
        boilerplateName: PropTypes.string,
        category: PropTypes.string,
        displayName: PropTypes.string.isRequired,
        supportLevel: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      }),
    ),
    supportLegend: PropTypes.shape({
      allowUnsupportedXblocks: PropTypes.bool,
      documentationLabel: PropTypes.string,
      showLegend: PropTypes.bool,
    }),
  }).isRequired,
  isRequestedModalView: PropTypes.bool,
};

export default ComponentModalView;
