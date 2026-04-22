"""
감정 캐릭터 PNG의 흰 배경을 제거합니다 (순수 PIL, 넘파이 불필요).
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
FILES = ("anger.png", "sad.png", "nervous.png", "clock.png")


def is_near_gray_white(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    avg = (r + g + b) / 3.0
    if mx - mn > 22:
        return False
    return avg >= 249.0


def flood_background_mask(width: int, height: int, px) -> list[list[bool]]:
    mask = [[False] * width for _ in range(height)]
    q: deque[tuple[int, int]] = deque()

    def push(y: int, x: int) -> None:
        if y < 0 or y >= height or x < 0 or x >= width or mask[y][x]:
            return
        r, g, b, _ = px[x, y]
        if not is_near_gray_white(r, g, b):
            return
        mask[y][x] = True
        q.append((y, x))

    for x in range(width):
        push(0, x)
        push(height - 1, x)
    for y in range(height):
        push(y, 0)
        push(y, width - 1)

    while q:
        y, x = q.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if ny < 0 or ny >= height or nx < 0 or nx >= width or mask[ny][nx]:
                continue
            r, g, b, _ = px[nx, ny]
            if not is_near_gray_white(r, g, b):
                continue
            mask[ny][nx] = True
            q.append((ny, nx))

    return mask


def process_file(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    px = img.load()
    w, h = img.size
    mask = flood_background_mask(w, h, px)

    out = Image.new("RGBA", (w, h))
    ox = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if mask[y][x]:
                ox[x, y] = (r, g, b, 0)
            else:
                ox[x, y] = (r, g, b, a)

    out.save(path, optimize=True)
    print(f"OK {path.name}")


def main() -> None:
    for name in FILES:
        p = ASSETS / name
        if not p.exists():
            print(f"Skip missing: {p}")
            continue
        process_file(p)


if __name__ == "__main__":
    main()
