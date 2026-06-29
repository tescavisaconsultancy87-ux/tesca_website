import base64
from PIL import Image
import io

def generate_favicons():
    # 1. Open original logo
    img = Image.open('public/images/Tesca_logo.png').convert('RGBA')
    
    # 2. Crop the emblem region (1280, 50, 1570, 555)
    emblem = img.crop((1280, 50, 1570, 555))
    
    # 3. Create a 512x512 transparent canvas and paste the resized emblem
    # We want height to be 460. Scale width proportionally.
    orig_w, orig_h = emblem.size
    target_h = 460
    target_w = int(orig_w * (target_h / orig_h))
    
    resized_emblem = emblem.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    favicon_png = Image.new('RGBA', (512, 512), (255, 255, 255, 0))
    x_offset = (512 - target_w) // 2
    y_offset = (512 - target_h) // 2
    favicon_png.paste(resized_emblem, (x_offset, y_offset), resized_emblem)
    
    # Save public/favicon.png
    favicon_png.save('public/favicon.png', format='PNG')
    print("Saved public/favicon.png (512x512)")
    
    # 4. Generate public/favicon.ico
    # ICO standard sizes: 16x16, 32x32, 48x48
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    ico_images = []
    for size in ico_sizes:
        # Resize emblem to fit within the square size preserving aspect ratio
        h_to_fit = size[1] - 2 # 2px margin
        w_to_fit = int(orig_w * (h_to_fit / orig_h))
        # Ensure width is at least 1 and within size[0]
        w_to_fit = max(1, min(w_to_fit, size[0]))
        small_emblem = emblem.resize((w_to_fit, h_to_fit), Image.Resampling.LANCZOS)
        
        # Center on a transparent canvas of current size
        canvas = Image.new('RGBA', size, (255, 255, 255, 0))
        canvas.paste(small_emblem, ((size[0] - w_to_fit) // 2, (size[1] - h_to_fit) // 2), small_emblem)
        ico_images.append(canvas)
        
    ico_images[1].save('public/favicon.ico', format='ICO', append_images=ico_images)
    print("Saved public/favicon.ico (16x16, 32x32, 48x48)")
    
    # 5. Generate public/favicon.svg
    # We will embed a 128x128 PNG as base64 inside the SVG
    svg_png_size = 128
    svg_emblem_h = 114
    svg_emblem_w = int(orig_w * (svg_emblem_h / orig_h))
    
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
