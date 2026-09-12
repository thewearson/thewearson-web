#!/usr/bin/env python3
"""Website-only mockup compositing. Does not touch the iOS app."""

from __future__ import annotations

import os
from collections import deque
from glob import glob

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "out")
ANIM_IN = "/tmp/two-rec/anim"
ANIM_OUT = os.path.join(OUT, "anim")
FONT = "/System/Library/Fonts/HelveticaNeue.ttc"

os.makedirs(OUT, exist_ok=True)
os.makedirs(ANIM_OUT, exist_ok=True)


def font(size, index=1):
    return ImageFont.truetype(FONT, size, index=index)


def cover(src, size, focus_x=0.5, focus_y=0.22, zoom=1.0):
    tw, th = size
    im = src.convert("RGB")
    sw, sh = im.size
    scale = max(tw / sw, th / sh) * max(1.0, zoom)
    nw = max(tw, int(round(sw * scale)))
    nh = max(th, int(round(sh * scale)))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = int((nw - tw) * focus_x)
    y = int((nh - th) * focus_y)
    x = max(0, min(nw - tw, x))
    y = max(0, min(nh - th, y))
    return im.crop((x, y, x + tw, y + th))


def contain(src, size, bg=(247, 247, 247), pad=0.05):
    tw, th = size
    im = src.convert("RGB")
    sw, sh = im.size
    scale = min((tw * (1 - 2 * pad)) / sw, (th * (1 - 2 * pad)) / sh)
    nw, nh = max(1, int(sw * scale)), max(1, int(sh * scale))
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (tw, th), bg)
    canvas.paste(im, ((tw - nw) // 2, (th - nh) // 2))
    return canvas


def circle(dst, src, cx, cy, d, focus_x=0.5, focus_y=0.28, zoom=1.15):
    d = int(d)
    cx, cy = float(cx), float(cy)
    draw = ImageDraw.Draw(dst)
    pad = max(3, d // 18)
    draw.ellipse(
        (cx - d / 2 - pad, cy - d / 2 - pad, cx + d / 2 + pad, cy + d / 2 + pad),
        fill=(255, 255, 255),
    )
    face = cover(src, (d, d), focus_x=focus_x, focus_y=focus_y, zoom=zoom)
    mask = Image.new("L", (d, d), 0)
    ImageDraw.Draw(mask).ellipse((1, 1, d - 2, d - 2), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(0.35))
    dst.paste(face, (int(round(cx - d / 2)), int(round(cy - d / 2))), mask)
    ring = max(1, round(d * 0.012))
    draw.ellipse(
        (cx - d / 2, cy - d / 2, cx + d / 2 - 1, cy + d / 2 - 1),
        outline=(0, 0, 0),
        width=ring,
    )


def wipe(draw, box, fill=(255, 255, 255)):
    draw.rectangle(box, fill=fill)


def draw_centered(draw, text, cx, y, fnt, fill=(0, 0, 0), tracking=0.6):
    xs = []
    x = 0
    for ch in text:
        w = fnt.getlength(ch)
        xs.append((ch, x))
        x += w + tracking
    start = cx - x / 2
    for ch, ox in xs:
        draw.text((start + ox, y), ch, font=fnt, fill=fill)


def draw_left(draw, text, x, y, fnt, fill=(0, 0, 0), tracking=0.4):
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += fnt.getlength(ch) + tracking


def load(name):
    return Image.open(os.path.join(SRC, name)).convert("RGB")


_rocky_ig = Image.open(os.path.join(SRC, "pp-rocky-ig.png")).convert("RGB")
rocky_pp = _rocky_ig.crop((27, 8, 218, 199))
rocky_shot = load("rocky-pap.jpg")
hoodie = load("loewe-hoodie.jpg")
carti = load("wm-Playboi_Carti_(cropped).jpg")
travis = load("wm-Travis_Scott_February_2016.jpg")
uzi = Image.open(os.path.join(SRC, "uzi.png")).convert("RGB")
_cee = load("ccee-Central_Cee.jpg")
cw, ch = _cee.size
cee = _cee.crop((int(cw * 0.38), int(ch * 0.18), int(cw * 0.62), int(ch * 0.78)))
miles = load("miles.png")

HIGHLIGHTS = [
    (61.5, 305, 86, rocky_pp, "ROCKY", dict(focus_x=0.52, focus_y=0.42, zoom=1.08)),
    (165.5, 305, 86, carti, "CARTI", dict(focus_x=0.50, focus_y=0.16, zoom=1.85)),
    (270.0, 305, 86, travis, "TRAVIS", dict(focus_x=0.28, focus_y=0.20, zoom=1.55)),
    (374.5, 305, 86, uzi, "UZI", dict(focus_x=0.48, focus_y=0.22, zoom=1.35)),
    (454.0, 305, 86, cee, "CEE", dict(focus_x=0.42, focus_y=0.28, zoom=1.4)),
]


def edit_feed(im):
    im = im.convert("RGB")
    s = im.width / 473
    d = ImageDraw.Draw(im)
    wipe(d, (int(8 * s), int(348 * s), int(473 * s), int(376 * s)))
    for cx, cy, dia, face, label, crop in HIGHLIGHTS:
        circle(im, face, cx * s, cy * s, int(dia * s), **crop)
        draw_centered(d, label, cx * s, 352 * s, font(max(7, int(8 * s)), 1), tracking=0.8)

    circle(im, rocky_pp, 37.5 * s, 449 * s, int(38 * s), focus_x=0.52, focus_y=0.42, zoom=1.08)
    wipe(d, (int(58 * s), int(422 * s), int(280 * s), int(472 * s)))
    draw_left(d, "A$AP ROCKY", 62 * s, 428 * s, font(max(8, int(11 * s)), 1), tracking=0.5)
    draw_left(d, "2 HOURS AGO", 62 * s, 448 * s, font(max(6, int(8 * s)), 0), fill=(130, 130, 130), tracking=0.5)

    photo = (int(20 * s), int(490 * s), int(433 * s), int(428 * s))
    fitted = cover(rocky_shot, (photo[2], photo[3]), focus_x=0.40, focus_y=0.02, zoom=1.22)
    im.paste(fitted, (photo[0], photo[1]))
    return im


def overlay_bbox(src, box):
    x0, y0, bw, bh = box
    px = src.load()
    x1, y1 = x0 + bw, y0 + bh
    seed = None
    for y in range(y0 + bh // 5, y0 + (4 * bh) // 5, 8):
        for x in range(x0 + bw // 4, x0 + (3 * bw) // 4, 8):
            r, g, b = px[x, y]
            if r > 250 and g > 250 and b > 250 and abs(r - g) < 6:
                seed = (x, y)
                break
        if seed:
            break
    if not seed:
        return None
    seen = set()
    q = deque([seed])
    minx = maxx = seed[0]
    miny = maxy = seed[1]
    while q:
        x, y = q.popleft()
        if (x, y) in seen or x < x0 or y < y0 or x >= x1 or y >= y1:
            continue
        r, g, b = px[x, y]
        white = r > 242 and g > 242 and b > 242 and abs(r - g) < 10
        black = r < 45 and g < 45 and b < 45
        red = r > 170 and g < 90 and b < 90
        blue = r < 140 and g > 140 and b > 180
        if not (white or black or red or blue):
            continue
        seen.add((x, y))
        minx = min(minx, x)
        maxx = max(maxx, x)
        miny = min(miny, y)
        maxy = max(maxy, y)
        q.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
        if len(seen) > 120000:
            break
    card_w = maxx - minx
    card_h = maxy - miny
    if len(seen) < 1200 or card_w < 80 or card_h < 100 or card_w > bw * 0.7:
        return None
    pad = 4
    return (max(x0, minx - pad), max(y0, miny - pad), min(x1, maxx + pad), min(y1, maxy + pad))


def copy_toasts(src, dst, box):
    x0, y0, bw, bh = box
    px = src.load()
    y1 = y0 + bh
    for y in range(y1 - 90, y1):
        dark = 0
        for x in range(x0, x0 + bw, 4):
            r, g, b = px[x, y]
            if r < 40 and g < 40 and b < 40:
                dark += 1
        if dark > bw / 12:
            band = src.crop((x0, y, x0 + bw, min(y + 36, y1)))
            dst.paste(band, (x0, y))
            break


PHOTO_VIDEO = (36, 354, 814, 1001)


def extract_overlay(frame):
    ov = overlay_bbox(frame, PHOTO_VIDEO)
    toast = None
    x0, y0, bw, bh = PHOTO_VIDEO
    px = frame.load()
    y1 = y0 + bh
    for y in range(y1 - 90, y1):
        dark = 0
        for x in range(x0, x0 + bw, 4):
            r, g, b = px[x, y]
            if r < 40 and g < 40 and b < 40:
                dark += 1
        if dark > bw / 12:
            toast = frame.crop((x0, y, x0 + bw, min(y + 36, y1)))
            break
    crop = frame.crop(ov) if ov else None
    return crop, ov, toast


def edit_stars(im):
    im = im.convert("RGB")
    s = im.width / 473
    tab = im.crop((0, int(912 * s), im.width, im.height))
    d = ImageDraw.Draw(im)
    top = [
        (111, 546, 180, rocky_pp, "A$AP ROCKY", "UNITED STATES", dict(focus_x=0.52, focus_y=0.42, zoom=1.08)),
        (340, 546, 180, carti, "PLAYBOI CARTI", "UNITED STATES", dict(focus_x=0.50, focus_y=0.16, zoom=1.85)),
    ]
    bottom = [
        (111, 852, 180, travis, dict(focus_x=0.28, focus_y=0.20, zoom=1.55)),
        (340, 852, 180, cee, dict(focus_x=0.42, focus_y=0.28, zoom=1.4)),
    ]
    for cx, cy, dia, face, name, country, crop in top:
        circle(im, face, cx * s, cy * s, int(dia * s), **crop)
    for cx, cy, dia, face, crop in bottom:
        circle(im, face, cx * s, cy * s, int(dia * s), **crop)

    wipe(d, (0, int(616 * s), im.width, int(708 * s)))
    for cx, cy, dia, face, name, country, crop in top:
        circle(im, face, cx * s, cy * s, int(dia * s), **crop)
        nx = (cx - dia / 2 + 8) * s
        draw_left(d, name, nx, 646 * s, font(max(8, int(10 * s)), 1), tracking=0.65)
        draw_left(
            d,
            country,
            nx,
            664 * s,
            font(max(6, int(8 * s)), 0),
            fill=(120, 120, 120),
            tracking=0.85,
        )
    im.paste(tab, (0, int(912 * s)))
    return im


def paint_tile(im, d, src, box, caption, focus_y=0.08, tracking=0.8, mode="cover", focus_x=0.5, zoom=1.0):
    x, y, w, h = box
    bar_h = max(22, int(h * 0.11))
    photo = contain(src, (w, h - bar_h)) if mode == "contain" else cover(
        src, (w, h - bar_h), focus_x=focus_x, focus_y=focus_y, zoom=zoom
    )
    im.paste(photo, (x, y))
    d.rectangle((x, y + h - bar_h, x + w, y + h), fill=(0, 0, 0))
    draw_centered(
        d,
        caption,
        x + w / 2,
        y + h - bar_h + int(bar_h * 0.22),
        font(max(7, int(h * 0.032)), 1),
        fill=(255, 255, 255),
        tracking=tracking,
    )
    d.rectangle((x, y, x + w - 1, y + h - 1), outline=(0, 0, 0), width=max(1, im.width // 473))


def edit_lookbook(im):
    im = im.convert("RGB")
    s = im.width / 473
    d = ImageDraw.Draw(im)
    paint_tile(
        im,
        d,
        rocky_shot,
        (int(20 * s), int(229 * s), int(212 * s), int(284 * s)),
        "A$AP ROCKY",
        focus_x=0.40,
        focus_y=0.0,
        zoom=1.18,
        tracking=0.8,
    )
    paint_tile(
        im,
        d,
        hoodie,
        (int(20 * s), int(558 * s), int(212 * s), int(285 * s)),
        "LOEWE",
        mode="contain",
        tracking=1.2,
    )
    return im


def edit_profile(im):
    im = im.convert("RGB")
    s = im.width / 473
    d = ImageDraw.Draw(im)
    circle(im, miles, 236 * s, 292 * s, int(108 * s))
    wipe(d, (int(60 * s), int(384 * s), int(414 * s), int(448 * s)))
    draw_centered(d, "MILES", 236 * s, 396 * s, font(max(18, int(28 * s)), 1), tracking=2.2)
    wipe(d, (0, int(618 * s), im.width, im.height))
    return im


def save(im, name, scale=2):
    out = im.resize((im.width * scale, im.height * scale), Image.Resampling.LANCZOS) if scale != 1 else im
    path = os.path.join(OUT, name)
    out.save(path, "JPEG", quality=92)
    print("wrote", path, out.size)
    return path


def paint_overlay(base, crop, toast):
    bw, bh = base.size
    s = bw / 473
    photo = (int(20 * s), int(490 * s), int(433 * s), int(428 * s))
    if crop is not None:
        scale = bw / 888
        nw = max(8, int(crop.width * scale))
        nh = max(8, int(crop.height * scale))
        card = crop.resize((nw, nh), Image.Resampling.LANCZOS)
        x = photo[0] + photo[2] // 2 - nw // 2
        y = photo[1] + int(photo[3] * 0.38) - nh // 2
        base.paste(card, (x, y))
    if toast is not None:
        tw = photo[2]
        th = max(28, int(toast.height * (bw / 888)))
        bar = toast.resize((tw, th), Image.Resampling.LANCZOS)
        base.paste(bar, (photo[0], photo[1] + photo[3] - th - 8))
    return base


def main():
    feed = edit_feed(load("feed.jpg"))
    feed_hi = feed.resize((946, 2048), Image.Resampling.LANCZOS)
    save(feed, "feed.jpg")
    save(edit_stars(load("stars.png")), "stars.jpg")
    save(edit_lookbook(load("lookbook.png")), "lookbook.jpg")
    save(edit_profile(load("profile.png")), "profile.jpg")

    frames = sorted(glob(os.path.join(ANIM_IN, "f-*.png")))
    print("anim frames", len(frames))
    for i, path in enumerate(frames, 1):
        crop, ov, toast = extract_overlay(Image.open(path).convert("RGB"))
        fr = paint_overlay(feed_hi.copy(), crop, toast)
        fr.save(os.path.join(ANIM_OUT, f"{i:03d}.jpg"), "JPEG", quality=86)
        if i in (1, 10, 20, 90, 120):
            fr.save(os.path.join(OUT, f"feed-frame-{i:03d}.jpg"), "JPEG", quality=90)
            print("preview", i, "overlay", bool(ov), "toast", toast is not None)
        if i % 30 == 0:
            print("anim", i)

    import imageio_ffmpeg
    import subprocess

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    mp4 = os.path.join(OUT, "feed.mp4")
    subprocess.check_call(
        [
            ffmpeg,
            "-y",
            "-framerate",
            "20",
            "-i",
            os.path.join(ANIM_OUT, "%03d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "20",
            "-movflags",
            "+faststart",
            mp4,
        ]
    )
    print("wrote", mp4)


if __name__ == "__main__":
    main()
