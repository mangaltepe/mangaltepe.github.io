"""Build dependency-free GitHub Pages output. Run from repository root."""
from pathlib import Path
import shutil
import json
import re

ROOT = Path(__file__).resolve().parent.parent

def build():
    vendor = ROOT / 'vendor/netron'
    for name in ['python.js', 'pytorch.js', 'pytorch-metadata.json', 'onnx.js', 'onnx-metadata.json', 'modelscope.js']:
        path = vendor / name
        if not path.is_file() or path.stat().st_size == 0:
            raise RuntimeError(f'Missing model reader: {path}')
    for path in vendor.glob('*.json'):
        json.loads(path.read_text())
    output = ROOT / 'dist'
    if output.exists():
        shutil.rmtree(output)
    output.mkdir()
    for name in ['index.html', 'style.css', 'app.js', 'THIRD_PARTY_NOTICES.md']:
        shutil.copy2(ROOT / name, output / name)
    for name in ['vendor', 'examples']:
        shutil.copytree(ROOT / name, output / name)
    (output / '.nojekyll').touch()
    print(f'Built {len(list(output.rglob("*")))} entries into {output}')

if __name__ == '__main__':
    build()
