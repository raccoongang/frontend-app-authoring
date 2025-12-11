import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Card,
  FormControl,
  Spinner,
  Toast,
} from '@openedx/paragon';
import { Send } from '@openedx/paragon/icons';
import { selectors } from '../../data/redux';
import { generateAIContent } from '../../data/services/aiContentAssistant/api';
import { setAssetToStaticUrl } from '../TinyMceWidget/hooks';
import './index.scss';

// Type declarations for TinyMCE
declare global {
  interface Window {
    tinymce?: {
      editors?: Record<string, {
        id?: string;
        getContent?: (options?: { format?: string }) => string;
        [key: string]: any;
      }>;
      [key: string]: any;
    };
  }
}

// Import problem editor utilities for direct content access
// Using try-catch to handle potential circular dependencies gracefully
let ReactStateOLXParser: any = null;
let ReactStateSettingsParser: any = null;
let fetchEditorContent: any = null;
let parseState: any = null;

try {
  // Try to import synchronously - if there's a circular dependency, we'll handle it gracefully
  const ReactStateOLXParserModule = require('../../containers/ProblemEditor/data/ReactStateOLXParser');
  ReactStateOLXParser = ReactStateOLXParserModule.default || ReactStateOLXParserModule;
  const ReactStateSettingsParserModule = require('../../containers/ProblemEditor/data/ReactStateSettingsParser');
  ReactStateSettingsParser = ReactStateSettingsParserModule.default || ReactStateSettingsParserModule;
  const hooksModule = require('../../containers/ProblemEditor/components/EditProblemView/hooks');
  fetchEditorContent = hooksModule.fetchEditorContent;
  parseState = hooksModule.parseState;
} catch (error) {
  // If imports fail (e.g., circular dependency), we'll use alternative methods
  console.warn('AIAssistantWidget: Could not import problem editor utilities, will use alternative methods:', error);
}

interface AIAssistantWidgetProps {
  /** Function to update editor content with new content */
  updateContent: (content: string) => void;
  /** Block type (e.g., 'html', 'problem-single-select') */
  blockType: string | null;
}

/**
 * AI Assistant Widget for generating xBlock content using AI
 */
