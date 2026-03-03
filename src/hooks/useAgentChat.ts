import { useState, useCallback, useRef } from 'react';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  agentId: string;
  streaming?: boolean;
}

interface AgentContext {
  projectId?: string | null;
  province?: string | null;
  phase?: number;
}

interface UseAgentChatOptions {
  agentId: string;
  context?: AgentContext;
  initialMessages?: ChatMessage[];
  fallbackFn?: (agentId: string, message: string) => string;
}

export function useAgentChat({ agentId, context, initialMessages, fallbackFn }: UseAgentChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim(), agentId };
    setMessages(prev => [...prev, userMsg]);

    // Build conversation history for API
    const history = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.text }));

    // Get API key from localStorage settings
    let storedApiKey = '';
    try {
      const settings = localStorage.getItem('visiogold-settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        storedApiKey = parsed.anthropicApiKey || '';
      }
    } catch {}

    setIsStreaming(true);

    // Add placeholder streaming message
    const streamingMsg: ChatMessage = { role: 'assistant', text: '', agentId, streaming: true };
    setMessages(prev => [...prev, streamingMsg]);

    // If no API key and we have a fallback, use it immediately (no network round-trip)
    const hasEnvKey = true; // Server may have ANTHROPIC_API_KEY; try API first
    if (!storedApiKey && !hasEnvKey && fallbackFn) {
      const fallbackResponse = fallbackFn(agentId, text.trim());
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].streaming) {
          updated[lastIdx] = { role: 'assistant', text: fallbackResponse, agentId, streaming: false };
        }
        return updated;
      });
      setIsStreaming(false);
      return;
    }

    try {
      abortRef.current = new AbortController();

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedApiKey) headers['x-anthropic-key'] = storedApiKey;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          agentId,
          message: text.trim(),
          context,
          history,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);

          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              fullText += parsed.text;
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (lastIdx >= 0 && updated[lastIdx].streaming) {
                  updated[lastIdx] = { ...updated[lastIdx], text: fullText };
                }
                return updated;
              });
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'Unknown error') {
              // Skip parse errors from partial chunks
            }
          }
        }
      }

      // Finalize the message (remove streaming flag)
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].streaming) {
          updated[lastIdx] = { ...updated[lastIdx], text: fullText || 'No response received.', streaming: false };
        }
        return updated;
      });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;

      // Fall back to keyword matching if API fails
      if (fallbackFn) {
        const fallbackResponse = fallbackFn(agentId, text.trim());
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].streaming) {
            updated[lastIdx] = { role: 'assistant', text: fallbackResponse, agentId, streaming: false };
          }
          return updated;
        });
      } else {
        const errorText = (err as Error).message || 'Failed to get AI response. Check your API key in Settings.';
        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].streaming) {
            updated[lastIdx] = { role: 'assistant', text: `⚠ ${errorText}`, agentId, streaming: false };
          }
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [agentId, context, messages, isStreaming, fallbackFn]);

  const addSystemMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { role: 'assistant', text, agentId }]);
  }, [agentId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  return { messages, setMessages, isStreaming, sendMessage, addSystemMessage, clearMessages, stopStreaming };
}
