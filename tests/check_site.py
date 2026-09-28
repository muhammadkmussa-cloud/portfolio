"""Check local destinations, metadata and form labels without dependencies."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.links = []
        self.assets = []
        self.labels = set()
        self.inputs = []
        self.h1 = 0
        self.canonical = None
        self.duplicate_ids = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.duplicate_ids.append(attrs['id'])
            self.ids.add(attrs['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'])
        if tag in ('script', 'img', 'source') and 'src' in attrs:
            self.assets.append(attrs['src'])
        if tag == 'video' and 'poster' in attrs:
            self.assets.append(attrs['poster'])
        if tag == 'link':
            if attrs.get('rel') == 'canonical':
                self.canonical = attrs['href']
            elif 'href' in attrs:
                self.assets.append(attrs['href'])
        if tag == 'label':
            self.labels.add(attrs.get('for'))
        if tag in ('input', 'textarea'):
            self.inputs.append(attrs.get('id'))


pages = {p.name: Page(p) for p in ROOT.glob('*.html')}
errors = []
for filename, page in pages.items():
    if page.h1 != 1:
        errors.append(f'{filename}: expected one h1')
    if page.duplicate_ids:
        errors.append(f'{filename}: duplicate ids {page.duplicate_ids}')
    if not page.canonical:
        errors.append(f'{filename}: missing canonical URL')
    for field in page.inputs:
        if field not in page.labels:
            errors.append(f'{filename}: missing label for {field}')
    for destination in page.links + page.assets:
        url = urlsplit(destination)
        if url.scheme or url.netloc:
            continue
        path = url.path.lstrip('/')
        target = filename if not path else ('index.html' if path == '' else path)
        if destination.startswith('/') and not path:
            target = 'index.html'
        elif path and not Path(path).suffix:
            errors.append(f'{filename}: extensionless link fails on basic static servers: {destination}')
        if not (ROOT / target).is_file():
            errors.append(f'{filename}: missing destination {destination}')
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:
            errors.append(f'{filename}: missing fragment {destination}')
assert not errors, '\n'.join(errors)
assert len(pages['services.html'].ids & {f'service-{i}' for i in range(1, 17)}) == 16
json.loads((ROOT / 'vercel.json').read_text())
print(f'PASS: {len(pages)} pages, local links/assets, fragments, labels, metadata and all 16 services')
