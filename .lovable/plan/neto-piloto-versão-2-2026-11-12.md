# Neto piloto versão 2

Reescrever toda a conversa do Neto seguindo o arquivo enviado. O visual atual continua: cabeçalho, aviso verde, tema, A+, recomeçar, Ouvir, campo com microfone, "Voltar ao menu principal".

## O que muda para a pessoa
- **Menu inicial:** alerta da semana em amarelo (recolhido, botão "Ver"), novo balão de boas-vindas, 3 botões grandes (dúvida, caí em golpe, mensagem estranha), 2 menores (canais oficiais, mandar o Neto para alguém) e "O Neto não guarda sua conversa."
- **Fluxo 1, dúvida:** 6 situações, com sub-menu "Quem pediu o dinheiro?", respostas com 🚩 e 3 itens ✅, botões de ação dentro do passo (135, Meu INSS, tribunal quando preenchido). Termina com "Ficou claro?"; no "Não", versão mais curta.
- **Fluxo 2, caí em golpe:** os 6 golpes com cartões numerados e botões no próprio passo (boletim online, avisar alguém de confiança, INSS, consumidor.gov.br). No fim: cartão "Montar meu relato", "Ficou claro?", teste rápido.
- **Fluxo 3, mensagem estranha:** colar texto, botão Analisar; os sinais de alerta são procurados só no aparelho, com resultado em 3 níveis e aviso "Eu posso errar". Nunca diz que é seguro.
- **Fluxo 4, meu relato:** 4 perguntas com botões, texto pronto com campos entre colchetes destacados, botão Copiar.
- **Fluxo 5, canais oficiais**, **Fluxo 6, alertas** (2 exemplos), **Fluxo 7, mandar o Neto pelo WhatsApp**.
- **Teste rápido:** 4 perguntas "É golpe / Parece seguro" com placar final.
- **Painel do tribunal (exemplo):** página nova com faixa vermelha "dados fictícios", números e gráfico de barras fixos. Link discreto no rodapé.
- Em toda tela: "Voltar uma etapa" e "Voltar ao menu principal". Rodapé: "Isto é uma orientação. Não substitui banco, polícia ou advogado."
- Botões com no mínimo 56px, um por linha; botões de ação com cor diferente dos de navegação.
- "Ouvir" lê o título e todo o texto, na ordem.
- Os links e telefones vazios (telefone e site do TJPE, Defensoria, Procon) não aparecem até serem preenchidos.

## Texto livre e voz
- O que a pessoa digita ou fala primeiro passa pelas palavras-chave do arquivo, no aparelho. Texto com mais de 150 letras vai para o verificador de mensagem.
- **Se nada for reconhecido, a IA responde** (texto sem dados pessoais, nada guardado), como você escolheu.
- **O microfone continua**: o áudio vira texto fora do aparelho, sem ser guardado.

## Detalhes técnicos
- Um módulo `neto-config` com o CONFIG e os ALERTAS; o conteúdo dos fluxos fica num único arquivo de roteiro (`neto-flows`), com o roteamento por palavras-chave e o analisador de sinais como funções puras.
- O chat vira uma máquina de estados com pilha de etapas, para o "Voltar uma etapa".
- Nova rota `/painel` com head próprio; meta description da página inicial cita TJPE.
- O fluxo antigo ("processo", quiz de 3 perguntas, helpNetwork) é removido; a tela `/equipe` não muda.
- Testes: roteamento por palavras-chave, níveis do verificador, texto do relato, placar do teste, esconder valores vazios.
