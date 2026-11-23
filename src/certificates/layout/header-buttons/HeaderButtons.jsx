import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button, Dropdown, DropdownButton, Hyperlink,
} from '@openedx/paragon';

import messages from '../../messages';
import useHeaderButtons from './hooks/useHeaderButtons';

// Enrolment modes are ids from the server; the known ones are shown translated, the value stays the id.
const COURSE_MODE_MESSAGES = {
  honor: messages.courseModeHonor,
  verified: messages.courseModeVerified,
  professional: messages.courseModeProfessional,
  'no-id-professional': messages.courseModeNoIdProfessional,
  audit: messages.courseModeAudit,
  credit: messages.courseModeCredit,
  masters: messages.courseModeMasters,
  'executive-education': messages.courseModeExecutiveEducation,
};

const HeaderButtons = () => {
  const intl = useIntl();
  const modeLabel = (mode) => (COURSE_MODE_MESSAGES[mode] ? intl.formatMessage(COURSE_MODE_MESSAGES[mode]) : mode);
  const {
    previewUrl,
    courseModes,
    dropdowmItem,
    isCertificateActive,
    setDropdowmItem,
    handleActivationStatus,
  } = useHeaderButtons();

  return (
    <>
      <DropdownButton id="dropdown-basic-button" title={modeLabel(dropdowmItem)} onSelect={(item) => setDropdowmItem(item)}>
        {courseModes.map((mode) => <Dropdown.Item key={mode} eventKey={mode}>{modeLabel(mode)}</Dropdown.Item>)}
      </DropdownButton>
      <Button
        variant="outline-primary"
        as={Hyperlink}
        destination={previewUrl}
        target="_blank"
        showLaunchIcon={false}
      >
        {intl.formatMessage(messages.headingActionsPreview)}
      </Button>
      <Button
        variant="outline-primary"
        onClick={handleActivationStatus}
      >
        {isCertificateActive
          ? intl.formatMessage(messages.headingActionsDeactivate)
          : intl.formatMessage(messages.headingActionsActivate)}
      </Button>
    </>
  );
};

export default HeaderButtons;
