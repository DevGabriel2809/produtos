# Organização recomendada do projeto PRODUTOS

Use a página de venda na raiz do projeto e deixe cada demonstração em sua própria pasta.

```txt
PRODUTOS/
├── index.html              página de venda / catálogo
├── style.css               CSS da página de venda
├── script.js               JS da página de venda
│
├── civel/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── civel2/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── trabalhista/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── trabalhista2/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── tributario/
│   ├── tributario.html
│   ├── tributario.css
│   └── main.js
└── tributario2/
    ├── index.html
    ├── style.css
    └── script.js
```

## O que fazer agora

1. Substitua os arquivos da raiz pelos arquivos desta pasta: `index.html`, `style.css` e `script.js`.
2. Mantenha as pastas dos produtos na raiz.
3. Evite deixar outros modelos soltos na raiz, para não confundir o navegador e o Git.
4. Publique a pasta `PRODUTOS` inteira no Netlify.

## Links usados na página

- `tributario/tributario.html`
- `tributario2/index.html`
- `civel/index.html`
- `civel2/index.html`
- `trabalhista/index.html`
- `trabalhista2/index.html`

Caso alguma pasta tenha outro nome, altere o link no `index.html`.
