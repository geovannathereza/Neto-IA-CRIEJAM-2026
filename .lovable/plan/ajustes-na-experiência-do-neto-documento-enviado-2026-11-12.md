# Ajustes na experiência do Neto (documento enviado)

## 1. Primeira tela
- Trocar a figura do Neto por uma nova ilustração (neto acolhedor com escudo da Justiça, cores do app).
- Remover todos os balões de áudio separados (com botão play e ondas) em todas as telas. O áudio fica só no botão "Ouvir" de cada mensagem.

## 2. Menu inicial com só duas opções
- "Estou na dúvida se é golpe"
- "Caí em um golpe"
- "Falaram do meu processo" e "Quem pode me ajudar" saem do menu (o conteúdo continua acessível dentro dos fluxos, ex.: resultado do teste rápido).

## 3. "Caí em um golpe" → tela "O que aconteceu?"
Seis opções, nesta ordem:
1. Falso funcionário do banco (usa a orientação atual "Ligaram do banco")
2. Golpe do falso advogado (usa a orientação atual "Sobre o seu processo")
3. Golpe do empréstimo consignado (usa a orientação atual "Desconto que não fiz")
4. Golpe do falso familiar (WhatsApp) (usa "Parente pediu dinheiro")
5. Golpe do Pix (novo texto abaixo)
6. Outro. Me conte — fecha a lista e convida a pessoa a escrever ou gravar áudio; a IA responde.

## 4. Golpe do Pix — "Faça isso agora"
Cinco passos exatamente como no documento, com título em negrito em cada passo, e no Passo 3 um link clicável "Registrar boletim de ocorrência pela internet" (delegaciapelainternet.pc.pe.gov.br).

## 5. Tela de orientações
- Remover a seção "Seus direitos" (Pix e demais golpes, para manter padrão).
- Remover "Imprimir resumo" e "Copiar mensagem para familiar". Mantenho "Avisar familiar no WhatsApp".
- Trocar "Sim, ajudou" pela pergunta "Você entendeu as orientações?" com "Sim" e "Não".
  - Sim: mensagem de encerramento acolhedora.
  - Não: Neto oferece ouvir de novo ("Ouvir") e mostra "Quem pode me ajudar" como apoio.

## Detalhes técnicos
- neto-content.ts: novo array de golpes (6 itens, títulos de passo em negrito, link no passo 3); remover uso de rightsText nos fluxos.
- neto-chat.tsx: menu de 2 ações, remover mensagens kind 'audio' e print/copy, nova ação "entendeu:sim/nao", "outro" foca o campo de mensagem; renderizar links em step-card.
- Nova imagem gerada em src/assets, substituindo NetoSticker.
- Atualizar testes em neto-rules.test.ts (6 opções, 5 passos do Pix, link presente) e verificar no preview com Playwright.
