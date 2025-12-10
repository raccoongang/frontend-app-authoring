# TextEditorPluginSlot

### Slot ID: `org.openedx.frontend.authoring.text_editor_plugin.v1`

### Slot ID Aliases
* `text_editor_plugin_slot`

### Plugin Props:

* `getCurrentContent` - Function. Returns the current content of the editor as a string.
* `updateContent` - Function. Updates the editor content with the provided string.
* `blockType` - String. The type of block being edited (e.g., 'html').

## Description

The slot is positioned in the Text Editor modal window for HTML xBlocks. It is suitable for adding AI-powered content generation tools or other editor enhancements.

By default, the slot contains the **AI Content Assistant** widget, which allows content creators to generate xBlock content using AI prompts.

## Example

The following example configuration shows how to replace the default AI Content Assistant with a custom implementation:

```jsx
import { DIRECT_PLUGIN, PLUGIN_OPERATIONS } from '@openedx/frontend-plugin-framework';
import { Card } from '@openedx/paragon';

const CustomAIAssistant = ({ getCurrentContent, updateContent, blockType }) => {
  // Your custom AI assistant implementation
  return (
    <Card>
      <Card.Body>
        Custom AI Assistant for {blockType}
      </Card.Body>
    </Card>
  );
};

const config = {
  pluginSlots: {
    'org.openedx.frontend.authoring.text_editor_plugin.v1': {
      keepDefault: false, // Set to true to keep default AI Assistant alongside your plugin
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'custom-text-editor-assistant',
            priority: 50,
            type: DIRECT_PLUGIN,
            RenderWidget: CustomAIAssistant,
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
    'org.openedx.frontend.authoring.text_editor_plugin.v1': {
      keepDefault: true, // Keep the default AI Assistant
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'additional-editor-tool',
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

