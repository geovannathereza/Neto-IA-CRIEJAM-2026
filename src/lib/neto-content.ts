export function sanitize(text: string) {
  return text.replace(/\b\d(?:[\d .\-/]*\d)?\b/g, value => value.replace(/\D/g, '').length >= 5 ? '[dado removido]' : value).replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[dado removido]').slice(0, 2000);
}
export function textHistory(messages: { role: 'user' | 'assistant'; text: string }[]) { return messages.filter(m => m.text.trim()).slice(-6).map(m => ({role: m.role, content: sanitize(m.text)})); }
