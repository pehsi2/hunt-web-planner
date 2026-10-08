# Hunt Web Planner — Migração Fraquezas v0.3

Esta versão migra o Planner de Fraquezas para cálculo local em JavaScript.

## Instalação no GitHub Pages

Substitua `index.html`, `app.js`, `styles.css`, `README.md` e envie `data.json` **na raiz** do repositório. Não envie o XLSX original ou os scripts do Google Apps Script.

## Fonte e lógica

Dados exportados localmente do arquivo XLSX de referência, abas `Base Áreas V2`, `Base Pokémon V2`, `Matriz de Tipos`. Agrupamento por região, zona, área e nível. Para cada fraqueza, soma dos pesos dos Pokémon cuja combinação de tipos tem multiplicador >=2, limitada a 100% por área. Ordenação decrescente por cada fraqueza selecionada, na ordem dos filtros, seguindo a fórmula `SORT(...,5,FALSE,6,FALSE,7,FALSE)` da aba Cálculos V2. Os tipos duplicados são ignorados.

**Validação pendente:** compare os rankings para combinações diferentes com o Google Sheets original. Os dados são um snapshot, não sincronizam automaticamente.

O site é público. `data.json` e todo código são acessíveis a qualquer visitante. Não publicar dados pessoais, tokens ou planilhas privadas.

Para testar localmente: `python -m http.server 8000` e abra `http://localhost:8000`. Abrir `index.html` diretamente via `file://` não carrega JSON em muitos navegadores.
