import { UPSTAGE_API_KEY, UPSTAGE_API_URL, UPSTAGE_MODEL } from './config';
import type { UpstageChatRequest, UpstageChatResponse } from './types';

export async function upstageChat(request: UpstageChatRequest): Promise<string> {
  if (!UPSTAGE_API_KEY) {
    throw new Error('Upstage API key is not configured');
  }

  const response = await fetch(UPSTAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${UPSTAGE_API_KEY}`,
    },
    body: JSON.stringify({
      model: UPSTAGE_MODEL,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2000,
      response_format: request.response_format ?? { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upstage API error: ${response.status} - ${errorText}`);
  }

  const data: UpstageChatResponse = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Upstage API');
  }

  return data.choices[0].message.content;
}
