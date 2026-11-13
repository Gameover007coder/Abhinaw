# Birthday Royale 🎮📱⌚

A Free Fire–style birthday page for a younger brother: floating smartphones and digital watches, a shrinking safe-zone ring, bullet tracers, a game HUD, a **photo memories slideshow with animated special messages**, and a fully synthesized soundtrack (no audio files).

## 📸 Adding Your Photos

Replace the two placeholder images with real ones:

| File | Description |
|------|-------------|
| `brother1.jpg` | First memory photo (portrait orientation recommended) |
| `brother2.jpg` | Second memory photo (portrait orientation recommended) |

> Just drop your `.jpg` files into the same folder as `index.html` — the site picks them up automatically.

## ✏️ Customize

1. Open `script.js` and edit `NAME` and `FROM` at the top.
2. Edit the special messages in `index.html` inside `#slide-1` and `#slide-2`.
3. The loot crate messages and finale text are also in `index.html`.

## 💻 Run Locally

```bash
# Option 1: Just open the file
start index.html          # Windows
open index.html           # macOS

# Option 2: Local server (avoids image CORS issues)
python -m http.server 8000
# then visit http://localhost:8000
```

## 🚀 Publish on GitHub Pages

1. Push all files to `main` branch of your GitHub repo.
2. Go to **Settings → Pages → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/pages.yml`) deploys automatically on every push.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## 🎮 Flow

**Title screen** (unlocks sound) → **Intro** → **Birthday message** → **Loot crates** → **📸 Photo Memories Slideshow** → **Player card** → **BOOYAH! finale** with 8-bit "Happy Birthday".

## 📱 Device Support

- ✅ Desktop / Laptop
- ✅ Mobile phones (portrait & landscape)
- ✅ Tablets
- ✅ Touch swipe to change slides
- ✅ Keyboard arrow keys to navigate steps
