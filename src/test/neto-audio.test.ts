import { describe, expect, it } from 'vitest';
import { AUDIO_MAX_BYTES, validateAudio } from '@/lib/neto-audio';
import { sanitize } from '@/lib/neto-content';
describe('Mensagens de áudio', () => {
  it('aceita áudio gravado em WebM com codec', () => {
    const file = new Blob(['voice'], { type: 'audio/webm;codecs=opus' });
    expect(validateAudio(file)).toBe(file);
  });
  it('rejeita áudio vazio', () => expect(() => validateAudio(new Blob([], { type: 'audio/mp4' }))).toThrow());
  it('rejeita arquivos que não são áudio', () => expect(() => validateAudio(new Blob(['data'], { type: 'text/html' }))).toThrow());
  it('rejeita áudio acima de oito megabytes', () => expect(() => validateAudio(new Blob([new Uint8Array(AUDIO_MAX_BYTES + 1)], { type: 'audio/webm' }))).toThrow());
  it('remove dados bancários da transcrição antes de analisar', () => expect(sanitize('Minha conta é 123456789 e fizeram um Pix')).toBe('Minha conta é [dado removido] e fizeram um Pix'));
});