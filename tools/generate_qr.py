from pathlib import Path
import base64
import io
import json
import urllib.parse

import qrcode

BASE_URL = "https://esakits.github.io/hiragana-handwriting-videos/"

videos = json.loads(Path("videos.json").read_text(encoding="utf-8"))
out_dir = Path("qr")
out_dir.mkdir(exist_ok=True)

for item in videos:
    url = BASE_URL + "?kana=" + urllib.parse.quote(item["kana"], safe="")
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=6,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    image = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG", optimize=True)
    data = base64.b64encode(buffer.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">'
        f'<image width="1" height="1" href="data:image/png;base64,{data}"/>'
        '</svg>'
    )
    (out_dir / f'{item["id"]}.svg').write_text(svg, encoding="utf-8")

print(f"Generated {len(videos)} QR codes for {BASE_URL}")
# Regenerate whenever this script changes.
