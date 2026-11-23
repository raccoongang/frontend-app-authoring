import { defineMessages } from '@edx/frontend-platform/i18n';

// The server marks these texts for extraction but sends them in English, so each card is translated here by its app id.
const appCardMessages = defineMessages({
  progressName: {
    id: 'course-authoring.pages-and-resources.app.progress.name',
    defaultMessage: 'Progress',
  },
  progressDescription: {
    id: 'course-authoring.pages-and-resources.app.progress.description',
    defaultMessage: 'Keep learners engaged and on track throughout the course.',
  },
  textbooksName: {
    id: 'course-authoring.pages-and-resources.app.textbooks.name',
    defaultMessage: 'Textbooks',
  },
  textbooksDescription: {
    id: 'course-authoring.pages-and-resources.app.textbooks.description',
    defaultMessage: 'Create and manage a library of course readings, textbooks, and chapters.',
  },
  calculatorName: {
    id: 'course-authoring.pages-and-resources.app.calculator.name',
    defaultMessage: 'Calculator',
  },
  calculatorDescription: {
    id: 'course-authoring.pages-and-resources.app.calculator.description',
    defaultMessage: 'Provide an in-course calculator for simple and complex calculations.',
  },
  proctoringName: {
    id: 'course-authoring.pages-and-resources.app.proctoring.name',
    defaultMessage: 'Proctoring',
  },
  proctoringDescription: {
    id: 'course-authoring.pages-and-resources.app.proctoring.description',
    defaultMessage: 'Maintain exam integrity by enabling a proctoring solution for your course',
  },
  custom_pagesName: {
    id: 'course-authoring.pages-and-resources.app.custom_pages.name',
    defaultMessage: 'Custom pages',
  },
  custom_pagesDescription: {
    id: 'course-authoring.pages-and-resources.app.custom_pages.description',
    defaultMessage: 'Provide additional course content and resources with custom pages',
  },
  ora_settingsName: {
    id: 'course-authoring.pages-and-resources.app.ora_settings.name',
    defaultMessage: 'Flexible Peer Grading for ORAs',
  },
  ora_settingsDescription: {
    id: 'course-authoring.pages-and-resources.app.ora_settings.description',
    defaultMessage: 'Course level settings for Flexible Peer Grading Open Response Assessments.',
  },
  liveName: {
    id: 'course-authoring.pages-and-resources.app.live.name',
    defaultMessage: 'Live',
  },
  liveDescription: {
    id: 'course-authoring.pages-and-resources.app.live.description',
    defaultMessage: 'Enable in-platform video conferencing by configuring live',
  },
  discussionName: {
    id: 'course-authoring.pages-and-resources.app.discussion.name',
    defaultMessage: 'Discussion',
  },
  discussionDescription: {
    id: 'course-authoring.pages-and-resources.app.discussion.description',
    defaultMessage: 'Encourage participation and engagement in your course with discussions.',
  },
  teamsName: {
    id: 'course-authoring.pages-and-resources.app.teams.name',
    defaultMessage: 'Teams',
  },
  teamsDescription: {
    id: 'course-authoring.pages-and-resources.app.teams.description',
    defaultMessage: 'Leverage teams to allow learners to connect by topic of interest.',
  },
  edxnotesName: {
    id: 'course-authoring.pages-and-resources.app.edxnotes.name',
    defaultMessage: 'Notes',
  },
  edxnotesDescription: {
    id: 'course-authoring.pages-and-resources.app.edxnotes.description',
    defaultMessage: 'Allow learners to highlight passages and make notes right in the course.',
  },
  wikiName: {
    id: 'course-authoring.pages-and-resources.app.wiki.name',
    defaultMessage: 'Wiki',
  },
  wikiDescription: {
    id: 'course-authoring.pages-and-resources.app.wiki.description',
    defaultMessage: 'Enable learners to access, and collaborate on course-related information.',
  },
});

export default appCardMessages;
