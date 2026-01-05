import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor } from '@tinymce/tinymce-react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { COLOR_MAP, DEFAULT_TEXT_COLOR } from '../constants';

const TextBlock = ({
  isEditing,
  block,
  updateBlock,
  setActiveBlockId,
  setIsEditing,
}) => {
  const intl = useIntl();

  const handleContentChange = useCallback((id, newContent) => {
    updateBlock(id, { content: newContent });
  }, [updateBlock]);

  const handleBlockEditorBlur = (event) => {
    const related = event.relatedTarget;
    if (
      related
      && (related.closest?.('.tox-toolbar, .tox-menu')
        || related.classList?.contains('tox-tbtn'))
    ) {
      return;
    }
    setIsEditing(false);
  };

  const handleBlockEditorFocus = (blockId) => {
    setActiveBlockId(blockId);
    setIsEditing(true);
  };

  return (
    <div className={classNames('text-block w-100 h-100 position-relative overflow-hidden', { editing: isEditing })}>
      <div className="tiny-wrapper w-100 h-100 position-relative" data-text-type={block.typeCls || 'textNormal'}>
        <Editor
          id={`editor-${block.id}`}
          inline
          value={block.content}
          onEditorChange={(newContent) => handleContentChange(block.id, newContent)}
          onFocus={() => handleBlockEditorFocus(block.id)}
          onBlur={handleBlockEditorBlur}
          init={{
            menubar: false,
            license_key: 'gpl',
            plugins: 'lists textcolor',
            toolbar:
                'bold italic underline forecolor | alignleft aligncenter alignright | bullist numlist | removeformat',
            toolbar_mode: 'wrap',
            forced_root_block: 'p',
            color_map: COLOR_MAP.map((item, index) => {
              if (index % 2 === 1) {
                return intl.formatMessage(item);
              }
              return item;
            }),
            color_default_foreground: DEFAULT_TEXT_COLOR,
            custom_colors: false,
            formats: {
              forecolor: {
                selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table',
                styles: { color: '%value' },
                inline: 'span',
                remove_similar: true,
                clear_child_styles: true,
                preserve_attributes: ['style'],
              },
            },
            inline_boundaries: true,
            skin: false,
            content_css: false,
            body_class: 'tiny-body',
            fixed_toolbar_container: '#editor-toolbar-container',
            contextmenu: false,
            branding: false,
          }}
        />
      </div>
    </div>
  );
};

TextBlock.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  block: PropTypes.any,
  updateBlock: PropTypes.func.isRequired,
  setActiveBlockId: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

export default TextBlock;
