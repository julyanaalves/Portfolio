# Portfólio • Julyana

Este repositório contém um frontend em React + Vite + Tailwind e um backend em Python Flask para servir dados do perfil a partir de um JSON, permitindo editar conteúdo sem rebuild do frontend.

## Estrutura

- frontend/ — SPA em React (Vite, TypeScript, Tailwind)
- backend/ — API Flask com endpoint `/api/profile`

## Como rodar

1) Backend (Python 3.10+)
- Crie um venv e instale dependências:

```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

- Rode a API:
```
python backend/app.py
```
A API subirá em http://127.0.0.1:8000

2) Frontend (Node 18+)
- Instale deps e rode:
```
cd frontend
npm install
npm run dev
```
O site abrirá em http://127.0.0.1:5173

Edite `backend/profile.json` para atualizar o conteúdo sem rebuild.
