import json

with open('ocr_menu_results.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

for idx, item in enumerate(data):
    name = item.get('Name')
    text = item.get('Text', '').strip().replace('\r', '').replace('\n', ' // ')
    print(f"[{idx+1:02d}] {name}: {text}")
