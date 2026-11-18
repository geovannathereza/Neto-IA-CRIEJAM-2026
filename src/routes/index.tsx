import { createFileRoute } from '@tanstack/react-router';
import { NetoChat } from '@/components/neto-chat';
export const Route = createFileRoute('/')({
  head:()=>({meta:[{title:'Neto · Cuidado e orientação'},{name:'description',content:'Orientações acolhedoras para pessoas idosas sobre golpes, direitos e atendimento do TJPE.'},{property:'og:title',content:'Neto · Cuidado e orientação'},{property:'og:description',content:'Converse sobre golpes e saiba como buscar ajuda. Protótipo de demonstração do TJPE.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
  component:NetoChat,
});
