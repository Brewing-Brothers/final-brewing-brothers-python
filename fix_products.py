import re

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix product names, prices, per-unit labels
replacements = [
    ('name:"Single Bottle"',                                   'name:"1-Pack (20oz)"'),
    ('price: process.env.NEXT_PUBLIC_PRICE_SINGLE || "$12"',   'price: process.env.NEXT_PUBLIC_PRICE_SINGLE || "$16"'),
    ('per:"$12/bottle"',                                       'per:"$16 per bottle"'),
    ('note:"Perfect intro \u2014 taste the freshness."',       'note:"Perfect intro \u2014 taste the freshness."'),

    ('name:"6-Pack"',                                          'name:"2-Pack (20oz)"'),
    ('price: process.env.NEXT_PUBLIC_PRICE_SIXPACK || "$64"',  'price: process.env.NEXT_PUBLIC_PRICE_SIXPACK || "$28"'),
    ('per:"$10.67/bottle"',                                    'per:"$14 per bottle"'),
    ('note:"Most popular \u2014 better value per bottle."',    'note:"Most popular \u2014 better value per bottle."'),

    ('name:"12-Pack"',                                         'name:"3-Pack (20oz)"'),
    ('price: process.env.NEXT_PUBLIC_PRICE_TWELVE || "$119"',  'price: process.env.NEXT_PUBLIC_PRICE_TWELVE || "$36"'),
    ('per:"$9.92/bottle"',                                     'per:"$12 per bottle"'),
    ('note:"Best value \u2014 stock up, free shipping."',      'note:"Best value \u2014 stock up and save."'),

    # Fix dropdown options in pickup form
    ('<option>1 Bottle</option><option>2 Bottles</option><option>6-Pack</option><option>12-Pack</option>',
     '<option>1-Pack (20oz)</option><option>2-Pack (20oz)</option><option>3-Pack (20oz)</option>'),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f'Replaced: {old[:50]}')

print(f'\nTotal replacements: {count}')

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('File saved OK')

# Verify
m = re.search(r'export const PRODUCTS = \[(.*?)\];', content, re.DOTALL)
if m:
    print('\nCurrent PRODUCTS:')
    print(m.group(0)[:500])
