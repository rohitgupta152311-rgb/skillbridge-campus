import os
from PIL import Image, ImageDraw, ImageFont

res_dir = r"C:\Users\rohit\.gemini\antigravity\scratch\skillbridge-campus\standalone-builder\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192
}

def create_icon(size):
    # High-res canvas for antialiasing (4x supersampling)
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded rectangle background with indigo gradient
    r = int(canvas_size * 0.22)
    # Background rectangle
    draw.rounded_rectangle([0, 0, canvas_size - 1, canvas_size - 1], radius=r, fill=(79, 70, 229, 255))
    
    # Subtle inner accent
    inner_pad = int(canvas_size * 0.04)
    draw.rounded_rectangle([inner_pad, inner_pad, canvas_size - 1 - inner_pad, canvas_size - 1 - inner_pad], 
                           radius=r - inner_pad, 
                           outline=(129, 140, 248, 120), 
                           width=int(scale * 1.5))

    # Center Graduation Cap / Logo drawing
    cx = canvas_size / 2
    cy = canvas_size / 2

    # Draw Cap top diamond
    cap_w = canvas_size * 0.32
    cap_h = canvas_size * 0.16
    top_diamond = [
        (cx, cy - cap_h - canvas_size * 0.08),
        (cx + cap_w, cy - canvas_size * 0.08),
        (cx, cy + cap_h - canvas_size * 0.08),
        (cx - cap_w, cy - canvas_size * 0.08)
    ]
    draw.polygon(top_diamond, fill=(255, 255, 255, 255))

    # Cap base skullcap
    base_w = cap_w * 0.65
    base_top_y = cy - canvas_size * 0.07
    base_bot_y = cy + canvas_size * 0.10
    draw.chord([cx - base_w, base_top_y, cx + base_w, base_bot_y + canvas_size * 0.12], 
               start=0, end=180, fill=(224, 231, 255, 255))

    # Tassel cord and tassel (gold)
    tassel_color = (245, 158, 11, 255) # Amber gold
    draw.line([(cx, cy - cap_h - canvas_size * 0.08), (cx + cap_w * 0.9, cy + canvas_size * 0.08)], 
              fill=tassel_color, width=int(scale * 2))
    draw.ellipse([cx + cap_w * 0.85, cy + canvas_size * 0.08, 
                  cx + cap_w * 0.98, cy + canvas_size * 0.18], fill=tassel_color)

    # Stylized "SB" monogram or banner below
    banner_w = canvas_size * 0.36
    banner_y = cy + canvas_size * 0.22
    draw.rounded_rectangle([cx - banner_w, banner_y, cx + banner_w, banner_y + canvas_size * 0.12], 
                           radius=int(scale * 4), fill=(245, 158, 11, 255))

    # Downsample with Lanczos for smooth antialiasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)
    return final_img

for folder, s in sizes.items():
    out_dir = os.path.join(res_dir, folder)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "ic_launcher.png")
    icon = create_icon(s)
    icon.save(out_path, format="PNG")
    print(f"Generated {out_path} ({s}x{s})")

print("All launcher icons generated successfully.")
