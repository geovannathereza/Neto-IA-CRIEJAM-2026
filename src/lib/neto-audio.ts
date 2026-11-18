export const AUDIO_MAX_BYTES = 8 * 1024 * 1024;
export const AUDIO_MAX_SECONDS = 60;
export function validateAudio(file: Blob) {
  if (!file.size) throw new Error('O áudio está vazio. Grave novamente.');
  if (file.size > AUDIO_MAX_BYTES) throw new Error('O áudio é muito grande. Grave uma mensagem mais curta.');
  if (!['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/mpeg'].includes(file.type.split(';')[0] ?? '')) {
    throw new Error('Este formato de áudio não é aceito. Grave novamente.');
  }
  return file;
}