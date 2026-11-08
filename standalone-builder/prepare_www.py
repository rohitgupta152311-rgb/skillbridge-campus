import os
import shutil

src_dist = r"C:\Users\rohit\.gemini\antigravity\scratch\skillbridge-campus\dist"
dest_www = r"C:\Users\rohit\.gemini\antigravity\scratch\skillbridge-campus\standalone-builder\assets\www"

if os.path.exists(dest_www):
    shutil.rmtree(dest_www)
os.makedirs(dest_www, exist_ok=True)

# Copy files and folders except downloads
for item in os.listdir(src_dist):
    if item == "downloads":
        continue
    s = os.path.join(src_dist, item)
    d = os.path.join(dest_www, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

# Fix paths in index.html to relative ./
index_path = os.path.join(dest_www, "index.html")
if os.path.exists(index_path):
    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace absolute root paths with relative
    content = content.replace('src="/assets/', 'src="./assets/')
    content = content.replace('href="/assets/', 'href="./assets/')
    content = content.replace('href="/manifest.json"', 'href="./manifest.json"')
    content = content.replace('href="/favicon.svg"', 'href="./favicon.svg"')

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Copied web app to {dest_www} with relative asset paths.")
