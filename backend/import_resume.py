import json
from pathlib import Path
from PyPDF2 import PdfReader

CUR_DIR = Path(__file__).resolve().parent
PDF_PATH = CUR_DIR.parent / "Currículo - Julyana dos Santos Alves.pdf"
PROFILE_JSON = CUR_DIR / "profile.json"


def extract_text_from_pdf(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts)


def parse_profile(text: str) -> dict:
    # Heurística simples: procura por campos conhecidos. Ajuste conforme necessário ao seu PDF.
    lines = [l.strip() for l in text.splitlines() if l.strip()]

    nome = "Julyana dos Santos Alves"
    titulo = "Profissional"
    resumo = "Resumo não extraído automaticamente. Preencha manualmente se necessário."

    contatos = []
    habilidades = []
    experiencias = []
    formacao = []
    links = []

    # Regras básicas
    for l in lines:
        low = l.lower()
        if "linkedin.com" in low:
            contatos.append({"tipo": "LinkedIn", "valor": l, "url": f"https://{l}" if not l.startswith("http") else l})
        if "github.com" in low:
            links.append({"label": "GitHub", "url": f"https://{l}" if not l.startswith("http") else l})
        if "@" in l and "." in l and " " not in l:
            contatos.append({"tipo": "Email", "valor": l})
        if low.startswith("telefone") or low.startswith("cel") or "+" in l:
            contatos.append({"tipo": "Telefone", "valor": l})

    # Campos default se vazios
    if not contatos:
        contatos = [{"tipo": "Email", "valor": "seuemail@example.com"}]

    profile = {
        "nome": nome,
        "titulo": titulo,
        "resumo": resumo,
        "contatos": contatos,
        "habilidades": habilidades,
        "experiencias": experiencias,
        "formacao": formacao,
        "links": links,
    }
    return profile


def main():
    if not PDF_PATH.exists():
        raise SystemExit(f"PDF nao encontrado: {PDF_PATH}")

    text = extract_text_from_pdf(PDF_PATH)
    profile = parse_profile(text)

    PROFILE_JSON.write_text(json.dumps(profile, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Perfil atualizado em {PROFILE_JSON}")


if __name__ == "__main__":
    main()
