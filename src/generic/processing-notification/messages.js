import { defineMessages } from '@edx/frontend-platform/i18n';

/**
 * Titles of the toast shown while Studio works on a request.
 *
 * The thunks keep the English text in `NOTIFICATION_MESSAGES` as the state value, so
 * the component looks the translation up by that text (see `index.jsx`).
 */
const messages = defineMessages({
  adding: {
    id: 'course-authoring.processing-notification.adding',
    defaultMessage: 'Adding',
    description: 'Title of the toast shown while Studio is working',
  },
  saving: {
    id: 'course-authoring.processing-notification.saving',
    defaultMessage: 'Saving',
    description: 'Title of the toast shown while Studio is working',
  },
  duplicating: {
    id: 'course-authoring.processing-notification.duplicating',
    defaultMessage: 'Duplicating',
    description: 'Title of the toast shown while Studio is working',
  },
  deleting: {
    id: 'course-authoring.processing-notification.deleting',
    defaultMessage: 'Deleting',
    description: 'Title of the toast shown while Studio is working',
  },
  copying: {
    id: 'course-authoring.processing-notification.copying',
    defaultMessage: 'Copying',
    description: 'Title of the toast shown while Studio is working',
  },
  pasting: {
    id: 'course-authoring.processing-notification.pasting',
    defaultMessage: 'Pasting',
    description: 'Title of the toast shown while Studio is working',
  },
  discardChanges: {
    id: 'course-authoring.processing-notification.discard-changes',
    defaultMessage: 'Discarding changes',
    description: 'Title of the toast shown while Studio is working',
  },
  moving: {
    id: 'course-authoring.processing-notification.moving',
    defaultMessage: 'Moving',
    description: 'Title of the toast shown while Studio is working',
  },
  undoMoving: {
    id: 'course-authoring.processing-notification.undo-moving',
    defaultMessage: 'Undo moving',
    description: 'Title of the toast shown while Studio is working',
  },
  publishing: {
    id: 'course-authoring.processing-notification.publishing',
    defaultMessage: 'Publishing',
    description: 'Title of the toast shown while Studio is working',
  },
  hidingFromStudents: {
    id: 'course-authoring.processing-notification.hiding-from-students',
    defaultMessage: 'Hiding from students',
    description: 'Title of the toast shown while Studio is working',
  },
  makingVisibleToStudents: {
    id: 'course-authoring.processing-notification.making-visible-to-students',
    defaultMessage: 'Making visible to students',
    description: 'Title of the toast shown while Studio is working',
  },
});

export default messages;
