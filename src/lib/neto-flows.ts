import { ALERTAS, CONFIG } from './neto-config';
export { ALERTAS };

export type Link = { label: string; href: string; note?: string; copy?: string; action?: string };
export type Step = { title?: string; text: string; links?: Link[] | undefined };
export type Action = { label: string; value: string; nav?: boolean };
export type Bubble = { title?: string; text?: string; steps?: Step[]; checks?: Step[]; tip?: string; links?: Link[] | undefined; small?: string; report?: string; kind?: 'sticker' | 'alerts' | 'paste'; focus?: boolean; actions?: Action[] };

const mk = (label: string, value: string, prefix = '', note?: string): Link[] => value ? [{ label, href: prefix + value, ...(note ? { note } : {}) }] : [];
const wa = (text: string) => 'https://wa.me/?text=' + encodeURIComponent(text);
export const btnA = () => mk('🌐 Registrar boletim online', CONFIG.BOLETIM_URL, '', 'É a delegacia online de Pernambuco. Tenha em mãos seus dados e os prints.');
export const btnB = (): Link[] => [{ label: '📋 Avisar alguém de confiança', href: wa(CONFIG.TEXTO_CONFIANCA) }];
export const btnC = () => mk(`📞 Ligar ${CONFIG.INSS_TEL} (INSS)`, CONFIG.INSS_TEL, 'tel:');
export const btnD = () => mk('🌐 Abrir Meu INSS', CONFIG.MEU_INSS_URL);
export const btnE = () => mk('🌐 Abrir consumidor.gov.br', CONFIG.CONSUMIDOR_URL);
export const shareText = (origin: string) => CONFIG.TEXTO_INDICAR + origin + '.' + CONFIG.TEXTO_INDICAR_FIM;
export const btnF = (origin: string): Link[] => [{ label: '📲 Mandar o Neto para alguém', href: wa(shareText(origin)) }];
export const tribunal = () => [...mk('📞 Ligar para o tribunal', CONFIG.TJPE_TELEFONE, 'tel:'), ...mk('🌐 Site do tribunal', CONFIG.TJPE_SITE)];
const apoio = () => [...mk('🌐 Defensoria Pública', CONFIG.DEFENSORIA_URL), ...mk('🌐 Procon', CONFIG.PROCON_URL)];

