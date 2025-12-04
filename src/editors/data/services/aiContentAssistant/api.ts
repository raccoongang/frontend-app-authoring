import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export interface GenerateAIContentRequest {
  course_id: string;
  sequential_id: string;
  xblock_type: string;
  prompt: string;
  content: string;
}

export interface GenerateAIContentResponse {
  content: string;
}

/**
 * Generate AI content for xBlock
 * @param request - The request payload with course_id, sequential_id, xblock_type, prompt, and content
 * @returns Promise with the generated content
 */
export async function generateAIContent(
  request: GenerateAIContentRequest,
): Promise<GenerateAIContentResponse> {
  const lmsBaseUrl = getConfig().LMS_BASE_URL;
  const url = `${lmsBaseUrl}/oex_ai_content_assistant/api/ai-content/generate/`;
  
  const { data } = await getAuthenticatedHttpClient().post(url, request);
  return data;
}

