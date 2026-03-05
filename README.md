# 📱 Pokédex

Uma Pokédex web responsiva, construída com **HTML, CSS e JavaScript puro**, consumindo a [PokéAPI](https://pokeapi.co/).

---

## ✨ Funcionalidades

- 🔍 **Busca** por nome ou número do Pokémon em tempo real
- 🎨 **Filtro por tipo** (Fire, Water, Grass, Psychic e mais 14 tipos)
- 🃏 **Cards coloridos** por tipo com imagem oficial, número e badges
- 📋 **Modal de detalhes** ao clicar em qualquer card, exibindo:
  - Altura, Peso, Power Total e Exp. Base
  - Habilidades (incluindo as ocultas)
  - Barras de estatísticas animadas (HP, Ataque, Defesa, Velocidade...)
  - Descrição oficial do Pokémon
- ♾️ **Carregamento incremental** com botão "Carregar mais"
- 💀 **Skeleton loader** enquanto os dados são buscados
- 📱 **Totalmente responsivo** — funciona bem em mobile e desktop
- ⌨️ Fecha o modal com **ESC** ou clicando fora

---

## 🗂️ Estrutura de arquivos

```
js-developer-pokedex/
├── index.html
├── assets/
│   ├── css/
│   │   ├── global.css        # Reset, variáveis de cor e tipo
│   │   └── pokedex.css       # Estilos dos componentes
│   └── js/
│       ├── pokemon-model.js  # Classe Pokemon com getters
│       ├── poke-api.js       # Comunicação com a PokéAPI
│       └── main.js           # Lógica principal (busca, filtros, modal)
```

---

## 🚀 Como rodar

Basta abrir o `index.html` diretamente no navegador — não há dependências para instalar.

> **Dica:** use a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code para evitar problemas de CORS com as imagens.

```bash
# Ou com qualquer servidor HTTP simples:
npx serve .
```

---

## 🌐 API utilizada

[PokéAPI](https://pokeapi.co/) — API REST gratuita com dados completos de todos os Pokémon.

| Endpoint | Uso |
|---|---|
| `/pokemon?limit=20&offset=0` | Lista paginada |
| `/pokemon/{id}` | Detalhes do Pokémon |
| `/pokemon-species/{id}` | Descrição (flavor text) |

---

## 🛠️ Tecnologias

- HTML5
- CSS3 (variáveis, grid, animações)
- JavaScript ES6+ (async/await, classes, módulos via script tags)

---

## 📸 Preview

> Cards coloridos por tipo, barra de busca, filtros e modal com stats detalhados.

---

Projeto baseado no desafio da [DIO](https://dio.me) — **Trilha JS Developer**.