const ckFinal = (id: string): Bubble => ({ text: 'Ficou claro?', actions: [{ label: 'Sim', value: `c1:sim:${id}` }, { label: 'Não', value: `c1:nao:${id}` }] });
type Answer = { title: string; text: string; checks: Step[]; links?: Link[] };
const s = (text: string, links?: Link[]): Step => (links?.length ? { text, links } : { text });
export const doubts: Record<string, Answer> = {
  'd:parente': { title: 'Cuidado! Esse golpe é muito comum. 🚩', text: 'Golpistas usam foto e nome de parentes para pedir Pix.', checks: [s('Não pague nada.'), s('Ligue para a pessoa no número antigo.'), s('Combine uma palavra secreta com a família.')] },
  'd:banco': { title: 'Cuidado! Isso tem cara de golpe. 🚩', text: "Banco e INSS não pedem Pix para 'liberar' ou 'proteger' seu dinheiro.", checks: [s('Não pague e encerre o contato.'), s('Ligue no número do verso do cartão. Para o INSS, ligue 135.', btnC()), s('Não siga as instruções de quem te procurou.')] },
  'd:justica': { title: 'Cuidado! Isso tem cara de golpe. 🚩', text: 'A Justiça não cobra taxa por mensagem ou ligação para liberar dinheiro de processo.', checks: [s('Não pague nada.'), s('Não responda mais.'), s('Confira no balcão ou no telefone oficial do tribunal.', tribunal())] },
  'd:loja': { title: 'Atenção! Pode ser golpe. 🚩', text: 'Preço muito baixo, pressa e Pix adiantado são sinais de alerta.', checks: [s('Não pague adiantado.'), s('Procure a loja pelo site oficial.'), s('Prefira lojas que você já conhece.')] },
  'd:naosei': { title: 'Na dúvida, pare. 🚩', text: 'Pedido de dinheiro com pressa ou segredo é sinal de golpe.', checks: [s('Não pague nada agora.'), s('Confirme por outro meio, pelo número que você já conhecia.'), s('Converse com alguém de confiança.')] },
  'd:senha': { title: 'Pare! Isso tem cara de golpe. 🚩', text: 'Ninguém sério pede senha, código de SMS ou foto de documento por mensagem ou ligação.', checks: [s('Não envie nada.'), s('Encerre a conversa.'), s("Se já enviou, toque em 'Já caí em um golpe'.")] },
  'd:link': { title: 'Não toque no link! 🚩', text: 'Links e aplicativos desconhecidos podem roubar seus dados.', checks: [s('Apague a mensagem.'), s('Não instale nada.'), s("Se já tocou ou instalou, toque em 'Já caí em um golpe'.")] },
  'd:ligacao': { title: 'Desligue! Isso tem cara de golpe. 🚩', text: 'Banco, INSS e Justiça não pedem dados nem dinheiro por telefone.', checks: [s('Desligue sem dar nenhuma informação.'), s('Ligue você mesmo no número oficial: no cartão ou, para o INSS, 135.', btnC()), s('Não ligue de volta para o número que a pessoa passou.')] },
  'd:desconto': { title: 'Atenção! Pode ser desconto ou empréstimo indevido. 🚩', text: 'Você pode contestar, e quanto antes, melhor.', checks: [s('Confira seu extrato no Meu INSS. Ou ligue 135.', [...btnD(), ...btnC()]), s('Fale com o banco e conteste por escrito.'), s('Guarde prints e comprovantes.')] },
  'd:generico': { title: 'Na dúvida, pare. 🚩', text: 'Desconfie de pressa, segredo e pedido de dinheiro.', checks: [s('Não pague nem envie nada.'), s('Confirme por outro meio, pelo número que você já conhecia.'), s('Converse com alguém de confiança.')] },
};

export const scams: { name: string; steps: Step[]; tip?: string }[] = [
  { name: 'Falso funcionário do banco', steps: [s('Ligue para o seu banco agora. O número está no verso do cartão. Diga que foi golpe.'), s('Peça para bloquear cartão e conta. Se fez Pix, peça a devolução.'), s('Troque a senha do banco e do celular. Apague qualquer aplicativo que pediram para instalar.'), s('Registre o boletim de ocorrência.', btnA()), s('Conte para alguém de confiança.', btnB())] },
  { name: 'Golpe do falso advogado', steps: [s('Pare de responder e não pague mais nada. A Justiça não cobra taxa por mensagem ou ligação.'), s('Se já pagou, ligue para o seu banco e peça a devolução do Pix.'), s('Guarde prints, comprovantes e o número do golpista.'), s('Registre o boletim de ocorrência.', btnA()), s('Para confirmar se existe processo, vá ao balcão do tribunal.', tribunal()), s('Conte para alguém de confiança.', btnB())] },
  { name: 'Golpe do empréstimo consignado', steps: [s('Veja os descontos no seu benefício.', [...btnD(), ...btnC()]), s('Fale com o banco e peça o cancelamento do empréstimo. Faça o pedido por escrito.'), s('Se o banco não resolver, reclame no site do consumidor.', btnE()), s('Registre o boletim de ocorrência.', btnA()), s('Se precisar de ajuda para contestar, procure a Defensoria Pública ou o Procon.', apoio()), s('Conte para alguém de confiança.', btnB())] },
  { name: 'Golpe do falso familiar (WhatsApp)', steps: [s('Pare de responder e não pague nada.'), s('Ligue para o seu familiar no número antigo. Confirme se foi ele.'), s('Se já fez Pix, ligue para o seu banco e peça a devolução.'), s("Bloqueie e denuncie o número. Toque no nome na conversa e escolha 'Bloquear e denunciar'."), s('Registre o boletim de ocorrência.', btnA()), s('Conte para alguém de confiança.', btnB())], tip: 'Dica: combine uma palavra secreta com a família.' },
  { name: 'Golpe do Pix', steps: [s('Ligue para o seu banco agora. Peça a devolução do Pix. Quanto mais rápido, melhor.'), s('Guarde o comprovante, os prints e o número de quem pediu.'), s('Se passou senha ou código, troque as senhas agora.'), s('Registre o boletim de ocorrência.', btnA()), s('Conte para alguém de confiança.', btnB())] },
];
const genericScam: { name: string; steps: Step[]; tip?: string } = { name: 'Outro golpe', steps: [s('Ligue para o seu banco se o golpe envolveu dinheiro ou dados.'), s('Guarde provas: prints, comprovantes e número do golpista.'), s('Registre o boletim de ocorrência.', btnA()), s('Conte para alguém de confiança.', btnB())] };
const scamAt = (i: number) => scams[i] ?? genericScam;

