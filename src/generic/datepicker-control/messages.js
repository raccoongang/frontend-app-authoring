import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  calendarAltText: {
    id: 'course-authoring.schedule.schedule-section.alt-text',
    defaultMessage: 'Calendar for datepicker input',
  },
  datePlaceholder: {
    id: 'course-authoring.datepicker.date-placeholder',
    defaultMessage: 'MM/DD/YYYY',
    description: 'Placeholder of a date input. The format of the typed date does not change.',
  },
  timePlaceholder: {
    id: 'course-authoring.datepicker.time-placeholder',
    defaultMessage: 'HH:MM',
    description: 'Placeholder of a time input. The format of the typed time does not change.',
  },
  previousMonth: {
    id: 'course-authoring.datepicker.previous-month',
    defaultMessage: 'Previous Month',
    description: 'Label of the button that shows the previous month in the calendar',
  },
  nextMonth: {
    id: 'course-authoring.datepicker.next-month',
    defaultMessage: 'Next Month',
    description: 'Label of the button that shows the next month in the calendar',
  },
  datepickerUTC: {
    id: 'course-authoring.schedule.schedule-section.datepicker.utc',
    defaultMessage: 'UTC',
  },
});

export default messages;
