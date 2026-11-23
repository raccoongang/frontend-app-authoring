import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  modalErrorTitle: {
    id: 'course-authoring.advanced-settings.modal.error.title',
    defaultMessage: 'Validation error while saving',
  },
  modalErrorButtonChangeManually: {
    id: 'course-authoring.advanced-settings.modal.error.btn.change-manually',
    defaultMessage: 'Change manually',
  },
  modalErrorButtonUndoChanges: {
    id: 'course-authoring.advanced-settings.modal.error.btn.undo-changes',
    defaultMessage: 'Undo changes',
  },
  incorrectJson: {
    id: 'course-authoring.advanced-settings.modal.error.incorrect-json',
    defaultMessage: 'Incorrectly formatted JSON',
    description: 'Shown under a setting whose value is not valid JSON',
  },
  modalErrorCount: {
    id: 'course-authoring.advanced-settings.modal.error.count',
    defaultMessage: '{count, plural, one {# validation error} other {# validation errors}}',
    description: 'Number of settings that failed validation, shown in bold inside the error description',
  },
});

export default messages;
