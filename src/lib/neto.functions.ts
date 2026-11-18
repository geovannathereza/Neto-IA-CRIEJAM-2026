import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { sanitize, textHistory } from './neto-content';
import { scams } from './neto-flows';
import { availableSlots } from './neto-schedule';
import { validateAudio } from './neto-audio';

export const transcribeNetoAudio = createServerFn({ method: 'POST' })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error('Envie um áudio válido.');
    const audio = data.get('audio');
    if (!(audio instanceof Blob)) throw new Error('Envie um áudio válido.');
    validateAudio(audio);
    return data;
  })
  .handler(async ({ data }) => {
    const audio = data.get('audio');
    if (!(audio instanceof Blob)) throw new Error('Envie um áudio válido.');
    const { transcribeAudio } = await import('@lovable.dev/ai-gateway');
    try {
      const result = await transcribeAudio({ model: 'openai/gpt-transcribe', file: validateAudio(audio), language: 'pt' });
      const text = sanitize((typeof result === 'string' ? result : result.text).trim());
      if (!text) throw new Error('empty');
      return { text };
    } catch {
      throw new Error('Não consegui entender o áudio agora. Grave novamente ou escreva sua mensagem.');
    }
  });

export const netoIa = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ messages: z.array(z.object({ role: z.enum(['user', 'assistant']), text: z.string().max(4000) })).max(6) }))
  .handler(async ({ data }) => {
    const { generateResponse } = await import('@lovable.dev/ai-gateway');
    const result = await generateResponse({ model: 'openai/gpt-6-astra',
      instructions: 'Você é o Neto, assistente virtual do Tribunal de Justiça de Pernambuco, que orienta pessoas idosas sobre golpes e seus direitos. Responda em português do Brasil simples, frases curtas, no máximo 90 palavras, sem títulos e sem emojis. Comece com uma frase acolhedora. Quando houver ações a realizar, organize em passos numerados curtos, uma ação por passo, separados por uma linha em branco. Separe também o acolhimento e as ressalvas com uma linha em branco. Quando a pessoa contar o que aconteceu, diga que golpe não é culpa dela. Nunca peça senha, código, número de cartão ou conta, CPF, endereço ou dinheiro. Use só as orientações aprovadas; não invente leis, prazos, telefones ou links; não prometa resultados. Frases de até 12 palavras. Se a dúvida fugir das orientações, oriente a voltar ao menu principal ou procurar banco, delegacia ou Defensoria Pública. Nunca ofereça falar com uma pessoa. Em perigo, 190; violência contra a pessoa idosa, Disque 100.\n' + JSON.stringify(scams),
      input: textHistory(data.messages),
    });
    const text = result.output.flatMap(item => item.type === 'message' ? item.content.flatMap(c => c.type === 'output_text' ? [c.text] : []) : []).join('\n');
    if (!text) throw new Error('Resposta indisponível');
    return { text: (text.match(/\S+\s*/g) ?? []).slice(0, 90).join('').trim() };
  });

export const getSlots = createServerFn({method: 'GET'}).handler(() => availableSlots());
export const bookAppointment = createServerFn({method: 'POST'})
  .inputValidator(z.object({ assunto: z.string().max(100), perguntas: z.array(z.string().max(2000)).max(3), horario: z.string() }))
  .handler(async ({data}) => {
    if (!availableSlots().some(s => s.iso === data.horario)) throw new Error('Escolha um dos horários disponíveis.');
    const { createClient } = await import('@supabase/supabase-js');
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const url = process.env['SUPABASE_URL'];
    if (!key || !url) throw new Error('Agendamento indisponível');
    const client = createClient(url, key, {auth: {persistSession:false}, global: {fetch: (input, init) => { const headers = new Headers(init?.headers); if (key.startsWith('sb_')) headers.delete('Authorization'); headers.set('apikey', key); return fetch(input, {...init, headers}); }} });
    const code = () => crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
    for (let attempt=0; attempt<3; attempt++) {
      const codigo = `NJ-${String(code()%100000).padStart(5,'0')}`;
      const codigo_seguranca = String(code()%10000).padStart(4,'0');
      const {error} = await client.from('atendimentos').insert({codigo, codigo_seguranca, assunto: scams.some(s=>s.name===data.assunto) ? data.assunto : 'Orientação geral', perguntas: data.perguntas.map(sanitize), horario:data.horario});
      if (!error) return {codigo, codigo_seguranca};
      if (error.code !== '23505') throw new Error('Não foi possível marcar agora. Tente novamente.');
    }
    throw new Error('Tente novamente.');
  });