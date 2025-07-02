"""Extract DNA sequence from PDF and update identity YAML."""
import sys
import re
from pathlib import Path
import yaml
from PyPDF2 import PdfReader

if len(sys.argv) < 3:
    print("Usage: python3 gatekeeper/pdf_dna_extract.py <pdf-file> <identity.yaml>")
    sys.exit(1)

pdf_file = Path(sys.argv[1])
identity_file = Path(sys.argv[2])

reader = PdfReader(str(pdf_file))
text = "".join(page.extract_text() or "" for page in reader.pages)
match = re.search(r"[ATCG]{10,}", text, re.I)
if not match:
    print("No DNA sequence found")
    sys.exit(0)

identity = {}
if identity_file.exists():
    with open(identity_file, encoding="utf-8") as f:
        identity = yaml.safe_load(f) or {}
identity["DNA"] = match.group(0)
with open(identity_file, "w", encoding="utf-8") as f:
    yaml.dump(identity, f, allow_unicode=True)
print("DNA sequence stored")
