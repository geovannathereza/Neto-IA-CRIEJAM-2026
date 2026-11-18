import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const GOLPES = [['Falso familiar (WhatsApp)', 31], ['Golpe do Pix', 24], ['Falso funcionário do banco', 18], ['Empréstimo consignado', 15], ['Falso advogado', 12]] as const;
export const Route = createFileRoute('/painel')({
  head: () => ({ meta: [{ title: 'Painel do tribunal (exemplo) · Neto TJPE' }, { name: 'description', content: 'Exemplo com dados fictícios dos golpes mais consultados no Neto, assistente do TJPE.' }, { property: 'og:title', content: 'Painel do tribunal (exemplo) · Neto TJPE' }, { property: 'og:description', content: 'Dados fictícios do piloto: o que as pessoas mais perguntam ao Neto.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
  component: Painel,
});
function Painel() {
  return <main className="panel-page">
    <div className="panel-banner" role="note">Exemplo com dados fictícios. O Neto não coleta nem guarda dados pessoais.</div>
    <h1>Painel do tribunal: o que as pessoas mais perguntam</h1>
    <section className="panel-card"><h2>Total de usos na semana</h2><div className="panel-big">1.240</div></section>
    <section className="panel-card"><h2>Golpes mais consultados</h2>{GOLPES.map(([nome, pct]) => <div key={nome} className="bar-row"><span>{nome}: <strong>{pct}%</strong></span><div className="bar-track" aria-hidden="true"><div className="bar-fill" style={{ width: `${pct * 2.5}%` }} /></div></div>)}</section>
    <section className="panel-card"><h2>Ficou claro?</h2><p><strong className="panel-big">86%</strong> Sim · <strong>14%</strong> Não</p></section>
    <section className="panel-card"><h2>Onde as pessoas mais pedem para explicar de novo</h2><ol><li>Devolução do Pix</li><li>Meu INSS</li><li>Bloquear e denunciar no WhatsApp</li></ol></section>
    <section className="panel-card"><h2>Para o tribunal</h2><p>Com esses dados, o tribunal pode priorizar alertas e campanhas nos golpes que mais aparecem.</p></section>
    <Button asChild variant="chat" className="primary-action"><Link to="/">Voltar ao Neto</Link></Button>
  </main>;
}