const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  updateContent,
  blockType,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get editor state from Redux
  const learningContextId = useSelector(selectors.app.learningContextId);
  const unitUrl = useSelector(selectors.app.unitUrl);
  const blockId = useSelector(selectors.app.blockId);
  const blockValue = useSelector(selectors.app.blockValue);
  const problemState = useSelector(selectors.problem.completeState);
  const showRawEditor = useSelector(selectors.app.showRawEditor);
  const isMarkdownEditorEnabled = useSelector(selectors.problem.isMarkdownEditorEnabled);
  const lmsEndpointUrl = useSelector(selectors.app.lmsEndpointUrl);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Apply styles to parent container to prevent horizontal scrolling
  // This encapsulates all layout fixes within the widget
  useEffect(() => {
    // Find the parent .editProblemView container (for ProblemEditor)
    const parentContainer = document.querySelector('.editProblemView');
    if (!parentContainer) {
      return;
    }

    // Apply styles to prevent horizontal overflow
    const originalStyles = {
      overflowX: (parentContainer as HTMLElement).style.overflowX,
      maxWidth: (parentContainer as HTMLElement).style.maxWidth,
      minWidth: (parentContainer as HTMLElement).style.minWidth,
      width: (parentContainer as HTMLElement).style.width,
    };

    (parentContainer as HTMLElement).style.overflowX = 'hidden';
    (parentContainer as HTMLElement).style.maxWidth = '100%';
    (parentContainer as HTMLElement).style.minWidth = '0';
    (parentContainer as HTMLElement).style.width = '100%';

    // Apply styles to child spans
    const childSpans = parentContainer.querySelectorAll('.editProblemView > span');
    childSpans.forEach((span) => {
      const spanEl = span as HTMLElement;
      spanEl.style.minWidth = '0';
      spanEl.style.maxWidth = '100%';
      spanEl.style.overflowX = 'hidden';
    });

    // Apply styles to settings column
    const settingsColumn = parentContainer.querySelector('.editProblemView-settingsColumn');
    if (settingsColumn) {
      (settingsColumn as HTMLElement).style.minWidth = '0';
    }

    // Apply styles to advanced editor container
    const advancedEditor = parentContainer.querySelector('.advancedEditorTopMargin');
    if (advancedEditor) {
      (advancedEditor as HTMLElement).style.overflowX = 'hidden';
      (advancedEditor as HTMLElement).style.maxWidth = '100%';
      (advancedEditor as HTMLElement).style.width = '100%';
    }

    // Cleanup: restore original styles when component unmounts
    return () => {
      (parentContainer as HTMLElement).style.overflowX = originalStyles.overflowX || '';
      (parentContainer as HTMLElement).style.maxWidth = originalStyles.maxWidth || '';
      (parentContainer as HTMLElement).style.minWidth = originalStyles.minWidth || '';
      (parentContainer as HTMLElement).style.width = originalStyles.width || '';
    };
  }, []);

  /**
   * Extract sequential_id from unitUrl ancestors
   */
  const getSequentialId = (): string | null => {
    if (!unitUrl?.data?.ancestors) {
      return null;
    }
    // Find the ancestor with category 'sequential' (subsection)
    const sequential = unitUrl.data.ancestors.find(
      (ancestor: { category: string }) => ancestor.category === 'sequential',
    );
    return sequential?.id || null;
  };

  /**
   * Map blockType to xblock_type for API
   * For problem types, we need to map to the specific problem type
   */
  const getXBlockType = (): string | null => {
    if (!blockType) return null;
    
    // Map problem types to API format
    // The blockType can be:
    // - 'html' for HTML blocks
    // - Problem type keys like 'multiplechoiceresponse', 'choiceresponse', etc.
    // - API format like 'problem-single-select'
    const problemTypeMap: Record<string, string> = {
      // Open edX problem type keys to API format
      'multiplechoiceresponse': 'problem-single-select',
      'choiceresponse': 'problem-multi-select',
      'optionresponse': 'problem-dropdown',
      'numericalresponse': 'problem-numerical-input',
      'stringresponse': 'problem-text-input',
      // Common aliases
      'problem': 'problem-single-select',
      'single-select': 'problem-single-select',
      'multiple-choice': 'problem-single-select',
      'checkbox': 'problem-multi-select',
      'multi-select': 'problem-multi-select',
      'dropdown': 'problem-dropdown',
      'numeric': 'problem-numerical-input',
      'text-input': 'problem-text-input',
      'string': 'problem-text-input',
      // Advanced problem type
      'advanced': 'problem-single-select', // Default to single-select for advanced
    };
    
    // If it's already in the correct format (starts with 'problem-'), use it
    if (blockType.startsWith('problem-')) {
      return blockType;
    }
    
    // Map known problem types
    if (problemTypeMap[blockType]) {
      return problemTypeMap[blockType];
    }
    
    // For html, return as-is
    if (blockType === 'html') {
      return blockType;
    }
    
    // For unknown types, try to construct the API format
    // This handles cases where blockType might be something like 'single-select'
    return `problem-${blockType}`;
  };

  /**
   * Directly get content from editors - same methods as save functionality
   * This bypasses the getCurrentContent function prop which may return empty
   */
  const getContentDirectly = (): string => {
    // For HTML editor
    if (blockType === 'html') {
      try {
        // Method 1: Access TinyMCE directly via window.tinymce.editors
        if (window.tinymce?.editors && !showRawEditor) {
          // Find the text editor (not problem editors)
          const editors = window.tinymce.editors;
          for (const editor of Object.values(editors)) {
            if (editor && typeof (editor as any).getContent === 'function') {
              const editorId = (editor as any).id || '';
              // Text editors don't have problem editor prefixes
              const isProblemEditor = editorId.startsWith('answer') || 
                                       editorId.startsWith('hint') || 
                                       editorId.startsWith('selected') || 
                                       editorId.startsWith('unselected') ||
                                       editorId.startsWith('group') ||
                                       editorId === 'question' ||
                                       editorId === 'explanation';
              
              if (!isProblemEditor) {
                const content = (editor as any).getContent();
                if (content && typeof content === 'string' && content.trim().length > 0) {
                  // Apply same transformation as save (setAssetToStaticUrl)
                  return setAssetToStaticUrl({ editorValue: content, lmsEndpointUrl: lmsEndpointUrl || '' }) || content;
                }
              }
            }
          }
        }

        // Method 2: Try to get content from TinyMCE iframe body directly
        if (!showRawEditor) {
          const iframes = document.querySelectorAll('iframe[title="Rich Text Area"]');
          for (const iframe of iframes) {
            try {
              const iframeDoc = (iframe as HTMLIFrameElement).contentDocument || 
                                (iframe as HTMLIFrameElement).contentWindow?.document;
              if (iframeDoc) {
                const body = iframeDoc.body;
                if (body) {
                  const content = body.innerHTML;
                  if (content && typeof content === 'string' && content.trim().length > 0) {
                    return setAssetToStaticUrl({ editorValue: content, lmsEndpointUrl: lmsEndpointUrl || '' }) || content;
                  }
                }
              }
            } catch (e) {
              // Cross-origin or other iframe access issues - skip
              continue;
            }
          }
        }

        // Method 3: Try CodeMirror (raw editor)
        if (showRawEditor) {
          // Find CodeMirror editor in DOM
          const codeMirrorElements = document.querySelectorAll('.CodeMirror');
          for (const cmEl of codeMirrorElements) {
            const cm = (cmEl as any).CodeMirror;
            if (cm && cm.getValue) {
              const content = cm.getValue();
              if (content && typeof content === 'string' && content.trim().length > 0) {
                return setAssetToStaticUrl({ editorValue: content, lmsEndpointUrl: lmsEndpointUrl || '' }) || content;
              }
            }
          }
        }

        // Method 4: Fallback to Redux state (initial content)
        if (blockValue?.data?.data) {
          const initialContent = blockValue.data.data;
          return typeof initialContent === 'string' ? initialContent : '';
        }
      } catch (error) {
        console.warn('AIAssistantWidget: Error getting HTML content directly:', error);
      }
    }

    // For Problem editor
    if (blockType && blockType !== 'html') {
      try {
        // Method 1: Use fetchEditorContent and ReactStateOLXParser (same as save functionality)
        if (fetchEditorContent && ReactStateOLXParser && problemState) {
          try {
            const editorObject = fetchEditorContent({ format: '' });
            const reactOLXParser = new ReactStateOLXParser({ problem: problemState, editorObject });
            const olx = reactOLXParser.buildOLX();
            if (olx && typeof olx === 'string' && olx.trim().length > 0) {
              return setAssetToStaticUrl({ editorValue: olx, lmsEndpointUrl: lmsEndpointUrl || '' }) || olx;
            }
          } catch (parseError) {
            console.warn('AIAssistantWidget: Error parsing problem state:', parseError);
          }
        }

        // Method 2: Direct access to TinyMCE editors for problem (same as fetchEditorContent does)
        if (window.tinymce?.editors) {
          try {
            const editorObject: any = { hints: [] };
            const EditorsArray = window.tinymce.editors;
            Object.entries(EditorsArray).forEach(([id, editor]: [string, any]) => {
              if (Number.isNaN(parseInt(id, 10)) && editor && typeof editor.getContent === 'function') {
                if (id.startsWith('answer')) {
                  const answerId = id.substring(id.indexOf('-') + 1);
                  editorObject.answers = { ...(editorObject.answers || {}), [answerId]: editor.getContent({ format: '' }) };
                } else if (id === 'question') {
                  editorObject.question = editor.getContent({ format: '' });
                } else if (id.startsWith('hint')) {
                  editorObject.hints = [...(editorObject.hints || []), editor.getContent()];
                }
              }
            });
            
            // If we have question content, try to build OLX
            if (editorObject.question && ReactStateOLXParser && problemState) {
              try {
                const reactOLXParser = new ReactStateOLXParser({ problem: problemState, editorObject });
                const olx = reactOLXParser.buildOLX();
                if (olx && typeof olx === 'string' && olx.trim().length > 0) {
                  return setAssetToStaticUrl({ editorValue: olx, lmsEndpointUrl: lmsEndpointUrl || '' }) || olx;
                }
              } catch (parseError) {
                console.warn('AIAssistantWidget: Error building OLX from editor object:', parseError);
              }
            }
          } catch (editorError) {
            console.warn('AIAssistantWidget: Error accessing TinyMCE editors:', editorError);
          }
        }

        // Method 3: Fallback to rawOLX from Redux state
        if (problemState?.rawOLX && typeof problemState.rawOLX === 'string') {
          return problemState.rawOLX;
        }
      } catch (error) {
        console.warn('AIAssistantWidget: Error getting problem content directly:', error);
      }
    }

    return '';
  };

  /**
   * Handle sending prompt to AI API
   */
  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    const sequentialId = getSequentialId();
    if (!sequentialId || !learningContextId) {
      setError('Unable to get course information. Please ensure you are editing a course xBlock.');
      return;
    }

    const xblockType = getXBlockType();
    if (!xblockType) {
      setError('Unable to determine xBlock type.');
      return;
    }

    // Get content directly using the same methods as save functionality
    const currentContent = getContentDirectly();

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateAIContent({
        course_id: learningContextId,
        sequential_id: sequentialId,
        xblock_type: xblockType,
        prompt,
        content: currentContent,
      });

      // Add assistant response to chat
      setMessages((prev) => [
        ...prev,
        { role: 'assistant' as const, content: response.content },
      ]);

      // Update editor content with generated content
      updateContent(response.content);

      // Reset horizontal scroll position after content update
      // This prevents the modal from scrolling horizontally
      setTimeout(() => {
        const modalBody = document.querySelector('.pgn__modal-body');
        if (modalBody) {
          modalBody.scrollLeft = 0;
        }
        window.scrollTo({ left: 0, behavior: 'auto' });
      }, 0);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to generate content. Please try again.';
      setError(errorMessage);
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press (Shift+Enter for new line, Enter to send)
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!blockType || !learningContextId) {
    return null;
  }

  // Only show for supported block types
  // Support both API format (problem-single-select) and OLX format (multiplechoiceresponse)
  const supportedTypes = [
    'html', 
    'problem', 
    'problem-single-select', 
    'problem-multi-select', 
    'problem-dropdown', 
    'problem-numerical-input', 
    'problem-text-input',
    // OLX problem type keys (from ProblemTypeKeys)
    'multiplechoiceresponse',  // single-select
    'choiceresponse',          // multi-select
    'optionresponse',          // dropdown
    'numericalresponse',       // numerical-input
    'stringresponse',          // text-input
    'advanced',
  ];
  
  // Check if blockType is supported
  const isSupported = supportedTypes.includes(blockType) || blockType.startsWith('problem-');
  
  if (!isSupported) {
    return null;
  }

  return (
    <div className="ai-assistant-widget">
      <Card className="mb-3">
        <div
          className="d-flex justify-content-between align-items-center p-3"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
        >
          <h5 className="mb-0">AI Content Assistant</h5>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="btn btn-link p-0 border-0 ai-toggle-button"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
            aria-expanded={isOpen}
          >
            <span className={`ai-toggle-icon ${isOpen ? 'ai-toggle-icon-open' : ''}`}>
              ▼
            </span>
          </button>
        </div>
        {isOpen && (
          <div className="p-3">
            {error && (
              <Toast show onClose={() => setError(null)} className="mb-3">
                {error}
              </Toast>
            )}

            {/* Chat messages */}
            {messages.length > 0 && (
              <div className="ai-chat-messages mb-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`ai-message ai-message-${msg.role} mb-2`}
                  >
                    <div className="ai-message-role">
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                    {msg.role === 'assistant' ? (
                      <div className="ai-message-content">
                        <pre className="mb-0">{msg.content.substring(0, 200)}...</pre>
                        <small className="text-muted">Content has been applied to the editor</small>
                      </div>
                    ) : (
                      <div className="ai-message-content">{msg.content}</div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input area */}
            <div className="d-flex gap-2">
              <FormControl
                as="textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your prompt for AI content generation..."
                disabled={isLoading}
                rows={3}
                className="flex-grow-1"
              />
              <Button
                onClick={handleSend}
                disabled={!prompt.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  'Send'
                )}
              </Button>
            </div>
            <small className="text-muted d-block mt-2">
              Press Enter to send, Shift+Enter for new line
            </small>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AIAssistantWidget;
