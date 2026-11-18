import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Mic, Square, X, LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import { transcribeNetoAudio } from '@/lib/neto.functions';
import { AUDIO_MAX_SECONDS, validateAudio } from '@/lib/neto-audio';

export function NetoRecorder({ disabled, onText, onActive }: { disabled: boolean; onText: (text: string) => Promise<void>; onActive: (active: boolean) => void }) {
  const [status, setStatus] = useState<'idle'|'permission'|'recording'|'transcribing'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const version = useRef(0);
  const transcribe = useServerFn(transcribeNetoAudio);
  const release = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
  };
  function cancel() {
    version.current++;
    if (recorder.current?.state === 'recording') recorder.current.stop();
    release(); setStatus('idle'); onActive(false);
  }
  useEffect(() => () => { version.current++; if (recorder.current?.state === 'recording') recorder.current.stop(); release(); }, []);
  async function start() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Seu navegador não permite gravar áudio. Você pode escrever sua mensagem.'); return;
    }
    const token = ++version.current;
    setStatus('permission'); onActive(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (token !== version.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type));
      const rec = mimeType ? new MediaRecorder(media, { mimeType }) : new MediaRecorder(media);
      recorder.current = rec;
      const chunks: Blob[] = [];
      rec.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      rec.onerror = () => { cancel(); setError('Não consegui gravar. Tente novamente.'); };
      rec.onstop = async () => {
        release();
        if (token !== version.current) return;
        setStatus('transcribing');
        try {
          const audio = validateAudio(new Blob(chunks, { type: rec.mimeType }));
          const data = new FormData();
          data.set('audio', audio, rec.mimeType.includes('mp4') ? 'mensagem.mp4' : rec.mimeType.includes('ogg') ? 'mensagem.ogg' : 'mensagem.webm');
          const result = await transcribe({ data });
          if (token !== version.current) return;
          setStatus('idle'); onActive(false);
          await onText(result.text);
        } catch (failure) {
          if (token !== version.current) return;
          setError(failure instanceof Error ? failure.message : 'Não consegui entender o áudio. Tente novamente.');
          setStatus('idle'); onActive(false);
        }
      };
      setSeconds(0); setStatus('recording'); rec.start();
      let elapsed = 0;
      timer.current = setInterval(() => { elapsed++; setSeconds(elapsed); if (elapsed >= AUDIO_MAX_SECONDS && rec.state === 'recording') rec.stop(); }, 1000);
    } catch {
      if (token !== version.current) return;
      release(); setStatus('idle'); onActive(false);
      setError('Não consegui acessar o microfone. Permita o acesso no navegador ou escreva sua mensagem.');
    }
  }
  return <div className="audio-recording-control">
    <Button type="button" variant={status === 'recording' ? 'destructive' : 'outline'} size="round" disabled={disabled || status === 'permission' || status === 'transcribing'} title={status === 'recording' ? 'Enviar áudio' : 'Gravar áudio'} aria-label={status === 'recording' ? 'Enviar áudio' : 'Gravar áudio'} onClick={() => status === 'recording' ? recorder.current?.stop() : void start()}>
      {status === 'recording' ? <Square/> : status === 'idle' ? <Mic/> : <LoaderCircle className="animate-spin"/>}
    </Button>
    {status !== 'idle' && <div className="recording-status" role="status"><span>{status === 'recording' ? `Gravando · ${seconds}s / ${AUDIO_MAX_SECONDS}s` : status === 'permission' ? 'Aguardando microfone…' : 'Transformando áudio em texto…'}</span><Button type="button" variant="ghost" size="round" aria-label="Cancelar áudio" title="Cancelar áudio" onClick={cancel}><X/></Button></div>}
    {error && <p className="recording-error" role="alert">{error}</p>}
  </div>;
}