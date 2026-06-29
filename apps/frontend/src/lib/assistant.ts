/**
 * Local stand-in for the agent. There is no chat route on the backend yet, so
 * replies are generated client-side: honest, short, and clearly a preview.
 * Swap `requestAssistantReply` for a real API call when the route exists.
 */

function summarize(text: string) {
  const oneLine = text.trim().replace(/\s+/g, " ");
  return oneLine.length > 72 ? `${oneLine.slice(0, 72).trimEnd()}…` : oneLine;
}

export function generateReply(userText: string, priorAssistantCount: number) {
  const intent = summarize(userText);

  if (priorAssistantCount === 0) {
    return `Here's where I'd plan out “${intent}” and stream the edits. I'm running in local preview right now — wire up a chat route on the backend and these replies become real.`;
  }

  const acknowledgements = [
    `On it — “${intent}”. In a connected workspace the diff would land here for review.`,
    `Noted. I'd keep the change for “${intent}” small and reversible.`,
    `Got it. This thread keeps the context, so we can build on it next.`,
  ];

  const index = priorAssistantCount % acknowledgements.length;
  return acknowledgements[index] ?? `Got it — “${intent}”.`;
}

export function requestAssistantReply(
  userText: string,
  priorAssistantCount: number,
): Promise<string> {
  const delay = 480 + Math.floor(Math.random() * 520);
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateReply(userText, priorAssistantCount)), delay);
  });
}
