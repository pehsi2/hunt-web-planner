# HUNT Web Planner — Starter 0.1

Protótipo visual responsivo com navegação e filtros funcionais de demonstração para o Planner de Fraquezas. **Não é ainda a migração das fórmulas reais**; os dados em `app.js` foram transcritos de exemplos e o índice é apenas demonstrativo. Captura e Bosses são telas de preparação.

## Rodar localmente
Abra `index.html` em um navegador. Não exige Node ou instalação.

## Hospedagem com acesso restrito
1. Crie um repositório **privado** no GitHub, e envie `index.html`, `styles.css`, `app.js` e este README.
2. Conecte o repositório ao **Cloudflare Pages** e configure o diretório de saída como raiz (`/`); sem comando de build. Confirme a configuração exata no painel, pois as opções podem mudar.
3. No Cloudflare Zero Trust, crie uma aplicação **Access / Self-hosted** para o domínio do site (`seu-projeto.pages.dev`) e uma política **Allow** apenas para os e-mails dos amigos autorizados. Configure um método de login suportado (por exemplo, PIN por e-mail). Use uma política padrão de bloqueio e teste com janela anônima.
4. **Proteja também domínios de preview** ou desative preview deployments públicos. Confira o domínio exato, possíveis aliases e custom domains.
5. Não publique dados sensíveis, tokens, credenciais ou URLs privadas no JavaScript. Se algum dado tiver de ser privado, proteja toda rota que o distribui. Um repositório privado não protege por si só o site publicado.
6. Antes de enviar o link, teste um e-mail autorizado, um não autorizado, acesso direto a `app.js` e às rotas de dados, e preview URLs.

## Próxima etapa
Exportar um snapshot somente-leitura da planilha original para JSON e portar a lógica de Fraquezas com testes comparando os resultados do Sheets. Depois Captura e Bosses. **Não modifique** os scripts atuais do Google Sheets.

## Segurança
O site **não implementa login próprio**. A restrição de acesso é aplicada na borda pelo Cloudflare Access, depois da configuração feita pelo proprietário. Abrir localmente ou publicar sem Access não torna o site privado. Verifique limites/preços vigentes do provedor antes de implantar.
