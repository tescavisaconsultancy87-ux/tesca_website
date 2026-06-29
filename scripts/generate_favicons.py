import base64
from PIL import Image
import io

def generate_favicons():
    # 1. Open the user-provided high-res logo
    input_path = 'C:/Users/dhame/.gemini/antigravity-ide/brain/6dbc0fbe-36b0-4e5b-b1cb-5400cd627626/media__1782713892898.png'
    img = Image.open(input_path).convert('RGBA')
    width, height = img.size
    pixels = img.load()
    
    # 2. Flood-fill from corners to make the white background transparent
    # This keeps any white details inside the emblem intact.
    visited = set()
    queue = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    for q in queue:
        visited.add(q)
        
    while queue:
        x, y = queue.pop(0)
        r, g, b, a = pixels[x, y]
        # Check if the pixel is white-ish (R, G, B all > 240)
        if r > 240 and g > 240 and b > 240:
            pixels[x, y] = (r, g, b, 0)  # Make transparent
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    queue.append((nx, ny))
                    
    # Also save the transparent source file for records
    img.save('public/images/Tesca_favicon_source.png', format='PNG')
    print("Saved transparent source image as public/images/Tesca_favicon_source.png")
    
    # 3. Crop tightly to the content bounding box
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        bbox = (0, 0, width, height)
    print("Content bounding box:", bbox)
    emblem = img.crop(bbox)
    
    # 4. Generate public/favicon.png (512x512)
    # Scale emblem to fit inside 460x460 (preserving aspect ratio)
    orig_w, orig_h = emblem.size
    max_dim = max(orig_w, orig_h)
    scale = 460.0 / max_dim
    target_w = int(orig_w * scale)
    target_h = int(orig_h * scale)
    
    resized_emblem = emblem.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    favicon_png = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
    x_offset = (512 - target_w) // 2
    y_offset = (512 - target_h) // 2
    favicon_png.paste(resized_emblem, (x_offset, y_offset), resized_emblem)
    favicon_png.save('public/favicon.png', format='PNG')
    print("Saved public/favicon.png (512x512)")
    
    # 5. Generate public/favicon.ico
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = []
    for size in ico_sizes:
        h_to_fit = size[1] - 2  # 2px margin
        w_to_fit = int(orig_w * (h_to_fit / orig_h))
        w_to_fit = max(1, min(w_to_fit, size[0]))
        small_emblem = emblem.resize((w_to_fit, h_to_fit), Image.Resampling.LANCZOS)
        
        canvas = Image.new('RGBA', size, (255, 255, 255, 0))
        canvas.paste(small_emblem, ((size[0] - w_to_fit) // 2, (size[1] - h_to_fit) // 2), small_emblem)
        ico_images.append(canvas)
        
    ico_images[1].save('public/favicon.ico', format='ICO', append_images=ico_images)
    print("Saved public/favicon.ico (16x16, 32x32, 48x48)")
    
    # 6. Generate public/favicon.svg (embed a 128x128 PNG)
    svg_png_size = 128
    svg_emblem_h = 114
    svg_emblem_w = int(orig_w * (svg_emblem_h / orig_h))
    svg_emblem_w = min(svg_emblem_w, 114)
    
    svg_resized_emblem = emblem.resize((svg_emblem_w, svg_emblem_h), Image.Resampling.LANCZOS)
    svg_canvas = Image.new('RGBA', (svg_png_size, svg_png_size), (255, 255, 255, 0))
    svg_canvas.paste(svg_resized_emblem, ((svg_png_size - svg_emblem_w) // 2, (svg_png_size - svg_emblem_h) // 2), svg_resized_emblem)
    
    buffer = io.BytesIO()
    svg_canvas.save(buffer, format='PNG')
    png_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="100%" height="100%">
  <image href="data:image/png;base64,{png_base64}" x="0" y="0" width="128" height="128" />
</svg>
'''
    with open('public/favicon.svg', 'w') as f:
        f.write(svg_content)
    print("Saved public/favicon.svg with embedded 128x128 PNG")

if __name__ == '__main__':
    generate_favicons()
