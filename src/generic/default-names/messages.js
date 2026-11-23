import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  chapter: {
    id: 'course-authoring.default-names.chapter',
    defaultMessage: 'Section',
    description: 'Name given to a new section of the course outline',
  },
  sequential: {
    id: 'course-authoring.default-names.sequential',
    defaultMessage: 'Subsection',
    description: 'Name given to a new subsection of the course outline',
  },
  vertical: {
    id: 'course-authoring.default-names.vertical',
    defaultMessage: 'Unit',
    description: 'Name given to a new unit',
  },
  libraryContent: {
    id: 'course-authoring.default-names.library-content',
    defaultMessage: 'Randomized Content Block',
    description: 'Name given to a new randomized content block (library content)',
  },
  itembank: {
    id: 'course-authoring.default-names.itembank',
    defaultMessage: 'Problem Bank',
    description: 'Name given to a new problem bank',
  },
});

export default messages;
