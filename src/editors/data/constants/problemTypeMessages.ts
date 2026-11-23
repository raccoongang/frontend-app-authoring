import { defineMessages } from '@edx/frontend-platform/i18n';
import type { IntlShape } from 'react-intl';
import { AdvanceProblemKeys, ProblemTypeKeys } from './problem';

/**
 * What the problem type dialogs show for each type.
 *
 * `ProblemTypes` / `AdvanceProblems` keep the English text as data (a new block is
 * named after it and the editor compares block titles with it), so the screens
 * translate it here, at the point of display.
 */
const messages = defineMessages({
  singleSelectTitle: {
    id: 'authoring.problemEditor.type.title.multiplechoiceresponse',
    defaultMessage: 'Single select',
    description: 'Name of the single select problem type',
  },
  multiSelectTitle: {
    id: 'authoring.problemEditor.type.title.choiceresponse',
    defaultMessage: 'Multi-select',
    description: 'Name of the multi-select problem type',
  },
  dropdownTitle: {
    id: 'authoring.problemEditor.type.title.optionresponse',
    defaultMessage: 'Dropdown',
    description: 'Name of the dropdown problem type',
  },
  numericTitle: {
    id: 'authoring.problemEditor.type.title.numericalresponse',
    defaultMessage: 'Numerical input',
    description: 'Name of the numerical input problem type',
  },
  textInputTitle: {
    id: 'authoring.problemEditor.type.title.stringresponse',
    defaultMessage: 'Text input',
    description: 'Name of the text input problem type',
  },
  singleSelectPreview: {
    id: 'authoring.problemEditor.type.preview.multiplechoiceresponse',
    defaultMessage: 'Learners must select the correct answer from a list of possible options.',
    description: 'Description of the single select problem type in the type dialog',
  },
  multiSelectPreview: {
    id: 'authoring.problemEditor.type.preview.choiceresponse',
    defaultMessage: 'Learners must select all correct answers from a list of possible options.',
    description: 'Description of the multi-select problem type in the type dialog',
  },
  dropdownPreview: {
    id: 'authoring.problemEditor.type.preview.optionresponse',
    defaultMessage: 'Learners must select the correct answer from a list of possible options',
    description: 'Description of the dropdown problem type in the type dialog',
  },
  numericPreview: {
    id: 'authoring.problemEditor.type.preview.numericalresponse',
    defaultMessage: 'Specify one or more correct numeric answers, submitted in a response field.',
    description: 'Description of the numerical input problem type in the type dialog',
  },
  textInputPreview: {
    id: 'authoring.problemEditor.type.preview.stringresponse',
    defaultMessage: 'Specify one or more correct text answers, including numbers and special characters, submitted in a response field.',
    description: 'Description of the text input problem type in the type dialog',
  },
  blankAdvanced: {
    id: 'authoring.problemEditor.advanced.title.blankadvanced',
    defaultMessage: 'Blank problem',
    description: 'Name of an advanced problem type',
  },
  circuitSchematic: {
    id: 'authoring.problemEditor.advanced.title.circuitschematic',
    defaultMessage: 'Circuit schematic builder',
    description: 'Name of an advanced problem type',
  },
  jsInput: {
    id: 'authoring.problemEditor.advanced.title.jsinputresponse',
    defaultMessage: 'Custom JavaScript display and grading',
    description: 'Name of an advanced problem type',
  },
  customGrader: {
    id: 'authoring.problemEditor.advanced.title.customgrader',
    defaultMessage: 'Custom Python-evaluated input',
    description: 'Name of an advanced problem type',
  },
  imageResponse: {
    id: 'authoring.problemEditor.advanced.title.imageresponse',
    defaultMessage: 'Image mapped input',
    description: 'Name of an advanced problem type',
  },
  formulaResponse: {
    id: 'authoring.problemEditor.advanced.title.formularesponse',
    defaultMessage: 'Math expression input',
    description: 'Name of an advanced problem type',
  },
  problemWithHint: {
    id: 'authoring.problemEditor.advanced.title.problemwithhint',
    defaultMessage: 'Problem with adaptive hint',
    description: 'Name of an advanced problem type',
  },
  statusNotSupported: {
    id: 'authoring.problemEditor.advanced.status.notsupported',
    defaultMessage: 'Not supported',
    description: 'Support level of an advanced problem type',
  },
  statusProvisional: {
    id: 'authoring.problemEditor.advanced.status.provisional',
    defaultMessage: 'Provisional',
    description: 'Support level of an advanced problem type',
  },
});

const TITLES = {
  [ProblemTypeKeys.SINGLESELECT]: messages.singleSelectTitle,
  [ProblemTypeKeys.MULTISELECT]: messages.multiSelectTitle,
  [ProblemTypeKeys.DROPDOWN]: messages.dropdownTitle,
  [ProblemTypeKeys.NUMERIC]: messages.numericTitle,
  [ProblemTypeKeys.TEXTINPUT]: messages.textInputTitle,
} as const;

const PREVIEWS = {
  [ProblemTypeKeys.SINGLESELECT]: messages.singleSelectPreview,
  [ProblemTypeKeys.MULTISELECT]: messages.multiSelectPreview,
  [ProblemTypeKeys.DROPDOWN]: messages.dropdownPreview,
  [ProblemTypeKeys.NUMERIC]: messages.numericPreview,
  [ProblemTypeKeys.TEXTINPUT]: messages.textInputPreview,
} as const;

const ADVANCED_TITLES = {
  [AdvanceProblemKeys.BLANK]: messages.blankAdvanced,
  [AdvanceProblemKeys.CIRCUITSCHEMATIC]: messages.circuitSchematic,
  [AdvanceProblemKeys.JSINPUT]: messages.jsInput,
  [AdvanceProblemKeys.CUSTOMGRADER]: messages.customGrader,
  [AdvanceProblemKeys.IMAGE]: messages.imageResponse,
  [AdvanceProblemKeys.FORMULA]: messages.formulaResponse,
  [AdvanceProblemKeys.PROBLEMWITHHINT]: messages.problemWithHint,
} as const;

const STATUSES: Record<string, typeof messages.statusNotSupported> = {
  'Not supported': messages.statusNotSupported,
  Provisional: messages.statusProvisional,
};

/** Name of a basic problem type; the English `fallback` when there is no message for the key. */
export const problemTypeTitle = (intl: IntlShape, key: string, fallback = '') => {
  const message = (TITLES as Record<string, typeof messages.singleSelectTitle>)[key];
  return message ? intl.formatMessage(message) : fallback;
};

export const problemTypePreview = (intl: IntlShape, key: string, fallback = '') => {
  const message = (PREVIEWS as Record<string, typeof messages.singleSelectPreview>)[key];
  return message ? intl.formatMessage(message) : fallback;
};

export const advancedProblemTitle = (intl: IntlShape, key: string, fallback = '') => {
  const message = (ADVANCED_TITLES as Record<string, typeof messages.blankAdvanced>)[key];
  return message ? intl.formatMessage(message) : fallback;
};

export const advancedProblemStatus = (intl: IntlShape, status: string) => {
  const message = STATUSES[status];
  return message ? intl.formatMessage(message) : status;
};
