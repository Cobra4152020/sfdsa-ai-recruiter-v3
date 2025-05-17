const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const SOURCE_ICON = path.join(process.cwd(), 'public', 'sf-sheriff-deputies.png');

// Create icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // Generate PWA icons
    for (const size of ICON_SIZES) {
      await sharp(SOURCE_ICON)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 10, g: 60, b: 31, alpha: 1 } // #0A3C1F
        })
        .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }

    // Generate special icons
    await sharp(SOURCE_ICON)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 10, g: 60, b: 31, alpha: 1 }
      })
      .toFile(path.join(ICONS_DIR, 'apply-192x192.png'));
    
    console.log('Generated apply icon');

    // Generate favicon
    await sharp(SOURCE_ICON)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 10, g: 60, b: 31, alpha: 1 }
      })
      .toFile(path.join(process.cwd(), 'public', 'favicon.ico'));
    
    console.log('Generated favicon');

    // Generate Apple touch icon
    await sharp(SOURCE_ICON)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 10, g: 60, b: 31, alpha: 1 }
      })
      .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));
    
    console.log('Generated Apple touch icon');

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons(); 