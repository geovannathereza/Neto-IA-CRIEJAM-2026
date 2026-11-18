import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Link as RouterLink } from '@tanstack/react-router';
import { BadgeCheck, RotateCcw, ArrowLeft, Home, Moon, Sun, ShieldCheck, Send, Volume2, CheckCheck, MessageCircle, ExternalLink, Search } from 'lucide-react';
import { Button } from './ui/button';
import { NetoSticker } from './neto-sticker';
import { NetoRecorder } from './neto-recorder';
import { sanitize } from '@/lib/neto-content';
import { ALERTAS, analyze, route, screen, speechText, type Action, type Bubble, type Link } from '@/lib/neto-flows';
import { nextReadingSize, readingSize, type ReadingSize } from '@/lib/neto-reading';
import { netoIa } from '@/lib/neto.functions';

type Message = Bubble & { id: number; role: 'user' | 'assistant'; time: string };
const KEYCAPS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const time = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const initial = (): Message[] => screen('menu').map((b, i) => ({ ...b, id: i + 1, role: 'assistant', time: '' }));

function LinkButtons({ links, onCopy, onGo, disabled }: { links?: Link[] | undefined; onCopy: (t: string) => void; onGo: (a: Action) => void; disabled: boolean }) {
  if (!links?.length) return null;
  return <div className="link-buttons">{links.map(l => <div key={l.label}>{l.note && <p className="link-note">{l.note}</p>}{l.action ? <Button variant="chat" className="action-link" disabled={disabled} onClick={() => { if (l.action) onGo({ label: l.label, value: l.action }); }}>{l.label}</Button> : l.copy ? <Button variant="chat" className="action-link" onClick={() => { if (l.copy) onCopy(l.copy); }}>{l.label}</Button> : <a className="action-link" href={l.href} target={l.href.startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer">{l.label}{!l.href.startsWith('tel:') && <ExternalLink aria-hidden="true" />}</a>}</div>)}</div>;
}
function Report({ text }: { text: string }) {
  return <div className="report-box">{text.split(/(\[[^\]]+\])/).map((p, i) => p.startsWith('[') ? <mark key={i}>{p}</mark> : p)}</div>;
}
function Alerts({ onGo, disabled }: { onGo: (a: Action) => void; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  return <div className="alert-box"><div className="alert-line"><span>⚠️ <strong>Alerta da semana:</strong> {ALERTAS[0]?.titulo}</span><Button variant="chat" className="alert-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fechar' : 'Ver'}</Button></div>
    {open && ALERTAS.map(a => <div key={a.titulo} className="alert-card"><strong>{a.titulo}</strong><p>{a.texto}</p><Button variant="chat" disabled={disabled} onClick={() => onGo({ label: a.titulo, value: a.destino })}>O que fazer</Button><small>Aviso de exemplo do piloto</small></div>)}</div>;
}

export function NetoChat() {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [recording, setRecording] = useState(false);
  const [input, setInput] = useState(''); const [paste, setPaste] = useState(''); const [busy, setBusy] = useState(false); const [reading, setReading] = useState<ReadingSize>(20);
  const [dark, setDark] = useState(false); const [playing, setPlaying] = useState<number | null>(null); const [speechAvailable, setSpeechAvailable] = useState(false);
  const scroll = useRef<HTMLDivElement>(null); const inputRef = useRef<HTMLInputElement>(null); const sequence = useRef(100); const generation = useRef(0);
  const stack = useRef<string[]>(['menu']);
  const ai = useServerFn(netoIa);
  useEffect(() => {
    let theme: string | null = null; let savedReading: string | null = null;
    try { theme = localStorage.getItem('neto-theme'); savedReading = sessionStorage.getItem('neto-reading-size'); } catch {}
    const night = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(night); setReading(readingSize(savedReading));
    document.documentElement.dataset['theme'] = night ? 'dark' : 'light';
    document.documentElement.dataset['reading'] = String(readingSize(savedReading));
    setMessages(m => m.map(x => ({ ...x, time: time() }))); setSpeechAvailable('speechSynthesis' in window);
    return () => { generation.current++; window.speechSynthesis?.cancel(); };
  }, []);
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.dataset['theme'] = next ? 'dark' : 'light'; try { localStorage.setItem('neto-theme', next ? 'dark' : 'light'); } catch {} }
  function toggleReading() { const next = nextReadingSize(reading); setReading(next); document.documentElement.dataset['reading'] = String(next); try { sessionStorage.setItem('neto-reading-size', String(next)); } catch {} }
  useEffect(() => { scroll.current?.scrollTo({ top: messages.length > 4 || busy ? scroll.current.scrollHeight : 0, behavior: messages.length > 4 ? 'smooth' : 'instant' }); }, [messages, busy]);

  const push = (b: Bubble, role: Message['role'] = 'assistant') => setMessages(m => [...m, { ...b, id: sequence.current++, role, time: time() }]);
  const clearActions = () => setMessages(m => m.map(x => ({ ...x, actions: [], links: x.links?.filter(link => !link.action) })));
  function speak(message: Message) {
    if (!speechAvailable) return;
    window.speechSynthesis.cancel(); if (playing === message.id) { setPlaying(null); return; }
    const u = new SpeechSynthesisUtterance(speechText(message)); u.lang = 'pt-BR'; u.rate = .85;
    const voice = window.speechSynthesis.getVoices().find(v => v.lang === 'pt-BR'); if (voice) u.voice = voice;
    u.onend = () => setPlaying(null); u.onerror = () => setPlaying(null); setPlaying(message.id); window.speechSynthesis.speak(u);
  }
  async function show(id: string, userLabel?: string, record = true) {
    generation.current++; const token = generation.current; window.speechSynthesis?.cancel(); setPlaying(null);
    clearActions(); if (userLabel) push({ text: userLabel }, 'user');
    if (record) stack.current = [...stack.current, id].slice(-30);
    const bubbles = screen(id, window.location.origin);
    for (const b of bubbles) { setBusy(true); await new Promise(r => setTimeout(r, 650)); if (token !== generation.current) return; push(b); }
    setBusy(false);
    if (bubbles.some(b => b.focus)) setTimeout(() => inputRef.current?.focus(), 50);
  }
  function choose(action: Action) { if (busy || recording) return; if (action.value === 'nav:back') { back(); return; } if (action.value === 'nav:home') { menu(); return; } void show(action.value, action.label); }
  function menu() { stack.current = []; void show('menu', 'Voltar ao menu principal'); }
  function back() { if (recording) return; stack.current.pop(); const prev = stack.current.pop() ?? 'menu'; void show(prev, 'Voltar uma etapa'); }
  function reset() { generation.current++; stack.current = ['menu']; setMessages(initial().map(m => ({ ...m, time: time() }))); setBusy(false); setInput(''); setPaste(''); setPlaying(null); window.speechSynthesis?.cancel(); }
  async function copy(text: string) { try { await navigator.clipboard.writeText(text); push({ text: 'Copiado! Cole no boletim ou mande ao banco.' }); } catch { push({ text: 'Não consegui copiar. Toque e segure no texto para copiar.' }); } }
  const context = () => stack.current[stack.current.length - 1] ?? 'menu';
  function analyzeText(raw: string) { const text = raw.trim(); if (!text || busy) return; setPaste(''); void show('sinais:' + analyze(text).join(','), sanitize(text)); }
  async function sendText(raw: string) {
    const text = sanitize(raw.trim()); if (!text || busy) return; setInput('');
    if (context() === 'verificar') { analyzeText(raw); return; }
    const target = route(text, context()); if (target) { void show(target, text); return; }
    const history = [...messages.filter(m => !m.kind && m.text).map(m => ({ role: m.role, text: [m.title, m.text].filter(Boolean).join('\n') })), { role: 'user' as const, text }].slice(-6);
    clearActions(); push({ text }, 'user'); setBusy(true); const token = ++generation.current;
    try { const result = await ai({ data: { messages: history } }); if (token === generation.current) push({ text: result.text }); }
    catch { if (token === generation.current) push({ text: 'Não consegui responder agora. Tente de novo ou volte ao menu principal.' }); }
    finally { if (token === generation.current) setBusy(false); }
  }
  const lastId = messages[messages.length - 1]?.id;

  return <main className="chat-stage"><section className="chat-app" aria-label="Conversa com Neto">
    <div className="demo-strip">Protótipo piloto · Não use dados reais.</div>
    <header className="chat-header"><div className="avatar">N</div><div className="identity"><h1>Neto <BadgeCheck className="verified" aria-label="Verificado" /></h1><p>{busy ? 'digitando…' : 'Assistente virtual do TJPE'}</p></div><div className="header-tools"><Button variant="header" title={dark ? 'Ativar modo claro' : 'Ativar modo escuro'} aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'} aria-pressed={dark} onClick={toggleTheme}>{dark ? <Sun /> : <Moon />}</Button><Button variant="header" title={`Tamanho da letra: ${reading}px. Alterar para ${nextReadingSize(reading)}px`} aria-label={`Alterar tamanho da letra: ${reading}px`} onClick={toggleReading}>A+</Button><Button variant="header" title="Recomeçar conversa" aria-label="Recomeçar conversa" disabled={recording} onClick={() => { if (window.confirm('Deseja recomeçar a conversa?')) reset(); }}><RotateCcw /></Button></div></header>
    <div className="safety-strip"><ShieldCheck /><span>O Neto nunca pede senha, código do banco ou Pix.</span></div>
    <div className="messages" ref={scroll} role="log" aria-live="polite" aria-relevant="additions"><div className="day-label"><span>Hoje</span></div>{messages.map(message => <div key={message.id} className="message-group">
      {message.kind === 'sticker' ? <div className="sticker-message"><NetoSticker /></div>
        : message.kind === 'alerts' ? <Alerts onGo={choose} disabled={busy || recording} />
        : message.kind === 'paste' ? <div className="bubble paste-box"><p className="paste-warning">{message.small}</p>{message.id === lastId && context() === 'verificar' ? <><textarea aria-label="Mensagem recebida" placeholder="Cole a mensagem aqui" value={paste} maxLength={4000} onChange={e => setPaste(e.target.value)} /><Button variant="chat" className="primary-action" disabled={!paste.trim() || busy} onClick={() => analyzeText(paste)}><Search />Analisar</Button><p className="link-note">Ou grave um áudio pelo microfone.</p></> : null}</div>
        : <div className={`bubble ${message.role === 'user' ? 'user-bubble' : ''}`}>
          <div className="message-text">
            {message.title && <strong className="message-title">{message.title}</strong>}
            {message.text && <p className="step-plain">{message.text}</p>}
            {message.steps?.map((st, i) => <div key={i} className="step-card"><span className="step-number">{KEYCAPS[i] ?? i + 1}</span> {st.text}<LinkButtons links={st.links} onCopy={copy} onGo={choose} disabled={busy || recording} /></div>)}
            {message.checks?.map((st, i) => <div key={i} className="check-item">✅ {st.title && <strong className="step-head">{st.title}</strong>}{st.text}<LinkButtons links={st.links} onCopy={copy} onGo={choose} disabled={busy || recording} /></div>)}
            {message.tip && <p className="step-plain tip">{message.tip}</p>}
            {message.report && <Report text={message.report} />}
            <LinkButtons links={message.links} onCopy={copy} onGo={choose} disabled={busy || recording} />
            {message.small && <p className="small-note">{message.small}</p>}
          </div>
          <div className="message-meta">{message.role === 'assistant' && <Button variant="secondary" className="listen" disabled={!speechAvailable} onClick={() => speak(message)} aria-label={playing === message.id ? 'Parar leitura' : 'Ouvir mensagem'}><Volume2 />{playing === message.id ? 'Parar' : 'Ouvir'}</Button>}<span>{message.time}</span>{message.role === 'user' && <CheckCheck />}</div>
        </div>}
      {Boolean(message.actions?.length) && <div className="replies">{message.actions?.map(action => <Button variant="chat" className={action.nav ? 'nav-action' : 'primary-action'} disabled={busy || recording} key={action.value} onClick={() => choose(action)}>{action.label}</Button>)}</div>}
    </div>)}{busy && <div className="bubble typing" aria-label="Neto está digitando"><i /><i /><i /></div>}</div>
    <footer className="composer"><div className="back-row"><Button variant="ghost" size="accessible" aria-label="Voltar uma etapa" disabled={recording} onClick={back}><ArrowLeft />Voltar</Button><Button variant="ghost" size="accessible" aria-label="Voltar ao menu principal" disabled={recording} onClick={menu}><Home />Menu principal</Button></div>
      <form onSubmit={e => { e.preventDefault(); if (!recording) void sendText(input); }}><div className="input-wrap"><input ref={inputRef} disabled={recording} aria-label="Mensagem" placeholder="Escreva aqui" value={input} maxLength={2000} onChange={e => setInput(e.target.value)} /><MessageCircle aria-hidden="true" /></div><NetoRecorder disabled={busy} onText={sendText} onActive={setRecording} /><Button variant="send" size="round" type="submit" disabled={busy || recording || !input.trim()} aria-label="Enviar mensagem"><Send /></Button></form>
      <div className="composer-note">Orientação, não substitui banco, polícia ou advogado. · <RouterLink to="/painel">Painel do tribunal (exemplo)</RouterLink></div></footer>
  </section></main>;
}
