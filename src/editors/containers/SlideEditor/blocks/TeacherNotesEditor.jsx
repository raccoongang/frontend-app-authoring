import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { COLOR_MAP, DEFAULT_TEXT_COLOR } from '../constants';

const TeacherNotesEditor = ({ value, onChange }) => {
  const intl = useIntl();

  const colorMap = useMemo(() => (
    COLOR_MAP.map((item, index) => (index % 2 === 1 ? intl.formatMessage(item) : item))
  ), [intl]);

  const handleChange = useCallback((content) => {
    onChange(content);
  }, [onChange]);

  // const isTinyEmpty = (html = '') => /^(\s*<p>(<br[^>]*>|&nbsp;|\s)*<\/p>\s*)$/i.test(html);
  // const normalizedValue = isTinyEmpty(value) ? '' : value;

  // console.log('aaaaaaaa', JSON.stringify(normalizedValue));

  return (
    <Editor
      value={value}
      onEditorChange={handleChange}
      init={{
        menubar: false,
        license_key: 'gpl',
        plugins: 'lists textcolor link',
        toolbar: 'bold italic underline link forecolor | alignleft aligncenter alignright | bullist numlist | removeformat',
        toolbar_mode: 'wrap',
        forced_root_block: 'p',
        placeholder: 'Test',
        color_map: colorMap,
        color_default_foreground: DEFAULT_TEXT_COLOR,
        custom_colors: false,
        skin: false,
        content_css: false,
        body_class: 'tiny-body',
        fixed_toolbar_container: '#notes-toolbar-container',
        contextmenu: false,
        branding: false,
        content_style: 'body.tiny-body {font-family: Outfit, "Helvetica Neue", Helvetica, Arial, sans-serif;}',
        // setup: (editor) => {
        //   editor.on('OpenWindow', () => {
        //     // TinyMCE dialogs live here
        //     const aux = document.querySelector('.tox-tinymce-aux');
        //     if (!aux) { return; }

        //     const stop = (e) => {
        //       e.stopPropagation();
        //     };
        //     aux.addEventListener('mousedown', stop);
        //   });
        // },
      }}
    />
  );
};

TeacherNotesEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TeacherNotesEditor.defaultProps = {
  value: '',
};

export default TeacherNotesEditor;
