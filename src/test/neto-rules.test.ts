import {describe,it,expect} from 'vitest';
import {sanitize,textHistory} from '@/lib/neto-content';
import {route,analyze,signalTitle,reportText,scoreAnswer,TESTE,scams,screen,tribunal,rightsExtra,rightsLinks,scamTools} from '@/lib/neto-flows';
import { CONFIG } from '@/lib/neto-config';
import { READING_SIZES, readingSize, nextReadingSize } from '@/lib/neto-reading';
import {availableSlots} from '@/lib/neto-schedule';
describe('Regras do Neto piloto',()=>{
  it('remove CPF antes de enviar',()=>expect(sanitize('Meu CPF é 123.456.789-00')).toBe('Meu CPF é [dado removido]'));
  it('envia somente as últimas seis mensagens',()=>expect(textHistory(Array.from({length:8},(_,i)=>({role:'user' as const,text:String(i)}))).map(m=>m.content)).toEqual(['2','3','4','5','6','7']));
  it('palavras-chave levam ao fluxo certo',()=>{expect(route('fiz um pix',' golpe'.trim())).toBe('g:4');expect(route('pediram minha senha')).toBe('d:senha');expect(route('caí num golpe do consignado')).toBe('g:2');expect(route('me ligaram')).toBe('d:ligacao');expect(route('bom dia')).toBeNull();});
  it('texto com mais de 150 letras vai ao verificador',()=>expect(route('a'.repeat(151))).toMatch(/^sinais:/));
  it('verificador: 3 ou mais sinais = muitos sinais',()=>{const k=analyze('URGENTE: pague a taxa por Pix hoje, clique em www.x.com');expect(k).toEqual(expect.arrayContaining(['pressa','dinheiro','link']));expect(signalTitle(3)).toContain('muitos');expect(signalTitle(1)).toContain('alerta');expect(signalTitle(0)).toBe('Não achei sinais claros');});
  it('verificador nunca diz que é seguro',()=>expect(JSON.stringify(screen('sinais:'))).not.toMatch(/é segura/));
  it('relato preenche respostas e deixa campos para completar',()=>{const t=reportText(4,0,0,1);expect(t).toContain('Aconteceu hoje, por WhatsApp');expect(t).toContain('até R$ 500');expect(t).toContain('[seu CPF]');expect(reportText(0,1,5,0)).toContain('não houve perda de dinheiro');});
  it('teste rápido: 4 perguntas, só a última é segura',()=>{expect(TESTE).toHaveLength(4);expect(scoreAnswer(3,2,'seguro')).toEqual({right:true,score:3});expect(scoreAnswer(0,0,'seguro').right).toBe(false);});
  it('cinco golpes na ordem e sem falar com pessoa',()=>{expect(scams.map(s=>s.name)).toEqual(['Falso funcionário do banco','Golpe do falso advogado','Golpe do empréstimo consignado','Golpe do falso familiar (WhatsApp)','Golpe do Pix']);expect(JSON.stringify(screen('menu'))).not.toMatch(/Falar com pessoa/i);});
  it('valores vazios do tribunal não viram botão',()=>expect(tribunal()).toEqual([]));
  it.each([0,1,2,3,4,5])('oferece direitos entre boletim e pessoa de confiança no golpe %i',(i)=>{
    const tools=scamTools(i);expect(tools.map(t=>t.action??t.href)).toEqual([CONFIG.BOLETIM_URL,`direitos:${i}`,expect.stringMatching(/^https:\/\/wa.me\//)]);
    expect(screen(i===5?'g:generico':`g:${i}`)[0]?.links).toEqual(tools);
  });
  it('direitos mostram apenas a orientação correspondente',()=>{
    expect(rightsExtra(2)).toBe('Descontos que você não autorizou no benefício: conteste pelo Meu INSS ou pelo 135 e peça a devolução.');
    expect(rightsExtra(1)).toBe('Não pague nada. Confira o processo no site oficial do tribunal.');
    for(const i of [0,3,4,5]) expect(rightsExtra(i)).toBe('');
  });
  it('direitos não oferecem links vazios nem atendimento humano',()=>{
    const links=rightsLinks();expect(links.every(l=>Boolean(l.href))).toBe(true);
    expect(links.map(l=>l.href)).toContain(CONFIG.CONSUMIDOR_URL);
    expect(links.map(l=>l.label)).not.toContain('Procon');expect(links.map(l=>l.label)).not.toContain('Defensoria Pública');
    for(let i=0;i<6;i++) expect(JSON.stringify(screen(`direitos:${i}`))).not.toMatch(/falar com (uma )?pessoa/i);
  });
  it('leitura tem três níveis de 20, 24 e 28px',()=>{
    expect(READING_SIZES).toEqual([20,24,28]);expect(readingSize(null)).toBe(20);
    expect(nextReadingSize(20)).toBe(24);expect(nextReadingSize(24)).toBe(28);expect(nextReadingSize(28)).toBe(20);expect(readingSize('28')).toBe(28);
  });
  it('oferece 9h, 15h e 10h pulando fim de semana e feriado nacional',()=>{const slots=availableSlots(new Date('2026-11-12T14:30:00Z'));expect(slots.map(s=>s.iso)).toEqual(['2026-11-13T09:00:00-03:00','2026-11-16T15:00:00-03:00','2026-11-17T10:00:00-03:00']);});
});
