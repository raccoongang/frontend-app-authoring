import { PluginSlot } from '@openedx/frontend-plugin-framework/dist';
import React from 'react';
import AIAssistantWidget from '../../editors/sharedComponents/AIAssistantWidget';


interface ProblemEditorPluginSlotProps {
  /** Function to get current editor content */
  getCurrentContent: () => string;
  /** Function to update editor content with new content */
  updateContent: (content: string) => void;
  /** Block type (e.g., 'problem-single-select', 'problem-multi-select') */
  blockType: string | null;
}

/**
 * Plugin slot for Problem Editor
 * 
 * Slot ID: `org.openedx.frontend.authoring.problem_editor_plugin.v1`
 * 
 * This slot allows plugins to extend or replace the AI Content Assistant widget
 * in the problem editor. By default, it includes the AIAssistantWidget.
 * 
 * Plugin Props:
 * - `getCurrentContent`: Function to get current editor content
 * - `updateContent`: Function to update editor content with new content
 * - `blockType`: Block type (e.g., 'problem-single-select', 'problem-multi-select')
 */
export const ProblemEditorPluginSlot: React.FC<ProblemEditorPluginSlotProps> = ({
  getCurrentContent,
  updateContent,
  blockType,
}) => (
  <PluginSlot
    id="org.openedx.frontend.authoring.problem_editor_plugin.v1"
    idAliases={['problem_editor_plugin_slot']}
    pluginProps={{
      getCurrentContent,
      updateContent,
      blockType,
    }}
  >
    <AIAssistantWidget
      getCurrentContent={getCurrentContent}
      updateContent={updateContent}
      blockType={blockType}
    />
  </PluginSlot>
);

