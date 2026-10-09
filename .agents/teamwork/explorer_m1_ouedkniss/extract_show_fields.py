import urllib.request
import re

url = 'https://cdn.ouedkniss.com/app/static/js/async/Show.8c9d19645b021821.3.8.14.m.js'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8', errors='ignore')

idx = content.find('AnnouncementGet')
print(f"AnnouncementGet found at {idx}")
snippet = content[idx:idx+25000]

fields = re.findall(r'name:\{kind:"Name",value:"([^"]+)"\}', snippet)
print(f"Total fields: {len(fields)}")
print("Fields 30..150:")
print(fields[30:150])