export const SIGNALS = [
  { key: 'pressa', words: ['urgente', 'hoje', 'imediatamente', 'último aviso', 'bloqueado', 'bloqueada', 'cancelado', 'cancelada', 'prazo'], phrase: '⏰ Tem pressa. Golpista quer que você aja sem pensar.' },
  { key: 'dinheiro', words: ['pix', 'taxa', 'custas', 'depósito', 'transferência', 'pague', 'boleto'], phrase: '💸 Pede dinheiro. Desconfie de Pix, taxa ou boleto.' },
  { key: 'dados', words: ['senha', 'código', 'token', 'cpf', 'foto do documento', 'selfie', 'confirmar seus dados'], phrase: '🔑 Pede dados. Ninguém sério pede senha ou código.' },
  { key: 'link', words: ['http', 'www', '.com', 'clique', 'baixe', 'instale'], loose: true, phrase: '🔗 Tem link ou aplicativo. Não toque nem instale.' },
  { key: 'segredo', words: ['não conte', 'não fale com ninguém', 'sigilo'], phrase: '🤫 Pede segredo. Golpista não quer que você conte.' },
  { key: 'premio', words: ['ganhou', 'prêmio', 'valor liberado', 'restituição', 'dinheiro esquecido', 'alvará'], phrase: '🎁 Promete dinheiro ou prêmio. Isso atrai a vítima.' },
  { key: 'familiar', words: ['mudei de número', 'número novo', 'mãe', 'pai', 'vovó'], phrase: '👤 Diz ser parente. Ligue no número antigo.' },
  { key: 'orgao', words: ['tribunal', 'justiça', 'processo', 'advogado', 'juiz', 'inss', 'banco'], phrase: '⚖️ Diz ser de órgão ou banco. Confira pelo canal oficial.' },
];
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function has(text: string, word: string, loose = false) {
  const w = norm(word);
  if (loose) return text.includes(w);
  return new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`).test(text);
}
export function analyze(raw: string) { const t = norm(raw); return SIGNALS.filter(sig => sig.words.some(w => has(t, w, sig.loose))).map(sig => sig.key); }
export function signalTitle(count: number) { return count >= 3 ? '🚩 Tem muitos sinais de golpe' : count > 0 ? '⚠️ Tem sinais de alerta' : 'Não achei sinais claros'; }

const ROUTES: { words: string[]; flow2?: string; flow1: string }[] = [
  { words: ['pix', 'transferência', 'dinheiro'], flow2: 'g:4', flow1: 'd:dinheiro' },
  { words: ['banco', 'cartão', 'conta'], flow2: 'g:0', flow1: 'd:banco' },
  { words: ['advogado', 'processo', 'alvará', 'juiz', 'justiça'], flow2: 'g:1', flow1: 'd:justica' },
  { words: ['consignado', 'empréstimo', 'desconto', 'inss', 'aposentadoria', 'benefício'], flow2: 'g:2', flow1: 'd:desconto' },
  { words: ['parente', 'filho', 'filha', 'meu neto', 'minha neta', 'número novo', 'whatsapp'], flow2: 'g:3', flow1: 'd:parente' },
  { words: ['senha', 'código', 'documento', 'foto'], flow1: 'd:senha' },
  { words: ['link', 'aplicativo', 'app', 'site'], flow1: 'd:link' },
  { words: ['ligou', 'ligaram', 'ligação', 'telefone'], flow1: 'd:ligacao' },
];
const FELL = ['caí', 'cai em', 'perdi', 'fui enganado', 'fui enganada'];
/** Leva o texto livre ao fluxo certo. null = não reconheceu. */
export function route(raw: string, context = 'menu'): string | null {
  if (raw.length > 150) return 'sinais:' + analyze(raw).join(',');
  const t = norm(raw);
  const fell = FELL.some(w => has(t, w)) || context === 'golpe' || context.startsWith('g:');
  for (const r of ROUTES) if (r.words.some(w => has(t, w))) return fell && r.flow2 ? r.flow2 : r.flow1;
  if (fell) return context === 'g:outro' ? 'g:generico' : 'golpe';
  if (context === 'd:outro') return 'd:generico';
  return null;
}

export const TESTE = [
  { q: 'O banco liga e pede o código que chegou no seu SMS.', golpe: true, fb: 'Isso mesmo! O código é só seu.' },
  { q: "Seu 'filho' manda mensagem de número novo pedindo Pix urgente.", golpe: true, fb: 'Isso mesmo! Ligue para ele no número antigo.' },
  { q: 'Alguém diz que precisa de uma taxa por Pix para liberar dinheiro de processo.', golpe: true, fb: 'Isso mesmo! A Justiça não cobra taxa assim.' },
  { q: 'Você abre o aplicativo do banco sozinho e vê um aviso.', golpe: false, fb: 'Isso mesmo! Abrir o app oficial por conta própria é seguro.' },
];
export function scoreAnswer(i: number, score: number, choice: 'golpe' | 'seguro') { const right = (choice === 'golpe') === TESTE[i]!.golpe; return { right, score: score + (right ? 1 : 0) }; }
const question = (i: number, score: number): Bubble => ({ title: `Pergunta ${i + 1} de ${TESTE.length}`, text: TESTE[i]!.q, actions: [{ label: '🚩 É golpe', value: `tr:${i}:${score}:golpe` }, { label: '✅ Parece seguro', value: `tr:${i}:${score}:seguro` }] });

export const relatoTipos = [...scams.map(x => x.name), 'Outro golpe'];
export const relatoQuando = ['Hoje', 'Ontem', 'Esta semana', 'Há mais tempo'];
export const relatoCanal = ['WhatsApp', 'Ligação', 'SMS', 'E-mail', 'Site ou link', 'Pessoalmente'];
export const relatoValor = ['Não', 'Até R$ 500', 'De R$ 500 a R$ 5 mil', 'Mais de R$ 5 mil'];
export function reportText(t: number, q: number, c: number, v: number) {
  const tipo = (relatoTipos[t] ?? 'Outro golpe').replace(/^Golpe do /, '');
  const canal = c === 5 ? 'pessoalmente' : 'por ' + (c === 0 || c === 2 ? relatoCanal[c] : relatoCanal[c]!.toLowerCase());
  const valor = v === 0 ? 'não houve perda de dinheiro' : relatoValor[v]!.replace(/^./, x => x.toLowerCase());
  return `Fui vítima de golpe (${tipo.toLowerCase()}). Aconteceu ${relatoQuando[q]!.toLowerCase()}, ${canal}. O prejuízo foi ${valor}. Fui contactado(a) pelo número/perfil [escreva aqui o número ou nome do perfil]. Tenho prints e comprovantes que posso apresentar. Peço o registro do boletim de ocorrência e, se houver valores envolvidos, a devolução e o bloqueio das contas envolvidas. Nome: [seu nome]. CPF: [seu CPF].`;
}

const afterClear = (fromScam: boolean): Action[] => [...(fromScam ? [] : [{ label: '🛡️ Já caí em um golpe', value: 'golpe' }]), { label: 'Fazer teste rápido', value: 'teste:0:0' }];
const answerBubble = (a: Answer): Bubble => ({ title: a.title, text: a.text + '\n\nO que fazer agora:', checks: a.checks });
export const rightsExtra = (i: number) => i === 2 ? 'Descontos que você não autorizou no benefício: conteste pelo Meu INSS ou pelo 135 e peça a devolução.' : i === 1 ? 'Não pague nada. Confira o processo no site oficial do tribunal.' : '';
export const rightsLinks = () => [...mk('Reclamar no consumidor.gov.br', CONFIG.CONSUMIDOR_URL), ...mk('Procon', CONFIG.PROCON_URL), ...mk('Defensoria Pública', CONFIG.DEFENSORIA_URL), ...btnB()];
export const scamTools = (i: number): Link[] => [...btnA(), { label: 'Meus direitos', href: '', action: `direitos:${i}` }, ...btnB()];
const scamBubbles = (i: number): Bubble[] => { const sc = scamAt(i); return [
  { title: 'Faça agora, nesta ordem:', steps: sc.steps.map(step => ({ ...step, links: step.links?.filter(link => !btnA().some(x => x.href === link.href) && !btnB().some(x => x.href === link.href)) })), links: scamTools(i), ...(sc.tip ? { tip: sc.tip } : {}) },
  { text: '📝 Quer montar seu relato? Eu escrevo um texto pronto para o boletim e para o banco.', actions: [{ label: 'Montar meu relato', value: `relatoq:${scams[i] ? i : 5}` }] },
  { text: 'Ficou claro?', actions: [{ label: 'Sim', value: `c2:sim:${i}` }, { label: 'Não', value: `c2:nao:${i}` }, { label: 'Fazer teste rápido', value: 'teste:0:0', nav: true }] },
]; };

export const welcomeTitle = 'Neto, me explica? ❤️';
export function screen(id: string, origin = ''): Bubble[] {
  const [head = '', a = '', b = '', c = ''] = id.split(':');
  if (id === 'menu') return [
    ...(ALERTAS.length ? [{ kind: 'alerts' } as Bubble] : []),
    { kind: 'sticker' },
    { title: welcomeTitle, text: 'Oi! Eu sou o Neto. Te ajudo a entender se é golpe e o que fazer. Pode escrever ou falar comigo.', small: 'O Neto não guarda sua conversa.', actions: [
      { label: '❓ Estou na dúvida se é golpe', value: 'duvida' }, { label: '🛡️ Caí em um golpe', value: 'golpe' }, { label: '📩 Recebi uma mensagem estranha', value: 'verificar' },
      { label: '📞 Canais oficiais', value: 'canais', nav: true }, { label: '📲 Mandar o Neto para alguém que eu cuido', value: 'indicar', nav: true }] },
  ];
  if (id === 'duvida') return [{ text: 'Vamos ver juntos? O que aconteceu?', actions: [
    { label: '💬 Alguém pediu dinheiro ou Pix', value: 'd:dinheiro' }, { label: '🔑 Pediram senha, código ou foto de documento', value: 'd:senha' },
    { label: '🔗 Mandaram um link ou aplicativo', value: 'd:link' }, { label: '📞 Ligaram dizendo ser do banco, INSS ou Justiça', value: 'd:ligacao' },
    { label: '💳 Apareceu desconto ou empréstimo que não reconheço', value: 'd:desconto' }, { label: '❓ Outra coisa', value: 'd:outro' }] }];
  if (id === 'd:dinheiro') return [{ text: 'Quem pediu o dinheiro?', actions: [
    { label: '👤 Um parente ou amigo', value: 'd:parente' }, { label: '🏦 Banco ou INSS', value: 'd:banco' }, { label: '⚖️ Alguém dizendo ser da Justiça ou advogado', value: 'd:justica' },
    { label: '🛒 Uma loja ou vendedor', value: 'd:loja' }, { label: '❓ Não sei', value: 'd:naosei' }] }];
  if (id === 'd:outro' || id === 'g:outro') return [{ text: 'Conte com suas palavras o que aconteceu. Pode escrever ou falar.', focus: true }];
  if (doubts[id]) return [answerBubble(doubts[id]!), ckFinal(id)];
  if (head === 'c1') {
    const key = `${b}:${c}`; const ans = doubts[key];
    if (a === 'sim' || !ans) return [{ text: 'Que bom! Guarde estas orientações. Se precisar, é só voltar aqui.', actions: afterClear(false) }];
    return [{ text: 'Vou explicar de novo, mais devagar.' }, { title: ans.title }, ...ans.checks.map(x => ({ text: '✅ ' + x.text, ...(x.links ? { links: x.links } : {}) })), { text: 'O que você quer fazer agora?', actions: afterClear(false) }];
  }
  if (id === 'golpe') return [{ text: 'Calma. Isso acontece com muita gente. Não é culpa sua. Vamos resolver juntos.' }, { text: 'O que aconteceu?', actions: [...scams.map((x, i) => ({ label: x.name, value: `g:${i}` })), { label: 'Outro. Me conte', value: 'g:outro' }] }];
  if (head === 'direitos') return [{ title: 'Seus direitos', text: 'A culpa é do golpista, não sua.', checks: [
    { title: 'Reclamação gratuita', text: 'Você pode reclamar sem pagar no consumidor.gov.br ou no Procon.' },
    { title: 'Prioridade', text: 'Pessoas com 60 anos ou mais têm prioridade no atendimento e nos processos (Estatuto da Pessoa Idosa).' },
    { title: 'Ajuda de graça', text: 'Se não puder pagar advogado, a Defensoria Pública ajuda.' },
    { title: 'Justiça', text: 'Nos Juizados Especiais, causas de até 20 salários mínimos podem ser feitas sem advogado.' },
  ], tip: rightsExtra(Number(a)), links: rightsLinks(), small: 'Informação geral. Cada caso é diferente.', actions: [{ label: 'Voltar', value: 'nav:back', nav: true }, { label: 'Início', value: 'nav:home', nav: true }] }];
  if (head === 'g') return scamBubbles(a === 'generico' ? 5 : Number(a));
  if (head === 'c2') {
    if (a === 'sim') return [{ text: 'Que bom! Guarde estas orientações. Se precisar, é só voltar aqui.', actions: afterClear(true) }];
    const sc = scamAt(Number(b));
    return [{ text: 'Vou explicar de novo, mais devagar.' }, ...sc.steps.map((x, i) => ({ text: `Passo ${i + 1}. ${x.text}`, ...(x.links ? { links: x.links } : {}) })), { text: 'O que você quer fazer agora?', actions: [{ label: 'Montar meu relato', value: `relatoq:${scams[Number(b)] ? b : 5}` }, ...afterClear(true)] }];
  }
  if (id === 'verificar') return [{ text: 'Cole aqui a mensagem que você recebeu. Eu aponto os sinais de alerta.' }, { kind: 'paste', small: 'Não cole senhas, CPF ou número de cartão.' }];
  if (head === 'sinais') {
    const keys = a ? a.split(',') : []; const found = SIGNALS.filter(x => keys.includes(x.key));
    return [{ title: signalTitle(found.length), text: found.length ? found.map(x => x.phrase).join('\n') : 'Mas isso não garante que é seguro. Na dúvida, confirme por outro meio.' },
      { title: 'O que fazer agora:', checks: [s('Não responda nem toque em links.'), s('Confirme pelo número ou site oficial que você já conhecia.'), s('Mostre para alguém de confiança.')], small: 'Isto é uma ajuda. Eu posso errar. Na dúvida, não pague nem envie nada.',
        actions: [{ label: '🛡️ Já caí em um golpe', value: 'golpe' }, { label: 'Analisar outra mensagem', value: 'verificar', nav: true }] }];
  }
  if (head === 'relatoq') { const t = Number(a); return [{ text: 'Vou escrever um texto para você. Responda 4 perguntas. Não escreva nome, CPF nem senha.' }, { title: 'Pergunta 1 de 4', text: `O que aconteceu?\n\nEscolhido: ${relatoTipos[t]}`, actions: [{ label: '✅ Isso mesmo', value: `relato:${t}` }, ...relatoTipos.map((x, i) => i === t ? null : { label: x, value: `relato:${i}`, nav: true }).filter(Boolean) as Action[]] }]; }
  if (head === 'relato') {
    const parts = a.split('|').map(Number); const pre = a + '|';
    if (parts.length === 1) return [{ title: 'Pergunta 2 de 4', text: 'Quando foi?', actions: relatoQuando.map((x, i) => ({ label: x, value: `relato:${pre}${i}` })) }];
    if (parts.length === 2) return [{ title: 'Pergunta 3 de 4', text: 'Por onde foi?', actions: relatoCanal.map((x, i) => ({ label: x, value: `relato:${pre}${i}` })) }];
    if (parts.length === 3) return [{ title: 'Pergunta 4 de 4', text: 'Perdeu dinheiro?', actions: relatoValor.map((x, i) => ({ label: x, value: `relato:${pre}${i}` })) }];
    const [t = 5, q = 0, ch = 0, v = 0] = parts; const report = reportText(t, q, ch, v);
    return [{ title: 'Seu relato pronto', report, links: [{ label: '📋 Copiar texto', href: '', copy: report }, ...btnA(), ...btnB()], small: 'Revise o texto e complete os campos antes de enviar.' }];
  }
  if (id === 'canais') {
    const trib = tribunal(); const out: Bubble[] = [{ title: 'Canais oficiais para conferir', text: 'Se alguém disser que é do tribunal, do banco ou do INSS, confira por aqui.' }];
    if (trib.length || CONFIG.TJPE_ENDERECO) out.push({ title: '🏛️ Tribunal de Justiça de Pernambuco', ...(CONFIG.TJPE_ENDERECO ? { text: CONFIG.TJPE_ENDERECO } : {}), links: trib });
    out.push({ title: 'Boletim de ocorrência', links: btnA() }, { title: '📞 INSS', links: [...btnC(), ...btnD()] }, { title: 'Reclamar de empresa ou banco', links: btnE() });
    if (CONFIG.DEFENSORIA_URL) out.push({ links: mk('🌐 Defensoria Pública', CONFIG.DEFENSORIA_URL) });
    if (CONFIG.PROCON_URL) out.push({ links: mk('🌐 Procon', CONFIG.PROCON_URL) });
    out.push({ text: 'A Justiça não cobra taxa por mensagem, ligação ou Pix.' }); return out;
  }
  if (id === 'indicar') return [{ text: 'Boa! Quem recebe o Neto antes do golpe se protege melhor.' }, { title: 'Prévia da mensagem', text: shareText(origin), links: btnF(origin) }, { text: 'Quer mandar para mais alguém?', actions: [{ label: 'Sim', value: 'indicar' }] }];
  if (head === 'teste') return [...(a === '0' ? [{ text: 'Vamos treinar? São 4 perguntas rápidas.' }] : []), question(Number(a), Number(b))];
  if (head === 'tr') {
    const i = Number(a); const r = scoreAnswer(i, Number(b), c === 'golpe' ? 'golpe' : 'seguro'); const fb = TESTE[i]!.fb;
    const feedback: Bubble = { text: r.right ? fb : 'Quase! Veja o porquê:\n' + fb };
    if (i + 1 < TESTE.length) return [feedback, question(i + 1, r.score)];
    return [feedback, { title: `Você acertou ${r.score} de ${TESTE.length}. 🎉`, text: 'Regra de ouro: desconfie de pressa, segredo e pedido de dinheiro.', links: btnF(origin), actions: [{ label: 'Refazer teste', value: 'teste:0:0', nav: true }] }];
  }
  return [{ text: 'Combinado! Estou aqui se você precisar.' }];
}
export function speechText(b: Bubble) {
  return [b.title, b.text, ...(b.steps ?? []).map((x, i) => `Passo ${i + 1}. ${x.text}`), ...(b.checks ?? []).map(x => [x.title, x.text].filter(Boolean).join('. ')), b.tip, b.report, b.small].filter(Boolean).join('. ').replace(/[🚩✅⚠️❤️🎉]/gu, '');
}
