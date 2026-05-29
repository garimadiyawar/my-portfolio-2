const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const faviconPath = path.join(publicDir, 'favicon.png');

async function resizeFavicon() {
  try {
    // Create logo192.png (192x192)
    await sharp(faviconPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo192.png'));
    console.log('✓ Generated logo192.png (192x192)');

    // Create logo512.png (512x512)
    await sharp(faviconPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo512.png'));
    console.log('✓ Generated logo512.png (512x512)');

    console.log('\n✓ All favicon sizes created successfully!');
  } catch (error) {
    console.error('Error resizing favicon:', error);
    process.exit(1);
  }
}

resizeFavicon();
