import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.studio-home.heading.title',
    defaultMessage: '{studioShortName} home',
  },
  addNewCourseBtnText: {
    id: 'course-authoring.studio-home.add-new-course.btn.text',
    defaultMessage: 'New course',
  },
  addNewLibraryBtnText: {
    id: 'course-authoring.studio-home.add-new-library.btn.text',
    defaultMessage: 'New library',
  },
  homePageLoadFailedMessage: {
    id: 'course-authoring.studio-home.page-load.failed.message',
    defaultMessage: 'Failed to load Studio home. Please try again later.',
  },
  emailStaffBtnText: {
    id: 'course-authoring.studio-home.email-staff.btn.text',
    defaultMessage: 'Email staff to create course',
  },
  defaultSection_1_Title: {
    id: 'course-authoring.studio-home.default-section-1.title',
    defaultMessage: 'Are you staff on an existing {studioShortName} course?',
  },
  defaultSection_1_Description: {
    id: 'course-authoring.studio-home.default-section-1.description',
    defaultMessage: 'The course creator must give you access to the course. Contact the course creator or administrator for the course you are helping to author.',
  },
  defaultSection_2_Title: {
    id: 'course-authoring.studio-home.default-section-2.title',
    defaultMessage: 'Create your first course',
  },
  defaultSection_2_Description: {
    id: 'course-authoring.studio-home.default-section-2.description',
    defaultMessage: 'Your new course is just a click away!',
  },
  btnAddNewCourseText: {
    id: 'course-authoring.studio-home.btn.add-new-course.text',
    defaultMessage: 'Create your first course',
  },
  btnReRunText: {
    id: 'course-authoring.studio-home.btn.re-run.text',
    defaultMessage: 'Re-run course',
  },
  viewLiveBtnText: {
    id: 'course-authoring.studio-home.btn.view-live.text',
    defaultMessage: 'View live',
  },
  organizationTitle: {
    id: 'course-authoring.studio-home.organization.title',
    defaultMessage: 'Organization and library settings',
  },
  organizationLabel: {
    id: 'course-authoring.studio-home.organization.label',
    defaultMessage: 'Show all courses in organization:',
  },
  organizationSubmitBtnText: {
    id: 'course-authoring.studio-home.organization.btn.submit.text',
    defaultMessage: 'Submit',
  },
  organizationInputPlaceholder: {
    id: 'course-authoring.studio-home.organization.input.placeholder',
    defaultMessage: 'For example, MITx',
  },
  organizationInputNoOptions: {
    id: 'course-authoring.studio-home.organization.input.no-options',
    defaultMessage: 'No options',
  },
  filterMenuToggleAlt: {
    id: 'course-authoring.studio-home.courses.filter-menu.toggle-alt',
    defaultMessage: 'Show the filter options',
    description: 'Accessible name of the button that opens a course filter or sort menu on Studio home',
  },
  searchPlaceholder: {
    id: 'course-authoring.studio-home.courses.search.placeholder',
    defaultMessage: 'Search',
    description: 'Placeholder of the course search field on Studio home',
  },
  searchLabel: {
    id: 'course-authoring.studio-home.courses.search.label',
    defaultMessage: 'search',
    description: 'Screen reader label of the course search field',
  },
  searchClearButton: {
    id: 'course-authoring.studio-home.courses.search.clear',
    defaultMessage: 'clear search',
    description: 'Screen reader label of the button that clears the course search field',
  },
  searchSubmitButton: {
    id: 'course-authoring.studio-home.courses.search.submit',
    defaultMessage: 'submit search',
    description: 'Screen reader label of the button that submits the course search',
  },
  paginationLabel: {
    id: 'course-authoring.studio-home.courses.pagination.label',
    defaultMessage: 'pagination navigation',
    description: 'Accessible name of the course list pagination',
  },
  paginationPrevious: {
    id: 'course-authoring.studio-home.courses.pagination.previous',
    defaultMessage: 'Previous',
    description: 'Previous page button of the course list pagination',
  },
  paginationNext: {
    id: 'course-authoring.studio-home.courses.pagination.next',
    defaultMessage: 'Next',
    description: 'Next page button of the course list pagination',
  },
  paginationPage: {
    id: 'course-authoring.studio-home.courses.pagination.page',
    defaultMessage: 'Page',
    description: 'The word "Page" in the accessible name of a page button',
  },
  paginationCurrentPage: {
    id: 'course-authoring.studio-home.courses.pagination.current-page',
    defaultMessage: 'Current Page',
    description: 'Accessible suffix of the page button that is currently shown',
  },
  paginationPageOfCount: {
    id: 'course-authoring.studio-home.courses.pagination.page-of-count',
    defaultMessage: 'of',
    description: 'The word "of" in "Page 1, Current Page, of 3"',
  },
});

export default messages;
