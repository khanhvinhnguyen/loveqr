#!/usr/bin/env python3
"""
merge_qr_bg.py   v2.1
- Blur dot/shape của QR; phần còn lại trong suốt.
- Tùy chọn ép ảnh vuông theo qr_size.
Usage:
    python merge_qr_bg.py qr.png bg.jpg out.png [qr_size]
"""

import sys
from pathlib import Path
from typing import Optional                      # 👈 NEW
from PIL import Image, ImageFilter, ImageOps


def center_crop_to_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w == h:
        return img
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def main(qr_path: Path,
         bg_path: Path,
         out_path: Path,
         size: Optional[int] = None):            # 👈 NEW
    bg = Image.open(bg_path).convert("RGB")
    qr = Image.open(qr_path).convert("L")

    # --- ép vuông -----------------------------------------------------------
    bg = center_crop_to_square(bg)
    qr = center_crop_to_square(qr)

    if size:
        bg = bg.resize((size, size), Image.LANCZOS)
        qr = qr.resize((size, size), Image.NEAREST)

    # --- mask = vùng dot/shape ---------------------------------------------
    mask = qr.filter(ImageFilter.GaussianBlur(1))

    # --- frost layer --------------------------------------------------------
    blur_radius = max(bg.size) // 100 or 2
    blurred = bg.filter(ImageFilter.GaussianBlur(blur_radius))
    frost = Image.blend(
        blurred,
        Image.new("RGB", bg.size, "white"),
        1
    )

    Image.composite(frost, bg, mask).save(out_path)


if __name__ == "__main__":
    if len(sys.argv) not in (4, 5):
        sys.exit("Usage: merge_qr_bg.py qr.png bg.jpg out.png [qr_size]")
    qr_size = int(sys.argv[4]) if len(sys.argv) == 5 else None
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), qr_size)
