import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const input = path.join(process.cwd(), 'public', 'iee-logo.png');
const outDir = path.join(process.cwd(), 'public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

async function generate() {
  if (!fs.existsSync(input)) {
    console.log('iee-logo.png not found, trying iee-logo-transparent.png');
    const inputAlt = path.join(process.cwd(), 'public', 'iee-logo-transparent.png');
    if (!fs.existsSync(inputAlt)) {
       console.log('No logo found');
       return;
    }
  }

  const inputFile = fs.existsSync(input) ? input : path.join(process.cwd(), 'public', 'iee-logo-transparent.png');

  for (const s of sizes) {
    await sharp(inputFile)
      .resize(s.size, s.size)
      .toFile(path.join(outDir, s.name));
    console.log(`Generated ${s.name}`);
  }
  
  // Create a rudimentary favicon.ico from 32x32
  // We'll just copy the 32x32 png to ico for simplicity, though real .ico format is different, 
  // most modern browsers accept PNG as ICO or we just rely on PNGs.
  fs.copyFileSync(path.join(outDir, 'favicon-32x32.png'), path.join(outDir, 'favicon.ico'));
  
  const manifest = {
    "name": "IEE Store",
    "short_name": "IEE Store",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
  };
  fs.writeFileSync(path.join(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated site.webmanifest');
}

generate().catch(console.error);
