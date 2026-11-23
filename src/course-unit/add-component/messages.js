import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'course-authoring.course-unit.add.component.title',
    defaultMessage: 'Add a new component',
    description: 'Title text for add component section in course unit.',
  },
  buttonText: {
    id: 'course-authoring.course-unit.add.component.button.text',
    defaultMessage: 'Add Component:',
    description: 'Information text for screen-readers about each add component button',
  },
  modalBtnText: {
    id: 'course-authoring.course-unit.modal.button.text',
    defaultMessage: 'Select',
    description: 'Information text for screen-readers about each add component button',
  },
  singleComponentPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.single-title.text',
    defaultMessage: 'Select component',
    description: 'Library content picker modal title.',
  },
  multipleComponentPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.multiple-title.text',
    defaultMessage: 'Select components',
    description: 'Problem bank component picker modal title.',
  },
  multipleComponentPickerModalBtn: {
    id: 'course-authoring.course-unit.modal.multiple-btn.text',
    defaultMessage: 'Add selected components',
    description: 'Problem bank component add button text.',
  },
  videoPickerModalTitle: {
    id: 'course-authoring.course-unit.modal.video-title.text',
    defaultMessage: 'Select video',
    description: 'Video picker modal title.',
  },
  modalContainerTitle: {
    id: 'course-authoring.course-unit.modal.container.title',
    defaultMessage: 'Add {componentTitle} component',
    description: 'Modal title for adding components',
  },
  modalContainerCancelBtnText: {
    id: 'course-authoring.course-unit.modal.container.cancel.button.text',
    defaultMessage: 'Cancel',
    description: 'Modal cancel button text.',
  },
  modalComponentSupportLabelFullySupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.fully-supported',
    defaultMessage: 'Fully supported',
    description: 'Label for advance problem type\'s support status with full platform support',
  },
  modalComponentSupportLabelProvisionallySupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.provisionally-support',
    defaultMessage: 'Provisionally supported',
    description: 'Label for advance problem type\'s support status with provisional platform support',
  },
  modalComponentSupportLabelNotSupported: {
    id: 'course-authoring.course-unit.modal.component.support.label.not-supported',
    defaultMessage: 'Not supported',
    description: 'Label for advance problem type\'s support status with no platform support',
  },
  modalComponentSupportTooltipFullySupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.fully-supported',
    defaultMessage: 'Fully supported tools and features are available for Open edX installations, '
      + 'are fully tested, have user interfaces where applicable, and are documented in the '
      + 'official Open edX guides that are available on docs.openedx.org.',
    description: 'Message for support status tooltip for modules with full platform support',
  },
  modalComponentSupportTooltipNotSupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.not-supported',
    defaultMessage: 'Tools with no support are not maintained by the Open edX community, '
      + 'and might be deprecated in the future. They are not recommended for use in '
      + 'courses due to non-compliance with one or more of the base requirements, such as '
      + 'testing, accessibility, internationalization, and documentation.',
    description: 'Message for support status tooltip for modules which is not supported',
  },
  modalComponentSupportTooltipProvisionallySupported: {
    id: 'course-authoring.course-unit.modal.component.support.tooltip.provisionally-support',
    defaultMessage: 'Provisionally supported tools might lack the robustness of functionality '
      + 'that your courses require. Open edX does not have control over the quality of the software, '
      + 'or of the content that can be provided using these tools. Test these tools thoroughly '
      + 'before using them in your course, especially in graded sections. Complete documentation '
      + 'might not be available for provisionally supported tools, or documentation might be '
      + 'available from sources other than the Open edX community.',
    description: 'Message for support status tooltip for modules with provisional platform support',
  },
  templateAnnouncement: {
    id: 'course-authoring.course-unit.add.component.template.announcement',
    defaultMessage: 'Announcement',
    description: 'Name of a component template in the add component dialog',
  },
  templateAnonymousUserId: {
    id: 'course-authoring.course-unit.add.component.template.anonymous-user-id',
    defaultMessage: 'Anonymous User ID',
    description: 'Name of a component template in the add component dialog',
  },
  templateIframeTool: {
    id: 'course-authoring.course-unit.add.component.template.iframe-tool',
    defaultMessage: 'IFrame Tool',
    description: 'Name of a component template in the add component dialog',
  },
  templateRawHtml: {
    id: 'course-authoring.course-unit.add.component.template.raw-html',
    defaultMessage: 'Raw HTML',
    description: 'Name of a component template in the add component dialog',
  },
  templateZoomingImageTool: {
    id: 'course-authoring.course-unit.add.component.template.zooming-image-tool',
    defaultMessage: 'Zooming Image Tool',
    description: 'Name of a component template in the add component dialog',
  },
  templatePoll: {
    id: 'course-authoring.course-unit.add.component.template.poll',
    defaultMessage: 'Poll',
    description: 'Name of a component template in the add component dialog',
  },
  templateSurvey: {
    id: 'course-authoring.course-unit.add.component.template.survey',
    defaultMessage: 'Survey',
    description: 'Name of a component template in the add component dialog',
  },
  templateWordCloud: {
    id: 'course-authoring.course-unit.add.component.template.word-cloud',
    defaultMessage: 'Word cloud',
    description: 'Name of a component template in the add component dialog',
  },
  templateSelfAssessmentOnly: {
    id: 'course-authoring.course-unit.add.component.template.self-assessment-only',
    defaultMessage: 'Self Assessment Only',
    description: 'Name of a component template in the add component dialog',
  },
  templateStaffAssessmentOnly: {
    id: 'course-authoring.course-unit.add.component.template.staff-assessment-only',
    defaultMessage: 'Staff Assessment Only',
    description: 'Name of a component template in the add component dialog',
  },
  templateSelfToPeer: {
    id: 'course-authoring.course-unit.add.component.template.self-to-peer',
    defaultMessage: 'Self Assessment to Peer Assessment',
    description: 'Name of a component template in the add component dialog',
  },
  templateSelfToStaff: {
    id: 'course-authoring.course-unit.add.component.template.self-to-staff',
    defaultMessage: 'Self Assessment to Staff Assessment',
    description: 'Name of a component template in the add component dialog',
  },
});

export default messages;
