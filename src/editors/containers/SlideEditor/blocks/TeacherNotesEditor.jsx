import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { 
  ModalDialog, 
  ActionRow, 
  Button, 
  Form, 
  useToggle 
} from '@openedx/paragon';
import { COLOR_MAP, DEFAULT_TEXT_COLOR } from '../constants';

const TeacherNotesEditor = ({ value, onChange }) => {
  const intl = useIntl();
  const [isLinkModalOpen, openLinkModal, closeLinkModal] = useToggle(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [editorRef, setEditorRef] = useState(null);

  const colorMap = useMemo(() => (
    COLOR_MAP.map((item, index) => (index % 2 === 1 ? intl.formatMessage(item) : item))
  ), [intl]);

  const handleChange = useCallback((content) => {
    onChange(content);
  }, [onChange]);

  const handleInsertLink = useCallback(() => {
    if (editorRef && linkUrl.trim()) {
      const text = selectedText || linkUrl;
      editorRef.insertContent(`<a href="${linkUrl}" target="_blank">${text}</a>`);
      setLinkUrl('');
      setSelectedText('');
      closeLinkModal();
    }
  }, [editorRef, linkUrl, selectedText, closeLinkModal]);

  return (
    <>
      <Editor
        value={value}
        onEditorChange={handleChange}
        init={{
          menubar: false,
          license_key: 'gpl',
          plugins: 'lists textcolor',
          toolbar: 'bold italic underline customLink forecolor | alignleft aligncenter alignright | bullist numlist | removeformat',
          toolbar_mode: 'wrap',
          forced_root_block: 'p',
          color_map: colorMap,
          color_default_foreground: DEFAULT_TEXT_COLOR,
          custom_colors: false,
          skin: false,
          content_css: false,
          body_class: 'tiny-body',
          fixed_toolbar_container: '#notes-toolbar-container',
          contextmenu: false,
          branding: false,
          content_style: `
            body.tiny-body {font-family: Outfit, "Helvetica Neue", Helvetica, Arial, sans-serif;}
            body.placeholder-visible::before {
              content: attr(data-placeholder);
              color: #999;
              font-style: italic;
              pointer-events: none;
              position: absolute;
              top: 0;
              left: 0;
            }
            body.placeholder-visible {
              position: relative;
            }
          `,
          setup: (editor) => {
            setEditorRef(editor);
            
            const updatePlaceholder = () => {
              const body = editor.getBody();
              const isEmpty = !editor.getContent({ format: 'text' }).trim();
              
              if (isEmpty) {
                body.setAttribute('data-placeholder', 'HELLO WORLD');
                body.classList.add('placeholder-visible');
              } else {
                body.removeAttribute('data-placeholder');
                body.classList.remove('placeholder-visible');
              }
            };
            
            editor.on('init keyup paste input focus blur', updatePlaceholder);

            editor.ui.registry.addButton('customlink', {
              text: '🔗',
              tooltip: 'Add Link',
              onAction: () => {
                const selection = editor.selection.getContent();
                setSelectedText(selection);
                setLinkUrl('https://');
                openLinkModal();
              }
            });
          },
        }}
      />

      <ModalDialog
        title="Add Link"
        isOpen={isLinkModalOpen}
        onClose={closeLinkModal}
        size="md"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            Add Link
          </ModalDialog.Title>
        </ModalDialog.Header>
        
        <ModalDialog.Body>
          <Form.Group>
            <Form.Label>Link URL</Form.Label>
            <Form.Control
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </Form.Group>
          {selectedText && (
            <Form.Group>
              <Form.Label>Link Text</Form.Label>
              <Form.Control
                type="text"
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Text to display"
              />
            </Form.Group>
          )}
        </ModalDialog.Body>
        
        <ModalDialog.Footer>
          <ActionRow>
            <ModalDialog.CloseButton variant="tertiary">
              Cancel
            </ModalDialog.CloseButton>
            <Button 
              variant="primary" 
              onClick={handleInsertLink}
              disabled={!linkUrl.trim()}
            >
              Add Link
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
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
