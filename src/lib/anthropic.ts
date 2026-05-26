// Browser-direct Anthropic Messages API streaming client.
// User's own key in their browser → Anthropic API. No central server.
// Per principle: bring-your-own-key + AI as calculator.

import type { Model } from "./storage";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export interface StreamOptions {
  apiKey: string;
  model: Model;
  system: string;
  userMessage: string;
  onText: (chunk: string) => void;
  onError: (err: string) => void;
  onDone: () => void;
  abortSignal?: AbortSignal;
}

export async function streamMessage(opts: StreamOptions): Promise<void> {
  const {
    apiKey,
    model,
    system,
    userMessage,
    onText,
    onError,
    onDone,
    abortSignal,
  } = opts;

  if (!apiKey.trim()) {
    onError("No API key set. Visit /settings/ to add one.");
    return;
  }

  let response: Response;
  try {
    response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: userMessage }],
        stream: true,
      }),
      signal: abortSignal,
    });
  } catch (e) {
    onError(`Network error: ${(e as Error).message}`);
    return;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    onError(`HTTP ${response.status}: ${body || response.statusText}`);
    return;
  }

  if (!response.body) {
    onError("No response body.");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE: split on double-newlines, each "event" block.
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        const lines = block.split("\n");
        let eventName: string | null = null;
        let data: string | null = null;
        for (const line of lines) {
          if (line.startsWith("event: ")) eventName = line.slice(7).trim();
          else if (line.startsWith("data: ")) data = line.slice(6);
        }
        if (!eventName || !data) continue;

        if (eventName === "content_block_delta") {
          try {
            const parsed = JSON.parse(data);
            if (parsed?.delta?.type === "text_delta" && parsed.delta.text) {
              onText(parsed.delta.text);
            }
          } catch {
            /* ignore malformed */
          }
        } else if (eventName === "message_stop") {
          onDone();
          return;
        } else if (eventName === "error") {
          try {
            const parsed = JSON.parse(data);
            onError(parsed?.error?.message ?? "Unknown stream error");
          } catch {
            onError("Unknown stream error");
          }
          return;
        }
      }
    }
    onDone();
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      onDone();
      return;
    }
    onError(`Stream error: ${(e as Error).message}`);
  }
}
