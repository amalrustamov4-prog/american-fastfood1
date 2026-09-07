import os
from PIL import Image, ImageEnhance, ImageFilter

input_dir = 'new_menu_raw'
output_dirs = [
    'images',
    'public/images',
    'android_app/app/src/main/assets/www/images'
]

for out_dir in output_dirs:
    os.makedirs(out_dir, exist_ok=True)

files = sorted(os.listdir(input_dir))
print(f"Enhancing {len(files)} menu images to crisp HD...")

for f in files:
    if not f.lower().endswith(('.jpg', '.jpeg', '.png')):
        continue
    in_path = os.path.join(input_dir, f)
    try:
        with Image.open(in_path) as img:
            img = img.convert('RGB')
            w, h = img.size
            # Double resolution with high-quality Lanczos filter
            new_w, new_h = max(w * 2, 1000), max(h * 2, 800)
            if w < 1000:
                img_enhanced = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            else:
                img_enhanced = img
            
            # Apply unsharp mask & sharpness enhancement to remove blur/noise
            img_enhanced = img_enhanced.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
            enhancer = ImageEnhance.Sharpness(img_enhanced)
            img_enhanced = enhancer.enhance(1.25)
            
            # Color & contrast boost for appetizing food look
            contrast = ImageEnhance.Contrast(img_enhanced)
            img_enhanced = contrast.enhance(1.08)
            
            color = ImageEnhance.Color(img_enhanced)
            img_enhanced = color.enhance(1.06)

            for out_dir in output_dirs:
                out_path = os.path.join(out_dir, f)
                img_enhanced.save(out_path, 'JPEG', quality=95, optimize=True)
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("All menu images successfully enhanced and exported!")
