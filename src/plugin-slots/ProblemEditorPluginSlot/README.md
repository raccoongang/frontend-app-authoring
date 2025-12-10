# ProblemEditorPluginSlot

### Slot ID: `org.openedx.frontend.authoring.problem_editor_plugin.v1`

### Slot ID Aliases
* `problem_editor_plugin_slot`

### Plugin Props:

* `getCurrentContent` - Function. Returns the current content of the editor as a string (OLX format for visual editor, raw content for advanced editor).
* `updateContent` - Function. Updates the editor content with the provided string. For visual editors, this should parse the OLX and update the problem state. For advanced editors, this updates the raw editor content.
* `blockType` - String. The type of problem block being edited (e.g., 'problem-single-select', 'problem-multi-select', 'problem', 'advanced').

## Description

The slot is positioned in the Problem Editor modal window for all problem xBlock types (single-select, multi-select, dropdown, numerical-input, text-input, and advanced). It is suitable for adding AI-powered content generation tools or other editor enhancements.

By default, the slot contains the **AI Content Assistant** widget, which allows content creators to generate problem xBlock content using AI prompts.

The slot is available in both:
- **Visual Editor Mode**: Where the widget can generate OLX content that is parsed and loaded into the visual editor components.
- **Advanced/Raw Editor Mode**: Where the widget can generate raw OLX or Markdown content that is directly inserted into the CodeMirror editor.

## Example

The following example configuration shows how to replace the default AI Content Assistant with a custom implementation:

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { Card } from '@openedx/paragon';

const CustomProblemAssistant = ({ getCurrentContent, updateContent, blockType }) => {
  // Your custom AI assistant implementation
  // getCurrentContent() returns the current OLX or raw content
  // updateContent(newContent) updates the editor with new content
  return (
    <Card>
      <Card.Body>
        Custom Problem Assistant for {blockType}
      </Card.Body>
    </Card>
  );
};

const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.problem_editor_plugin.v1': {
      keepDefault: false, // Set to true to keep default AI Assistant alongside your plugin
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom-problem-editor-assistant',
            priority: 50,
            type: DIRECT_PLUGIN,
            RenderWidget: CustomProblemAssistant,
          },
        },
      ]
    }
  },
}

export default config;
```

## Extending the Default AI Assistant

To add additional functionality alongside the default AI Content Assistant:

```jsx
const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.problem_editor_plugin.v1': {
      keepDefault: true, // Keep the default AI Assistant
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'additional-problem-tool',
            priority: 60,
            type: DIRECT_PLUGIN,
            RenderWidget: AdditionalTool,
          },
        },
      ]
    }
  },
}
```

## Notes

- The `updateContent` function behavior differs between visual and advanced editor modes:
  - **Visual Editor**: The function should parse the OLX content and update the entire problem state using Redux actions.
  - **Advanced Editor**: The function should directly update the CodeMirror editor content.
- The `blockType` prop may be in different formats:
  - API format: `problem-single-select`, `problem-multi-select`, etc.
  - OLX format: `multiplechoiceresponse`, `choiceresponse`, etc.
  - Generic: `problem`, `advanced`

