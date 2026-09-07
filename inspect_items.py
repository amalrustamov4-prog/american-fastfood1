import os
from PIL import Image

# Let's inspect each image in new_menu_raw
files = sorted(os.listdir('new_menu_raw'))
print(f"Total {len(files)} files.")

# Let's inspect the files list
for i, f in enumerate(files):
    p = os.path.join('new_menu_raw', f)
    with Image.open(p) as img:
        print(f"[{i+1}] {f} - size: {img.size}")
