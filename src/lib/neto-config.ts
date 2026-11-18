/** Valores editáveis pelo time. Campo vazio = botão/linha não aparece. */
export const CONFIG = {
  BOLETIM_URL: 'https://delegaciapelainternet.pc.pe.gov.br/delegacia/',
  MEU_INSS_URL: 'https://meu.inss.gov.br',
  CONSUMIDOR_URL: 'https://www.consumidor.gov.br',
  INSS_TEL: '135',
  TJPE_TELEFONE: '',
  TJPE_SITE: '',
  TJPE_ENDERECO: '',
  DEFENSORIA_URL: '',
  PROCON_URL: '',
  TEXTO_CONFIANCA: 'Oi, caí em um golpe e preciso de ajuda. Já segui as orientações do Neto (assistente do TJPE). Pode me ajudar a falar com o banco e registrar o boletim?',
  TEXTO_INDICAR: 'Oi! Conheci o Neto, um ajudante do tribunal que explica golpes e diz o que fazer. Guarde este link: ',
  TEXTO_INDICAR_FIM: ' Se algo parecer estranho, é só abrir e perguntar.',
};
export const ALERTAS: { titulo: string; texto: string; destino: string }[] = [
  { titulo: 'Falso advogado cobrando taxa', texto: 'Circula mensagem de falso advogado pedindo taxa para liberar dinheiro de processo. A Justiça não cobra assim. Não pague.', destino: 'd:justica' },
  { titulo: 'Filho com número novo', texto: 'Golpistas mandam mensagem dizendo ser parente, com número novo, e pedem Pix urgente. Ligue para a pessoa no número antigo.', destino: 'd:parente' },
];
