import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Icon } from '@openedx/paragon';
import { Error } from '@openedx/paragon/icons';
import { capitalize } from 'lodash';
import { useIntl } from '@edx/frontend-platform/i18n';

import { transformKeysToCamelCase } from '../../utils';
import messages from './messages';

// validateAdvancedSettingsData reports this exact English text; it is shown translated.
const INCORRECT_JSON = 'Incorrectly formatted JSON';

const ModalErrorListItem = ({ settingName, settingsData }) => {
  const intl = useIntl();
  const { displayName } = settingsData[transformKeysToCamelCase(settingName)];
  return (
    <li className="modal-error-item">
      <Alert variant="danger">
        <h4 className="modal-error-item-title">
          <Icon src={Error} />{capitalize(displayName)}:
        </h4>
        <p className="m-0">
          {settingName.message === INCORRECT_JSON ? intl.formatMessage(messages.incorrectJson) : settingName.message}
        </p>
      </Alert>
    </li>
  );
};

ModalErrorListItem.propTypes = {
  settingName: PropTypes.shape({
    key: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  settingsData: PropTypes.shape({}).isRequired,
};

export default ModalErrorListItem;
