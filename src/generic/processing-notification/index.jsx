import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Icon, Toast,
} from '@openedx/paragon';
import { Settings as IconSettings } from '@openedx/paragon/icons';
import classNames from 'classnames';

import { NOTIFICATION_MESSAGES } from '../../constants';
import messages from './messages';

// The state carries the English text of NOTIFICATION_MESSAGES; show it in the
// language of the interface. Anything else (a custom title) is shown as it is.
const TITLE_MESSAGES = {
  [NOTIFICATION_MESSAGES.adding]: messages.adding,
  [NOTIFICATION_MESSAGES.saving]: messages.saving,
  [NOTIFICATION_MESSAGES.duplicating]: messages.duplicating,
  [NOTIFICATION_MESSAGES.deleting]: messages.deleting,
  [NOTIFICATION_MESSAGES.copying]: messages.copying,
  [NOTIFICATION_MESSAGES.pasting]: messages.pasting,
  [NOTIFICATION_MESSAGES.discardChanges]: messages.discardChanges,
  [NOTIFICATION_MESSAGES.moving]: messages.moving,
  [NOTIFICATION_MESSAGES.undoMoving]: messages.undoMoving,
  [NOTIFICATION_MESSAGES.publishing]: messages.publishing,
  [NOTIFICATION_MESSAGES.hidingFromStudents]: messages.hidingFromStudents,
  [NOTIFICATION_MESSAGES.makingVisibleToStudents]: messages.makingVisibleToStudents,
};

const ProcessingNotification = ({
  isShow, title, action, close,
}) => {
  const intl = useIntl();
  const titleMessage = TITLE_MESSAGES[title];

  return (
    <Toast
      className={classNames({ 'processing-notification-hide-close-button': !close })}
      show={isShow}
      aria-hidden={isShow}
      action={action && { ...action }}
      onClose={close || (() => {})}
    >
      <span className="d-flex align-items-center">
        <Icon className="processing-notification-icon mb-0 mr-2" src={IconSettings} />
        <span className="font-weight-bold h4 mb-0 text-white">
          {titleMessage ? intl.formatMessage(titleMessage) : title}
        </span>
      </span>
    </Toast>
  );
};

ProcessingNotification.defaultProps = {
  close: null,
};

ProcessingNotification.propTypes = {
  isShow: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }),
  close: PropTypes.func,
};

export default ProcessingNotification;
